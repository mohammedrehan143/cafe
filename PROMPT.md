# Master Replication Prompt for AI Agents

> **How to use this file:**  
> Copy and paste the entire prompt below into any AI coding assistant (Cursor, Antigravity, Claude, GPT-4, Gemini) to build the complete **Zafiroo Gourmet Cafe & Cloud Kitchen Web Platform** from scratch.

---

```markdown
You are an elite Principal Full-Stack Engineer and Creative Frontend Architect. Your task is to build a complete, production-grade, full-stack Artisan Cafe, Cloud Kitchen, and Delivery E-Commerce web platform named **Zafiroo** (formerly Atelier Lambre / French-Vietnamese Banh Mi aesthetic evolving into Zafiroo Gourmet Cafe).

Follow this comprehensive specification to build every file, component, API route, context provider, database schema, and styling configuration.

---

## 1. TECH STACK & DEPENDENCIES

Initialize a Next.js 15 project using TypeScript, Tailwind CSS, and App Router.

### `package.json` Dependencies:
- `next`: `^15.1.7`
- `react`: `^19.0.0`
- `react-dom`: `^19.0.0`
- `@supabase/supabase-js`: `^2.112.4`
- `framer-motion`: `^12.4.3`
- `lucide-react`: `^0.475.0`
- `canvas-confetti`: `^1.9.4`
- `clsx`: `^2.1.1`
- `tailwind-merge`: `^3.0.1`
- `razorpay`: `^2.9.8`
- `three`: `^0.173.0`
- `gsap`: `^3.12.7`
- Dev Dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `@types/node`, `@types/react`, `@types/canvas-confetti`, `@types/three`.

### Theme & Styling Configuration (`tailwind.config.ts`):
Configure warm artisan cafe design tokens:
- `banhmi.bg`: `#FFF8F0` (warm cream canvas)
- `banhmi.card`: `#FFF3E3`
- `banhmi.red`: `#4A2818` (deep espresso roast)
- `banhmi.redDark`: `#2E1509`
- `banhmi.gold`: `#D4A373`
- `banhmi.dark`: `#1C1917`
- `cream`: 50 through 500 scale (`#FCFAF6` to `#D49226`)
- `espresso`: 50 through 950 scale (`#F5F2F0` to `#120D0A`)
- Box Shadows: `warm-sm`, `warm-md`, `warm-xl`
- Font Families: `display` (Impact / Asap), `sans` (Inter / Poppins), `mono` (Space Mono)

---

## 2. SYSTEM ARCHITECTURE & FOLDER STRUCTURE

Organize the project cleanly as follows:

```
src/
├── app/
│   ├── layout.tsx                     # Root layout with fonts & OrderProvider
│   ├── page.tsx                       # Homepage (Cinematic Hero, Best Picks, Testimonials, Modals)
│   ├── globals.css                    # Tailwind directives & custom utilities
│   ├── menu/
│   │   └── page.tsx                   # Whole Menu page (categories, search, mobile Burger-King layout)
│   ├── track/
│   │   └── page.tsx                   # Live Order Tracking page (5-stage pipeline, OTP card, rider info)
│   ├── admin/
│   │   └── page.tsx                   # KDS (Kitchen Display System), Rider Mobile Portal, SOS Action Center & Analytics
│   └── api/
│       ├── orders/
│       │   ├── route.ts               # GET all orders, POST create order with DB OTP
│       │   ├── [id]/route.ts          # GET order by ID/phone, PATCH update status/feedback
│       │   └── cleanup/route.ts       # Automated 10-day retention purge
│       ├── menu/route.ts              # GET / POST dynamic menu items
│       ├── delivery/
│       │   ├── agents/route.ts        # GET / POST delivery agents
│       │   ├── auth/route.ts          # Rider phone authentication
│       │   ├── orders/route.ts        # GET orders assigned to rider
│       │   ├── verify-otp/route.ts    # POST strictly verify 4-digit OTP against DB & complete delivery
│       │   └── sos/route.ts           # GET, POST, PATCH rider disaster emergency SOS alerts
│       ├── admin/auth/route.ts        # POST admin PIN authentication & key management
│       ├── notifications/
│       │   └── dispatch-otp/route.ts  # POST send WhatsApp OTP notification link
│       ├── cashfree/
│       │   ├── order/route.ts         # POST create Cashfree PG session
│       │   └── verify/route.ts        # POST verify Cashfree payment
│       ├── razorpay/
│       │   ├── order/route.ts         # POST create Razorpay order
│       │   └── verify/route.ts        # POST verify Razorpay signature
│       └── db-check/route.ts          # Health check Supabase connectivity
├── components/
│   ├── ZafirooHero.tsx                # Cinematic video carousel hero with tap-to-change
│   ├── BestPicksSection.tsx           # Curated spotlight items with quick add
│   ├── MenuDetailModal.tsx            # Customization modal (sweetness, milk, portion, notes)
│   ├── CartDrawer.tsx                 # Slide-over cart with tipping, taxes, free delivery bar
│   ├── CheckoutModal.tsx              # Checkout modal with GPS reverse geocode, 1-line address builder & payments
│   ├── OrderTrackingModal.tsx         # Popup version of live order tracker
│   ├── OrderCompletionFeedback.tsx    # 5-star rating and compliment chips
│   ├── OriginalBillReceipt.tsx        # Printable 80mm thermal receipt format
│   ├── BillModal.tsx                  # Modal wrapper for bill receipt
│   ├── TestimonialsSection.tsx        # Customer acclaim & reviews
│   ├── ZafirooFooter.tsx              # Footer with store hours, map link, social
│   └── ui/
│       └── star-button.tsx            # Interactive animated star/shine button
├── context/
│   └── OrderContext.tsx               # Global order, cart, rider, SOS alerts, and KDS state management
├── data/
│   └── cafeData.ts                    # Default menu items, store metadata, initial orders
├── lib/
│   ├── supabase.ts                    # Supabase client & real-time order formatter
│   ├── location.ts                    # GPS reverse geocoding (zoom=18 building precision), 1-line address formatting & Google Maps link builder
│   ├── adminAuth.ts                   # Admin PIN hashing & universal key verification
│   ├── notifications.ts               # WhatsApp message formatting & alert dispatch
│   ├── whatsapp.ts                    # Click-to-chat WhatsApp link & location ping generator
│   └── billUtils.ts                   # POS bill receipt formatting utilities
└── types/
    └── cafe.ts                        # Complete TypeScript interfaces (Order, MenuItem, SosAlert, Customer, etc.)
```

---

## 3. CORE DOMAIN MODELS (`src/types/cafe.ts`)

Define strong TypeScript types for:
1. `MenuItem`: `id`, `name`, `category`, `description`, `detailedDescription`, `price`, `priceNumber`, `image`, `calories`, `dietary`, `tasteNotes`, `featured`, `signature`, `prepTime`, `customizationOptions` (`milk`, `temperature`, `sweetness`, `portion`, `flavor`), `isAvailable`.
2. `CartItem`: `id`, `menuItem`, `quantity`, `selectedOptions`, `itemTotal`.
3. `OrderStatus`: `'new' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'`.
4. `DeliveryMethod`: `'delivery' | 'pickup'`.
5. `DeliveryAgent`: `id` (e.g. `AGT-9876-01`), `name`, `phone`, `status` (`'active' | 'inactive' | 'on_delivery' | 'off_duty'`), `vehicleType`, `ordersDeliveredCount`.
6. `Customer`: `id` (e.g. `CUST-9886-A4F`), `phone`, `name`, `email`, `address`, `unit`, `defaultInstructions`, `lat`, `lng`, `orderCount`, `totalSpent`.
7. `SosAlert`:
   - `id`: string (e.g. `SOS-9421-1718`)
   - `agentId`: string
   - `agentName`: string
   - `agentPhone`: string
   - `orderId`?: string
   - `tokenId`?: string
   - `reason`: `'breakdown' | 'accident' | 'flood' | 'traffic' | 'medical' | 'threat' | 'other' | string`
   - `notes`?: string
   - `lat`?: number
   - `lng`?: number
   - `locationAddress`?: string
   - `status`: `'active' | 'resolved'`
   - `resolvedAt`?: string
   - `resolvedBy`?: string
   - `createdAt`: string
8. `Order`:
   - `id`: e.g. `ZF-9421-XK7`
   - `tokenId`: e.g. `TOK-9421-XK7`
   - `trackingCode`: string
   - `customerId`, `deliveryAgentId`: optional foreign IDs
   - `deliveryOtp`: 4-digit verification code persisted in database (e.g. `"4829"`)
   - `status`: `OrderStatus`
   - `deliveryMethod`: `DeliveryMethod`
   - `customer`: `{ name, phone, email, address, unitOrApt, deliveryInstructions, lat?, lng? }`
   - `items`: `CartItem[]`
   - `subtotal`, `deliveryFee`, `tax`, `tip`, `total`: numbers
   - `estimatedTime`: e.g. `"20-30 min"`
   - `paymentMethod`, `paymentStatus`: string
   - `riderName`, `riderPhone`: optional string
   - `rating`, `feedbackTags`, `feedbackNote`: post-delivery review data
   - `createdAt`, `deliveredAt`: ISO timestamps

---

## 4. DATABASE SCHEMA (`supabase_schema.sql`)

Create PostgreSQL tables in Supabase with indexes and triggers:
1. **`customers`**: `id` (PK), `phone` (UNIQUE), `name`, `email`, `address`, `unit`, `default_instructions`, `order_count`, `total_spent`, `created_at`, `updated_at`.
2. **`delivery_agents`**: `id` (PK), `name`, `phone` (UNIQUE), `status` (`active`, `inactive`, `on_delivery`, `off_duty`), `vehicle_type`, `orders_delivered_count`, `created_at`, `updated_at`.
3. **`sos_alerts`**: `id` (PK), `agent_id` (FK), `agent_name`, `agent_phone`, `order_id`, `token_id`, `reason`, `notes`, `lat`, `lng`, `location_address`, `status` (`active`, `resolved`), `resolved_at`, `resolved_by`, `created_at`, `updated_at`.
4. **`menu_items`**: `id` (PK), `name`, `category`, `description`, `detailed_description`, `price`, `price_number`, `image`, `dietary`, `taste_notes`, `featured`, `signature`, `prep_time`, `customization_options` (JSONB), `is_available`, `display_order`, `created_at`, `updated_at`.
5. **`orders`**: `id` (PK), `token_id` (UNIQUE), `tracking_code` (UNIQUE), `customer_id` (FK), `delivery_agent_id` (FK), `delivery_otp`, `delivered_at`, `status`, `delivery_method`, `customer_name`, `customer_phone`, `customer_email`, `customer_address`, `customer_unit`, `customer_instructions`, `items_json` (JSONB), `subtotal`, `delivery_fee`, `tax`, `tip`, `total`, `estimated_time`, `payment_method`, `payment_status`, `rider_name`, `rider_phone`, `rating`, `feedback_tags`, `feedback_note`, `created_at`, `updated_at`.
6. **`admin_keys`**: `id` (PK, `'universal'` or `'custom'`), `key_name`, `key_value`, `key_hash`, `is_universal`, `updated_at`.
7. Indexes: on `token_id`, `tracking_code`, `customer_phone`, `customer_id`, `delivery_agent_id`, `status`, `created_at DESC`, `sos_alerts.status`.
8. Stored Procedure & Trigger: `delete_orders_older_than_10_days()` and `update_modtime_column()` for `updated_at`.

---

## 5. CLIENT & KITCHEN STATE MANAGEMENT (`src/context/OrderContext.tsx`)

Implement `OrderContext` providing:
- **Menu Management:** `menuItems`, `loadingMenu`, `refreshMenu()`.
- **Cart Engine:** `cart`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `cartCount`, `cartSubtotal`.
- **Modals State:** `cartDrawerOpen`, `checkoutModalOpen`, `trackingModalOpen`.
- **Order Placement & Tracking:** `orders`, `activeTrackingOrder`, `placeOrder()`, `updateOrderStatus()`, `submitOrderFeedback()`.
- **Delivery Logistics & Verification:** `deliveryAgents`, `refreshDeliveryAgents()`, `assignDeliveryAgent()`, `verifyDeliveryOtp()`.
- **Rider SOS Disaster Alerts:** `sosAlerts`, `refreshSosAlerts()`, `triggerRiderSos()`, `resolveSosAlert()`.
- **Real-Time Subscription & Polyphonic Audio:** Supabase WebSocket listener on `postgres_changes` for `orders` and `sos_alerts` tables with Web Audio API sound alerts (gentle chime for new orders, high-urgency siren alarm for SOS disaster alerts).
- **Offline Fallback:** Synchronize state with browser `localStorage` (`atelier_lambre_orders_v1`, `atelier_lambre_cart_v1`, `zafiroo_sos_alerts_v1`) to guarantee offline operation.

---

## 6. GEOLOCATION, 1-LINE ADDRESS CONCATENATION & NAVIGATION (`src/lib/location.ts`)

Build high-precision location helper functions:
1. `getCurrentLocationAddress()`:
   - Queries `navigator.geolocation.getCurrentPosition` with `{ enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }`.
   - Sends coordinates to OpenStreetMap Nominatim reverse geocoder (`zoom=18`, `namedetails=1`, `addressdetails=1` for exact building/house precision).
   - Falls back to BigDataCloud client reverse geocoding API.
   - Extracts building, house number, house name, road, neighbourhood, suburb, city, state, and postcode.
2. `formatFullOneLineAddress(line1, line2)`:
   - Concatenates Line 1 (auto-detected/selected road & locality) and Line 2 (unit/flat/house name/landmark) into a single uninterrupted string.
   - Prevents duplicate fragments so Google Maps navigation receives a seamless, unambiguous query string.
3. `buildGoogleMapsUrl(address, lat?, lng?)`:
   - Builds a 1-click Google Maps navigation URL (`https://www.google.com/maps/search/?api=1&query=...`) using coordinates or the complete 1-line address.
4. `searchAddressQuery(query)`:
   - Queries Photon OpenStreetMap POI API (`https://photon.komoot.io/api/?q=...`).
   - Returns structured suggestions with street name, city, and coordinates.

---

## 7. KEY UI / UX SPECIFICATIONS

### 1. Homepage (`src/app/page.tsx` & `src/components/ZafirooHero.tsx`)
- Fullscreen video hero looping through 4 culinary scenes (Latte Art, Burgers & Fries, Molten Lava Cakes, Cold Brew Crema).
- Clicking anywhere on the hero advances to the next video scene.
- Quick action buttons: "Order Online", "Explore Menu", and live order track pill.
- Curated Best Picks grid with direct item customization modal trigger.

### 2. Full Menu Catalog (`src/app/menu/page.tsx`)
- Horizontal scrolling category filter pills with icons (*All, Coffee, Thick Shakes, Crispy Fries, Sandwiches, Pizzas, Desserts, Coolers*).
- Instant search bar with live filtering.
- **Mobile-first Burger King style layout:** high-density cards with photo on left, title & description in center, and direct "Add" button on right.
- **Desktop layout:** 3-column card grid with price badges and prep time indicators.

### 3. Cart Drawer & Price Engine (`src/components/CartDrawer.tsx`)
- Slide-over drawer with item quantity adjusters.
- Free delivery threshold progress bar (e.g. Free delivery above ₹299).
- Tipping selector (₹20, ₹30, ₹50, custom).
- Bill breakdown: Subtotal, Delivery Fee (₹40 / Free), GST (5%), Tip, Total.

### 4. Checkout Modal (`src/components/CheckoutModal.tsx`)
- Toggle between "Home Delivery" and "Studio Counter Pickup".
- "Use Current Location" button triggering zoom=18 building/house-precision GPS reverse geocoding.
- Input fields: Line 1 (Street/Area) and Line 2 (House/Flat No., Landmark). Auto-concatenates both into a single 1-line address for navigation.
- Captures GPS `lat` and `lng` coordinates.
- Multi-payment support: Cashfree PG drop-in SDK, Razorpay, and Cash on Delivery (COD).
- Generates 4-digit doorstep delivery OTP that is persisted in the database.

### 5. Live Order Tracking Page (`src/app/track/page.tsx`)
- Search by 10-digit Phone Number (displays all active running orders) or specific Order Token ID.
- Real-time status sync via Supabase WebSockets + 1.5s auto-polling fallback.
- **5-Stage Visual Stepper Pipeline:**
  1. `Order Received`
  2. `Chef Preparing`
  3. `Thermal Packaged`
  4. `Out for Delivery` / `Ready at Studio Counter`
  5. `Delivered & Enjoyed`
- **Doorstep Verification OTP Card:** Large 4-digit code display with 1-tap **"Send to my WhatsApp"** button.
- **Assigned Rider Card:** Courier partner name, phone number, direct phone dialer link, and 1-tap WhatsApp location pin sharing.
- **Order Completion Feedback:** 5-star rating selector, compliment tags, review note, and printable thermal bill preview.

### 6. Kitchen Display System (KDS) & Admin Portal (`src/app/admin/page.tsx`)
- **Dual-Authentication:** Universal Master Key (`ADMIN_MASTER_KEY` env var) + Database-backed Custom Kitchen PIN (`1234` default, editable in UI).
- **Dual Role Access:** Kitchen Admin KDS vs Delivery Agent / Rider Mobile Mode.
- **Live KDS Board:**
  - Live clock and 24-hour midnight countdown timer.
  - Synthesized Web Audio API sound alert on new incoming orders.
  - Status progression buttons: *Accept & Start Cooking*, *Mark Thermal Packed*, *Dispatch Delivery Partner*, *Verify Pickup OTP & Handover*, *Cancel*.
- **Active SOS Emergency Banner & Action Center:**
  - Flashing red/gold warning banner when any delivery rider triggers an emergency SOS.
  - Pulsing siren alarm audio.
  - Action Center modal to call the rider, open their exact GPS location in Google Maps, and resolve/dismiss the alert.
- **Delivery Agent Rider Mobile Portal:**
  - Rider login via registered 10-digit phone number.
  - Mobile cards showing assigned orders with complete 1-line address and 1-tap Google Maps navigation button.
  - Direct Phone Call button and WhatsApp OTP share (all SMS buttons removed).
  - **🚨 Emergency SOS Button:** Large SOS disaster button opening a modal with categorized issues (*Bike Breakdown, Severe Flood/Rain, Traffic Gridlock, Medical Emergency, Threat/Safety, Other*) and auto GPS pin broadcasting.
  - **Strict Doorstep 4-Digit OTP Verification:** Validates against the database stored `delivery_otp` (no bypass codes). Rejects invalid OTPs with clear feedback.
- **Printable Thermal Bill Modal (`OriginalBillReceipt.tsx`):** Standard 80mm POS receipt layout.
- **Business Analytics Dashboard:** Revenue metrics (Today, Month, All-time), Total Orders, AOV, delivery vs pickup ratios, category sales breakdowns, and courier delivery leaderboards.

---

## 8. BACKEND SERVERLESS API ROUTES

Implement the following Next.js 15 route handlers in `src/app/api/`:
- `GET /api/orders`: Return active and recent orders.
- `POST /api/orders`: Validate and persist new order, customer, and OTP.
- `GET /api/orders/[id]`: Lookup active orders by ID, Token ID, or Phone number.
- `PATCH /api/orders/[id]`: Update status, rider assignment, or customer feedback.
- `GET /api/menu` & `POST /api/menu`: Fetch and manage dynamic menu items.
- `GET /api/delivery/agents` & `POST /api/delivery/agents`: Fetch and register delivery riders.
- `POST /api/delivery/auth`: Authenticate rider by phone.
- `GET /api/delivery/orders`: Fetch active deliveries for a specific rider.
- `POST /api/delivery/verify-otp`: Strictly validate 4-digit delivery OTP against database and mark order completed.
- `GET /api/delivery/sos`, `POST /api/delivery/sos`, `PATCH /api/delivery/sos`: Manage rider emergency disaster SOS alerts.
- `POST /api/admin/auth`: Validate admin PIN and manage custom PIN updates.
- `POST /api/notifications/dispatch-otp`: Send automated OTP alerts via WhatsApp link.
- `POST /api/cashfree/order` & `POST /api/cashfree/verify`: Cashfree PG session creation and payment verification.
- `POST /api/razorpay/order` & `POST /api/razorpay/verify`: Razorpay session creation and signature verification.
- `POST /api/orders/cleanup`: Purge orders older than 10 days.
- `GET /api/db-check`: Return Supabase connection health status.

---

## 9. IMPLEMENTATION STEPS

1. **Setup Config & Types:** Create `package.json`, `tailwind.config.ts`, `next.config.mjs`, and `src/types/cafe.ts` (with `SosAlert` and coordinate fields).
2. **Database SQL:** Write and run `supabase_schema.sql` on Supabase including `sos_alerts` table.
3. **Mock Data & Utilities:** Build `src/data/cafeData.ts`, `src/lib/supabase.ts`, `src/lib/location.ts` (with `formatFullOneLineAddress` and `buildGoogleMapsUrl`), `src/lib/adminAuth.ts`, `src/lib/notifications.ts`, and `src/lib/whatsapp.ts`.
4. **Context Provider:** Implement `src/context/OrderContext.tsx` with Supabase Realtime synchronization, polyphonic order chimes & SOS siren alerts, and `localStorage` resilience.
5. **API Handlers:** Implement all 16 API routes in `src/app/api/` (including strict OTP checking and SOS handling).
6. **Frontend Components:** Build `ZafirooHero`, `BestPicksSection`, `MenuDetailModal`, `CartDrawer`, `CheckoutModal`, `OrderTrackingModal`, `OrderCompletionFeedback`, `OriginalBillReceipt`, `BillModal`, and `ZafirooFooter`.
7. **Pages:** Build `src/app/page.tsx`, `src/app/menu/page.tsx`, `src/app/track/page.tsx`, and `src/app/admin/page.tsx` (with SOS emergency modal, SOS banner, Action Center, 1-line address navigation, and strict OTP verification).
8. **Verification:** Test end-to-end user journeys: item customization $\rightarrow$ cart $\rightarrow$ GPS address auto-fill & 1-line concatenation $\rightarrow$ checkout with DB OTP $\rightarrow$ live tracking $\rightarrow$ KDS dispatch $\rightarrow$ rider SOS alert $\rightarrow$ admin SOS resolution $\rightarrow$ rider OTP verification against DB $\rightarrow$ bill print & review rating.
```

---
*End of Master Replication Prompt.*
