import "server-only";

/**
 * In-memory fixed-window rate limiter for login attempts.
 * Keyed by client IP. Sufficient for a single-admin login on one instance;
 * swap for a Redis/Upstash store if multi-instance lockout is needed.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
};

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    return { allowed: true, remaining: MAX_ATTEMPTS, retryAfterSec: 0 };
  }
  const allowed = bucket.count < MAX_ATTEMPTS;
  return {
    allowed,
    remaining: Math.max(0, MAX_ATTEMPTS - bucket.count),
    retryAfterSec: allowed ? 0 : Math.ceil((bucket.resetAt - now) / 1000),
  };
}

/** Record a failed attempt. Call only on auth failure. */
export function registerFailure(key: string): void {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    bucket.count += 1;
  }
}

/** Clear attempts on success. */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
