"use client"

import { Leaf } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Thresholds } from "@/lib/types"

interface DashboardHeaderProps {
  moisture: number | null
  thresholds: Thresholds
}

function getStatus(
  moisture: number | null,
  thresholds: Thresholds
): { label: string; variant: "healthy" | "dry" | "wet" | "idle" } {
  if (moisture === null) return { label: "No data", variant: "idle" }
  if (moisture < thresholds.dry) return { label: "Dry", variant: "dry" }
  if (moisture > thresholds.wet) return { label: "Too Wet", variant: "wet" }
  return { label: "Healthy", variant: "healthy" }
}

export function DashboardHeader({ moisture, thresholds }: DashboardHeaderProps) {
  const status = getStatus(moisture, thresholds)
  
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Leaf className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Smart Garden
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring for my vertical garden
          </p>
        </div>
      </div>
      
      <Badge
        className={cn(
          "w-fit px-3 py-1.5 text-sm font-medium transition-colors",
          status.variant === "healthy" && "bg-primary/15 text-primary hover:bg-primary/20",
          status.variant === "dry" && "bg-accent/15 text-accent hover:bg-accent/20",
          status.variant === "wet" && "bg-chart-2/15 text-chart-2 hover:bg-chart-2/20",
          status.variant === "idle" && "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        <span className={cn(
          "mr-2 inline-block h-2 w-2 rounded-full",
          status.variant === "healthy" && "bg-primary animate-pulse",
          status.variant === "dry" && "bg-accent",
          status.variant === "wet" && "bg-chart-2",
          status.variant === "idle" && "bg-muted-foreground"
        )} />
        {status.label}
      </Badge>
    </header>
  )
}
