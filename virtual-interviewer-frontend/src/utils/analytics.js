export function emitAssessmentEvent(event, onAnalyticsEvent) {
  if (!event || typeof event !== "object" || !event.type) return;

  try {
    if (typeof onAnalyticsEvent === "function") {
      onAnalyticsEvent(event);
    }
  } catch {
    // Keep analytics non-blocking.
  }

  try {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new CustomEvent("assessment:analytics", { detail: event }));
    }
  } catch {
    // Keep analytics non-blocking.
  }
}
