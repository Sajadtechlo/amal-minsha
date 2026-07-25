/** Canonical site origin for absolute OG/Twitter URLs. Set VITE_SITE_URL in production. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function absoluteUrl(path: string, originFallback = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const origin = SITE_URL || originFallback.replace(/\/$/, "");
  return origin ? `${origin}${normalized}` : normalized;
}
