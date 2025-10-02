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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthInitializer />
          <Toaster position="top-center" richColors />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}