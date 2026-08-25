'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, DeliveryMethod } from '@/types/cafe';
import { INITIAL_ORDERS, CAFE_INFO } from '@/data/cafeData';

interface OrderContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, selectedOptions?: any) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  checkoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;
  trackingModalOpen: boolean;
  setTrackingModalOpen: (open: boolean) => void;
  orders: Order[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  placeOrder: (
    customer: Order['customer'],
    deliveryMethod: DeliveryMethod,
    tip: number,
    paymentMethod?: string,
    razorpayDetails?: any
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => void;
  addDemoOrder: () => void;
  clearAllOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'atelier_lambre_orders_v1';
const CART_STORAGE_KEY = 'atelier_lambre_cart_v1';

// Auto-purge orders older than 10 days
function filterOrdersLast10Days(list: Order[]): Order[] {
  const tenDaysAgoMs = Date.now() - 10 * 24 * 60 * 60 * 1000;
  return list.filter((o) => new Date(o.createdAt).getTime() >= tenDaysAgoMs);
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(filterOrdersLast10Days(INITIAL_ORDERS));
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  // Load initial orders from API / localStorage on mount
  useEffect(() => {
    const initOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success && data.orders && data.orders.length > 0) {
          const fresh = filterOrdersLast10Days(data.orders);
          setOrders(fresh);
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(fresh));
          return;
        }
      } catch {
        // offline fallback
      }

      try {
        const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (savedOrders) {
          const fresh = filterOrdersLast10Days(JSON.parse(savedOrders));
          setOrders(fresh);
        } else {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filterOrdersLast10Days(INITIAL_ORDERS)));
        }

        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch {
        // fallback
      }
    };

    initOrders();
  }, []);

  // Listen to storage events across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ORDERS_STORAGE_KEY && e.newValue) {
        setOrders(filterOrdersLast10Days(JSON.parse(e.newValue)));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveOrdersToStorage = (updatedOrders: Order[]) => {
    const filtered = filterOrdersLast10Days(updatedOrders);
    setOrders(filtered);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // storage error
    }
  };

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    } catch {
      // storage error
    }
  };

  const addToCart = (item: MenuItem, quantity = 1, selectedOptions = {}) => {
    const instanceId = `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: CartItem = {
      id: instanceId,
      menuItem: item,
      quantity,
      selectedOptions,
      itemTotal: item.priceNumber * quantity,
    };

    const newCart = [...cart, newItem];
    saveCartToStorage(newCart);
    setCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const newCart = cart.filter((i) => i.id !== cartItemId);
    saveCartToStorage(newCart);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const newCart = cart.map((i) => {
      if (i.id === cartItemId) {
        return {
          ...i,
          quantity,
          itemTotal: i.menuItem.priceNumber * quantity,
        };
      }
      return i;
    });
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  const placeOrder = async (
    customer: Order['customer'],
    deliveryMethod: DeliveryMethod,
    tip: number,
    paymentMethod = 'Online (Razorpay)',
    razorpayDetails = null
  ): Promise<Order> => {
    const subtotal = cartSubtotal;
    const deliveryFee = deliveryMethod === 'delivery' ? (subtotal >= CAFE_INFO.freeDeliveryThreshold ? 0 : CAFE_INFO.deliveryFee) : 0;
    const tax = Number((subtotal * 0.08875).toFixed(2));
    const total = Number((subtotal + deliveryFee + tax + tip).toFixed(2));

    try {
      // Send to API endpoint with Supabase and 10-day retention
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          deliveryMethod,
          items: [...cart],
          subtotal,
          deliveryFee,
          tax,
          tip,
          total,
          paymentMethod,
          razorpayDetails,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        const createdOrder: Order = data.order;
        const updated = [createdOrder, ...orders];
        saveOrdersToStorage(updated);
        clearCart();
        setActiveTrackingOrder(createdOrder);
        setCheckoutModalOpen(false);
        setTrackingModalOpen(true);
        return createdOrder;
      }
    } catch {
      // offline fallback
    }

    // Fallback order generation with unique ID
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const trackingId = `BM-${Math.floor(1000 + Math.random() * 9000)}-${randomSuffix}`;
    const fallbackOrder: Order = {
      id: trackingId,
      createdAt: new Date().toISOString(),
      status: 'new',
      deliveryMethod,
      customer,
      items: [...cart],
      subtotal,
      deliveryFee,
      tax,
      tip,
      total,
      estimatedTime: deliveryMethod === 'delivery' ? '20-30 min' : '10-15 min',
      paymentMethod,
    };

    const updated = [fallbackOrder, ...orders];
    saveOrdersToStorage(updated);
    clearCart();
    setActiveTrackingOrder(fallbackOrder);
    setCheckoutModalOpen(false);
    setTrackingModalOpen(true);

    return fallbackOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // offline
    }

    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrdersToStorage(updated);
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder({ ...activeTrackingOrder, status });
    }
  };

  const deleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    saveOrdersToStorage(updated);
  };

  const addDemoOrder = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const newDemoOrder: Order = {
      id: `BM-${Math.floor(1000 + Math.random() * 9000)}-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      deliveryMethod: Math.random() > 0.4 ? 'delivery' : 'pickup',
      customer: {
        name: ['Minh T.', 'Sarah K.', 'David R.', 'Elena Z.'][Math.floor(Math.random() * 4)],
        phone: '+1 (917) 555-' + Math.floor(1000 + Math.random() * 9000),
        email: 'customer@cloudkitchen.nyc',
        address: '428 Mercer St, SoHo, NY 10013',
      },
      items: [
        {
          id: `item-${Date.now()}-1`,
          menuItem: INITIAL_ORDERS[0].items[0].menuItem,
          quantity: 2,
          itemTotal: 19.0,
        }
      ],
      subtotal: 19.0,
      deliveryFee: 2.99,
      tax: 1.68,
      tip: 4.00,
      total: 27.67,
      estimatedTime: '20-30 min',
      paymentMethod: 'Online (Razorpay)',
    };

    saveOrdersToStorage([newDemoOrder, ...orders]);
  };

  const clearAllOrders = () => {
    saveOrdersToStorage([]);
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDrawerOpen,
        setCartDrawerOpen,
        checkoutModalOpen,
        setCheckoutModalOpen,
        trackingModalOpen,
        setTrackingModalOpen,
        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        addDemoOrder,
        clearAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
