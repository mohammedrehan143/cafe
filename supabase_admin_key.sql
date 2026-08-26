-- ==============================================================================
-- ZAFIROO KDS: ADMIN KEYS DATABASE TABLE
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Create admin_keys table
CREATE TABLE IF NOT EXISTS public.admin_keys (
    id TEXT PRIMARY KEY,                       -- 'universal' or 'custom'
    key_name TEXT NOT NULL,                    -- e.g. 'universal_master_key' or 'custom_user_key'
    key_value TEXT NOT NULL,                   -- custom PIN
    key_hash TEXT,                             -- SHA-256 secure hash
    is_universal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Insert Initial Default Key (Default: '1234')
INSERT INTO public.admin_keys (id, key_name, key_value, key_hash, is_universal, updated_at)
VALUES (
    'custom',
    'custom_user_key',
    '1234',
    '1234',
    FALSE,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Key 2: User Made Custom Key (Default: '1234')
INSERT INTO public.admin_keys (id, key_name, key_value, key_hash, is_universal, updated_at)
VALUES (
    'custom',
    'custom_user_key',
    '1234',
    '1234',
    FALSE,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE public.admin_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read admin keys" ON public.admin_keys;
CREATE POLICY "Allow public read admin keys" 
    ON public.admin_keys FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow public insert update admin keys" ON public.admin_keys;
CREATE POLICY "Allow public insert update admin keys" 
    ON public.admin_keys FOR ALL 
    USING (true)
    WITH CHECK (true);
