"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/api";
import { AUTH_STORAGE_KEY, ERROR_MESSAGES } from "@/utils/constants";
import type { AuthContextType, AuthUser } from "@/utils/types";

const AuthContext = createContext<AuthContextType | null>(null);

function buildUserFromToken(token: string): AuthUser {
  return {
    id: 1,
    username: "johnd",
    email: "john@example.com",
    token,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        if (parsed?.token) setUser(parsed);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);
  async function login(username: string, password: string): Promise<void> {
    const { data, error } = await loginUser(username, password);

    if (error || !data?.token) {
      throw new Error(error ?? ERROR_MESSAGES.LOGIN_FAILED);
    }

    const authUser = buildUserFromToken(data.token);
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    router.push("/products");
  }
  function logout() {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push("/login");
  }
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
