const ONOKUN_SATOOYA_PAYLOAD_SCHEMA_VERSION = "onokun-satooya-payload-v1";
const ONOKUN_SATOOYA_SESSION_KEY = "onokun-satooya-client-session-id";

function createId(prefix: string) {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replaceAll("-", "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);

  return `${prefix}_${Date.now().toString(36)}_${randomPart}`;
}

function getOnokunSatooyaClientSessionId() {
  if (typeof window === "undefined") return "";

  const existing = window.sessionStorage.getItem(ONOKUN_SATOOYA_SESSION_KEY);
  if (existing) return existing;

  const sessionId = createId("onokun_session");
  window.sessionStorage.setItem(ONOKUN_SATOOYA_SESSION_KEY, sessionId);
  return sessionId;
}

export function createOnokunSatooyaEventFields(eventType: string) {
  return {
    eventType,
    eventId: createId(eventType),
    clientSessionId: getOnokunSatooyaClientSessionId(),
    payloadSchemaVersion: ONOKUN_SATOOYA_PAYLOAD_SCHEMA_VERSION,
  };
}

export function getOnokunSatooyaDeviceLabel() {
  if (typeof navigator === "undefined") return "";

  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("ipad") || userAgent.includes("tablet")) return "tablet";
  if (userAgent.includes("mobile") || userAgent.includes("iphone")) return "mobile";

  return "desktop";
}
