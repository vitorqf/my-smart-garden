"use client";

import {
  ArrowDown,
  ArrowUp,
  Minus,
  Sparkles,
  TrendingDown,
  TrendingUp
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardInsights } from "@/lib/types";
import { cn } from "@/lib/utils";

interface InsightsCardProps extends DashboardInsights {}

function displayValue(value: number): string {
  return value === 0 ? "--" : `${value}%`;
}

export function InsightsCard({
  currentStatus,
  dailyAverage,
  lowestToday,
  highestToday,
  trend
}: InsightsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "Rising":
        return <TrendingUp className="h-4 w-4" />;
      case "Dropping":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "Rising":
        return "text-chart-2";
      case "Dropping":
        return "text-accent";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-medium">Garden Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-secondary/50 p-4 transition-colors hover:bg-secondary/70">
            <p className="text-xs font-medium text-muted-foreground">Status</p>
            <p className="mt-1 text-lg font-semibold text-primary">{currentStatus}</p>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4 transition-colors hover:bg-secondary/70">
            <p className="text-xs font-medium text-muted-foreground">Daily Average</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{displayValue(dailyAverage)}</p>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4 transition-colors hover:bg-secondary/70">
            <p className="text-xs font-medium text-muted-foreground">Today&apos;s Range</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="flex items-center text-sm text-accent">
                <ArrowDown className="h-3 w-3" />
                {displayValue(lowestToday)}
              </span>
              <span className="text-muted-foreground">-</span>
              <span className="flex items-center text-sm text-chart-2">
                <ArrowUp className="h-3 w-3" />
                {displayValue(highestToday)}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4 transition-colors hover:bg-secondary/70">
            <p className="text-xs font-medium text-muted-foreground">Trend</p>
            <div className={cn("mt-1 flex items-center gap-1.5 font-semibold", getTrendColor())}>
              {getTrendIcon()}
              <span>{trend}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
