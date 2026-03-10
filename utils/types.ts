export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  token: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  category: string;
  minPrice: number;
  maxPrice: number;
  search: string;
  sort: SortOrder;
  page: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export interface ProductRatingProps {
  rating: ProductRating;
  showCount?: boolean;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  search: string;
}
