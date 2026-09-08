#!/usr/bin/env node

/**
 * Audit API Endpoints against common SQLi / XSS / NoSQL Injection payloads
 * using sqlguardjs
 */

import { Detector, scanSqlQuery } from 'sqlguardjs';

const detector = new Detector();

const testVectors = [
  { type: 'SQLi Boolean', payload: "admin' OR 1=1--" },
  { type: 'SQLi Union', payload: "1 UNION SELECT username, password FROM users--" },
  { type: 'SQLi Time-based', payload: "1; SELECT pg_sleep(5)--" },
  { type: 'XSS Script Tag', payload: "<script>alert('pwned')</script>" },
  { type: 'XSS Event Handler', payload: "<img src=x onerror=alert(1)>" },
  { type: 'NoSQL Operator', payload: '{"$gt": ""}' },
  { type: 'Benign Customer Order', payload: 'Classic Hot Coffee with extra brown sugar' },
  { type: 'Benign Address', payload: 'Flat 402, 100 Feet Road, Indiranagar, Bengaluru' },
];

console.log('--- SQLGuardJS Audit Verification ---');
let blockedCount = 0;
let allowedCount = 0;

for (const vector of testVectors) {
  const result = detector.detect(vector.payload);
  const isMalicious = result.isMalicious || result.confidence >= 0.5;

  if (isMalicious) {
    blockedCount++;
    console.log(`[BLOCKED] ${vector.type}: "${vector.payload}" -> Threat: ${result.label.toUpperCase()} (Confidence: ${result.confidence})`);
  } else {
    allowedCount++;
    console.log(`[ALLOWED] ${vector.type}: "${vector.payload}"`);
  }
}

console.log('-------------------------------------');
console.log(`Audit Complete: ${blockedCount} attack vectors blocked, ${allowedCount} benign payloads passed safely.`);
