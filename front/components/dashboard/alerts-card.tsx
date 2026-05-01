"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Alert {
  id: number
  message: string
  time: string
  type: "warning" | "info" | "success"
}

interface AlertsCardProps {
  alerts: Alert[]
}

export function AlertsCard({ alerts }: AlertsCardProps) {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return "text-accent bg-accent/10"
      case "info":
        return "text-chart-2 bg-chart-2/10"
      case "success":
        return "text-primary bg-primary/10"
    }
  }

  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-medium">Recent Alerts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
            >
              <div className={cn("rounded-full p-1.5", getAlertColor(alert.type))}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{alert.message}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
