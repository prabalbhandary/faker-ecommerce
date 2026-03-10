'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import ProductFilters from './components/ProductFilters';
import { debounce, buildQueryString } from '@/utils/formatters';
import { PRODUCTS_PER_PAGE, PRICE_RANGE } from '@/utils/constants';
import type { Product } from '@/utils/types';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: string[];
  fetchError: string | null;
  initialSearch: string;
  initialCategory: string;
  initialSort: string;
  initialPage: number;
}

export default function ProductsClient({
  initialProducts,
  categories,
  fetchError,
  initialSearch,
  initialCategory,
  initialSort,
  initialPage,
}: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(PRICE_RANGE.MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_RANGE.MAX);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input to avoid excessive re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce((value: unknown) => setSearch(value as string), 350),
    []
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    debouncedSetSearch(e.target.value);
    setCurrentPage(1);
  }

  // Sync URL query params whenever filters change (bonus: shareable URLs)
  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params['search'] = search;
    if (category) params['category'] = category;
    if (sort) params['sort'] = sort;
    if (currentPage > 1) params['page'] = String(currentPage);

    const qs = buildQueryString(params);
    router.replace(`${pathname}${qs}`, { scroll: false });
  }, [search, category, sort, currentPage, router, pathname]);

  // Client-side filtering on server-fetched products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch = search
        ? product.title.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesCategory = category ? product.category === category : true;
      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [initialProducts, search, category, minPrice, maxPrice]);

  // Client-side sort (supplements SSR sort for filtered results)
  const sortedProducts = useMemo(() => {
    if (!sort) return filteredProducts;
    return [...filteredProducts].sort((a, b) =>
      sort === 'asc' ? a.price - b.price : b.price - a.price
    );
  }, [filteredProducts, sort]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return sortedProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  function handleCategoryChange(cat: string) {
    setCategory(cat);
    setCurrentPage(1);
  }

  function handleSortChange(value: string) {
    setSort(value);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearFilters() {
    setSearch('');
    setSearchInput('');
    setCategory('');
    setSort('');
    setMinPrice(PRICE_RANGE.MIN);
    setMaxPrice(PRICE_RANGE.MAX);
    setCurrentPage(1);
  }

  const hasActiveFilters = search || category || sort || minPrice > PRICE_RANGE.MIN || maxPrice < PRICE_RANGE.MAX;

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Failed to load products</h2>
        <p className="text-sm text-gray-500">{fetchError}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-3xl font-black text-gray-900">Products</h1>
        <p className="text-sm text-gray-500 mt-1">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <ProductFilters
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        onSearchClear={() => { setSearchInput(''); setSearch(''); }}
        sort={sort}
        onSortChange={handleSortChange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        categories={categories}
        category={category}
        onCategoryChange={handleCategoryChange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={(val) => { setMinPrice(Math.min(val, maxPrice - 1)); setCurrentPage(1); }}
        onMaxPriceChange={(val) => { setMaxPrice(Math.max(val, minPrice + 1)); setCurrentPage(1); }}
        hasActiveFilters={!!hasActiveFilters}
        onClearFilters={clearFilters}
        search={search}
      />

      {/* Product grid */}
      <ProductGrid products={paginatedProducts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
