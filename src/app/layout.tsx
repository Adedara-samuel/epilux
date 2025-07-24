// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './context/auth-context';
import { CartProvider } from './context/cart-context';
// import { SearchProvider } from './context/search-context'; // REMOVE THIS LINE
import { Toaster } from 'sonner';

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
        <AuthProvider>
          <CartProvider>
            {/* SearchProvider is now moved to app/products/layout.tsx */}
            <Toaster position="top-center" richColors />
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                {children} {/* All page content will be rendered here */}
              </main>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}