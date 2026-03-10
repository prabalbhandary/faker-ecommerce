import { API_BASE_URL, ERROR_MESSAGES } from "./constants";
import { ApiResponse, FetchOptions, Product, LoginResponse } from "./types";

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;

  // Build full URL
  let url = `${API_BASE_URL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;
  }

  const headers: HeadersInit = { "Content-Type": "application/json" };

  // Add auth token if in browser
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ecommerce_auth");
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        if (auth?.token) headers["Authorization"] = `Bearer ${auth.token}`;
      } catch (err) {
        console.error("Auth parse error:", err);
      }
    }
  }

  try {
    const res = await fetch(url, { ...fetchOptions, headers });

    if (!res.ok) {
      const status = res.status;
      if (status === 404) return { data: null, error: ERROR_MESSAGES.PRODUCT_NOT_FOUND };
      if (status === 401) return { data: null, error: ERROR_MESSAGES.LOGIN_FAILED };
      if (status >= 500) return { data: null, error: ERROR_MESSAGES.FETCH_FAILED };
      return { data: null, error: ERROR_MESSAGES.GENERIC };
    }

    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (err) {
    console.error("API fetch error:", err);
    return { data: null, error: ERROR_MESSAGES.NETWORK_ERROR };
  }
}

// Product API
export async function fetchProducts(sort?: "asc" | "desc"): Promise<ApiResponse<Product[]>> {
  const params: Record<string, string> = {};
  if (sort) params.sort = sort;
  return apiFetch<Product[]>("/products", { params });
}

export async function fetchProductById(id: number): Promise<ApiResponse<Product>> {
  return apiFetch<Product>(`/products/${id}`);
}

export async function fetchCategories(): Promise<ApiResponse<string[]>> {
  return apiFetch<string[]>("/products/categories");
}

export async function fetchProductByCategory(category: string, sort?: "asc" | "desc"): Promise<ApiResponse<Product[]>> {
  const params: Record<string, string> = {};
  if (sort) params.sort = sort;
  return apiFetch<Product[]>(`/products/category/${encodeURIComponent(category)}`, { params });
}

// Auth
export async function loginUser(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export { apiFetch };
