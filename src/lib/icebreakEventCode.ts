export const ICEBREAK_EVENT_CODE_LENGTH = 6;
export const ICEBREAK_EVENT_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const ICEBREAK_EVENT_CODE_RETRY_LIMIT = 5;

export function createIcebreakEventCode(length = ICEBREAK_EVENT_CODE_LENGTH) {
  const safeLength = Math.max(1, Math.floor(length));
  let code = "";

  for (let index = 0; index < safeLength; index += 1) {
    code += ICEBREAK_EVENT_CODE_CHARS[Math.floor(Math.random() * ICEBREAK_EVENT_CODE_CHARS.length)];
  }

  return code;
}

export function normalizeIcebreakEventCode(eventCode: string) {
  return eventCode.trim().toUpperCase();
}

export function createIcebreakEventCodeCandidates(
  retryLimit = ICEBREAK_EVENT_CODE_RETRY_LIMIT,
) {
  return Array.from({ length: Math.max(1, retryLimit) }, () => createIcebreakEventCode());
}

