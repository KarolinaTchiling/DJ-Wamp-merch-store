import React, { useState, useEffect } from "react";
import { useCentralCart } from "../cart/centralCart"; // Centralized cart logic
import { useTokenContext } from "../TokenContext"; // Access user token
import { Product } from "../types"; // Adjust path as needed

const TestPage: React.FC = () => {
    const { token } = useTokenContext(); // Retrieve the token
    const { handleGetCart, handleCartTotal } = useCentralCart();

    const [cartItems, setCartItems] = useState<any[]>([]); // State for cart items
    const [cartTotal, setCartTotal] = useState<number>(0); // State for cart total
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    // Fetch the cart and total
    const fetchCart = async () => {
        setLoading(true);
        try {
            const items = await handleGetCart(); // Fetch cart items
            const total = await handleCartTotal(); // Fetch cart total
            setCartItems(items); // Store items
            setCartTotal(total); // Store total
        } catch (error) {
            console.error("Failed to fetch cart data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart(); // Fetch cart data when the component mounts
    }, []);


    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Test Page</h1>
            {token ? (
                <p className="text-green-500">User is logged in. TOKEN: {token}</p>
            ) : (
                <p className="text-red-500">User is not logged in.</p>
            )}

            <div>
                <h2 className="text-lg font-bold">Cart Contents:</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : cartItems.length > 0 ? (
                    <div>
                        <ul>
                            {cartItems.map((item, index) => (
                                <li key={index} className="py-2 border-b border-gray-300 flex items-center gap-4">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover"
                                    />
                                    <div>
                                        <p><strong>{item.name}</strong></p>
                                        <p>Price: ${item.price.toFixed(2)}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Total: ${item.total_price.toFixed(2)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <h3 className="text-lg font-bold">Cart Total: ${cartTotal.toFixed(2)}</h3>
                        </div>
                    </div>
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>

        </div>
    );
};

export default TestPage;
