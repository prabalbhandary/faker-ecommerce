'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/app/cart/components/CartProvider';
import type { Product } from '@/utils/types';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const inCart = isInCart(product.id);
  const cartQty = getItemQuantity(product.id);

  function handleAddToCart() {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function decrementQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function incrementQuantity() {
    setQuantity((prev) => prev + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="px-3 py-2.5 hover:bg-gray-50 text-gray-600 disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <span className="w-12 text-center text-sm font-semibold text-gray-900 select-none">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            className="px-3 py-2.5 hover:bg-gray-50 text-gray-600 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>

        {inCart && (
          <span className="text-xs text-gray-400 font-medium">
            {cartQty} already in cart
          </span>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        className={[
          'w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold transition-all duration-200 active:scale-[0.98]',
          justAdded
            ? 'bg-green-600 text-white'
            : 'bg-gray-900 text-white hover:bg-gray-800',
        ].join(' ')}
      >
        {justAdded ? (
          <>
            <Check size={20} />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
