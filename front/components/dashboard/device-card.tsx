"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, Wifi, Battery, Sun, Hash } from "lucide-react"

export function DeviceCard() {
  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-medium">Device</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Cpu className="h-3.5 w-3.5" />
              <span>Device</span>
            </div>
            <span className="text-sm font-medium text-foreground">ESP32</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-3.5 w-3.5" />
              <span>Sensors</span>
            </div>
            <span className="text-sm font-medium text-foreground">1</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="h-3.5 w-3.5" />
              <span>Connectivity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">Online</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Battery className="h-3.5 w-3.5" />
              <span>Battery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[87%] rounded-full bg-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">87%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sun className="h-3.5 w-3.5" />
              <span>Solar</span>
            </div>
            <span className="text-sm font-medium text-accent">Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
