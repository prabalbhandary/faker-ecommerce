# ShopNext — E-commerce Dashboard

A production-ready e-commerce dashboard built with **Next.js 15**, **TypeScript**, and the [Fake Store API](https://fakestoreapi.com).

---

## Features

### Products
- **SSR product listing** (`/products`) — fetched server-side for fast first paint and SEO
- **Server-side sorting** via `?sort=asc` / `?sort=desc` query params
- **Client-side filtering** — category, price range, and name search applied after server fetch
- **URL-synced filters** — shareable URLs (`/products?category=electronics&sort=asc&search=phone`)
- **Pagination** — 8 products per page with ellipsis page numbers
- **Product detail pages** (`/products/[id]`) — SSR with dynamic metadata
- `generateStaticParams` pre-generates all product pages at build time

### Cart
- Add / remove / update quantity
- Persisted to `localStorage` via `useReducer` + `useEffect`
- Cart total with shipping threshold and tax calculation
- `CartProvider` using React Context API

### Auth (Bonus)
- Login via Fake Store API (`/auth/login`)
- Session persisted to `localStorage`
- Auth state managed via `AuthProvider` context

### SEO (Bonus)
- Dynamic `<Metadata>` per page
- JSON-LD structured data (Product schema on detail pages, ItemList on listing)
- `/sitemap.xml` auto-generated from live product data
- `/robots.txt` configured

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 |
| Icons | lucide-react |
| HTTP | Native `fetch` only |
| State | React Context + `useReducer` |
| Images | `next/image` with remote patterns |

---

## Project Structure

```
app/
├── cart/
│   ├── components/
│   │   ├── CartItem.tsx
│   │   ├── CartProvider.tsx   ← Cart context + reducer
│   │   └── CartSummary.tsx
│   └── page.tsx
├── components/                ← Shared components
│   ├── AuthProvider.tsx
│   ├── Button.tsx
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   └── Loader.tsx
├── login/
│   └── page.tsx
├── products/
│   ├── [id]/
│   │   ├── AddToCartButton.tsx
│   │   └── page.tsx           ← SSR product detail
│   ├── components/
│   │   ├── Pahination.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductRating.tsx
│   ├── ProductsClient.tsx     ← Client-side filters/search
│   └── page.tsx               ← SSR product listing
├── globals.css
├── layout.tsx
├── page.tsx
├── robots.ts
└── sitemap.ts
utils/
├── api.ts                     ← Fetch interceptor + all API calls
├── constants.ts
├── formatters.ts
└── types.ts
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo login credentials:**
- Username: `johnd`
- Password: `m38rmF$`

---

## API Interceptor

All HTTP calls go through the `apiFetch` wrapper in `utils/api.ts`. It handles:
- Base URL prepending
- Auth token injection from localStorage
- Query parameter serialization
- Non-2xx HTTP error classification (404, 401, 5xx)
- Network-level failure detection
- Consistent `{ data, error }` response shape

This pattern makes the API layer easy to extend (logging, retry logic, request caching) without changing call sites.
