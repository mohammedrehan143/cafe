'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, DeliveryMethod } from '@/types/cafe';
import { INITIAL_ORDERS, MENU_ITEMS, CAFE_INFO } from '@/data/cafeData';
import { supabase, isSupabaseConfigured, formatDbOrderToOrder } from '@/lib/supabase';

interface OrderContextType {
  menuItems: MenuItem[];
  loadingMenu: boolean;
  refreshMenu: () => Promise<void>;
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
  updateOrderStatus: (orderId: string, status: OrderStatus, riderDetails?: { riderName?: string; riderPhone?: string }) => Promise<void>;
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(filterOrdersLast10Days(INITIAL_ORDERS));
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  // Fetch Database-Backed Menu Items
  const refreshMenu = useCallback(async () => {
    try {
      setLoadingMenu(true);
      const res = await fetch('/api/menu', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.menu) && data.menu.length > 0) {
        setMenuItems(data.menu);
      }
    } catch {
      // Fallback to initial local items
      setMenuItems(MENU_ITEMS);
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  // Fetch initial menu on mount
  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]);

  // Load initial orders from API / localStorage on mount
  useEffect(() => {
    const initOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
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

  // Real-time Supabase Subscription for ALL ORDERS (KDS instant updates on new order without reload)
  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const channel = supabase
      .channel('kds-all-orders-stream')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newOrder = formatDbOrderToOrder(payload.new);
            setOrders((prev) => {
              const exists = prev.some((o) => o.id === newOrder.id || o.tokenId === newOrder.tokenId);
              if (exists) return prev;
              const updated = [newOrder, ...prev];
              try {
                localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filterOrdersLast10Days(updated)));
              } catch {}
              return updated;
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedOrder = formatDbOrderToOrder(payload.new);
            setOrders((prev) => {
              const updated = prev.map((o) =>
                o.id === updatedOrder.id || o.tokenId === updatedOrder.tokenId ? { ...o, ...updatedOrder } : o
              );
              try {
                localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filterOrdersLast10Days(updated)));
              } catch {}
              return updated;
            });

            setActiveTrackingOrder((prev) => {
              if (!prev) return null;
              if (prev.id === updatedOrder.id || prev.tokenId === updatedOrder.tokenId) {
                return { ...prev, ...updatedOrder };
              }
              return prev;
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const deletedId = payload.old.id || payload.old.tracking_code || payload.old.token_id;
            setOrders((prev) => {
              const updated = prev.filter((o) => o.id !== deletedId && o.tokenId !== deletedId);
              try {
                localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filterOrdersLast10Days(updated)));
              } catch {}
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Background Auto-Sync Heartbeat (Every 2.5s) to guarantee instantaneous KDS sync
  useEffect(() => {
    const syncOrdersHeartbeat = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const fresh = filterOrdersLast10Days(data.orders);
          setOrders((prev) => {
            const prevFingerprint = prev.map((o) => `${o.id}:${o.status}:${o.riderName || ''}`).join('|');
            const freshFingerprint = fresh.map((o) => `${o.id}:${o.status}:${o.riderName || ''}`).join('|');
            if (prevFingerprint !== freshFingerprint) {
              try {
                localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(fresh));
              } catch {}
              return fresh;
            }
            return prev;
          });
        }
      } catch {}
    };

    const interval = setInterval(syncOrdersHeartbeat, 2500);
    return () => clearInterval(interval);
  }, []);

  // Real-time Supabase Subscription specifically for active tracking order
  useEffect(() => {
    if (!activeTrackingOrder || !isSupabaseConfigured) {
      return;
    }

    const orderIdToTrack = activeTrackingOrder.id || activeTrackingOrder.tokenId;
    const channel = supabase
      .channel(`active-order-${orderIdToTrack}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload: any) => {
          const updatedRow = payload.new;
          if (
            updatedRow &&
            (updatedRow.tracking_code === activeTrackingOrder.id ||
              updatedRow.token_id === activeTrackingOrder.tokenId ||
              updatedRow.id === activeTrackingOrder.id)
          ) {
            const parsed = formatDbOrderToOrder(updatedRow);
            setActiveTrackingOrder((prev) => (prev ? { ...prev, ...parsed } : parsed));
            setOrders((prevList) =>
              prevList.map((o) =>
                o.id === parsed.id || o.tokenId === parsed.tokenId
                  ? { ...o, ...parsed }
                  : o
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTrackingOrder?.id, activeTrackingOrder?.tokenId]);

  // Listen to storage events across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ORDERS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setOrders(filterOrdersLast10Days(parsed));
          }
        } catch {
          // ignore malformed storage payload
        }
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
    const tax = Number((subtotal * 0.05).toFixed(2));
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
        const createdOrder: Order = {
          ...data.order,
          tokenId: data.tokenId || data.order.tokenId,
          customerId: data.customerId || data.order.customerId,
        };
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

    // Fallback order generation with unique Token ID
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const trackingCode = `ZF-${randomDigits}-${randomSuffix}`;
    const tokenId = `TOK-${randomDigits}-${randomSuffix}`;
    const customerId = `CUST-${customer.phone.slice(-4) || '9999'}-${randomSuffix}`;

    const fallbackOrder: Order = {
      id: trackingCode,
      tokenId: tokenId,
      trackingCode: trackingCode,
      customerId: customerId,
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
      paymentStatus: 'completed',
    };

    const updated = [fallbackOrder, ...orders];
    saveOrdersToStorage(updated);
    clearCart();
    setActiveTrackingOrder(fallbackOrder);
    setCheckoutModalOpen(false);
    setTrackingModalOpen(true);

    return fallbackOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    riderDetails?: { riderName?: string; riderPhone?: string }
  ) => {
    try {
      await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          riderName: riderDetails?.riderName,
          riderPhone: riderDetails?.riderPhone,
        }),
      });
    } catch {
      // offline
    }

    const updated = orders.map((o) => {
      if (o.id === orderId || o.tokenId === orderId) {
        return {
          ...o,
          status,
          ...(riderDetails?.riderName ? { riderName: riderDetails.riderName } : {}),
          ...(riderDetails?.riderPhone ? { riderPhone: riderDetails.riderPhone } : {}),
        };
      }
      return o;
    });
    saveOrdersToStorage(updated);
    if (activeTrackingOrder && (activeTrackingOrder.id === orderId || activeTrackingOrder.tokenId === orderId)) {
      setActiveTrackingOrder({
        ...activeTrackingOrder,
        status,
        ...(riderDetails?.riderName ? { riderName: riderDetails.riderName } : {}),
        ...(riderDetails?.riderPhone ? { riderPhone: riderDetails.riderPhone } : {}),
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, { method: 'DELETE' });
    } catch {}
    const updated = orders.filter((o) => o.id !== orderId && o.tokenId !== orderId);
    saveOrdersToStorage(updated);
  };

  const addDemoOrder = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const defaultItem = menuItems[0] || {
      id: 'zafiroo-signature-coffee',
      name: 'Zafiroo Signature Coffee',
      category: 'coffee',
      description: 'Single-origin roast with whipped sea salt cream.',
      price: '₹220',
      priceNumber: 220,
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop',
    };

    const newDemoOrder: Order = {
      id: `ZF-${randomDigits}-${randomSuffix}`,
      tokenId: `TOK-${randomDigits}-${randomSuffix}`,
      trackingCode: `ZF-${randomDigits}-${randomSuffix}`,
      customerId: `CUST-5555-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      deliveryMethod: Math.random() > 0.4 ? 'delivery' : 'pickup',
      customer: {
        name: ['Rohan S.', 'Priya N.', 'Vikram M.', 'Ananya I.'][Math.floor(Math.random() * 4)],
        phone: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
        email: 'customer@zafiroo.com',
        address: '100 Feet Rd, Indiranagar, Bengaluru 560038',
      },
      items: [
        {
          id: `item-${Date.now()}-1`,
          menuItem: defaultItem,
          quantity: 2,
          itemTotal: 440,
        },
      ],
      subtotal: 440,
      deliveryFee: 40,
      tax: 22,
      tip: 30,
      total: 532,
      estimatedTime: '20-30 min',
      paymentMethod: 'Online (Razorpay)',
      paymentStatus: 'completed',
    };

    saveOrdersToStorage([newDemoOrder, ...orders]);
  };

  const clearAllOrders = async () => {
    try {
      await fetch('/api/orders', { method: 'DELETE' });
    } catch {}
    saveOrdersToStorage([]);
  };

  return (
    <OrderContext.Provider
      value={{
        menuItems,
        loadingMenu,
        refreshMenu,
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
