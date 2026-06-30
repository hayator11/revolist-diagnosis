import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "onokun_satooya_admin";

function getAdminPassword() {
  return process.env.ONOKUN_SATOOYA_ADMIN_PASSWORD ?? "";
}

function getAdminSecret() {
  return process.env.ONOKUN_SATOOYA_ADMIN_SECRET ?? "";
}

export function isOnokunAdminConfigured() {
  return Boolean(getAdminPassword() && getAdminSecret());
}

function createAdminToken() {
  return createHmac("sha256", getAdminSecret()).update(getAdminPassword()).digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export function isOnokunAdminRequest(req: NextRequest) {
  if (!isOnokunAdminConfigured()) return false;

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value ?? "";
  if (!token) return false;

  return safeEqual(token, createAdminToken());
}

function shouldUseSecureCookie(req: NextRequest) {
  return req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
}

export function createOnokunAdminLoginResponse(req: NextRequest) {
  const response = NextResponse.json({ result: "success", authenticated: true });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: createAdminToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(req),
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}

export function createOnokunAdminLogoutResponse(req: NextRequest) {
  const response = NextResponse.json({ result: "success", authenticated: false });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(req),
    path: "/",
    maxAge: 0,
  });

  return response;
}

export function isValidOnokunAdminPassword(password: unknown) {
  if (!isOnokunAdminConfigured() || typeof password !== "string") return false;
  return safeEqual(password, getAdminPassword());
}
