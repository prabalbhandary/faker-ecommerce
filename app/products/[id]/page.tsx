"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { fetchProductById } from "@/utils/api";
import { ROUTES, META } from "@/utils/constants";
import { formatPrice, formatCategory } from "@/utils/formatters";
import ProductRating from "../components/ProductRating";
import AddToCartButton from "./AddToCartButton";

export default function ProductPageClient() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const id = Number(params?.id);

  useEffect(() => {
    if (isNaN(id)) return router.push(ROUTES.PRODUCTS);

    fetchProductById(id).then((res) => {
      if (res.error) setError(res.error);
      else setProduct(res.data);
      setLoading(false);
    });
  }, [id, router]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        {error && <p className="text-sm text-gray-500 mb-6">{error}</p>}
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href={ROUTES.HOME} className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={ROUTES.PRODUCTS} className="hover:text-gray-900 transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-50">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 flex items-center justify-center min-h-100">
          <div className="relative w-full max-w-sm aspect-square">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {formatCategory(product.category)}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">
            {product.title}
          </h1>
          <div className="mb-5">
            <ProductRating rating={product.rating} showCount />
          </div>
          <div className="mb-6">
            <span className="text-4xl font-black text-gray-900">{formatPrice(product.price)}</span>
          </div>
          <div className="border-t border-gray-100 my-5" />
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Description
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          <AddToCartButton product={product} />
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-1.5 mt-5 text-sm text-gray-500 hover:text-gray-900 transition-colors self-start"
          >
            <ArrowLeft size={14} />
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
