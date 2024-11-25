import React, { useState, useEffect } from "react";
import { useTokenContext } from "../TokenContext";
import { useCentralCart } from "../cart/centralCart";

const TestPage: React.FC = () => {
    const { token } = useTokenContext();
    const { handleGetCart } = useCentralCart();

    const [cartItems, setCartItems] = useState<any[]>([]);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const items = await handleGetCart(); // Fetch cart items
            setCartItems(items); // Store the items
            setCartTotal(calculateCartTotal(items)); // Calculate and set the total
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const calculateCartTotal = (items: any[]) => {
        return items.reduce((total, item) => total + item.total_price, 0);
    };

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
                                <li key={index} className="py-2 border-b border-gray-300">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover"
                                    />
                                    <p>
                                        <strong>{item.name}</strong>
                                    </p>
                                    <p>Price: ${item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Total: ${item.total_price}</p>
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
