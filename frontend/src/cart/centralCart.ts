import { addToCartBackend, getCartBackend} from "./backendCart"; // Backend methods
import { addToCart, getCart, getTotal} from "./localCart"; // Local methods
import { useTokenContext } from "../TokenContext"; // Access user token
import { Product } from "../types.ts";

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

    const handleCartTotal = async () => {
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

    return { handleGetCart, handleCartTotal, handleAddToCart };
};


