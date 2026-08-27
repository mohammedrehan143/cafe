import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Sliding Window Rate Limiter (In-Memory with automatic TTL garbage collection)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records every 60 seconds to avoid memory growth under 10,000+ users
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
      if (record.resetAt < now) {
        rateLimitStore.delete(ip);
      }
    }
  }, 60000);
}

/**
 * Rate Limiter middleware
 * @param req NextRequest
 * @param maxRequests Maximum allowed requests in the window
 * @param windowSeconds Window duration in seconds
 */
export function checkRateLimit(
  req: NextRequest,
  maxRequests = 40,
  windowSeconds = 60
): { allowed: boolean; remaining: number; resetIn: number } {
  // Extract client IP from standard proxy headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';

  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const existing = rateLimitStore.get(ip);

  if (!existing || existing.resetAt < now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowSeconds };
  }

  existing.count += 1;

  if (existing.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    resetIn: Math.ceil((existing.resetAt - now) / 1000),
  };
}

// Failed Auth Rate Limiting (Tracks ONLY failed/incorrect attempts so valid logins on multiple devices are never throttled)
const failedAuthStore = new Map<string, RateLimitRecord>();

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
}

export function isAuthThrottled(
  req: NextRequest,
  maxFailed = 25,
  windowSeconds = 60
): { throttled: boolean; resetIn: number } {
  const ip = getClientIp(req);
  const now = Date.now();
  const existing = failedAuthStore.get(ip);

  if (!existing || existing.resetAt < now) {
    return { throttled: false, resetIn: 0 };
  }

  if (existing.count >= maxFailed) {
    return {
      throttled: true,
      resetIn: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { throttled: false, resetIn: 0 };
}

export function recordFailedAuthAttempt(req: NextRequest, windowSeconds = 60): void {
  const ip = getClientIp(req);
  const now = Date.now();
  const existing = failedAuthStore.get(ip);

  if (!existing || existing.resetAt < now) {
    failedAuthStore.set(ip, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
  } else {
    existing.count += 1;
  }
}

export function clearFailedAuthAttempts(req: NextRequest): void {
  const ip = getClientIp(req);
  failedAuthStore.delete(ip);
}

/**
 * Sanitize string inputs to prevent XSS and injection attacks
 */
export function sanitizeString(input: any, maxLength = 250): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // strip direct html tag delimiters
    .slice(0, maxLength);
}

/**
 * Validate customer contact payload
 */
export function validateCustomer(customer: any): { valid: boolean; error?: string; sanitized?: any } {
  if (!customer || typeof customer !== 'object') {
    return { valid: false, error: 'Customer information is required' };
  }

  const name = sanitizeString(customer.name, 80);
  const phone = sanitizeString(customer.phone, 30);
  const email = sanitizeString(customer.email, 120);
  const address = sanitizeString(customer.address, 200);
  const unitOrApt = sanitizeString(customer.unitOrApt, 50);
  const deliveryInstructions = sanitizeString(customer.deliveryInstructions, 300);

  if (!name || name.length < 2) {
    return { valid: false, error: 'Valid customer name is required' };
  }
  if (!phone || phone.length < 5) {
    return { valid: false, error: 'Valid contact phone number is required' };
  }

  return {
    valid: true,
    sanitized: {
      name,
      phone,
      email,
      address,
      unitOrApt,
      deliveryInstructions,
    },
  };
}

/**
 * Validate order financial amounts
 */
export function validateOrderAmounts(
  subtotal: any,
  deliveryFee: any,
  tax: any,
  tip: any,
  total: any
): { valid: boolean; error?: string } {
  const isFiniteNonNegative = (val: any) => typeof val === 'number' && Number.isFinite(val) && val >= 0;

  if (
    !isFiniteNonNegative(subtotal) ||
    !isFiniteNonNegative(deliveryFee) ||
    !isFiniteNonNegative(tax) ||
    !isFiniteNonNegative(tip) ||
    !isFiniteNonNegative(total)
  ) {
    return { valid: false, error: 'Invalid financial amount values' };
  }

  // Prevent unrealistic overflow amounts
  if (total > 50000 || subtotal > 45000) {
    return { valid: false, error: 'Order exceeds maximum transaction limits' };
  }

  return { valid: true };
}

/**
 * Constant-time string comparison to prevent timing attacks on signatures
 */
export function constantTimeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf-8');
    const bufB = Buffer.from(b, 'utf-8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
