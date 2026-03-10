"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/app/cart/components/CartProvider";
import ProductRating from "./ProductRating";
import { formatPrice, formatCategory, truncateText } from "@/utils/formatters";
import { ROUTES } from "@/utils/constants";
import type { ProductCardProps } from "@/utils/types";

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product, 1);
  }

  return (
    <Link
      href={ROUTES.PRODUCTS_DETAILS(product.id)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col"
    >
      <div className="relative h-52 bg-gray-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
          {formatCategory(product.category)}
        </span>

        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 flex-1">
          {truncateText(product.title, 60)}
        </h3>

        <div className="mb-3">
          <ProductRating rating={product.rating} showCount />
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-black text-gray-900">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            aria-label={inCart ? "Added to cart" : "Add to cart"}
            className={[
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95",
              inCart
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-900 text-white hover:bg-gray-800",
            ].join(" ")}
          >
            {inCart ? (
              <>
                <Check size={13} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={13} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
