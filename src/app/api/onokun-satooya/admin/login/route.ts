import { NextRequest, NextResponse } from "next/server";
import {
  createOnokunAdminLoginResponse,
  isOnokunAdminConfigured,
  isValidOnokunAdminPassword,
} from "../../_lib/adminAuth";

export async function POST(req: NextRequest) {
  if (!isOnokunAdminConfigured()) {
    return NextResponse.json(
      { result: "error", reason: "admin_not_configured" },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;

  if (!isValidOnokunAdminPassword(body?.password)) {
    return NextResponse.json(
      { result: "error", reason: "invalid_password" },
      { status: 401 },
    );
  }

  return createOnokunAdminLoginResponse(req);
}
