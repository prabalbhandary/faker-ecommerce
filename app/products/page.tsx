import { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { fetchProducts, fetchCategories } from "@/utils/api";
import { META, PRODUCTS_PER_PAGE } from "@/utils/constants";

type ProductsPageProps = {
  searchParams: {
    sort?: string;
    category?: string;
    search?: string;
    page?: string;
  };
};

export const metadata: Metadata = {
  title: `Products | ${META.SITE_NAME}`,
  description: "Browse our full collection of products at unbeatable prices.",
  openGraph: {
    title: `Products | ${META.SITE_NAME}`,
    description: META.DESCRIPTION,
  },
};

function ProductListingJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Product Listing",
          description: META.DESCRIPTION,
          url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/products`,
        }),
      }}
    />
  );
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const sort =
    searchParams.sort === "desc"
      ? "desc"
      : searchParams.sort === "asc"
        ? "asc"
        : undefined;

  try {
    // Server-side fetch
    const [productsResult, categoriesResult] = await Promise.all([
      fetchProducts(sort), // sorted client-side
      fetchCategories(),
    ]);

    const products = productsResult.data ?? [];
    const categories = categoriesResult.data ?? [];
    const fetchError = productsResult.error;

    return (
      <>
        <ProductListingJsonLd />
        <ProductsClient
          initialProducts={products}
          categories={categories}
          fetchError={fetchError}
          initialSearch={searchParams.search ?? ""}
          initialCategory={searchParams.category ?? ""}
          initialSort={sort ?? ""}
          initialPage={Number(searchParams.page ?? 1)}
          productsPerPage={PRODUCTS_PER_PAGE}
        />
      </>
    );
  } catch (err) {
    return (
      <div className="text-center mt-10 text-red-600">
        Failed to load products. Please try again later.
      </div>
    );
  }
}
