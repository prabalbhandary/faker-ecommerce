"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/utils/types";
import { fetchProducts, fetchProductByCategory } from "@/utils/api";

type Props = {
  categories: string[];
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: "asc" | "desc" | "";
  initialPage?: number;
  productsPerPage: number;
};

export default function ProductsClient({
  categories,
  initialSearch = "",
  initialCategory = "",
  initialSort = "",
  initialPage = 1,
  productsPerPage,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<"asc" | "desc" | "">(initialSort);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on client
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        let result;
        if (category) {
          result = await fetchProductByCategory(category, sort as "asc" | "desc");
        } else {
          result = await fetchProducts(sort as "asc" | "desc");
        }

        if (result.error) setError(result.error);
        else setProducts(
          result.data?.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
          ) ?? []
        );
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
        setPage(1); // Reset page on new fetch
      }
    }

    loadProducts();
  }, [category, sort, search]);

  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);

  if (loading) return <p>Loading products...</p>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!products.length) return <p>No products found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "asc" | "desc" | "")}
          className="border p-1 rounded"
        >
          <option value="">Default</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-1 rounded flex-1"
        />
      </div>

      {/* Product grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {paginatedProducts.map((product) => (
          <li
            key={product.id}
            className="border rounded overflow-hidden hover:shadow-lg transition"
          >
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
