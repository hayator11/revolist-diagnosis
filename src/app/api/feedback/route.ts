import { NextRequest, NextResponse } from "next/server";

const GAS_URL = "https://script.google.com/macros/s/AKfycbwcgs-Sv-3PUiSKRI8NNech0q0GnjBhtTnTmUyS6MdEIpwMA4c7Pq2Ezv-qjvqUeqhx/exec";

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
