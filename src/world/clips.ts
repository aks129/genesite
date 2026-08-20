/*
 * One blob cache for the world footage.
 *
 * Clips are fetched as Blobs rather than streamed from a <video src> so that
 * seeking never depends on HTTP range support — the technique the home film
 * already relies on. Caching the object URL at module scope means a clip is
 * downloaded once per session no matter how many stages want it, and it
 * survives navigation because nothing here is owned by a component.
 */

const cache = new Map<string, Promise<string>>();

/** Honour Data Saver / 2g: the still posters carry the page on their own. */
export function videoAllowed(): boolean {
  const c = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!c) return true;
  if (c.saveData) return false;
  return c.effectiveType !== "slow-2g" && c.effectiveType !== "2g";
}

export function loadClip(src: string): Promise<string> {
  const hit = cache.get(src);
  if (hit) return hit;
  const p = fetch(src)
    .then(r => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
    .then(b => URL.createObjectURL(b))
    .catch(err => { cache.delete(src); throw err; });
  cache.set(src, p);
  return p;
}

/** Warm a clip without caring when or whether it lands. */
export function prefetchClip(src: string): void {
  if (!videoAllowed() || cache.has(src)) return;
  const run = () => { loadClip(src).catch(() => { /* poster carries it */ }); };
  const ric = (window as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
    .requestIdleCallback;
  if (ric) ric(run, { timeout: 4000 });
  else window.setTimeout(run, 1200);
}
