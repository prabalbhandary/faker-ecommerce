"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Store, User, LogOut } from "lucide-react";
import { useCart } from "@/app/cart/components/CartProvider";
import { useAuth } from "@/app/components/AuthProvider";
import { ROUTES } from "@/utils/constants";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: ROUTES.HOME, label: "Home" },
    { href: ROUTES.PRODUCTS, label: "Products" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-2 font-black text-xl text-gray-900 hover:opacity-80 transition-opacity"
            >
              <Store size={22} className="text-gray-900" />
              ShopNext
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.CART}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label={`Cart with ${itemCount} items`}
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700">
                    <User size={16} />
                    {user.username}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <User size={16} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} ShopNext. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href={ROUTES.PRODUCTS}
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                Products
              </Link>
              <Link
                href={ROUTES.CART}
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                Cart
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
