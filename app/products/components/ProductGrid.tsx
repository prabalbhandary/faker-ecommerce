import { Package } from 'lucide-react';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '@/app/components/Loader';
import type { ProductGridProps } from '@/utils/types';

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Package size={28} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Try adjusting your filters or search query to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
