/**
 * Example: Protecting Next.js 15 App Router Route Handlers with SQLGuardJS
 * Path: src/app/api/example/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { Detector } from 'sqlguardjs';

const detector = new Detector({
  maxPayloadLength: 8192,
  maxDecodeIterations: 4,
});

/**
 * Validates any arbitrary JSON or string payload against injection patterns
 */
function scanPayload(payload: unknown): { isMalicious: boolean; reason?: string } {
  if (!payload) return { isMalicious: false };

  const str = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const result = detector.detect(str);

  if (result.label !== 'benign' && result.confidence >= 0.5) {
    return {
      isMalicious: true,
      reason: `Blocked ${result.label.toUpperCase()} attack vector (Confidence: ${result.confidence})`,
    };
  }

  return { isMalicious: false };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Scan Query Parameters
    let maliciousQuery: { isMalicious: boolean; reason?: string } | null = null;
    req.nextUrl.searchParams.forEach((value) => {
      if (maliciousQuery) return;
      const check = scanPayload(value);
      if (check.isMalicious) {
        maliciousQuery = check;
      }
    });

    if (maliciousQuery) {
      return NextResponse.json(
        { error: 'Forbidden: Malicious query payload detected', details: (maliciousQuery as any).reason },
        { status: 403 }
      );
    }

    // 2. Scan JSON Body
    const body = await req.json().catch(() => null);
    if (body) {
      const check = scanPayload(body);
      if (check.isMalicious) {
        return NextResponse.json(
          { error: 'Forbidden: Malicious body content detected', details: check.reason },
          { status: 403 }
        );
      }
    }

    // 3. Process Safe Business Logic
    return NextResponse.json({ success: true, message: 'Request verified and safe.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
