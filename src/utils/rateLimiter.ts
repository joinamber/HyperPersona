// Rate limiting utilities for API protection

interface RateLimitEntry {
  count: number;
  windowStart: number;
  lastRequest: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly blockDurationMs: number;

  constructor(
    maxRequests: number = 10,
    windowMs: number = 60 * 1000, // 1 minute
    blockDurationMs: number = 5 * 60 * 1000 // 5 minutes
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
    
    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  checkLimit(identifier: string): { allowed: boolean; resetTime?: number; retryAfter?: number } {
    const now = Date.now();
    const entry = this.storage.get(identifier);

    if (!entry) {
      // First request
      this.storage.set(identifier, {
        count: 1,
        windowStart: now,
        lastRequest: now
      });
      return { allowed: true };
    }

    // Check if still in blocking period
    if (entry.count >= this.maxRequests) {
      const timeSinceBlock = now - entry.lastRequest;
      if (timeSinceBlock < this.blockDurationMs) {
        return {
          allowed: false,
          retryAfter: Math.ceil((this.blockDurationMs - timeSinceBlock) / 1000)
        };
      } else {
        // Reset after block period
        this.storage.set(identifier, {
          count: 1,
          windowStart: now,
          lastRequest: now
        });
        return { allowed: true };
      }
    }

    // Check if window has expired
    if (now - entry.windowStart >= this.windowMs) {
      // Reset window
      this.storage.set(identifier, {
        count: 1,
        windowStart: now,
        lastRequest: now
      });
      return { allowed: true };
    }

    // Increment count
    entry.count++;
    entry.lastRequest = now;
    this.storage.set(identifier, entry);

    if (entry.count > this.maxRequests) {
      return {
        allowed: false,
        retryAfter: Math.ceil(this.blockDurationMs / 1000)
      };
    }

    return {
      allowed: true,
      resetTime: entry.windowStart + this.windowMs
    };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      // Remove entries older than block duration
      if (now - entry.lastRequest > this.blockDurationMs) {
        this.storage.delete(key);
      }
    }
  }

  getStats(identifier: string): { count: number; remaining: number; resetTime?: number } {
    const entry = this.storage.get(identifier);
    if (!entry) {
      return { count: 0, remaining: this.maxRequests };
    }

    const now = Date.now();
    if (now - entry.windowStart >= this.windowMs) {
      return { count: 0, remaining: this.maxRequests };
    }

    return {
      count: entry.count,
      remaining: Math.max(0, this.maxRequests - entry.count),
      resetTime: entry.windowStart + this.windowMs
    };
  }
}

// Default rate limiter instances
export const apiRateLimiter = new RateLimiter(5, 60 * 1000, 5 * 60 * 1000); // 5 requests per minute
export const authRateLimiter = new RateLimiter(3, 15 * 60 * 1000, 30 * 60 * 1000); // 3 attempts per 15 minutes

// Helper to get client identifier
export function getClientIdentifier(): string {
  // Use a combination of user agent and screen resolution as identifier
  const fingerprint = btoa(
    `${navigator.userAgent}-${screen.width}x${screen.height}`
  ).substring(0, 16);
  return fingerprint;
}