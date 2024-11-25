import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCartBackend, addToCartBackend, updateCartBackend, removeFromCartBackend} from './backendCart';
import { getCart, addToCart, updateCart, removeFromCart} from './localCart';

interface CartContextProps {
    cartItems: any[];
    cartTotal: number;
    cartCount: number;
    handleAddToCart: (product: any, quantity: number) => Promise<void>;
    handleUpdateCart: (productId: string, quantity: number) => Promise<void>;
    handleRemoveFromCart: (productId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [cartCount, setCartCount] = useState<number>(0);

    // Fetch cart data from backend or local storage
    const refreshCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await getCartBackend(token);
                const items = response.items || [];
                const total = response.cart_total || 0;
                const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)

                setCartItems(items);
                setCartTotal(total);
                setCartCount(count);
            } else {
                const items = getCart();
                const total = items.reduce((sum: number, item: any)=> sum + item.total_price, 0);
                const count = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

                setCartItems(items);
                setCartTotal(total);
                setCartCount(count);
            }
        } catch (error:any) {
            console.error('Failed to refresh cart:', error.message);
        }
    };

    // Add an item to the cart
    const handleAddToCart = async (product: any, quantity: number) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await addToCartBackend(product.id, quantity, token);
            } else {
                addToCart(product, quantity);
            }
            await refreshCart();
        } catch (error:any) {
            console.error('Failed to add item to cart:', error.message);
        }
    };

    // Update the quantity of an item
    const handleUpdateCart = async (productId: string, quantity: number) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await updateCartBackend(productId, quantity, token);
            } else {
                updateCart(productId, quantity);
            }
            await refreshCart();
        } catch (error:any) {
            console.error('Failed to update cart item:', error.message);
        }
    };

    // Remove an item from the cart
    const handleRemoveFromCart = async (productId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await removeFromCartBackend(productId, token);
            } else {
                removeFromCart(productId);
            }
            await refreshCart();
        } catch (error: any) {
            console.error('Failed to remove item from cart:', error.message);
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartTotal,
                cartCount,
                handleAddToCart,
                handleUpdateCart,
                handleRemoveFromCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};