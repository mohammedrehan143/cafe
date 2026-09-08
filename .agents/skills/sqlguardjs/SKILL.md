---
name: sqlguardjs
description: Detect, prevent, and audit SQL injection (SQLi), NoSQL injection, XSS payloads, and malicious request structures across Next.js API routes, Express middleware, raw database queries (Supabase/PostgreSQL), and application inputs using SQLGuardJS.
argument-hint: "[scan|protect|audit|verify] [target]"
metadata:
  author: Chiranth Janardhan Moger (adapted for Antigravity)
  repository: https://github.com/Chiranth-Janardhan-moger/sqlguardjs
  version: "1.0.4"
---

# SQLGuardJS Security Skill

[SQLGuardJS](https://github.com/Chiranth-Janardhan-moger/sqlguardjs) is a defense-in-depth request-scanning engine and runtime guard designed to intercept and neutralize SQL injection (SQLi), NoSQL operator injection, Cross-Site Scripting (XSS), and malicious request payloads before they reach application handlers or database execution layers.

This skill equips agents with workflows, scripts, and patterns to audit codebases, secure Next.js App Router route handlers, protect Supabase/PostgreSQL queries, and run payload scans.

---

## When to Use This Skill

Activate or reference this skill when:
- Designing or auditing API endpoints (`/api/*`) for injection vulnerabilities.
- Protecting Next.js 15 App Router server route handlers (`route.ts`) against malicious query parameters and JSON body injections.
- Validating raw SQL strings, stored procedures (`supabase.rpc`), or dynamic query clauses before database execution.
- Implementing defense-in-depth security layers alongside parameterized queries and Supabase Row Level Security (RLS).
- Scanning suspicious payloads, form inputs, or search terms during penetration testing or code reviews.
- Configuring detection sensitivity levels (`strict`, `balanced`, `permissive`) or route schemas.

---

## Quick Start & CLI Usage

`sqlguardjs` is installed in this project as an npm dependency. The CLI can be invoked via `npx`:

### 1. Scan a Single Payload
```bash
npx sqlguardjs scan "1' OR '1'='1"
```
**Sample JSON Output:**
```json
{
  "payload": "1' OR '1'='1",
  "result": {
    "label": "sqli",
    "confidence": 1,
    "scores": { "sqli": 2, "xss": 0 },
    "matches": [
      { "id": "sql-structural-boolean", "label": "sqli", "confidence": 0.75 },
      { "id": "boolean-tautology", "label": "sqli", "confidence": 0.75 }
    ]
  }
}
```

### 2. Scan a File with Multiple Payloads
```bash
npx sqlguardjs scan-file suspicious_payloads.txt --format json
```

### 3. Quick Node.js Verification
```bash
node -e "const { assertSafeSqlQuery } = require('sqlguardjs'); assertSafeSqlQuery('SELECT * FROM orders WHERE id = 1'); console.log('Query safe!');"
```

---

## Core Detection Architecture

| Attack Vector | Detection Methodology |
| :--- | :--- |
| **SQL Injection (SQLi)** | Detects boolean tautologies (`' OR '1'='1`), union-based extraction (`UNION SELECT`), stacked queries (`; DROP TABLE`), time-based delays (`pg_sleep()`, `WAITFOR DELAY`), and comment truncation (`--`, `/* */`). |
| **NoSQL Injection** | Intercepts nested query operators like `$gt`, `$ne`, `$where`, `$regex` injected into request bodies or query strings. |
| **Cross-Site Scripting (XSS)** | Identifies `<script>` tags, inline event handlers (`onerror=`, `onload=`), `javascript:` pseudo-protocols, and encoded vector variants. |
| **Deep Decoding** | Recursively unwraps URL encoding (`%27`), hex entities, and multi-layered obfuscations before running heuristic signal matchers. |

---

## Integration Patterns in This Project

### 1. Next.js 15 App Router Route Handlers (`src/app/api/...`)

Use `src/lib/sqlguard.ts` (or the `Detector` class directly) to wrap route handlers:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withSqlGuard } from '@/lib/sqlguard';

// Wrap GET/POST/PUT handlers with automatic payload & query inspection
export const POST = withSqlGuard(async (req: NextRequest) => {
  const body = await req.json();
  // Safe to process business logic
  return NextResponse.json({ success: true });
}, {
  level: 'strict', // 'strict' | 'balanced' | 'permissive'
  scanBody: true,
  scanQuery: true,
});
```

### 2. Supabase Dynamic Query / RPC Guard

Even when using Supabase client libraries, dynamic queries or custom RPC arguments can be validated using `assertSafeSqlQuery`:

```typescript
import { assertSafeSqlQuery } from 'sqlguardjs';

export async function executeFilteredReport(rawFilterSql: string) {
  // Throws SqlGuardJSQueryError if malicious SQL signals are found
  assertSafeSqlQuery(rawFilterSql, { level: 'strict' });
  
  const { data, error } = await supabase.rpc('run_filtered_orders', { filter: rawFilterSql });
  if (error) throw error;
  return data;
}
```

### 3. Programmatic Detector API

For custom sanitization or custom validation middleware:

```typescript
import { Detector } from 'sqlguardjs';

const detector = new Detector({
  maxPayloadLength: 10000,
  maxDecodeIterations: 5,
});

const result = detector.detect(userInput);

if (result.isMalicious && result.confidence >= 0.5) {
  console.warn(`Blocked ${result.label} attempt with confidence ${result.confidence}`);
  throw new Error('Security policy violation: suspicious input detected.');
}
```

---

## Detection Sensitivity Levels

| Level | Confidence Threshold | Recommended Endpoints |
| :--- | :--- | :--- |
| `strict` | Low tolerance (blocks on ~0.35+ confidence) | Authentication (`/api/admin/auth`, `/api/delivery/auth`), OTP verification, Payment callbacks (`/api/cashfree/*`, `/api/razorpay/*`). |
| `balanced` | Standard default (`0.5` threshold) | Customer ordering (`/api/orders`), cart submissions, delivery updates. |
| `permissive` | High tolerance (observes / logs unless overt attack) | Free-text search inputs, customer review/feedback text, kitchen notes. |

---

## Best Practices & Security Guidelines

1. **Defense-in-Depth, Not a Replacement**:
   - `sqlguardjs` intercepts malicious probes at the perimeter.
   - Always combine with parameterized Supabase queries (`.eq()`, `.in()`), Row Level Security (RLS) policies, and schema validation.
2. **Schema Enforcement**:
   - For sensitive POST endpoints, declare allowed body fields so attackers cannot inject unexpected prototype or operator keys.
3. **Log & Audit**:
   - In production, set `logAttacks: true` or subscribe to `onThreat` events to track attack sources, IPs, and payload patterns.

---

## Skill Directory Structure

- [`SKILL.md`](file:///D:/agy/cafe/.agents/skills/sqlguardjs/SKILL.md) — Main skill instruction file.
- [`scripts/audit-endpoints.mjs`](file:///D:/agy/cafe/.agents/skills/sqlguardjs/scripts/audit-endpoints.mjs) — Script to audit project API routes for input protection.
- [`examples/nextjs-route-guard.ts`](file:///D:/agy/cafe/.agents/skills/sqlguardjs/examples/nextjs-route-guard.ts) — Sample Next.js App Router protection.
- [`references/api-reference.md`](file:///D:/agy/cafe/.agents/skills/sqlguardjs/references/api-reference.md) — Comprehensive API and options reference.
