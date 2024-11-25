import axios from "axios";

export const getCartBackend = async (token: string) => {
    try {
        const response = await axios.get(
            "http://127.0.0.1:5000/cart/",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to add product to cart");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};

export const addToCartBackend = async (product_id: string, quantity: number, token: string) => {
    try {
        const response = await axios.post(
            "http://127.0.0.1:5000/cart/",
            { product_id, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to add product to cart");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};

export const updateCartBackend = async (product_id: string, quantity: number, token: string) => {
    try {
        const response = await axios.patch(
            `http://127.0.0.1:5000/cart/${product_id}`,
            { quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to add product to cart");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};



