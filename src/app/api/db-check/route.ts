import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = Boolean(supabaseUrl && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !supabaseUrl.includes('demo-cloud-kitchen'));

  const report: Record<string, any> = {
    status: 'online',
    timestamp: new Date().toISOString(),
    envSource: '.env.local',
    supabaseConfigured: isConfigured,
    supabaseUrl: supabaseUrl ? supabaseUrl.replace(/(https:\/\/)(.{4}).*(\.supabase\.co)/, '$1$2****$3') : 'Not set',
    tables: {
      menu_items: { accessible: false, count: 0 },
      customers: { accessible: false, count: 0 },
      orders: { accessible: false, count: 0 },
    },
    latencyMs: 0,
    instructions: '',
  };

  if (!isConfigured) {
    report.status = 'local_fallback';
    report.message = 'Supabase environment variables in .env.local have default placeholder values. The app is running smoothly in local fast-fallback mode.';
    report.instructions = 'To connect to your live Supabase database, paste your real NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY into .env.local and run supabase_schema.sql in the Supabase SQL editor.';
    report.latencyMs = Date.now() - startTime;
    return NextResponse.json(report);
  }

  try {
    // 1. Test menu_items table
    const { data: menuData, error: menuErr } = await supabase
      .from('menu_items')
      .select('id', { count: 'exact' });

    if (!menuErr) {
      report.tables.menu_items.accessible = true;
      report.tables.menu_items.count = menuData?.length || 0;
    } else {
      report.tables.menu_items.error = menuErr.message;
    }

    // 2. Test customers table
    const { data: custData, error: custErr } = await supabase
      .from('customers')
      .select('id', { count: 'exact' });

    if (!custErr) {
      report.tables.customers.accessible = true;
      report.tables.customers.count = custData?.length || 0;
    } else {
      report.tables.customers.error = custErr.message;
    }

    // 3. Test orders table
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .select('id', { count: 'exact' });

    if (!orderErr) {
      report.tables.orders.accessible = true;
      report.tables.orders.count = orderData?.length || 0;
    } else {
      report.tables.orders.error = orderErr.message;
    }

    const allAccessible = report.tables.menu_items.accessible && report.tables.customers.accessible && report.tables.orders.accessible;

    report.status = allAccessible ? 'connected_healthy' : 'partially_connected';
    report.latencyMs = Date.now() - startTime;
    report.realtimeReady = true;

    return NextResponse.json(report);
  } catch (err: any) {
    report.status = 'error';
    report.error = err.message;
    report.latencyMs = Date.now() - startTime;
    return NextResponse.json(report, { status: 500 });
  }
}
