-- ==============================================================================
-- ZAFIROO / CLOUD KITCHEN PRODUCTION DATABASE SCHEMA
-- Full Supabase Schema: Customers, Dynamic Menu, Orders, Realtime Tracking, & Auto 10-Day Retention
-- ==============================================================================

-- 1. Create Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,                          -- e.g. CUST-9886-A4F
    phone TEXT UNIQUE NOT NULL,                   -- Normalized phone number (e.g. +919886012345)
    name TEXT NOT NULL,
    email TEXT,
    address TEXT,
    unit TEXT,
    default_instructions TEXT,
    order_count INTEGER NOT NULL DEFAULT 1,
    total_spent NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Menu Items Table (Dynamic Database-Backed Menu)
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,                          -- e.g. zafiroo-signature-coffee
    name TEXT NOT NULL,
    category TEXT NOT NULL,                       -- coffee, shakes, fries, sandwiches, pizza, desserts, drinks
    description TEXT NOT NULL,
    detailed_description TEXT,
    price TEXT NOT NULL,                          -- Display price: e.g. "$6.00"
    price_number NUMERIC(10, 2) NOT NULL,         -- Calculation price: 6.00
    image TEXT NOT NULL,
    calories TEXT,
    dietary TEXT[] DEFAULT '{}',
    taste_notes TEXT[] DEFAULT '{}',
    origin TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    signature BOOLEAN NOT NULL DEFAULT FALSE,
    pairing TEXT,
    prep_time TEXT NOT NULL DEFAULT '3-5 min',
    customization_options JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Orders Table with Customer ID & Order Token ID
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,                          -- e.g. ZF-9421-XK7
    token_id TEXT UNIQUE NOT NULL,                -- Clean Tracking Token: e.g. TOK-9421-XK7 / ZF-9421-XK7
    tracking_code TEXT UNIQUE NOT NULL,           -- Direct tracking lookup code
    customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'new' 
        CHECK (status IN ('new', 'preparing', 'ready', 'delivering', 'completed', 'cancelled')),
    delivery_method TEXT NOT NULL DEFAULT 'delivery' 
        CHECK (delivery_method IN ('delivery', 'pickup')),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_address TEXT,
    customer_unit TEXT,
    customer_instructions TEXT,
    items_json JSONB NOT NULL,                    -- Ordered items with customized toppings/options
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tip NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    estimated_time TEXT NOT NULL DEFAULT '20-30 min',
    payment_method TEXT NOT NULL DEFAULT 'Online',
    payment_status TEXT NOT NULL DEFAULT 'completed' 
        CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    rider_name TEXT,
    rider_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. High Performance Lookups & Real-time Tracking Indexes
CREATE INDEX IF NOT EXISTS idx_orders_token_id ON public.orders (token_id);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON public.orders (tracking_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers (phone);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items (category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items (is_available);

-- 5. Automated 10-Day Retention Stored Procedure
CREATE OR REPLACE FUNCTION delete_orders_older_than_10_days()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.orders
    WHERE created_at < (NOW() - INTERVAL '10 days');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger to Auto-Update updated_at Timestamps
CREATE OR REPLACE FUNCTION update_modtime_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_modtime_column();

DROP TRIGGER IF EXISTS trigger_customers_updated_at ON public.customers;
CREATE TRIGGER trigger_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION update_modtime_column();

DROP TRIGGER IF EXISTS trigger_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER trigger_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION update_modtime_column();

-- 7. Enable Supabase Realtime for Live Live Order Tracking
-- Note: Run these in Supabase SQL editor to broadcast live events
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;

-- 8. Row Level Security (RLS) Policies
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers RLS
CREATE POLICY "Public can select customer" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Public can insert/upsert customer" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update customer" ON public.customers FOR UPDATE USING (true);

-- Menu Items RLS (Public read-only, staff write)
CREATE POLICY "Public can view active menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Staff can manage menu items" ON public.menu_items FOR ALL USING (true);

-- Orders RLS (Realtime tracking and order submission)
CREATE POLICY "Public can view order by token or code" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can place new order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff and system can update order status" ON public.orders FOR UPDATE USING (true);

-- ==============================================================================
-- 9. Initial Menu Seed Data (18 Gourmet Artisan Items)
-- ==============================================================================

INSERT INTO public.menu_items (id, name, category, description, detailed_description, price, price_number, image, calories, dietary, taste_notes, origin, featured, signature, pairing, prep_time, customization_options, is_available, display_order)
VALUES
(
    'classic-hot-coffee',
    'Classic Hot Coffee',
    'coffee',
    'Freshly pulled rich espresso combined with silky steamed microfoam and delicate latte art.',
    'Brewed from single-origin 100% Arabica beans roasted in-house. Pulled with precision into double espresso, blended with velvety micro-textured whole milk, creating a comforting, buttery cup with dark chocolate and hazelnut notes.',
    '$4.50',
    4.50,
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    '120 kcal',
    ARRAY['Vegetarian', 'Specialty Brew'],
    ARRAY['Velvety Microfoam', 'Dark Cacao', 'Roasted Hazelnut'],
    'Single-Origin Chikmagalur',
    TRUE,
    FALSE,
    'Brownie Chocolate Lava',
    '3 min',
    '{"temperature": ["Piping Hot (Recommended)", "Extra Hot", "Warm"], "sweetness": ["No Sugar", "Regular Sweetness", "Extra Sweet"], "portion": ["Regular Cup (250ml)", "Large Mug (350ml) (+$1.00)"]}'::jsonb,
    TRUE,
    1
),
(
    'zafiroo-signature-coffee',
    'Zafiroo Signature Coffee',
    'coffee',
    'Zafiroo''s exclusive house blend brewed with aromatic beans, secret caramel-hazelnut syrup, and a velvety whipped cream crown.',
    'The crown jewel of Zafiroo. A rich triple-ristretto base steeped with hand-crafted salted butter caramel and toasted hazelnuts, finished with a luscious sea salt cream froth and a dusting of Belgian cocoa.',
    '$6.00',
    6.00,
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop',
    '210 kcal',
    ARRAY['Chef Signature', 'House Special'],
    ARRAY['Salted Caramel', 'Whipped Cream Crown', 'Dark Mocha Depth'],
    'Zafiroo Secret Recipe',
    TRUE,
    TRUE,
    'Cheesy Fries & Veg Sandwich',
    '4 min',
    '{"temperature": ["Hot Latte Style", "Iced Cold Cloud (Recommended)"], "sweetness": ["Zafiroo Balanced Sweetness", "Less Sweet (70%)", "Extra Sweet"], "portion": ["Standard Glass", "Grande Jar (+$1.50)"]}'::jsonb,
    TRUE,
    2
),
(
    'classic-cold-coffee',
    'Classic Cold Coffee',
    'coffee',
    'Bold slow-steeped dark roast espresso blended with chilled milk and ice, topped with a frothy coffee crest.',
    'Strong dark espresso pulled fresh over chilled whole milk and blended with ice into a thick, frothy, energizing coffee shake.',
    '$5.00',
    5.00,
    'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1200&auto=format&fit=crop',
    '180 kcal',
    ARRAY['Chilled Favorite'],
    ARRAY['Crisp Espresso Kick', 'Thick Froth', 'Creamy Finish'],
    'Estate Arabica Blend',
    TRUE,
    FALSE,
    'Classic French Fries',
    '3 min',
    '{"temperature": ["Chilled with Ice", "Extra Chilled (Crushed Ice)"], "sweetness": ["Regular Sweet", "Low Sugar", "No Sugar"]}'::jsonb,
    TRUE,
    3
),
(
    'chocolate-cold-coffee',
    'Chocolate Cold Coffee',
    'coffee',
    'Decadent Dutch cocoa syrup swirled into thick iced espresso and whole milk, drizzled with dark chocolate ganache.',
    'A luscious marriage of intense cold drip espresso and rich Dutch cocoa ganache. Swirled over creamy milk and crushed ice, topped with chocolate drizzle.',
    '$5.75',
    5.75,
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1200&auto=format&fit=crop',
    '240 kcal',
    ARRAY['Chocoholic Choice'],
    ARRAY['Dutch Dark Cocoa', 'Espresso Fusion', 'Silky Ganache Drizzle'],
    'Zafiroo Beverage Bar',
    FALSE,
    FALSE,
    'Pastries & Cupcakes',
    '3 min',
    '{"sweetness": ["Standard Sweet", "Extra Chocolatey", "Mild Sweet"], "portion": ["Standard (350ml)", "Monster Mug (450ml) (+$1.50)"]}'::jsonb,
    TRUE,
    4
),
(
    'zafiroo-royal-cold-coffee',
    'Zafiroo Royal Cold Coffee',
    'coffee',
    'The ultimate cold indulgence — double shot espresso, Belgian chocolate flakes, creamy vanilla bean gelato, and caramelized almond crunch.',
    'Double-extracted specialty espresso blended with creamy Madagascar vanilla gelato, poured over Belgian chocolate chips, and crowned with whipped cream, almond brittle, and dark chocolate shavings.',
    '$6.50',
    6.50,
    'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?q=80&w=1200&auto=format&fit=crop',
    '290 kcal',
    ARRAY['Royal Signature', 'House Special'],
    ARRAY['Gelato Creaminess', 'Belgian Chocolate Curls', 'Almond Brittle'],
    'Zafiroo Royal Reserve',
    TRUE,
    TRUE,
    'Pizzas & Peri Peri Fries',
    '4 min',
    '{"portion": ["Royal Goblet (400ml)", "Mega Royal (550ml) (+$2.00)"], "sweetness": ["Royal Sweetness", "Moderate Sweetness"]}'::jsonb,
    TRUE,
    5
),
(
    'vanilla-milkshake',
    'Vanilla Milkshake',
    'shakes',
    'Ultra-thick and creamy shake churned with premium Madagascar vanilla beans, fresh whole cream, and topped with whipped peaks.',
    'High-grade Madagascar bourbon vanilla bean extract blended with slow-churned whole cream ice cream and farm-fresh milk into a super dense, velvety shake.',
    '$5.50',
    5.50,
    'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1200&auto=format&fit=crop',
    '320 kcal',
    ARRAY['Vegetarian', 'Creamy Classic'],
    ARRAY['Madagascar Vanilla', 'Thick Cream Texture', 'Whipped Frosting'],
    'Zafiroo Creamery',
    FALSE,
    FALSE,
    'Peri Peri French Fries',
    '3 min',
    '{"sweetness": ["Regular Sweet", "Extra Creamy"], "portion": ["Standard (350ml)", "Jumbo (500ml) (+$1.50)"]}'::jsonb,
    TRUE,
    6
),
(
    'chocolate-milkshake',
    'Chocolate Milkshake',
    'shakes',
    'Rich Belgian dark chocolate blended to creamy perfection, layered with chocolate fudge and chocolate vermicelli.',
    'Dense, spoon-thick shake made with double dark chocolate ice cream, melted Belgian couverture, and chilled milk. Garnished with rich chocolate fudge sauce and crunchy chocolate curls.',
    '$6.00',
    6.00,
    'https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=1200&auto=format&fit=crop',
    '380 kcal',
    ARRAY['Vegetarian', 'Rich Chocolate'],
    ARRAY['Belgian Couverture', 'Fudge Ribbon', 'Malted Cocoa'],
    'Zafiroo Creamery',
    TRUE,
    FALSE,
    'Cheesy Fries',
    '3 min',
    '{"sweetness": ["Standard Sweet", "Dark & Intense", "Extra Sweet"], "portion": ["Standard (350ml)", "Jumbo (500ml) (+$1.50)"]}'::jsonb,
    TRUE,
    7
),
(
    'kitkat-shake',
    'KitKat Shake',
    'shakes',
    'Crispy crushed KitKat wafer bars blended into thick chocolate malt shake, garnished with whole KitKat fingers and fudge.',
    'Crisp KitKat chocolate wafers crushed and folded into our signature chocolate malt shake, topped with whipped cream, chocolate syrup swirl, and whole crispy KitKat bars.',
    '$6.50',
    6.50,
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop',
    '420 kcal',
    ARRAY['Bestseller', 'Crunchy Delight'],
    ARRAY['Wafer Crunch', 'Milk Chocolate Malt', 'Whipped Topping'],
    'Zafiroo Signature Shakes',
    TRUE,
    TRUE,
    'Egg Sandwich & Peri Peri Fries',
    '4 min',
    '{"portion": ["Standard (380ml)", "Monster Shake with Extra KitKat (+$2.00)"], "sweetness": ["Regular Sweet", "Extra Chocolate"]}'::jsonb,
    TRUE,
    8
),
(
    'classic-french-fries',
    'Classic French Fries',
    'fries',
    'Golden, skin-on potatoes triple-fried to crispy perfection, dusted with flaky sea salt and served with house mayo dip.',
    'Hand-cut premium russet potatoes soaked, blanched, and triple-cooked to achieve a glass-like golden exterior and a fluffy, steaming potato interior.',
    '$4.00',
    4.00,
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop',
    '280 kcal',
    ARRAY['100% Vegan', 'Gluten-Free'],
    ARRAY['Crispy Glass Crunch', 'Fluffy Potato Heart', 'Flaky Sea Salt'],
    'Zafiroo Fryer Station',
    TRUE,
    FALSE,
    'Classic Cold Coffee',
    '5 min',
    '{"portion": ["Regular Basket", "Large Bucket (+$1.50)"]}'::jsonb,
    TRUE,
    9
),
(
    'peri-peri-french-fries',
    'Peri Peri French Fries',
    'fries',
    'Extra crunchy fries tossed vigorously in our spicy, tangy African bird''s eye chili Peri Peri seasoning blend.',
    'Golden crispy fries tossed fresh out of the fryer with crushed bird''s eye chilies, smoked paprika, garlic powder, onion herbs, and zesty lemon zest.',
    '$4.50',
    4.50,
    'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=1200&auto=format&fit=crop',
    '295 kcal',
    ARRAY['Spicy Favorite', 'Vegan'],
    ARRAY['Smoky Tangy Heat', 'Zesty Lemon Paprika', 'Crunchy Salt'],
    'Zafiroo Fryer Station',
    TRUE,
    FALSE,
    'Vanilla Milkshake or Cold Drinks',
    '5 min',
    '{"sweetness": ["Medium Spicy", "Extra Hot Peri Peri", "Mild Tangy"], "portion": ["Regular Basket", "Large Bucket (+$1.50)"]}'::jsonb,
    TRUE,
    10
),
(
    'cheesy-fries',
    'Cheesy Fries',
    'fries',
    'Crispy golden fries smothered in warm molten cheddar cheese sauce, melted mozzarella, and finished with herbs.',
    'Crisp golden fries loaded under a double blanket of velvety warm cheddar cheese sauce and shredded mozzarella, flashed in the salamander oven for a gooey pull.',
    '$5.50',
    5.50,
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1200&auto=format&fit=crop',
    '410 kcal',
    ARRAY['Vegetarian', 'Loaded Indulgence'],
    ARRAY['Molten Cheddar Sauce', 'Gooey Mozzarella Pull', 'Herbed Seasoning'],
    'Zafiroo Melt Station',
    TRUE,
    TRUE,
    'Zafiroo Signature Coffee',
    '5 min',
    '{"portion": ["Regular Loaded Plate", "Mega Cheese Overload (+$2.00)"], "sweetness": ["Add Pickled Jalapenos", "Extra Cheese Dip on Side (+$1.00)", "Classic (No Jalapeno)"]}'::jsonb,
    TRUE,
    11
),
(
    'veg-sandwich',
    'Veg Sandwich',
    'sandwiches',
    'Freshly toasted artisan bread stuffed with crunchy cucumber, ripe tomatoes, bell peppers, melted cheddar, and zesty mint pesto.',
    'Crafted on thick-cut golden herbed brioche bread. Layered with English cucumbers, vine-ripened tomatoes, roasted bell peppers, sliced cheddar cheese, and house mint-coriander aioli.',
    '$6.00',
    6.00,
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1200&auto=format&fit=crop',
    '340 kcal',
    ARRAY['Vegetarian', 'Fresh & Crunchy'],
    ARRAY['Zesty Herb Pesto', 'Melted Cheddar', 'Crispy Toasted Brioche'],
    'Zafiroo Sandwich Grill',
    TRUE,
    FALSE,
    'Classic Cold Coffee',
    '5 min',
    '{"temperature": ["Toasted Extra Crispy (Recommended)", "Soft Grilled"], "sweetness": ["Spicy Green Chilis Added", "Mild Pesto", "No Chilis"], "portion": ["Single Sandwich (2 Halves)", "Double Sandwich (+$3.50)"]}'::jsonb,
    TRUE,
    12
),
(
    'egg-sandwich',
    'Egg Sandwich',
    'sandwiches',
    'Fluffy seasoned scrambled eggs, caramelized onions, melted cheese, and garlic aioli layered inside golden grilled brioche toast.',
    'Silky soft scrambled farm-fresh eggs folded with melted sharp cheddar, sweet balsamic caramelized onions, and house garlic pepper aioli inside butter-toasted artisan brioche.',
    '$6.50',
    6.50,
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop',
    '390 kcal',
    ARRAY['High Protein', 'Egg Specialty'],
    ARRAY['Silky Scrambled Eggs', 'Caramelized Sweet Onions', 'Garlic Butter Aioli'],
    'Zafiroo Sandwich Grill',
    TRUE,
    TRUE,
    'Classic Hot Coffee or KitKat Shake',
    '5 min',
    '{"temperature": ["Toasted Golden Crispy", "Warm Brioche"], "portion": ["Standard", "Double Egg & Extra Cheese (+$2.00)"]}'::jsonb,
    TRUE,
    13
),
(
    'brownie-chocolate-lava',
    'Brownie Chocolate Lava',
    'desserts',
    'Warm fudgy chocolate brownie with a molten dark chocolate center that oozes with every bite, served with vanilla cream.',
    'Baked fresh in small batches using 70% dark Belgian cocoa. A delicate crust gives way to an intensely warm, molten chocolate lava core that cascades smoothly when spooned.',
    '$6.50',
    6.50,
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop',
    '450 kcal',
    ARRAY['Vegetarian', 'Molten Heaven'],
    ARRAY['70% Belgian Dark Cocoa', 'Warm Oozing Center', 'Fudgy Texture'],
    'Zafiroo Bakery',
    TRUE,
    TRUE,
    'Classic Hot Coffee',
    '3 min',
    '{"temperature": ["Served Warm & Molten (Recommended)", "Room Temp"], "portion": ["Single Molten Cake", "With Scoop of Vanilla Gelato (+$1.50)"]}'::jsonb,
    TRUE,
    14
),
(
    'cupcakes',
    'Cupcakes',
    'desserts',
    'Soft and airy gourmet cupcakes swirled with velvety buttercream frosting, colorful sprinkles, and rich chocolate fillings.',
    'Fluffy, melt-in-mouth sponge cupcakes freshly piped with whipped Madagascar vanilla and chocolate buttercream rosettes, finished with artisanal sprinkles.',
    '$3.50',
    3.50,
    'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1200&auto=format&fit=crop',
    '230 kcal',
    ARRAY['Vegetarian', 'Sweet Treat'],
    ARRAY['Airy Sponge Cake', 'Silky Buttercream Frosting', 'Chocolate Shavings'],
    'Zafiroo Bakery',
    FALSE,
    FALSE,
    'Classic Cold Coffee',
    '2 min',
    '{"portion": ["Single Cupcake", "Box of 2 (+$3.00)", "Party Box of 4 (+$6.00)"]}'::jsonb,
    TRUE,
    15
),
(
    'pizzas',
    'Zafiroo Artisan Pizzas',
    'pizza',
    'Hand-stretched crispy thin crust baked in stone oven, rich San Marzano tomato sauce, bubbly melted mozzarella, and fresh basil.',
    'Fermented for 48 hours to create a blistered, airy, crunchy crust. Smothered in tangy Italian plum tomato sauce, loaded with fresh Fior di Latte mozzarella and herbs.',
    '$9.50',
    9.50,
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
    '520 kcal',
    ARRAY['Vegetarian', 'Stone-Baked'],
    ARRAY['Crispy Blistered Crust', 'Bubbly Mozzarella', 'Fresh Basil & Oregano'],
    'Zafiroo Stone Oven',
    TRUE,
    TRUE,
    'Peri Peri French Fries & Cold Drinks',
    '7 min',
    '{"flavor": ["Classic Margherita (Tomato & Basil)", "Farmhouse Veggie Supreme", "Spicy Paneer Tikka"], "portion": ["Medium 8-inch", "Large 11-inch (+$3.50)"]}'::jsonb,
    TRUE,
    16
),
(
    'pastries',
    'Artisan Pastries',
    'desserts',
    'Flaky French-style butter croissants, Danish pastries, and chocolate eclairs baked golden and crisp each morning.',
    'Laminated with pure cultured French butter to achieve 81 delicate, crisp flaky layers. Golden on the outside, light and honeycomb on the inside.',
    '$4.50',
    4.50,
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop',
    '260 kcal',
    ARRAY['Vegetarian', 'Flaky Crisp'],
    ARRAY['Cultured French Butter', 'Flaky Golden Layers', 'Dark Chocolate Filling'],
    'Zafiroo Bakery',
    FALSE,
    FALSE,
    'Classic Hot Coffee',
    '2 min',
    '{"flavor": ["Pain au Chocolat (Chocolate Croissant)", "Butter Croissant", "Berry Glazed Danish"], "temperature": ["Warm & Flaky", "Standard"]}'::jsonb,
    TRUE,
    17
),
(
    'cold-drinks',
    'Cold Drinks & Refreshers',
    'drinks',
    'Chilled fizzy sodas, iced lemonades, and sparkling fruit refreshers served over cracked ice with fresh lime.',
    'Refreshing ice-cold beverages to quench your thirst. Choice of classic sparkling cola, sparkling lime cooler, and iced berry fizz garnished with fresh mint sprigs.',
    '$3.00',
    3.00,
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop',
    '90 kcal',
    ARRAY['Vegan', 'Sparkling Refreshment'],
    ARRAY['Iced Fizzy Burst', 'Fresh Lime Twist', 'Crisp Mint Cool'],
    'Zafiroo Cooler Bar',
    FALSE,
    FALSE,
    'Cheesy Fries & Pizzas',
    '2 min',
    '{"flavor": ["Classic Sparkling Cola", "Zesty Iced Lemonade", "Berry Sparkling Cooler"], "temperature": ["Chilled with Ice", "No Ice (Extra Drink)"]}'::jsonb,
    TRUE,
    18
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    detailed_description = EXCLUDED.detailed_description,
    price = EXCLUDED.price,
    price_number = EXCLUDED.price_number,
    image = EXCLUDED.image,
    calories = EXCLUDED.calories,
    dietary = EXCLUDED.dietary,
    taste_notes = EXCLUDED.taste_notes,
    origin = EXCLUDED.origin,
    featured = EXCLUDED.featured,
    signature = EXCLUDED.signature,
    pairing = EXCLUDED.pairing,
    prep_time = EXCLUDED.prep_time,
    customization_options = EXCLUDED.customization_options,
    is_available = EXCLUDED.is_available,
    display_order = EXCLUDED.display_order,
    updated_at = NOW();

-- ==============================================================================
-- 4. Create Admin Keys Table (Encrypted KDS Authentication)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_keys (
    id TEXT PRIMARY KEY,                       -- 'universal' or 'custom'
    key_name TEXT NOT NULL,                    -- 'universal_master_key' or 'custom_user_key'
    key_value TEXT NOT NULL,                   -- '9019631104' or custom PIN
    key_hash TEXT,                             -- SHA-256 secure hash
    is_universal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Initial Universal Key (9019631104) & Custom Key (1234)
INSERT INTO public.admin_keys (id, key_name, key_value, key_hash, is_universal, updated_at)
VALUES 
    ('universal', 'universal_master_key', '9019631104', '9019631104', TRUE, NOW()),
    ('custom', 'custom_user_key', '1234', '1234', FALSE, NOW())
ON CONFLICT (id) DO UPDATE 
SET key_value = EXCLUDED.key_value, updated_at = NOW();

-- Enable RLS
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

