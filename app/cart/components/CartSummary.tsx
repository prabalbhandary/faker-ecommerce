"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/utils/formatters";

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08;

export default function CartSummary() {
  const { items, total, clearCart } = useCart();

  if (items.length === 0) return null;

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = total * TAX_RATE;
  const grandTotal = total + shipping + tax;
  const freeShippingRemaining = SHIPPING_THRESHOLD - total;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
      {freeShippingRemaining > 0 && (
        <div className="mb-5 bg-amber-50 rounded-xl p-3.5 border border-amber-100">
          <p className="text-xs font-medium text-amber-700 mb-2">
            Add {formatPrice(freeShippingRemaining)} more for free shipping!
          </p>
          <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(total / SHIPPING_THRESHOLD) * 100}%` }}
            />
          </div>
        </div>
      )}
      {freeShippingRemaining <= 0 && (
        <div className="mb-5 bg-green-50 rounded-xl p-3.5 border border-green-100">
          <p className="text-xs font-medium text-green-700">
            🎉 You qualify for free shipping!
          </p>
        </div>
      )}
      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
          </span>
          <span className="font-medium text-gray-900">
            {formatPrice(total)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span
            className={
              shipping === 0
                ? "text-green-600 font-medium"
                : "font-medium text-gray-900"
            }
          >
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax (8%)</span>
          <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
        </div>
      </div>
      <div className="border-t border-gray-100 my-4" />
      <div className="flex justify-between items-center mb-6">
        <span className="text-base font-bold text-gray-900">Total</span>
        <span className="text-xl font-black text-gray-900">
          {formatPrice(grandTotal)}
        </span>
      </div>
      <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all duration-150">
        <ShoppingBag size={18} />
        Proceed to Checkout
      </button>
      <button
        onClick={clearCart}
        className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 py-2.5 rounded-xl transition-colors"
      >
        <Trash2 size={14} />
        Clear Cart
      </button>
    </div>
  );
}
