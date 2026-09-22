import { useEffect, useState } from "react";

const RATES_KEY = "wcmh_exchange_rates";
const RATES_TIMESTAMP_KEY = "wcmh_exchange_rates_ts";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Approximate ZAR-based fallbacks used until live rates load
export const fallbackRates: Record<string, number> = {
  ZAR: 1,
  USD: 0.054,
  EUR: 0.05,
  GBP: 0.043,
  NGN: 83.5,
  KES: 6.95,
  BWP: 0.74,
  INR: 4.54,
  AUD: 0.085,
  CAD: 0.075,
};

/** Live ZAR-based exchange rates, cached for an hour in localStorage. */
export function useExchangeRates() {
  const [rates, setRates] = useState<Record<string, number>>(fallbackRates);
  const [isLive, setIsLive] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(RATES_KEY);
    const cachedTs = localStorage.getItem(RATES_TIMESTAMP_KEY);
    if (cached && cachedTs && Date.now() - Number(cachedTs) < CACHE_DURATION) {
      try {
        setRates(JSON.parse(cached));
        setIsLive(true);
        setUpdatedAt(Number(cachedTs));
        return;
      } catch {
        /* ignore malformed cache */
      }
    }

    let cancelled = false;
    fetch("https://api.exchangerate-api.com/v4/latest/ZAR")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.rates) return;
        setRates(data.rates);
        setIsLive(true);
        setUpdatedAt(Date.now());
        localStorage.setItem(RATES_KEY, JSON.stringify(data.rates));
        localStorage.setItem(RATES_TIMESTAMP_KEY, String(Date.now()));
      })
      .catch(() => {
        /* keep fallback rates */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { rates, isLive, updatedAt };
}
