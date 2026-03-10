"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/utils/types";

type Props = {
  initialProducts: Product[];
  categories: string[];
  fetchError: string | null;
  initialSearch: string;
  initialCategory: string;
  initialSort: string;
  initialPage: number;
  productsPerPage: number;
};

export default function ProductsClient({
  initialProducts,
  categories,
  fetchError,
  initialSearch,
  initialCategory,
  initialSort,
  initialPage,
  productsPerPage,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(initialPage);

  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);

  if (fetchError) return <div className="text-red-600">{fetchError}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {paginatedProducts.map((product) => (
          <li key={product.id} className="border rounded overflow-hidden hover:shadow-lg transition">
            <Link href={`/products/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-contain"
                />
                <div className="p-2">
                  <h2 className="mt-2 font-semibold">{product.title}</h2>
                  <p className="text-green-700">${product.price}</p>
                </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-4 flex justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={startIndex + productsPerPage >= products.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
