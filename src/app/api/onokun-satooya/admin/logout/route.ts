import { NextRequest } from "next/server";
import { createOnokunAdminLogoutResponse } from "../../_lib/adminAuth";

export async function POST(req: NextRequest) {
  return createOnokunAdminLogoutResponse(req);
}
