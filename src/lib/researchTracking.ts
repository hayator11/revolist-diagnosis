export const RESEARCH_PAYLOAD_SCHEMA_VERSION = "research-light-payload-v2";

function createId(prefix: string) {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replaceAll("-", "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);

  return `${prefix}_${Date.now().toString(36)}_${randomPart}`;
}

export function createResearchEventId(eventType: string) {
  return createId(eventType);
}

export function getResearchClientSessionId() {
  if (typeof window === "undefined") return "";

  const storageKey = "research-light-client-session-id";
  const existing = window.sessionStorage.getItem(storageKey);
  if (existing) return existing;

  const sessionId = createId("session");
  window.sessionStorage.setItem(storageKey, sessionId);
  return sessionId;
}

export function createResearchEventFields(eventType: string) {
  return {
    eventType,
    eventId: createResearchEventId(eventType),
    clientSessionId: getResearchClientSessionId(),
    payloadSchemaVersion: RESEARCH_PAYLOAD_SCHEMA_VERSION,
  };
}
