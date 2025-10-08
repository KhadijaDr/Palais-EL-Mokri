/**
 * Rate limiting utilities to prevent brute force attacks and DoS
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.store.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(identifier: string): number {
    const entry = this.store.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return 0;
    }
    return entry.resetTime;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Global rate limiters for different endpoints
export const authLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const contactLimiter = new RateLimiter(3, 60 * 1000); // 3 messages per minute
export const generalLimiter = new RateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes

// Utility function to get client IP
export const getClientIP = (req: any): string => {
  return (
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

// Rate limiting middleware
export const createRateLimitMiddleware = (limiter: RateLimiter) => {
  return (req: any, res: any, next: () => void) => {
    const clientIP = getClientIP(req);

    if (!limiter.isAllowed(clientIP)) {
      const resetTime = limiter.getResetTime(clientIP);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      res.status(429).json({
        error: 'Too many requests',
        retryAfter: retryAfter,
      });
      return;
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', limiter['maxRequests']);
    res.setHeader(
      'X-RateLimit-Remaining',
      limiter.getRemainingRequests(clientIP)
    );
    res.setHeader('X-RateLimit-Reset', limiter.getResetTime(clientIP));

    next();
  };
};

// Cleanup function to be called periodically
setInterval(
  () => {
    authLimiter.cleanup();
    contactLimiter.cleanup();
    generalLimiter.cleanup();
  },
  5 * 60 * 1000
); // Cleanup every 5 minutes