import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback defaults for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-cloud-kitchen.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key-atelier-lambre-secure-token';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbCustomerRow {
  id: string;
  phone: string;
  name: string;
  email?: string;
  address?: string;
  unit?: string;
  default_instructions?: string;
  order_count: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface DbMenuItemRow {
  id: string;
  name: string;
  category: string;
  description: string;
  detailed_description?: string;
  price: string;
  price_number: number;
  image: string;
  calories?: string;
  dietary?: string[];
  taste_notes?: string[];
  origin?: string;
  featured: boolean;
  signature: boolean;
  pairing?: string;
  prep_time: string;
  customization_options: any;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbOrderRow {
  id: string;
  token_id: string;
  tracking_code: string;
  customer_id?: string;
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
  payment_status?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  updated_at: string;
}
