export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'shakes' | 'fries' | 'sandwiches' | 'pizza' | 'desserts' | 'drinks' | string;
  description: string;
  detailedDescription?: string;
  price: string;
  priceNumber: number;
  image: string;
  calories?: string;
  dietary?: string[];
  tasteNotes?: string[];
  origin?: string;
  featured?: boolean;
  signature?: boolean;
  pairing?: string;
  prepTime?: string;
  customizationOptions?: {
    milk?: string[];
    temperature?: string[];
    sweetness?: string[];
    portion?: string[];
    flavor?: string[];
  };
  isAvailable?: boolean;
  displayOrder?: number;
}

export interface CartItem {
  id: string; // unique item instance id
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: {
    milk?: string;
    temperature?: string;
    sweetness?: string;
    portion?: string;
    flavor?: string;
    specialInstructions?: string;
  };
  itemTotal: number;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
export type DeliveryMethod = 'delivery' | 'pickup';

export interface DeliveryAgent {
  id: string; // e.g. AGENT-9876-101
  name: string;
  phone: string; // 10-digit phone number
  status: 'active' | 'inactive' | 'on_delivery' | 'off_duty';
  vehicleType?: string;
  ordersDeliveredCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string; // e.g. CUST-9886-A4F
  phone: string;
  name: string;
  email?: string;
  address?: string;
  unit?: string;
  defaultInstructions?: string;
  orderCount?: number;
  totalSpent?: number;
  createdAt?: string;
}

export interface Order {
  id: string;
  tokenId?: string; // Order Token ID for tracking (e.g. TOK-9421-XK7 / ZF-9421-XK7)
  trackingCode?: string;
  customerId?: string; // Customer ID reference
  deliveryAgentId?: string; // Delivery Agent ID reference
  deliveryOtp?: string; // 4-digit OTP for doorstep delivery verification (e.g. "4829")
  deliveredAt?: string; // ISO timestamp when delivery was verified with OTP
  createdAt: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  customer: {
    name: string;
    phone: string;
    email: string;
    address?: string;
    unitOrApt?: string;
    deliveryInstructions?: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  estimatedTime: string; // e.g. "20-30 min"
  paymentMethod: string;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  cashfreeOrderId?: string;
  cashfreePaymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  riderName?: string;
  riderPhone?: string;
  rating?: number;
  feedbackTags?: string[];
  feedbackNote?: string;
}

export interface SignatureDish {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  priceNumber: number;
  image: string;
  tags: string[];
  flavorProfile: {
    sweetness: number;
    intensity: number;
    richness: number;
    acidity: number;
  };
  chefNote: string;
  pairing: string;
  prepTime: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  publication?: string;
  rating: number;
  image?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Kitchen' | 'Coffee' | 'Food' | 'Packaging';
  image: string;
  aspect: 'square' | 'tall' | 'wide';
  caption: string;
}
