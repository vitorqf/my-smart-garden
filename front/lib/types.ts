export type SoilState = "dry" | "ideal" | "wet";

export type AlertType = "warning" | "info" | "success";

export type TrendType = "Stable" | "Dropping" | "Rising";

export interface Thresholds {
  dry: number;
  wet: number;
}

export interface ReadingPayload {
  device_id: string;
  timestamp: string;
  soil_moisture_pct: number;
}

export interface Reading extends ReadingPayload {
  soil_state: SoilState;
}

export interface HistoryPoint {
  time: string;
  fullTime: Date;
  moisture: number;
}

export interface DashboardInsights {
  currentStatus: string;
  dailyAverage: number;
  lowestToday: number;
  highestToday: number;
  trend: TrendType;
}

export interface DashboardAlert {
  id: number;
  message: string;
  time: string;
  type: AlertType;
}
