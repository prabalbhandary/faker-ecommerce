import { API_BASE_URL, ERROR_MESSAGES } from "./constants";
import { ApiResponse, FetchOptions, Product, LoginResponse } from "./types";

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;
  let url = `${API_BASE_URL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;
  }
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ecommerce_auth");
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        if (auth?.token) {
          (defaultHeaders as Record<string, string>)["Authorization"] =
            `Bearer ${auth.token}`;
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...defaultHeaders,
        ...fetchOptions.headers,
      },
    });
    if (!response.ok) {
      const status = response.status;
      if (status === 404) {
        return {
          data: null,
          error: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
        };
      }
      if (status === 401) {
        return {
          data: null,
          error: ERROR_MESSAGES.LOGIN_FAILED,
        };
      }
      if (status >= 500) {
        return {
          data: null,
          error: ERROR_MESSAGES.FETCH_FAILED,
        };
      }
      return {
        data: null,
        error: ERROR_MESSAGES.GENERIC,
      };
    }
    const data = (await response.json()) as T;
    return {
      data,
      error: null,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        data: null,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
    return {
      data: null,
      error: ERROR_MESSAGES.GENERIC,
    };
  }
}

export async function fetchProducts(
  sort?: "asc" | "desc",
): Promise<ApiResponse<Product[]>> {
  const params: Record<string, string> = {};
  if (sort) params["sort"] = sort;
  return apiFetch<Product[]>("/products", { params });
}

export async function fetchProductById(
  id: number,
): Promise<ApiResponse<Product>> {
  return apiFetch<Product>(`/products/${id}`);
}

export async function fetchCategories(): Promise<ApiResponse<string[]>> {
  return apiFetch<string[]>("/products/categories");
}

export async function fetchProductByCategory(
  category: string,
  sort?: "asc" | "desc",
): Promise<ApiResponse<Product[]>> {
  const params: Record<string, string> = {};
  if (sort) params["sort"] = sort;
  return apiFetch<Product[]>(
    `/products/category/${encodeURIComponent(category)}`,
    { params },
  );
}

export async function loginUser(
  username: string,
  password: string,
): Promise<ApiResponse<LoginResponse>> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export { apiFetch };
