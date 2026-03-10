"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "./components/CartProvider";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";
import { ROUTES } from "@/utils/constants";

export default function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <ShoppingCart size={36} className="text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven&apos;t added anything yet. Browse our products
          and find something you love.
        </p>
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={ROUTES.PRODUCTS}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
        <div className="w-px h-4 bg-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="divide-y divide-transparent">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
