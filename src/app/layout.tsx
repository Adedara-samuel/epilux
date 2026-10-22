// app/layout.tsx
import './globals.css';
import './animations.css';
import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/Components/providers';
import PageTransition from '@/Components/PageTransition';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700', '800'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Epilux Water — Premium Water Delivery',
    template: '%s | Epilux Water',
  },
  description: 'Your trusted source for premium sachet and bottled water, delivered to your doorstep. Earn rewards on every order.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Epilux Water',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Allow pinch-zoom for accessibility
  maximumScale: 5,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <Providers>
          <Suspense fallback={null}>
            <PageTransition />
          </Suspense>
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{ classNames: { toast: 'rounded-xl shadow-lift font-sans' } }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
