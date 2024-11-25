import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCartBackend, addToCartBackend, updateCartBackend, removeFromCartBackend} from './backendCart';
import { getCart, addToCart, updateCart, removeFromCart} from './localCart';
import { CartItem, Cart, Product } from '../types';

interface CartContextProps {
    cartItems: CartItem[];
    cartTotal: number;
    cartCount: number;
    handleAddToCart: (product: Product, quantity: number) => Promise<void>;
    handleUpdateCart: (productId: string, quantity: number) => Promise<void>;
    handleRemoveFromCart: (productId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [cartCount, setCartCount] = useState<number>(0);

    // Fetch cart data from backend or local storage
    const refreshCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response: Cart = await getCartBackend(token);
                const items = response.items || [];
                const total = response.cart_total || 0;
                const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

                setCartItems(items);
                setCartTotal(total);
                setCartCount(count);
            } else {
                const localCart: Cart = getCart();
                const items = localCart.items || [];
                const total = localCart.cart_total || 0;
                const count = localCart.items.reduce((sum, item) => sum + item.quantity, 0);

                setCartItems(items);
                setCartTotal(total);
                setCartCount(count);
            }
        } catch (error:any) {
            console.error('Failed to refresh cart:', error.message);
        }
    };

    // Add an item to the cart
    const handleAddToCart = async (product: Product, quantity: number) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await addToCartBackend(product.id, quantity, token);
                console.log("Adding " , quantity, " product_id", product.id, "to backend cart.");
            } else {
                addToCart(product, quantity);
                console.log("Adding " , quantity, " product_id", product.id, "to local cart.");
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
                console.log("Updating product_id:", productId, "to quantity:", quantity, "in backend cart");
            } else {
                updateCart(productId, quantity);
                console.log("Updating product_id:", productId, "to quantity:", quantity, "in local cart");
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
                console.log("Removing product_id", productId, "from backend cart.");
            } else {
                removeFromCart(productId);
                console.log("Removing product_id", productId, "from local cart.");
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