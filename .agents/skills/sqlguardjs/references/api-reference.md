# SQLGuardJS API & Configuration Reference

This reference document outlines key functions, classes, and options available in `sqlguardjs`.

---

## 1. Top-Level Exports

```typescript
import {
  sqlguardjs,           // Main factory function for Express middleware instance
  secureRouter,         // Secure router wrapping Express Router with automatic checks
  scanSqlQuery,         // Query scanner returning DetectionResult
  assertSafeSqlQuery,   // Query validator throwing SqlGuardJSQueryError on violation
  evaluatePayloads,     // Test harness for benchmarking payloads against detection rules
  Detector,             // Core heuristic inspection and normalization class
  SqlGuardJSQueryError  // Custom error class with detection details
} from 'sqlguardjs';
```

---

## 2. Detector Class

The core scanning engine independent of any HTTP framework.

### Constructor Options
```typescript
const detector = new Detector({
  maxPayloadLength?: number;     // Default 8192 - Maximum characters inspected
  maxDecodeIterations?: number;  // Default 4 - Maximum recursive URL/entity decode passes
});
```

### Methods
- `detect(payload: unknown): DetectionResult`
  Scans strings, objects, or arrays. Returns:
  ```typescript
  interface DetectionResult {
    isMalicious: boolean;
    label: 'sqli' | 'xss' | 'nosql' | 'benign';
    confidence: number;          // 0.0 to 1.0
    scores: {
      sqli: number;
      xss: number;
    };
    matches: Array<{
      id: string;
      label: string;
      confidence: number;
    }>;
  }
  ```
- `decodeDeeply(payload: unknown): string`
  Recursively unwraps URL encoding, HTML entities, and Unicode escapes.
- `normalizePayload(payload: unknown, options?: { sqlCommentMode?: 'space' | 'remove' | 'preserve' }): string`
  Converts payload into standard comparable representation.

---

## 3. Query Guard Functions

### `scanSqlQuery(query: string, options?: SqlQueryGuardOptions): DetectionResult`
Performs inspection without throwing an exception.

### `assertSafeSqlQuery(query: string, options?: SqlQueryGuardOptions): DetectionResult`
Inspects SQL query string. Throws `SqlGuardJSQueryError` if confidence threshold is breached.

```typescript
try {
  assertSafeSqlQuery(untrustedQuery, { level: 'strict' });
} catch (err) {
  if (err instanceof SqlGuardJSQueryError) {
    console.error('Threat blocked:', err.result.label, err.result.confidence);
  }
}
```

---

## 4. Detection Levels

- `'strict'`: High sensitivity. Blocks low-confidence heuristic anomalies. Ideal for authentication, payments, and admin endpoints.
- `'balanced'`: Default mode. Low false-positive rate while catching common and obfuscated SQLi/XSS attacks.
- `'permissive'`: Observe and log mode. Only blocks overt, unmistakable exploits. Recommended during initial production rollout.
