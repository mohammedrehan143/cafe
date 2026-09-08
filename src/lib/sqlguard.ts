import { NextRequest, NextResponse } from 'next/server';
import {
  Detector,
  assertSafeSqlQuery,
  scanSqlQuery,
  SqlGuardJSQueryError,
  DetectionResult,
  ThreatLabel,
  DetectionLevel
} from 'sqlguardjs';

// Singleton Detector instance with tuned limits for web requests
export const detector = new Detector({
  maxPayloadLength: 10000,
  maxDecodeIterations: 4,
});

export type SecurityLevel = DetectionLevel;

export interface SqlGuardOptions {
  level?: SecurityLevel;
  scanBody?: boolean;
  scanQuery?: boolean;
  scanHeaders?: boolean;
  allowedParams?: string[];
}

const THRESHOLDS: Record<SecurityLevel, number> = {
  strict: 0.35,
  balanced: 0.50,
  permissive: 0.80,
};

/**
 * Scans an arbitrary JavaScript value, string, or object for SQLi, XSS, and NoSQL injection
 */
export function scanPayload(payload: unknown, level: SecurityLevel = 'balanced'): {
  isMalicious: boolean;
  label?: ThreatLabel;
  confidence?: number;
  reason?: string;
  result?: DetectionResult;
} {
  if (payload === null || payload === undefined) {
    return { isMalicious: false };
  }

  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const result = detector.detect(serialized);
  const threshold = THRESHOLDS[level];

  const isMalicious = result.label !== 'benign' && result.confidence >= threshold;

  if (isMalicious) {
    return {
      isMalicious: true,
      label: result.label,
      confidence: result.confidence,
      reason: `Blocked ${result.label.toUpperCase()} attack vector (Confidence: ${result.confidence.toFixed(2)}, Threshold: ${threshold})`,
      result,
    };
  }

  return { isMalicious: false, label: result.label, confidence: result.confidence, result };
}

/**
 * Asserts that a dynamic SQL query or raw fragment is safe before database execution
 */
export function assertSafeQuery(query: string, level: SecurityLevel = 'balanced') {
  return assertSafeSqlQuery(query, { level });
}

export { assertSafeSqlQuery, scanSqlQuery, SqlGuardJSQueryError };

/**
 * Next.js 15 Route Handler Security Wrapper (Higher-Order Function)
 * Automatically inspects query parameters and JSON body for SQLi/XSS/NoSQL payloads.
 */
export function withSqlGuard<T = any>(
  handler: (req: NextRequest, context?: T) => Promise<NextResponse> | NextResponse,
  options: SqlGuardOptions = {}
) {
  const {
    level = 'balanced',
    scanBody = true,
    scanQuery = true,
    allowedParams = [],
  } = options;

  return async (req: NextRequest, context?: T): Promise<NextResponse> => {
    // 1. Inspect Query Parameters
    if (scanQuery) {
      let queryViolation: { isMalicious: boolean; reason?: string } | null = null;
      req.nextUrl.searchParams.forEach((value, key) => {
        if (queryViolation || allowedParams.includes(key)) return;
        const check = scanPayload(value, level);
        if (check.isMalicious) {
          queryViolation = check;
        }
      });

      if (queryViolation) {
        return NextResponse.json(
          {
            error: 'Security Policy Violation',
            message: 'Malicious query parameter detected.',
            details: process.env.NODE_ENV === 'development' ? (queryViolation as any).reason : undefined,
          },
          { status: 403 }
        );
      }
    }

    // 2. Inspect Body for mutating methods
    if (scanBody && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      try {
        const clonedReq = req.clone();
        const contentType = req.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const body = await clonedReq.json();
          const check = scanPayload(body, level);
          if (check.isMalicious) {
            return NextResponse.json(
              {
                error: 'Security Policy Violation',
                message: 'Malicious payload detected in request body.',
                details: process.env.NODE_ENV === 'development' ? check.reason : undefined,
              },
              { status: 403 }
            );
          }
        }
      } catch {
        // Empty or non-JSON body - route handler handles structure
      }
    }

    // 3. Delegate to original route handler
    return handler(req, context);
  };
}
