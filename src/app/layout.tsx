// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthInitializer } from '@/Components/AuthInitializer';
import { Providers } from '@/Components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Epilux Water - Premium Water Delivery',
  description: 'Your trusted source for premium sachet and bottled water, delivered to your doorstep.',
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#007bff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} app-container`}>
        <Providers>
          <AuthInitializer />
          <Toaster position="top-center" richColors />
          <main className="app-main">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}