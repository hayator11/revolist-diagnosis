import { createHmac, randomUUID } from "node:crypto";

const HOST_KEY_PEPPER_ENV = "ICEBREAK_HOST_KEY_PEPPER";

export function createIcebreakHostKey() {
  return `${randomUUID().replaceAll("-", "")}${randomUUID().replaceAll("-", "")}`;
}

export function createIcebreakHostKeyHash(hostKey: string) {
  const trimmedHostKey = hostKey.trim();
  const pepper = process.env[HOST_KEY_PEPPER_ENV];

  if (!trimmedHostKey) {
    throw new Error("Icebreak hostKey is required.");
  }

  if (!pepper) {
    throw new Error(`${HOST_KEY_PEPPER_ENV} is required to hash Icebreak hostKey.`);
  }

  return createHmac("sha256", pepper).update(trimmedHostKey).digest("hex");
}

