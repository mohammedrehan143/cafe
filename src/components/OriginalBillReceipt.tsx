'use client';

import React from 'react';
import { Order } from '@/types/cafe';
import { CAFE_INFO } from '@/data/cafeData';
import { formatReceiptDate } from '@/lib/billUtils';

interface OriginalBillReceiptProps {
  order: Order;
  isModalPreview?: boolean;
}

/**
 * Hand-crafted Line-Art Vector Logo: Layered Burger & Steaming Coffee Cup
 * Matches the reference artwork
 */
function CafeLogoIllustration() {
  return (
    <div className="flex items-center justify-center my-1 select-none">
      <svg
        width="140"
        height="68"
        viewBox="0 0 140 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-neutral-900"
      >
        {/* BURGER (LEFT) */}
        <g transform="translate(10, 10)" stroke="#171717" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Top Bun Dome */}
          <path d="M 4 20 C 4 5, 48 5, 48 20 Z" fill="#ffffff" />
          {/* Sesame Seeds */}
          <circle cx="17" cy="11" r="1" fill="#171717" stroke="none" />
          <circle cx="26" cy="9" r="1" fill="#171717" stroke="none" />
          <circle cx="35" cy="12" r="1" fill="#171717" stroke="none" />
          <circle cx="21" cy="15" r="1" fill="#171717" stroke="none" />
          <circle cx="31" cy="15" r="1" fill="#171717" stroke="none" />
          {/* Lettuce Wavy Ruffle */}
          <path d="M 2 24 C 6 21, 10 26, 14 23 C 18 21, 22 26, 26 23 C 30 21, 34 26, 38 23 C 42 21, 46 25, 50 24" />
          {/* Cheese / Tomato Layers */}
          <path d="M 4 29 L 48 29" />
          <path d="M 4 33 L 48 33" />
          {/* Patty Layer */}
          <path d="M 7 36 L 45 36 C 47 36, 47 41, 45 41 L 7 41 C 5 41, 5 36, 7 36 Z" fill="#171717" />
          {/* Bottom Bun */}
          <path d="M 6 43 L 46 43 C 46 48, 6 48, 6 43 Z" fill="#ffffff" />
        </g>

        {/* STEAMING COFFEE CUP (RIGHT) */}
        <g transform="translate(74, 14)" stroke="#171717" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Steam Curls */}
          <path d="M 16 0 C 13 -4, 18 -8, 15 -13" strokeWidth="1.8" />
          <path d="M 25 1 C 22 -3, 27 -7, 24 -12" strokeWidth="1.8" />
          {/* Cup Body */}
          <path d="M 5 4 L 35 4 C 34 25, 6 25, 5 4 Z" fill="#ffffff" />
          {/* Inner Liquid Surface */}
          <path d="M 9 9 Q 20 12, 31 9" strokeWidth="1.4" />
          {/* Cup Handle */}
          <path d="M 34 8 C 43 8, 43 19, 32 19" strokeWidth="2.2" />
          {/* Saucer Plate */}
          <ellipse cx="20" cy="27" rx="20" ry="3.2" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}

export default function OriginalBillReceipt({ order }: OriginalBillReceiptProps) {
  const formattedDate = formatReceiptDate(order.createdAt);
  
  // Format Order ID
  const rawId = (order.tokenId || order.trackingCode || order.id || '2612-ZNE').replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
  const displayOrderId = rawId.startsWith('#') ? rawId : `#${rawId}`;

  const customerName = order.customer?.name || 'Customer';
  const customerPhone = order.customer?.phone || '9019631104';
  const orderType = order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup / Dine-In';

  // Subtotals & calculations
  const itemsSubtotal = order.subtotal || order.items.reduce((sum, it) => sum + (it.itemTotal || 0), 0);
  const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : (order.deliveryMethod === 'delivery' ? 30 : 0);
  const packagingFee = order.tax !== undefined ? order.tax : 10;
  const grandTotal = order.total || (itemsSubtotal + deliveryFee + packagingFee);

  const isPaid =
    order.paymentStatus === 'completed' ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes('online')) ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes('upi')) ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes('cashfree')) ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes('razorpay'));

  const paymentMethodDisplay = order.paymentMethod
    ? order.paymentMethod
    : (isPaid ? 'Online (UPI)' : 'Cash on Delivery');

  const txnIdDisplay = order.cashfreePaymentId || order.cashfreeOrderId || order.razorpayPaymentId || (isPaid ? '532418765412' : '-');

  return (
    <div
      id="printable-receipt"
      className="w-full bg-white text-[#111827] font-mono text-[12px] leading-tight select-text"
      style={{
        fontFamily: "'Courier New', Courier, 'Space Mono', Consolas, monospace",
      }}
    >
      {/* 1. TOP LOGO ILLUSTRATION (BURGER & COFFEE) */}
      <div className="flex justify-center pb-1">
        <CafeLogoIllustration />
      </div>

      {/* 2. CAFE BRAND NAME & TAGLINE */}
      <div className="text-center space-y-1 pb-2">
        <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-neutral-900 font-sans leading-none pt-0.5">
          ZAFIROO CAFE
        </h1>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-800">
          GOOD FOOD • GOOD MOOD
        </p>
      </div>

      {/* Dashed Separator */}
      <div className="border-b border-dashed border-neutral-400 my-2.5" />

      {/* 3. ADDRESS & GST DETAILS (ZAFIROO DATA) */}
      <div className="text-center text-[11px] leading-relaxed space-y-0.5 text-neutral-800">
        <div>100 Feet Road, Indiranagar, Bengaluru</div>
        <div>Karnataka - 560038</div>
        <div>Ph: {CAFE_INFO.phone || '+91 90196 31104'}</div>
        <div>GSTIN: 29AAAAZ0000A1Z5</div>
      </div>

      {/* Dashed Separator */}
      <div className="border-b border-dashed border-neutral-400 my-2.5" />

      {/* 4. ORDER BILL HEADER */}
      <div className="text-center py-1">
        <span className="text-[15px] font-black tracking-wider uppercase text-neutral-900">
          ORDER BILL
        </span>
      </div>

      {/* 5. ORDER & CUSTOMER DETAILS (2-COLUMN KEY VALUE) */}
      <div className="text-[11.5px] space-y-1 pt-1 pb-1">
        {/* Row 1: Order ID + Date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="w-24 text-neutral-800">Order ID</span>
            <span className="text-neutral-900 font-bold">: {displayOrderId}</span>
          </div>
          <div className="flex items-center text-right pl-2">
            <span className="text-neutral-800">Date :</span>
            <span className="text-neutral-900 ml-1 font-medium">{formattedDate.date}</span>
          </div>
        </div>

        {/* Row 2: Order Type + Time */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="w-24 text-neutral-800">Order Type</span>
            <span className="text-neutral-900 font-bold">: {orderType}</span>
          </div>
          <div className="flex items-center text-right pl-2">
            <span className="text-neutral-800">Time :</span>
            <span className="text-neutral-900 ml-1 font-medium">{formattedDate.time}</span>
          </div>
        </div>

        {/* Row 3: Customer */}
        <div className="flex items-center">
          <span className="w-24 text-neutral-800">Customer</span>
          <span className="text-neutral-900 font-bold">: {customerName}</span>
        </div>

        {/* Row 4: Phone */}
        <div className="flex items-center">
          <span className="w-24 text-neutral-800">Phone</span>
          <span className="text-neutral-900 font-medium">: {customerPhone}</span>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="border-b border-dashed border-neutral-400 my-2.5" />

      {/* 6. ITEM TABLE HEADER */}
      <div className="flex justify-between text-[11.5px] font-bold text-neutral-900 py-0.5">
        <span className="flex-1 text-left">Item</span>
        <span className="w-10 text-center">Qty</span>
        <span className="w-16 text-right">Price</span>
        <span className="w-16 text-right">Total</span>
      </div>

      {/* Dashed Line under Header */}
      <div className="border-b border-dashed border-neutral-400 my-1.5" />

      {/* 7. ITEMS LIST */}
      <div className="space-y-1.5 text-[11.5px] py-1">
        {order.items && order.items.length > 0 ? (
          order.items.map((item, idx) => {
            const unitPrice = item.menuItem?.priceNumber || (item.itemTotal / item.quantity);
            const total = item.itemTotal || (unitPrice * item.quantity);
            return (
              <div key={idx} className="flex justify-between items-start text-neutral-900">
                <span className="flex-1 text-left pr-2 font-medium break-words leading-tight">
                  {item.menuItem?.name || 'Cafe Item'}
                </span>
                <span className="w-10 text-center font-medium shrink-0">{item.quantity}</span>
                <span className="w-16 text-right font-medium shrink-0">{unitPrice.toFixed(2)}</span>
                <span className="w-16 text-right font-bold shrink-0">{total.toFixed(2)}</span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-2 text-neutral-500 italic">No items</div>
        )}
      </div>

      {/* Dashed Separator */}
      <div className="border-b border-dashed border-neutral-400 my-2.5" />

      {/* 8. FINANCIAL BREAKDOWN */}
      <div className="text-[11.5px] space-y-1.5 py-0.5 text-neutral-900">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">{itemsSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Charge</span>
          <span className="font-semibold">{deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Packaging Charge</span>
          <span className="font-semibold">{packagingFee.toFixed(2)}</span>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="border-b border-dashed border-neutral-400 my-2.5" />

      {/* 9. TOTAL AMOUNT */}
      <div className="flex justify-between items-center py-1 text-neutral-900">
        <span className="text-[14px] font-black tracking-wider uppercase">TOTAL</span>
        <span className="text-[15px] font-black tracking-tight">₹{grandTotal.toFixed(2)}</span>
      </div>

      {/* Dashed Separator */}
      <div className="border-b border-dashed border-neutral-400 my-2.5" />

      {/* 10. PAYMENT METHOD & TRANSACTION DETAILS */}
      <div className="text-[11.5px] space-y-1 py-1 text-neutral-900">
        <div className="flex items-center">
          <span className="w-32 text-neutral-800">Payment Method</span>
          <span className="font-bold">: {paymentMethodDisplay}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-neutral-800">Payment Status</span>
          <span className="font-bold">: {isPaid ? 'Paid' : 'Pending'}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-neutral-800">Txn ID</span>
          <span className="font-medium">: {txnIdDisplay}</span>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="border-b border-dashed border-neutral-400 my-3" />

      {/* 11. FOOTER & GREETING */}
      <div className="text-center text-[11px] text-neutral-800 space-y-1.5 pt-1 pb-1">
        <div>Thank you for ordering!</div>
        <div>We hope to serve you again.</div>
        <div className="flex justify-center pt-0.5">
          <span className="text-neutral-900 text-sm leading-none">♥</span>
        </div>
        <div className="pt-2 text-[11px] font-medium text-neutral-900 tracking-wide">
          www.zafiroo.com
        </div>
      </div>
    </div>
  );
}
