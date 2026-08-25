export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'breakfast' | 'mains' | 'desserts' | 'mocktails';
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
  };
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
    specialInstructions?: string;
  };
  itemTotal: number;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
export type DeliveryMethod = 'delivery' | 'pickup';

export interface Order {
  id: string;
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
  estimatedTime: string; // e.g. "25-35 min"
  paymentMethod: string;
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
