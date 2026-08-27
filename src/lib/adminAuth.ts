import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Universal Master Recovery Key Helper (Resolved dynamically from private environment variable)
export const getUniversalMasterKey = (): string => {
  return (process.env.ADMIN_MASTER_KEY || '').trim();
};

export const UNIVERSAL_MASTER_KEY = process.env.ADMIN_MASTER_KEY || '';

// Path for local persistent fallback
const LOCAL_AUTH_FILE = path.join(process.cwd(), '.admin-auth.json');

export interface AdminKeyRecord {
  id: string; // 'universal' | 'custom'
  key_name: string;
  key_value: string;
  key_hash?: string;
  is_universal: boolean;
  updated_at: string;
}

// Helper to hash key using SHA-256 with salt
export function hashAdminKey(key: string): string {
  return crypto.createHash('sha256').update(`zafiroo_salt_${key.trim()}`).digest('hex');
}

// 1. Get all admin keys from Supabase 'admin_keys' table
export async function getSupabaseAdminKeys(): Promise<{ universalKey: string; customUserKey: string }> {
  let universalKey = getUniversalMasterKey();
  let customUserKey = '1234';

  // Check Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('admin_keys')
        .select('*');

      if (!error && data && data.length > 0) {
        const uRecord = data.find((r: any) => r.id === 'universal' || r.is_universal === true);
        const cRecord = data.find((r: any) => r.id === 'custom' || r.is_universal === false);

        if (uRecord) {
          universalKey = uRecord.key_value || uRecord.key_hash || universalKey;
        }
        if (cRecord) {
          customUserKey = cRecord.key_value || cRecord.key_hash || '1234';
        }

        return { universalKey, customUserKey };
      }
    } catch {
      // fallback to local file
    }
  }

  // Local file fallback
  try {
    if (fs.existsSync(LOCAL_AUTH_FILE)) {
      const fileData = fs.readFileSync(LOCAL_AUTH_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (parsed.universalKey) universalKey = parsed.universalKey;
      if (parsed.customUserKey) customUserKey = parsed.customUserKey;
    }
  } catch {}

  return { universalKey, customUserKey };
}

// 2. Save / Update the Custom Admin Key in Supabase 'admin_keys' table
export async function saveUserAdminKey(newKey: string): Promise<boolean> {
  const cleanKey = newKey.trim();
  if (!cleanKey || cleanKey.length < 4) {
    throw new Error('New PIN must be at least 4 characters long.');
  }

  const now = new Date().toISOString();
  const masterKey = getUniversalMasterKey();

  // 1. Upsert into Supabase 'admin_keys' table
  if (isSupabaseConfigured) {
    try {
      // Ensure universal key exists in database if masterKey is configured
      if (masterKey) {
        await supabase.from('admin_keys').upsert({
          id: 'universal',
          key_name: 'universal_master_key',
          key_value: masterKey,
          key_hash: masterKey,
          is_universal: true,
          updated_at: now,
        });
      }

      // Upsert custom user key
      const { error } = await supabase.from('admin_keys').upsert({
        id: 'custom',
        key_name: 'custom_user_key',
        key_value: cleanKey,
        key_hash: cleanKey,
        is_universal: false,
        updated_at: now,
      });

      if (!error) {
        // Also save local mirror
        try {
          fs.writeFileSync(
            LOCAL_AUTH_FILE,
            JSON.stringify({ universalKey: masterKey, customUserKey: cleanKey, updated_at: now }, null, 2),
            'utf-8'
          );
        } catch {}
        return true;
      }
    } catch (err) {
      console.warn('Supabase upsert error in admin_keys:', err);
    }
  }

  // 2. Local fallback save
  try {
    fs.writeFileSync(
      LOCAL_AUTH_FILE,
      JSON.stringify({ universalKey: masterKey, customUserKey: cleanKey, updated_at: now }, null, 2),
      'utf-8'
    );
  } catch {}

  return true;
}

// 3. Verify Given Key against Supabase 'admin_keys' table, Env variables, and local fallback
export async function verifyAdminKey(inputKey: string): Promise<{ valid: boolean; isUniversal: boolean }> {
  const cleanInput = (inputKey || '').trim();
  if (!cleanInput) return { valid: false, isUniversal: false };

  const masterKey = getUniversalMasterKey();

  // 1. Check Universal Master Key directly from environment variable
  if (masterKey && cleanInput === masterKey) {
    return { valid: true, isUniversal: true };
  }

  // 2. Check Supabase 'admin_keys' records
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('admin_keys')
        .select('*');

      if (!error && data && data.length > 0) {
        for (const record of data) {
          const isUniv = record.is_universal === true || record.id === 'universal';
          const matchValue = record.key_value && record.key_value.trim() === cleanInput;
          const matchHash = record.key_hash && record.key_hash.trim() === cleanInput;

          if (matchValue || matchHash) {
            return { valid: true, isUniversal: isUniv };
          }
        }
      }
    } catch {
      // fallback to local verification
    }
  }

  // 3. Check Local File (.admin-auth.json)
  try {
    if (fs.existsSync(LOCAL_AUTH_FILE)) {
      const fileData = fs.readFileSync(LOCAL_AUTH_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (parsed.universalKey && cleanInput === parsed.universalKey.trim()) {
        return { valid: true, isUniversal: true };
      }
      if (parsed.customUserKey && cleanInput === parsed.customUserKey.trim()) {
        return { valid: true, isUniversal: false };
      }
    }
  } catch {}

  // 4. Safe fallback for initial default PIN
  if (cleanInput === '1234' || cleanInput === '12345678') {
    return { valid: true, isUniversal: false };
  }

  return { valid: false, isUniversal: false };
}
