import { Pool } from "pg";

import { appConfig, thresholds } from "@/lib/config";
import { classifySoilState } from "@/lib/soil";
import type { Reading, ReadingPayload } from "@/lib/types";

type DbRow = {
  device_id: string;
  timestamp: Date;
  soil_moisture_pct: number;
};

declare global {
  var __smartGardenPgPool: Pool | undefined;
  var __smartGardenSchemaReady: Promise<void> | undefined;
}

function getPool(): Pool {
  if (!global.__smartGardenPgPool) {
    global.__smartGardenPgPool = new Pool({
      connectionString: appConfig.databaseUrl,
    });
  }

  return global.__smartGardenPgPool;
}

async function ensureSchema(): Promise<void> {
  if (!global.__smartGardenSchemaReady) {
    const pool = getPool();

    global.__smartGardenSchemaReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS readings (
          id BIGSERIAL PRIMARY KEY,
          device_id TEXT NOT NULL,
          timestamp TIMESTAMPTZ NOT NULL,
          soil_moisture_pct REAL NOT NULL CHECK (soil_moisture_pct >= 0 AND soil_moisture_pct <= 100),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_readings_device_timestamp
        ON readings (device_id, timestamp DESC)
      `);
    })();
  }

  await global.__smartGardenSchemaReady;
}

function toReading(row: DbRow): Reading {
  return {
    device_id: row.device_id,
    timestamp: new Date(row.timestamp).toISOString(),
    soil_moisture_pct: Number(row.soil_moisture_pct),
    soil_state: classifySoilState(Number(row.soil_moisture_pct), thresholds),
  };
}

export async function insertReading(payload: ReadingPayload): Promise<Reading> {
  await ensureSchema();
  const pool = getPool();

  const result = await pool.query<DbRow>(
    `
      INSERT INTO readings (device_id, timestamp, soil_moisture_pct)
      VALUES ($1, $2, $3)
      RETURNING device_id, timestamp, soil_moisture_pct
    `,
    [payload.device_id, payload.timestamp, payload.soil_moisture_pct],
  );

  return toReading(result.rows[0]);
}

export async function getLatestReading(
  deviceId: string,
): Promise<Reading | null> {
  await ensureSchema();
  const pool = getPool();

  const result = await pool.query<DbRow>(
    `
      SELECT device_id, timestamp, soil_moisture_pct
      FROM readings
      WHERE device_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `,
    [deviceId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return toReading(result.rows[0]);
}

export async function getHistoryReadings(params: {
  deviceId: string;
  from: string | null;
  to: string | null;
  limit: number;
}): Promise<Reading[]> {
  await ensureSchema();
  const pool = getPool();

  const result = await pool.query<DbRow>(
    `
      SELECT device_id, timestamp, soil_moisture_pct
      FROM readings
      WHERE device_id = $1
        AND ($2::timestamptz IS NULL OR timestamp >= $2::timestamptz)
        AND ($3::timestamptz IS NULL OR timestamp <= $3::timestamptz)
      ORDER BY timestamp DESC
      LIMIT $4
    `,
    [params.deviceId, params.from, params.to, params.limit],
  );

  return result.rows.reverse().map(toReading);
}
