import { NextResponse } from "next/server";

import { appConfig, thresholds } from "@/lib/config";
import { getHistoryReadings, getLatestReading, insertReading } from "@/lib/db";
import { InputValidationError } from "@/lib/errors";
import {
  parseDateQuery,
  parseLimit,
  validateReadingPayload,
} from "@/lib/payload";

export const runtime = "nodejs";

function serverErrorResponse(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "unexpected server error while processing reading";

  return NextResponse.json(
    { error: message },
    {
      status: 500,
    },
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = validateReadingPayload(body);
    const reading = await insertReading(payload);

    return NextResponse.json(
      {
        reading,
        thresholds,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof InputValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return serverErrorResponse({ error });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deviceId =
    url.searchParams.get("device_id") ?? appConfig.defaultDeviceId;
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const limit = url.searchParams.get("limit");

  try {
    const parsedFrom = parseDateQuery(from, "from");
    const parsedTo = parseDateQuery(to, "to");
    const parsedLimit = parseLimit(
      limit,
      appConfig.maxHistoryPoints,
      appConfig.maxHistoryPoints,
    );

    const [latest, readings] = await Promise.all([
      getLatestReading(deviceId),
      getHistoryReadings({
        deviceId,
        from: parsedFrom,
        to: parsedTo,
        limit: parsedLimit,
      }),
    ]);

    return NextResponse.json({
      device_id: deviceId,
      thresholds,
      latest,
      count: readings.length,
      readings,
    });
  } catch (error) {
    if (error instanceof InputValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return serverErrorResponse(error);
  }
}
