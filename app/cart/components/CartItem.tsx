"use client";

import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatPrice, truncateText } from "@/utils/formatters";
import type { CartItem as CartItemType } from "@/utils/types";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const { product, quantity } = item;
  function handleDecrement() {
    updateQuantity(product.id, quantity - 1);
  }
  function handleIncrement() {
    updateQuantity(product.id, quantity + 1);
  }
  function handleRemove() {
    removeFromCart(product.id);
  }
  return (
    <div className="flex items-center gap-4 py-5 border-b border-gray-100 last:border-0">
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="80px"
          className="object-contain p-2"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-snug">
          {truncateText(product.title, 55)}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">
          {product.category}
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
      <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={handleDecrement}
          className="p-1.5 hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm font-medium text-gray-800 select-none">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          className="p-1.5 hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="text-right min-w-18">
        <p className="text-sm font-bold text-gray-900">
          {formatPrice(product.price * quantity)}
        </p>
      </div>
      <button
        onClick={handleRemove}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        aria-label={`Remove ${product.title} from cart`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
