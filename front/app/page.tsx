"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AlertsCard } from "@/components/dashboard/alerts-card";
import { DashboardHeader } from "@/components/dashboard/header";
import { GardenNotesCard } from "@/components/dashboard/garden-notes-card";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { MoistureChart } from "@/components/dashboard/moisture-chart";
import { MoistureHeroCard } from "@/components/dashboard/moisture-hero-card";
import { buildAlerts, buildHistoryPoints, buildInsights } from "@/lib/dashboard";
import type { Reading, Thresholds } from "@/lib/types";

const DEVICE_ID = process.env.NEXT_PUBLIC_DEVICE_ID ?? "horta-01";
const REFRESH_MS = Number(process.env.NEXT_PUBLIC_REFRESH_MS ?? "30000");

const initialNotes = [
  { id: 1, text: "Cebola planted this week", date: "Apr 10" },
  { id: 2, text: "Soil dried faster yesterday because of heat", date: "Apr 9" },
  { id: 3, text: "Need to monitor morning sunlight", date: "Apr 8" }
];

interface HistoryResponse {
  thresholds: Thresholds;
  readings: Reading[];
  count: number;
}

interface LatestResponse {
  reading: Reading;
}

export default function SmartGardenDashboard() {
  const [notes, setNotes] = useState(initialNotes);
  const [latest, setLatest] = useState<Reading | null>(null);
  const [history, setHistory] = useState<Reading[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds>({ dry: 35, wet: 75 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleAddNote = (text: string) => {
    const newNote = {
      id: Date.now(),
      text,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
    };

    setNotes((current) => [newNote, ...current]);
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const [historyRes, latestRes] = await Promise.all([
        fetch(`/api/readings/history?device_id=${encodeURIComponent(DEVICE_ID)}&limit=96`, {
          cache: "no-store"
        }),
        fetch(`/api/readings/latest?device_id=${encodeURIComponent(DEVICE_ID)}`, {
          cache: "no-store"
        })
      ]);

      if (!historyRes.ok) {
        const payload = (await historyRes.json()) as { error?: string };
        throw new Error(payload.error ?? "failed to load history");
      }

      const historyPayload = (await historyRes.json()) as HistoryResponse;
      setThresholds(historyPayload.thresholds);
      setHistory(historyPayload.readings);

      if (latestRes.status === 404) {
        setLatest(null);
      } else if (latestRes.ok) {
        const latestPayload = (await latestRes.json()) as LatestResponse;
        setLatest(latestPayload.reading);
      } else {
        const payload = (await latestRes.json()) as { error?: string };
        throw new Error(payload.error ?? "failed to load latest reading");
      }

      setError("");
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "failed to fetch dashboard data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const timer = window.setInterval(fetchDashboardData, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [fetchDashboardData]);

  const chartData = useMemo(() => buildHistoryPoints(history), [history]);
  const insights = useMemo(() => buildInsights(history), [history]);
  const alerts = useMemo(() => buildAlerts(latest, history, thresholds), [latest, history, thresholds]);
  const moisture = latest ? Math.round(latest.soil_moisture_pct) : null;
  const lastUpdate = latest ? new Date(latest.timestamp) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <DashboardHeader moisture={moisture} thresholds={thresholds} />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <MoistureHeroCard moisture={moisture} lastUpdate={lastUpdate} thresholds={thresholds} />
            <MoistureChart data={chartData} thresholds={thresholds} />
            <InsightsCard {...insights} />
          </div>

          <div className="space-y-6">
            <GardenNotesCard notes={notes} onAddNote={handleAddNote} />
            <AlertsCard alerts={alerts} />
          </div>
        </div>

        {loading && <p className="mt-4 text-sm text-muted-foreground">Loading soil data...</p>}
        {error && <p className="mt-4 text-sm text-destructive">Error: {error}</p>}
      </div>
    </div>
  );
}
