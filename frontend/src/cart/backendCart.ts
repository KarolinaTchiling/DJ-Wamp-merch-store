import axios from "axios";

export const getCartBackend = async (token: string) => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addToCartBackend = async (product_id: string, quantity: number, token: string) => {
    await axios.post(
        `${import.meta.env.VITE_BASE_URL}/cart/`,
        { product_id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const updateCartBackend = async (product_id: string, quantity: number, token: string) => {
    await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/cart/${product_id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const removeFromCartBackend = async (productId: string, token: string) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const clearCartBackend = async (token: string) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};


