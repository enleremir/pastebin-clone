import { add } from "date-fns";

const DURATION_UNITS: Record<string, Parameters<typeof add>[1]> = {
  "1m": { minutes: 1 },
  "10m": { minutes: 10 },
  "30m": { minutes: 30 },
  "1h": { hours: 1 },
  "1d": { days: 1 },
  "1w": { weeks: 1 },
  "2w": { weeks: 2 },
  "1mo": { months: 1 },
  "6mo": { months: 6 },
  "1y": { years: 1 },
};

export function getExpirationDate(expiration?: string): Date | null {
  if (!expiration || expiration === "never" || expiration === "once") return null;

  const duration = DURATION_UNITS[expiration];
  if (!duration) return null;

  return add(new Date(), duration);
}
