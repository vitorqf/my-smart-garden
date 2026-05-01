"use client";

import { Activity } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { HistoryPoint, Thresholds } from "@/lib/types";

interface MoistureChartProps {
  data: HistoryPoint[];
  thresholds: Thresholds;
}

export function MoistureChart({ data, thresholds }: MoistureChartProps) {
  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-medium">Moisture History</CardTitle>
        </div>
        <CardDescription>Last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[280px] w-full">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-secondary/20 text-sm text-muted-foreground">
              No readings yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 145)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 145)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 150)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "oklch(0.65 0.02 150)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "oklch(0.65 0.02 150)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const value = payload[0].value as number;
                      return (
                        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
                          <p className="text-xs text-muted-foreground">
                            {String(payload[0].payload.time)}
                          </p>
                          <p className="text-sm font-semibold text-primary">{value}% moisture</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="moisture"
                  stroke="oklch(0.72 0.18 145)"
                  strokeWidth={2}
                  fill="url(#moistureGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-muted-foreground">{`< ${thresholds.dry}% Dry`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">
              {`${thresholds.dry}-${thresholds.wet}% Ideal`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">{`> ${thresholds.wet}% Too Wet`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
