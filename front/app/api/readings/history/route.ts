import { NextResponse } from "next/server";

import { appConfig, thresholds } from "@/lib/config";
import { getHistoryReadings } from "@/lib/db";
import { InputValidationError } from "@/lib/errors";
import { parseDateQuery, parseLimit } from "@/lib/payload";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deviceId = url.searchParams.get("device_id") ?? appConfig.defaultDeviceId;

  try {
    const from = parseDateQuery(url.searchParams.get("from"), "from");
    const to = parseDateQuery(url.searchParams.get("to"), "to");
    const limit = parseLimit(
      url.searchParams.get("limit"),
      appConfig.maxHistoryPoints,
      appConfig.maxHistoryPoints
    );

    const readings = await getHistoryReadings({
      deviceId,
      from,
      to,
      limit
    });

    return NextResponse.json({
      device_id: deviceId,
      thresholds,
      count: readings.length,
      readings
    });
  } catch (error) {
    if (error instanceof InputValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "failed to fetch history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
