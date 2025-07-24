// app/context/cart-context.tsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product'; // Ensure Product is imported
import { toast } from 'sonner';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
    totalItems: 0,
    totalPrice: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem('aquapure_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('aquapure_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, quantity: number = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);

            if (existingItem) {
                // Check if adding quantity exceeds stock
                if (existingItem.quantity + quantity > product.stock) {
                    toast.error(`Cannot add more than ${product.stock} units of ${product.name} to cart. Only ${product.stock - existingItem.quantity} more available.`);
                    return prevCart; // Return previous cart state without modification
                }
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // Check if product quantity exceeds stock
            if (quantity > product.stock) {
                toast.error(`Cannot add ${quantity} units of ${product.name}. Only ${product.stock} available.`);
                return prevCart; // Return previous cart state without modification
            }

            return [...prevCart, { ...product, quantity }];
        });

        // Toast message is handled in ProductCard/ProductDetailPage
        // toast.success(`${quantity} ${product.name} added to cart`);
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
        toast.success('Item removed from cart');
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCart((prevCart) => {
            const itemToUpdate = prevCart.find(item => item.id === productId);
            if (!itemToUpdate) return prevCart;

            if (quantity < 1) {
                removeFromCart(productId); // Remove if quantity goes to 0 or less
                return prevCart.filter((item) => item.id !== productId);
            }

            // Prevent quantity from exceeding stock
            if (quantity > itemToUpdate.stock) {
                toast.error(`Cannot set quantity to ${quantity} for ${itemToUpdate.name}. Only ${itemToUpdate.stock} available.`);
                return prevCart; // Keep existing quantity if stock is exceeded
            }

            return prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            );
        });
    };

    const clearCart = () => {
        setCart([]);
        toast.success('Cart cleared!');
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);