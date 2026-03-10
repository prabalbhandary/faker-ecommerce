import { API_BASE_URL, ERROR_MESSAGES } from "./constants";
import { ApiResponse, FetchOptions, Product, LoginResponse } from "./types";

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;
  let url = `${API_BASE_URL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    url += `?${new URLSearchParams(params).toString()}`;
  }

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: { "Content-Type": "application/json", ...fetchOptions.headers },
    });

    if (!res.ok) {
      console.error("Fetch error:", res.status, await res.text());
      if (res.status === 404) return { data: null, error: "Product not found." };
      return { data: null, error: "Something went wrong. Please try again." };
    }

    const data = (await res.json()) as T;
    console.log("Fetch success:", url, data);
    return { data, error: null };
  } catch (err) {
    console.error("Network error:", err);
    return { data: null, error: "Something went wrong. Please try again." };
  }
}
export async function fetchProductById(id: number): Promise<ApiResponse<Product>> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) return { data: null, error: ERROR_MESSAGES.PRODUCT_NOT_FOUND };
    const data = (await res.json()) as Product;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: ERROR_MESSAGES.FETCH_FAILED };
  }
}

export async function fetchProducts(): Promise<ApiResponse<Product[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) return { data: null, error: ERROR_MESSAGES.FETCH_FAILED };
    const data = (await res.json()) as Product[];
    return { data, error: null };
  } catch (err) {
    return { data: null, error: ERROR_MESSAGES.FETCH_FAILED };
  }
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
