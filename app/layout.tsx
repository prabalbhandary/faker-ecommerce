import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { CartProvider } from './cart/components/CartProvider';
import { AuthProvider } from './components/AuthProvider';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { META } from '@/utils/constants';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: {
    default: META.SITE_NAME,
    template: `%s | ${META.SITE_NAME}`,
  },
  description: META.DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: META.SITE_NAME,
    description: META.DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    creator: META.TWITTER_HANDLE,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased font-sans">
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <Layout>{children}</Layout>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
