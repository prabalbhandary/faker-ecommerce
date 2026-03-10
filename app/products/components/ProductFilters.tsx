'use client';

import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { formatCategory, formatPrice } from '@/utils/formatters';
import { PRICE_RANGE } from '@/utils/constants';

export interface ProductFiltersProps {
  searchInput: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;

  sort: string;
  onSortChange: (value: string) => void;

  showFilters: boolean;
  onToggleFilters: () => void;

  categories: string[];
  category: string;
  onCategoryChange: (cat: string) => void;

  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;

  hasActiveFilters: boolean;
  onClearFilters: () => void;

  search: string; 
}

export default function ProductFilters({
  searchInput,
  onSearchChange,
  onSearchClear,
  sort,
  onSortChange,
  showFilters,
  onToggleFilters,
  categories,
  category,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  hasActiveFilters,
  onClearFilters,
  search,
}: ProductFiltersProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchInput}
            onChange={onSearchChange}
            placeholder="Search products..."
            className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
          {searchInput && (
            <button
              onClick={onSearchClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none pl-3 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
            aria-label="Sort order"
          >
            <option value="">Sort: Default</option>
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        <button
          onClick={onToggleFilters}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
          className={[
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors',
            showFilters
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
          ].join(' ')}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden="true" />
          )}
        </button>
      </div>

      {showFilters && (
        <div
          id="filter-panel"
          className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange('')}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                  !category
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50',
                ].join(' ')}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={[
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border capitalize',
                    category === cat
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'text-gray-600 border-gray-200 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {formatCategory(cat)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Price Range
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Min: {formatPrice(minPrice)}</p>
                <input
                  type="range"
                  min={PRICE_RANGE.MIN}
                  max={PRICE_RANGE.MAX}
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(Number(e.target.value))}
                  className="w-full accent-gray-900"
                  aria-label="Minimum price"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Max: {formatPrice(maxPrice)}</p>
                <input
                  type="range"
                  min={PRICE_RANGE.MIN}
                  max={PRICE_RANGE.MAX}
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                  className="w-full accent-gray-900"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <X size={14} />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
              {formatCategory(category)}
              <button
                onClick={() => onCategoryChange('')}
                aria-label={`Remove ${category} filter`}
              >
                <X size={11} />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
              &ldquo;{search}&rdquo;
              <button onClick={onSearchClear} aria-label="Remove search filter">
                <X size={11} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
