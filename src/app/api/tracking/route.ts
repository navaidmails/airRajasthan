import { NextRequest, NextResponse } from "next/server";
import { TrackingService } from "@/features/tracking/tracking-provider";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");

  if (!ref) {
    return NextResponse.json(
      { found: false, message: "Missing reference parameter" },
      { status: 400 }
    );
  }

  const result = await TrackingService.track(ref);
  return NextResponse.json(result);
}
