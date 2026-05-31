import { NextRequest, NextResponse } from "next/server";

const GAS_URL = "https://script.google.com/macros/s/AKfycbxTRMnBqTzZINQVIzx9RCWrXR5t5n90NJ8sj_0XE-zIgUM2wDTDWDsQlPCVOD-GVN8x/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    return NextResponse.json({ result: "success" });
  } catch (err) {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
