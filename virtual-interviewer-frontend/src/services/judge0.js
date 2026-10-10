const LOCAL_JUDGE0_URL = "http://localhost:2358";
const PUBLIC_JUDGE0_URL = "https://ce.judge0.com";

const FALLBACK_LANGUAGE_IDS = {
  python: 71,
  c: 50,
  java: 62,
};

let cachedLanguages = null;
let cachePromise = null;
let activeBaseUrl = null;
const HEALTH_PATHS = ["/languages", "/about", "/"];

function normalizeUrl(url) {
  return (url || "").trim().replace(/\/+$/, "");
}

function getCandidateBaseUrls() {
  const configured = normalizeUrl(import.meta.env.VITE_JUDGE0_URL);
  if (configured) return [configured];
  return [LOCAL_JUDGE0_URL, PUBLIC_JUDGE0_URL];
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function withBaseUrl(requestBuilder, { requireOk = true } = {}) {
  const ordered = [
    ...(activeBaseUrl ? [activeBaseUrl] : []),
    ...getCandidateBaseUrls().filter((url) => url !== activeBaseUrl),
  ];

  let lastError = null;
  for (const baseUrl of ordered) {
    try {
      const response = await requestBuilder(baseUrl);
      if (requireOk && !response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      activeBaseUrl = baseUrl;
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  const endpoints = ordered.join(", ");
  const reason = lastError?.message || "Unknown network error";
  throw new Error(
    `Cannot reach Judge0 service. Checked: ${endpoints}. Reason: ${reason}`
  );
}

async function fetchWithRetry(url, options = {}, retries = 2) {
  let lastError = null;
  for (let i = 0; i <= retries; i += 1) {
    try {
      return await fetchWithTimeout(url, options, 15000);
    } catch (error) {
      lastError = error;
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (i + 1)));
      }
    }
  }
  throw lastError || new Error("Network request failed");
}

async function fetchLanguages() {
  if (cachedLanguages) return cachedLanguages;
  if (cachePromise) return cachePromise;

  cachePromise = withBaseUrl((baseUrl) =>
    fetchWithRetry(`${baseUrl}/languages`)
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      cachedLanguages = Array.isArray(data) ? data : [];
      return cachedLanguages;
    })
    .catch(() => {
      cachedLanguages = [];
      return cachedLanguages;
    })
    .finally(() => {
      cachePromise = null;
    });

  return cachePromise;
}

function pickLanguageId(languages, key) {
  if (!languages || languages.length === 0) {
    return FALLBACK_LANGUAGE_IDS[key];
  }

  const normalized = key.toLowerCase();
  const isArchived = (lang) => lang.is_archived === true;

  const matches = languages.filter((lang) => {
    const name = (lang.name || "").toLowerCase();
    if (normalized === "python") {
      return name.startsWith("python");
    }
    if (normalized === "c") {
      return name.startsWith("c ") || name.startsWith("c (");
    }
    if (normalized === "java") {
      return name.startsWith("java ") || name.startsWith("java (");
    }
    return false;
  });

  if (normalized === "python") {
    const activeMatches = matches.filter((lang) => !isArchived(lang));
    const py3 = activeMatches.find((lang) =>
      /python\s*3|python\s*\(3/i.test(lang.name || "")
    );
    const nonPy2 = activeMatches.find(
      (lang) => !/python\s*2|python\s*\(2/i.test(lang.name || "")
    );
    return (
      (py3 || nonPy2 || activeMatches[0] || matches[0] || {}).id ||
      FALLBACK_LANGUAGE_IDS[key]
    );
  }

  const active = matches.find((lang) => !isArchived(lang));
  return (active || matches[0] || {}).id || FALLBACK_LANGUAGE_IDS[key];
}

async function createSubmission({ source, languageId, stdin }) {
  const res = await withBaseUrl(
    (baseUrl) =>
      fetchWithRetry(`${baseUrl}/submissions?base64_encoded=false&wait=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: source,
          language_id: languageId,
          stdin: stdin || "",
        }),
      }),
    { requireOk: false }
  );

  const payload = await res.json();
  if (!res.ok) {
    const message = payload?.error || payload?.message || `HTTP ${res.status}`;
    throw new Error(`Submission failed: ${message}`);
  }
  return payload;
}

async function getSubmission(token) {
  const res = await withBaseUrl(
    (baseUrl) =>
      fetchWithRetry(`${baseUrl}/submissions/${token}?base64_encoded=false`),
    { requireOk: false }
  );
  const payload = await res.json();
  if (!res.ok) {
    const message = payload?.error || payload?.message || `HTTP ${res.status}`;
    throw new Error(`Result fetch failed: ${message}`);
  }
  return payload;
}

function isFinished(status) {
  if (!status || typeof status.id !== "number") return false;
  return status.id >= 3;
}

async function waitForResult(token, attempts = 20, delayMs = 1000) {
  for (let i = 0; i < attempts; i += 1) {
    const result = await getSubmission(token);
    if (isFinished(result.status)) return result;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error("Timed out waiting for result");
}

export async function runJudge0({ languageKey, source, stdin }) {
  const languages = await fetchLanguages();
  const languageId = pickLanguageId(languages, languageKey);
  const submission = await createSubmission({ source, languageId, stdin });

  if (submission.status && isFinished(submission.status)) {
    return submission;
  }

  if (submission.token) {
    return waitForResult(submission.token);
  }

  return submission;
}

export async function getJudge0Health() {
  const endpoints = [activeBaseUrl, ...getCandidateBaseUrls()].filter(Boolean);
  const visited = new Set();

  for (const baseUrl of endpoints) {
    if (visited.has(baseUrl)) continue;
    visited.add(baseUrl);

    for (const path of HEALTH_PATHS) {
      try {
        const res = await fetchWithRetry(`${baseUrl}${path}`, {}, 1);
        if (res.ok) {
          activeBaseUrl = baseUrl;
          return { status: "up", baseUrl };
        }
      } catch {
        // continue probing
      }
    }
  }

  return {
    status: "down",
    baseUrl: endpoints[0] || LOCAL_JUDGE0_URL,
  };
}
