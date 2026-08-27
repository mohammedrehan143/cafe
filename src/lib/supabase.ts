import { createClient } from '@supabase/supabase-js';
import { Order, OrderStatus, DeliveryMethod } from '@/types/cafe';

// Environment variables (private SUPABASE_URL / SUPABASE_ANON_KEY or NEXT_PUBLIC_ fallbacks)
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://demo-cloud-kitchen.supabase.co';

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'demo-anon-key-atelier-lambre-secure-token';

export const isSupabaseConfigured = Boolean(
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
  !supabaseUrl.includes('demo-cloud-kitchen')
);

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
  rider_name?: string;
  rider_phone?: string;
  created_at: string;
  updated_at: string;
}

export function formatDbOrderToOrder(row: any): Order {
  let resolvedRiderName = row.rider_name;
  let resolvedRiderPhone = row.rider_phone;

  if (!resolvedRiderName && row.customer_instructions) {
    const match = String(row.customer_instructions).match(/\[RIDER:\s*(.*?)\s*\|\s*(.*?)\s*\]/);
    if (match) {
      resolvedRiderName = match[1];
      resolvedRiderPhone = match[2];
    }
  }

  return {
    id: row.tracking_code || row.token_id || row.id,
    tokenId: row.token_id || row.tracking_code || row.id,
    trackingCode: row.tracking_code || row.id,
    customerId: row.customer_id,
    createdAt: row.created_at || new Date().toISOString(),
    status: (row.status || 'new') as OrderStatus,
    deliveryMethod: (row.delivery_method || 'delivery') as DeliveryMethod,
    customer: {
      name: row.customer_name || 'Valued Customer',
      phone: row.customer_phone || '',
      email: row.customer_email || '',
      address: row.customer_address || '',
      unitOrApt: row.customer_unit || '',
      deliveryInstructions: row.customer_instructions || '',
    },
    items: Array.isArray(row.items_json) ? row.items_json : [],
    subtotal: Number(row.subtotal || 0),
    deliveryFee: Number(row.delivery_fee || 0),
    tax: Number(row.tax || 0),
    tip: Number(row.tip || 0),
    total: Number(row.total || 0),
    estimatedTime: row.estimated_time || (row.delivery_method === 'delivery' ? '20-30 min' : '10-15 min'),
    paymentMethod: row.payment_method || 'Online',
    paymentStatus: row.payment_status || 'completed',
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    riderName: resolvedRiderName,
    riderPhone: resolvedRiderPhone,
  };
}
