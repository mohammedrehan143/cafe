import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, DbMenuItemRow } from '@/lib/supabase';
import { MENU_ITEMS } from '@/data/cafeData';
import { MenuItem } from '@/types/cafe';
import { checkRateLimit, sanitizeString } from '@/lib/security';

export async function GET(req: NextRequest) {
  const limit = checkRateLimit(req, 120, 60);
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    // Fetch from Supabase if configured
    if (isSupabaseConfigured) {
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const formatted: MenuItem[] = (data as DbMenuItemRow[]).map((row) => {
          const staticMatch = MENU_ITEMS.find((m) => m.id === row.id);
          let imageUrl = row.image;

          // Auto-heal broken legacy fries image
          if (!imageUrl || imageUrl.includes('1576107232684') || row.id === 'classic-french-fries') {
            imageUrl = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop';
            // Sync to Supabase in background
            try {
              supabase.from('menu_items').update({ image: imageUrl }).eq('id', row.id);
            } catch {}
          } else if (staticMatch && !row.image) {
            imageUrl = staticMatch.image;
          }

          // Auto-heal prices to INR
          const itemPrice = staticMatch?.price || (row.price.startsWith('$') ? `₹${Math.round(Number(row.price_number) * 35)}` : row.price);
          const itemPriceNumber = staticMatch?.priceNumber || (row.price.startsWith('$') ? Math.round(Number(row.price_number) * 35) : Number(row.price_number));

          if (row.price.startsWith('$') && staticMatch) {
            try {
              supabase.from('menu_items').update({ price: staticMatch.price, price_number: staticMatch.priceNumber }).eq('id', row.id);
            } catch {}
          }

          return {
            id: row.id,
            name: row.name,
            category: row.category,
            description: row.description,
            detailedDescription: row.detailed_description,
            price: itemPrice,
            priceNumber: itemPriceNumber,
            image: imageUrl,
            calories: row.calories,
            dietary: row.dietary || [],
            tasteNotes: row.taste_notes || [],
            origin: row.origin,
            featured: row.featured,
            signature: row.signature,
            pairing: row.pairing,
            prepTime: row.prep_time,
            customizationOptions: row.customization_options || {},
            isAvailable: row.is_available,
            displayOrder: row.display_order,
          };
        });

        return NextResponse.json({ success: true, menu: formatted, source: 'supabase' });
      }
    }

    // Fallback to static menu items
    let fallbackMenu = [...MENU_ITEMS];
    if (category && category !== 'all') {
      fallbackMenu = fallbackMenu.filter((i) => i.category === category);
    }

    return NextResponse.json({ success: true, menu: fallbackMenu, source: 'local' });
  } catch (err: any) {
    return NextResponse.json({ success: true, menu: MENU_ITEMS, warning: err.message });
  }
}

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, 20, 60);
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const {
      id,
      name,
      category,
      description,
      detailedDescription,
      price,
      priceNumber,
      image,
      calories,
      dietary,
      tasteNotes,
      origin,
      featured,
      signature,
      pairing,
      prepTime,
      customizationOptions,
      isAvailable,
      displayOrder,
    } = body;

    if (!id || !name || !price || !category) {
      return NextResponse.json({ success: false, error: 'Missing required menu fields' }, { status: 400 });
    }

    const payload: Partial<DbMenuItemRow> = {
      id: sanitizeString(id, 80),
      name: sanitizeString(name, 100),
      category: sanitizeString(category, 50),
      description: sanitizeString(description, 300),
      detailed_description: sanitizeString(detailedDescription || '', 600),
      price: sanitizeString(price, 20),
      price_number: Number(priceNumber) || 0,
      image: sanitizeString(image, 500),
      calories: sanitizeString(calories || '', 30),
      dietary: Array.isArray(dietary) ? dietary : [],
      taste_notes: Array.isArray(tasteNotes) ? tasteNotes : [],
      origin: sanitizeString(origin || '', 100),
      featured: Boolean(featured),
      signature: Boolean(signature),
      pairing: sanitizeString(pairing || '', 100),
      prep_time: sanitizeString(prepTime || '3-5 min', 30),
      customization_options: customizationOptions || {},
      is_available: isAvailable !== false,
      display_order: Number(displayOrder) || 0,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('menu_items')
        .upsert(payload)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, item: data });
    }

    return NextResponse.json({ success: true, item: payload, warning: 'Saved in offline mode' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
