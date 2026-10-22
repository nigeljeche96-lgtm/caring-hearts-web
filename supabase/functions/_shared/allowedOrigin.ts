// Only these sites may be used as payment return/cancel destinations.
const DEFAULT_ORIGIN = "https://worldchangersmh.org";
const EXACT = new Set([
  "https://worldchangersmh.org",
  "https://www.worldchangersmh.org",
  "https://world-changers-org.lovable.app",
  "https://id-preview--93fce670-2a8f-4441-b8a3-a0539853b587.lovable.app",
  "http://localhost:8080",
]);

export function safeOrigin(candidate: unknown): string {
  if (typeof candidate !== "string") return DEFAULT_ORIGIN;
  try {
    const u = new URL(candidate);
    const o = u.origin;
    if (EXACT.has(o)) return o;
    // Lovable preview hosts for this project only
    if (u.protocol === "https:" && /^[a-z0-9-]+--93fce670-2a8f-4441-b8a3-a0539853b587\.lovable\.app$/.test(u.hostname)) return o;
  } catch { /* ignore */ }
  return DEFAULT_ORIGIN;
}
