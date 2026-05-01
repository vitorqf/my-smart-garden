import type { SoilState, Thresholds } from "@/lib/types";

export function classifySoilState(
  value: number,
  soilThresholds: Thresholds
): SoilState {
  if (value < soilThresholds.dry) {
    return "dry";
  }

  if (value > soilThresholds.wet) {
    return "wet";
  }

  return "ideal";
}

export function statusLabel(state: SoilState): string {
  switch (state) {
    case "dry":
      return "Dry";
    case "wet":
      return "Too Wet";
    default:
      return "Healthy";
  }
}
