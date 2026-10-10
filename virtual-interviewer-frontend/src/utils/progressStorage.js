import { getAuthToken, getProgress, saveProgressRemote } from "../services/apiClient";

export const PROGRESS_VERSION = 2;

export function getTestProgressKey(topic, level, testId) {
  return `test-progress-${topic}-${level}-${testId}`;
}

export function loadProgress(storageKey) {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey));
    if (!raw) return {};
    if (raw.v === PROGRESS_VERSION) return raw;
    if (raw.v == null) {
      return { v: PROGRESS_VERSION, ...raw };
    }
    return {};
  } catch {
    return {};
  }
}

export function saveProgress(storageKey, state) {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      v: PROGRESS_VERSION,
      ...state,
    })
  );
}

export async function loadProgressWithServer(storageKey) {
  const local = loadProgress(storageKey);
  if (!getAuthToken()) return local;

  try {
    const remote = await getProgress(storageKey);
    if (remote?.data && typeof remote.data === "object") {
      const merged = { ...local, ...remote.data, v: PROGRESS_VERSION };
      saveProgress(storageKey, merged);
      return merged;
    }
  } catch {
    // Keep local fallback on network/auth failures.
  }

  return local;
}

export async function saveProgressWithServer(storageKey, state) {
  saveProgress(storageKey, state);
  if (!getAuthToken()) return;

  try {
    await saveProgressRemote(storageKey, {
      v: PROGRESS_VERSION,
      ...state,
    });
  } catch {
    // Non-blocking save; local state is the source of truth when offline.
  }
}

export function getProgressPercent(saved, totalQuestions = 10) {
  if (!saved || totalQuestions <= 0) return 0;

  if (saved.answers && Object.keys(saved.answers).length > 0) {
    return Math.round((Object.keys(saved.answers).length / totalQuestions) * 100);
  }
  if (saved.answered && Object.keys(saved.answered).length > 0) {
    return Math.round((Object.keys(saved.answered).length / totalQuestions) * 100);
  }
  if (saved.visited && Object.keys(saved.visited).length > 0) {
    return Math.round((Object.keys(saved.visited).length / totalQuestions) * 100);
  }
  return 0;
}
