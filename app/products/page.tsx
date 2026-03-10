import { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { fetchCategories } from "@/utils/api";
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
  description: META.DESCRIPTION,
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

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Fetch categories server-side
  const categoriesResult = await fetchCategories();
  const categories = categoriesResult.data ?? [];

  return (
    <>
      <ProductListingJsonLd />
      <ProductsClient
        categories={categories}
        initialSearch={searchParams.search ?? ""}
        initialCategory={searchParams.category ?? ""}
        initialSort={
          searchParams.sort === "desc"
            ? "desc"
            : searchParams.sort === "asc"
            ? "asc"
            : ""
        }
        initialPage={Number(searchParams.page ?? 1)}
        productsPerPage={PRODUCTS_PER_PAGE}
      />
    </>
  );
}
