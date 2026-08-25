import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback defaults for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-cloud-kitchen.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key-atelier-lambre-secure-token';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbOrderRow {
  id: string;
  tracking_code: string;
  status: string;
  delivery_method: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address?: string;
  customer_unit?: string;
  customer_instructions?: string;
  items_json: any;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  tip: number;
  total: number;
  estimated_time: string;
  payment_method: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  updated_at: string;
}
