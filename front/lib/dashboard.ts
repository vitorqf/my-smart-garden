import { classifySoilState, statusLabel } from "@/lib/soil";
import type {
  DashboardAlert,
  DashboardInsights,
  HistoryPoint,
  Reading,
  SoilState,
  Thresholds,
  TrendType
} from "@/lib/types";

function toLocalTimeLabel(timestampIso: string): string {
  return new Date(timestampIso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function toRelativeTime(timestampIso: string): string {
  const diffMs = Math.max(0, Date.now() - new Date(timestampIso).getTime());
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "agora";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} d`;
}

function trendFromReadings(readings: Reading[]): TrendType {
  if (readings.length < 2) {
    return "Stable";
  }

  const first = readings[0].soil_moisture_pct;
  const last = readings[readings.length - 1].soil_moisture_pct;
  const delta = last - first;

  if (delta >= 3) {
    return "Rising";
  }

  if (delta <= -3) {
    return "Dropping";
  }

  return "Stable";
}

function alertTypeFromState(state: SoilState): DashboardAlert["type"] {
  if (state === "ideal") {
    return "success";
  }

  return "warning";
}

export function buildHistoryPoints(readings: Reading[]): HistoryPoint[] {
  return readings.map((reading) => ({
    time: toLocalTimeLabel(reading.timestamp),
    fullTime: new Date(reading.timestamp),
    moisture: Math.round(reading.soil_moisture_pct)
  }));
}

export function buildInsights(readings: Reading[]): DashboardInsights {
  if (readings.length === 0) {
    return {
      currentStatus: "No data",
      dailyAverage: 0,
      lowestToday: 0,
      highestToday: 0,
      trend: "Stable"
    };
  }

  const values = readings.map((reading) => reading.soil_moisture_pct);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const latest = readings[readings.length - 1];

  return {
    currentStatus: statusLabel(latest.soil_state),
    dailyAverage: Math.round(avg),
    lowestToday: Math.round(Math.min(...values)),
    highestToday: Math.round(Math.max(...values)),
    trend: trendFromReadings(readings)
  };
}

export function buildAlerts(
  latest: Reading | null,
  readings: Reading[],
  soilThresholds: Thresholds
): DashboardAlert[] {
  if (!latest) {
    return [
      {
        id: Date.now(),
        message: "Waiting for first soil reading",
        time: "now",
        type: "info"
      }
    ];
  }

  const alerts: DashboardAlert[] = [
    {
      id: 1,
      message:
        latest.soil_state === "dry"
          ? `Moisture dropped below ${soilThresholds.dry}%`
          : latest.soil_state === "wet"
            ? `Moisture above ${soilThresholds.wet}%`
            : "Sensor reading inside ideal range",
      time: toRelativeTime(latest.timestamp),
      type: alertTypeFromState(latest.soil_state)
    }
  ];

  if (readings.length >= 2) {
    const prev = readings[readings.length - 2];
    const nowState = classifySoilState(latest.soil_moisture_pct, soilThresholds);
    const prevState = classifySoilState(prev.soil_moisture_pct, soilThresholds);

    if (prevState !== nowState) {
      alerts.push({
        id: 2,
        message: `State changed from ${statusLabel(prevState)} to ${statusLabel(nowState)}`,
        time: toRelativeTime(latest.timestamp),
        type: nowState === "ideal" ? "success" : "warning"
      });
    }
  }

  alerts.push({
    id: 3,
    message: `Device ${latest.device_id} reported successfully`,
    time: toRelativeTime(latest.timestamp),
    type: "info"
  });

  return alerts;
}
