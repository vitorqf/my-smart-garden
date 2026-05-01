"use client";

import { Clock, Droplets } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Thresholds } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MoistureHeroCardProps {
  moisture: number | null;
  lastUpdate: Date | null;
  thresholds: Thresholds;
}

function getInterpretation(
  moisture: number | null,
  soilThresholds: Thresholds
): { text: string; status: "healthy" | "dry" | "wet" | "idle" } {
  if (moisture === null) {
    return { text: "Waiting for first reading", status: "idle" };
  }

  if (moisture < soilThresholds.dry) {
    return { text: "The soil is getting dry", status: "dry" };
  }

  if (moisture > soilThresholds.wet) {
    return { text: "The soil is too wet", status: "wet" };
  }

  return { text: "Soil moisture is within the ideal range", status: "healthy" };
}

function formatTimeAgo(date: Date | null): string {
  if (!date) {
    return "Awaiting first reading";
  }

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hour${hours > 1 ? "s" : ""} ago`;
}

export function MoistureHeroCard({
  moisture,
  lastUpdate,
  thresholds
}: MoistureHeroCardProps) {
  const interpretation = getInterpretation(moisture, thresholds);
  const moistureValue = moisture ?? 0;

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-primary/5">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rounded-full bg-chart-2/5 blur-3xl" />

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Droplets className="h-4 w-4" />
              <span className="text-sm font-medium">Soil Moisture</span>
            </div>

            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-6xl font-bold tracking-tighter sm:text-7xl",
                  interpretation.status === "healthy" && "text-primary",
                  interpretation.status === "dry" && "text-accent",
                  interpretation.status === "wet" && "text-chart-2",
                  interpretation.status === "idle" && "text-muted-foreground"
                )}
              >
                {moisture === null ? "--" : moisture}
              </span>
              <span className="text-2xl font-medium text-muted-foreground">%</span>
            </div>

            <p
              className={cn(
                "text-sm font-medium",
                interpretation.status === "healthy" && "text-primary/80",
                interpretation.status === "dry" && "text-accent/80",
                interpretation.status === "wet" && "text-chart-2/80",
                interpretation.status === "idle" && "text-muted-foreground"
              )}
            >
              {interpretation.text}
            </p>
          </div>

          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-secondary"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${moistureValue * 2.64} 264`}
                className={cn(
                  "transition-all duration-1000 ease-out",
                  interpretation.status === "healthy" && "text-primary",
                  interpretation.status === "dry" && "text-accent",
                  interpretation.status === "wet" && "text-chart-2",
                  interpretation.status === "idle" && "text-muted-foreground"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Droplets
                className={cn(
                  "h-8 w-8",
                  interpretation.status === "healthy" && "text-primary/60",
                  interpretation.status === "dry" && "text-accent/60",
                  interpretation.status === "wet" && "text-chart-2/60",
                  interpretation.status === "idle" && "text-muted-foreground"
                )}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Last updated {formatTimeAgo(lastUpdate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
