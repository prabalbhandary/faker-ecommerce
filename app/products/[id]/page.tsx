import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { fetchProductById, fetchProducts } from '@/utils/api';
import { META, ROUTES } from '@/utils/constants';
import { formatPrice, formatCategory } from '@/utils/formatters';
import ProductRating from '../components/ProductRating';
import AddToCartButton from './AddToCartButton';

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { data: product } = await fetchProductById(Number(params.id));

  if (!product) {
    return { title: `Product Not Found | ${META.SITE_NAME}` };
  }

  return {
    title: `${product.title} | ${META.SITE_NAME}`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: [{ url: product.image, width: 600, height: 600, alt: product.title }],
    },
  };
}

export async function generateStaticParams() {
  const { data: products } = await fetchProducts();
  return (products ?? []).map((p) => ({ id: String(p.id) }));
}

function ProductJsonLd({ product }: { product: NonNullable<Awaited<ReturnType<typeof fetchProductById>>['data']> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          image: product.image,
          description: product.description,
          category: product.category,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating.rate,
            reviewCount: product.rating.count,
          },
        }),
      }}
    />
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = Number(params.id);

  if (isNaN(id)) notFound();

  const { data: product, error } = await fetchProductById(id);

  if (error && !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
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

  if (!product) notFound();

  return (
    <>
      <ProductJsonLd product={product} />

      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <Link href={ROUTES.HOME} className="hover:text-gray-900 transition-colors">Home</Link>
        <span>/</span>
        <Link href={ROUTES.PRODUCTS} className="hover:text-gray-900 transition-colors">Products</Link>
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
            <span className="text-4xl font-black text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="border-t border-gray-100 my-5" />

          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Description</h2>
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
    </>
  );
}
