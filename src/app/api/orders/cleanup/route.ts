import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const tenDaysAgoISO = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

    let deletedCount = 0;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .delete()
        .lt('created_at', tenDaysAgoISO)
        .select();

      if (!error && data) {
        deletedCount = data.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up orders older than 10 days (${tenDaysAgoISO})`,
      deletedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
