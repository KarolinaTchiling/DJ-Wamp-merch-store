import { addToCartBackend, getCartBackend, updateCartBackend} from "./backendCart"; // Backend methods
import { addToCart, updateCart, getCart, getTotal, getCartCount} from "./localCart"; // Local methods
import { useTokenContext } from "../TokenContext"; // Access user token
import { Product, CartItem } from "../types.ts";

export const useCentralCart = () => {
    const { token } = useTokenContext(); // Access login status

    // Get cart items
    const handleGetCart = async () => {
        if (token) {
            console.log("Fetching cart from backend with token:", token);
            try {
                const response = await getCartBackend(token);
                console.log("Backend cart fetched:", response);
                return response.items;
            } catch (error: any) {
                console.error("Failed to fetch backend cart:", error.message);
                alert("Failed to fetch cart. Please try again.");
                return [];
            }
        } else {
            console.log("Fetching cart from local storage");
            return getCart();
        }
    };

    // Get the total cost of the cart
    const handleCartTotal = async (): Promise<number> => {
        if (token) {
            console.log("Fetching cart from backend with token:", token);
            try {
                const response = await getCartBackend(token);
                console.log("Backend cart fetched:", response);
                return response.cart_total;
            } catch (error: any) {
                console.error("Failed to fetch backend cart:", error.message);
                alert("Failed to fetch cart. Please try again.");
                return 0.0;
            }
        } else {
            console.log("Fetching cart from local storage");
            return getTotal();
        }
    };

    // Get the total number of items in the cart
    const handleCartCount = async (): Promise<number> => {
        if (token) {
            console.log("Fetching cart count from backend with token:", token);
            try {
                const response = await getCartBackend(token);
                console.log("Backend cart fetched:", response);
                const items = response.items || []; // Fallback to empty array if undefined
                const totalQuantity = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
                return totalQuantity;
            } catch (error: any) {
                console.error("Failed to fetch backend cart count:", error.message);
                alert("Failed to fetch cart count. Please try again.");
                return 0; // Return 0 in case of error
            }
        } else {
            console.log("Fetching cart count from local storage");
            try {
                return getCartCount(); // Ensure this handles errors internally
            } catch (error: any) {
                console.error("Failed to fetch local cart count:", error.message);
                return 0; // Return 0 in case of error
            }
        }
    };

    // Add product to cart
    const handleAddToCart = async (product: Product, selectedQuantity: number) => {
        if (token) {
            console.log("Using backend cart with token:", token);
            try {
                const response = await addToCartBackend(product.id, selectedQuantity, token);
                console.log("Product added to backend cart:", response);
            } catch (error: any) {
                console.error("Failed to add product to backend cart:", error.message);
                alert("Failed to add product to cart. Please try again.");
            }
        } else {
            console.log("Using local cart");
            addToCart({
                product_id: product.id,
                name: product.name,
                price: product.price,
                total_price: selectedQuantity * product.price,
                quantity: selectedQuantity,
                image_url: product.image_url,
            });
        }
    };

    // Update the quantity of item in the cat
    const handleUpdateCart = async (item: CartItem, selectedQuantity: number) => {
        console.log("handleUpdateCart called with:", { item, selectedQuantity });

        if (!item || !item.product_id) {
            console.error("Invalid cart item or missing product_id:", item);
            return;
        }

        if (token) {
            console.log("Using backend cart with token:", token);
            try {
                const response = await updateCartBackend(item.product_id, selectedQuantity, token);
                console.log("Product updated in backend cart:", response);
            } catch (error: any) {
                console.error("Failed to update product in backend cart:", error.message);
            }
        } else {
            console.log("Using local cart");
            updateCart({
                product_id: item.product_id,
                quantity: selectedQuantity,
                name: item.name,
                price: item.price,
                total_price: selectedQuantity * item.price,
                image_url: item.image_url,
            });
        }
    };



    // // Delete cart or clear items
    // const handleDeleteCart = async () => {
    //     if (token) {
    //         console.log("Deleting backend cart with token:", token);
    //         try {
    //             const response = await deleteCartBackend(token);
    //             console.log("Backend cart deleted:", response);
    //         } catch (error: any) {
    //             console.error("Failed to delete backend cart:", error.message);
    //             alert("Failed to delete cart. Please try again.");
    //         }
    //     } else {
    //         console.log("Clearing local cart");
    //         deleteCart();
    //     }
    // };

    return { handleGetCart, handleCartTotal, handleCartCount, handleAddToCart, handleUpdateCart };
};


