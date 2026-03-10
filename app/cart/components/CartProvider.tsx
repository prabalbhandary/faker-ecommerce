"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import type { CartContextType, CartItem, Product } from "@/utils/types";
import { CART_STORAGE_KEY } from "@/utils/constants";

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: number; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingIndex = state.findIndex(
        (item) => item.product.id === product.id,
      );

      if (existingIndex !== -1) {
        return state.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...state, { product, quantity }];
    }

    case "REMOVE_ITEM":
      return state.filter(
        (item) => item.product.id !== action.payload.productId,
      );

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((item) => item.product.id !== productId);
      }
      return state.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      );
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error(error);
    }
  }, [items]);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  function addToCart(product: Product, quantity = 1) {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  }
  function removeFromCart(productId: number) {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  }

  function updateQuantity(productId: number, quantity: number) {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  function isInCart(productId: number): boolean {
    return items.some((item) => item.product.id === productId);
  }

  function getItemQuantity(productId: number): number {
    return items.find((item) => item.product.id === productId)?.quantity ?? 0;
  }
  const value: CartContextType = {
    items,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
