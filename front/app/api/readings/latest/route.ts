import { NextResponse } from "next/server";

import { appConfig, thresholds } from "@/lib/config";
import { getLatestReading } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deviceId = url.searchParams.get("device_id") ?? appConfig.defaultDeviceId;

  try {
    const reading = await getLatestReading(deviceId);

    if (!reading) {
      return NextResponse.json(
        {
          error: "no readings found for device",
          device_id: deviceId
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      device_id: deviceId,
      thresholds,
      reading
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to fetch latest reading";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
