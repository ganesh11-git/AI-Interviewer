const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");
const AUTH_TOKEN_KEY = "interviewer-auth-token";
const AUTH_USER_KEY = "interviewer-auth-user";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token || "");
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user || null));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  const authToken = token || getAuthToken();
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = payload?.error || payload?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return payload;
}

export function register(email, password) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

export function login(email, password) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function me() {
  return apiRequest("/api/me");
}

export function getProgress(key) {
  const encoded = encodeURIComponent(key);
  return apiRequest(`/api/progress?key=${encoded}`);
}

export function saveProgressRemote(key, data) {
  const encoded = encodeURIComponent(key);
  return apiRequest(`/api/progress/${encoded}`, {
    method: "PUT",
    body: { data },
  });
}
