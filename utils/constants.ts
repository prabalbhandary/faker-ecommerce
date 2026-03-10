export const API_BASE_URL = "https://fakestoreapi.com";

export const PRODUCTS_PER_PAGE = 8;

export const SORT_OPTIONS = [
  {
    label: "Default",
    value: "",
  },
  {
    label: "Price: Low to High",
    value: "asc",
  },
  {
    label: "Price: High to Low",
    value: "desc",
  },
] as const;

export const PRICE_RANGE = {
  MIN: 0,
  MAX: 1000,
} as const;

export const CART_STORAGE_KEY = "ecommerce_cart";

export const AUTH_STORAGE_KEY = "ecommerce_auth";

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCTS_DETAILS: (id: number) => `/products/${id}`,
  CART: "/cart",
  LOGIN: "/login",
} as const;

export const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch data. Please try again.",
  PRODUCT_NOT_FOUND: "Product not found.",
  LOGIN_FAILED: "Invalid username or password.",
  NETWORK_ERROR: "Network error. Check your connection.",
  GENERIC: "Something went wrong. Please try again.",
} as const;

export const META = {
  SITE_NAME: "ShopNext",
  DESCRIPTION: "Discover amazing products at unbeatable prices.",
  TWITTER_HANDLE: "@shopnext",
} as const;
