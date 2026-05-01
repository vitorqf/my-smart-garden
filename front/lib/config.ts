import type { Thresholds } from "@/lib/types";

function getNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a valid number`);
  }

  return parsed;
}

const dry = getNumberEnv("SOIL_DRY_THRESHOLD", 35);
const wet = getNumberEnv("SOIL_WET_THRESHOLD", 75);

if (dry >= wet) {
  throw new Error("SOIL_DRY_THRESHOLD must be less than SOIL_WET_THRESHOLD");
}

export const thresholds: Thresholds = { dry, wet };

export const appConfig = {
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/garden",
  defaultDeviceId: process.env.DEFAULT_DEVICE_ID ?? "horta-01",
  maxHistoryPoints: getNumberEnv("MAX_HISTORY_POINTS", 288),
  clientRefreshMs: getNumberEnv("NEXT_PUBLIC_REFRESH_MS", 30000),
};
