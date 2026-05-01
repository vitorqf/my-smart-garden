import { InputValidationError } from "@/lib/errors";
import type { ReadingPayload } from "@/lib/types";

const REQUIRED_FIELDS: Array<keyof ReadingPayload> = [
  "device_id",
  "timestamp",
  "soil_moisture_pct"
];

const OUT_OF_SCOPE_FIELDS = new Set(["solar_active", "battery_pct", "rssi"]);

export function validateReadingPayload(input: unknown): ReadingPayload {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new InputValidationError("payload must be a JSON object");
  }

  const record = input as Record<string, unknown>;

  for (const key of Object.keys(record)) {
    if (OUT_OF_SCOPE_FIELDS.has(key)) {
      throw new InputValidationError(`unsupported field: ${key}`);
    }

    if (!REQUIRED_FIELDS.includes(key as keyof ReadingPayload)) {
      throw new InputValidationError(`unknown field: ${key}`);
    }
  }

  if (typeof record.device_id !== "string" || record.device_id.trim().length === 0) {
    throw new InputValidationError("device_id must be a non-empty string");
  }

  if (typeof record.timestamp !== "string" || Number.isNaN(Date.parse(record.timestamp))) {
    throw new InputValidationError("timestamp must be a valid ISO 8601 date-time");
  }

  if (
    typeof record.soil_moisture_pct !== "number" ||
    !Number.isFinite(record.soil_moisture_pct) ||
    record.soil_moisture_pct < 0 ||
    record.soil_moisture_pct > 100
  ) {
    throw new InputValidationError("soil_moisture_pct must be between 0 and 100");
  }

  return {
    device_id: record.device_id,
    timestamp: record.timestamp,
    soil_moisture_pct: record.soil_moisture_pct
  };
}

export function parseLimit(raw: string | null, fallback: number, max: number): number {
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new InputValidationError("limit must be a positive integer");
  }

  return Math.min(parsed, max);
}

export function parseDateQuery(raw: string | null, fieldName: "from" | "to"): string | null {
  if (!raw) {
    return null;
  }

  if (Number.isNaN(Date.parse(raw))) {
    throw new InputValidationError(`${fieldName} must be a valid ISO 8601 date-time`);
  }

  return raw;
}
