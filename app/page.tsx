import Link from 'next/link';
import { ArrowRight, ShoppingBag, Shield, Truck, Star } from 'lucide-react';
import { fetchProducts } from '@/utils/api';
import { ROUTES } from '@/utils/constants';
import { formatPrice } from '@/utils/formatters';
import Image from 'next/image';

const FEATURES = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'On orders over $50',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    desc: '100% protected checkout',
  },
  {
    icon: Star,
    title: 'Top Rated',
    desc: 'Thousands of 5-star reviews',
  },
  {
    icon: ShoppingBag,
    title: 'Easy Returns',
    desc: '30-day hassle-free returns',
  },
];

export default async function HomePage() {
  const { data: products } = await fetchProducts();
  const featured = (products ?? []).slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 px-4">
        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          New Arrivals Every Week
        </span>
        <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-5 max-w-2xl mx-auto">
          Shop the Best.<br />
          <span className="text-gray-400">At Any Budget.</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
          Discover thousands of products across all categories with free shipping and easy returns.
        </p>
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          Shop Now
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Feature highlights */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-sm transition-shadow"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon size={20} className="text-gray-700" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-0.5">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products (SSR) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Featured Products</h2>
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={ROUTES.PRODUCTS_DETAILS(product.id)}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="relative h-44 bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-900 font-semibold line-clamp-2 mb-1.5 leading-snug">
                  {product.title}
                </p>
                <p className="text-base font-black text-gray-900">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
