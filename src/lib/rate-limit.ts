/**
 * Simple in-memory sliding-window rate limiter
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale keys every 10 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter(t => now - t < 3600000); // 1 hour
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 600000);
}

/**
 * Check if an action is within allowed rate limit
 * @param key Unique identifier (e.g. action + IP or action + email)
 * @param maxRequests Maximum requests allowed within windowMs
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { timestamps: [] };

  // Remove timestamps outside the current window
  const validTimestamps = record.timestamps.filter(t => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const resetTime = Math.ceil((oldest + windowMs - now) / 1000);
    return { success: false, remaining: 0, resetTime };
  }

  validTimestamps.push(now);
  rateLimitMap.set(key, { timestamps: validTimestamps });

  return {
    success: true,
    remaining: maxRequests - validTimestamps.length,
    resetTime: Math.ceil(windowMs / 1000),
  };
}
