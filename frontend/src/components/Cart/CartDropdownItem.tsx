import React, { useEffect, useState } from 'react';
import { useCartContext } from '../../contexts/cart/CartContext.tsx';
import QuantityControl from './QuantityControl.tsx';
import { Link } from 'react-router-dom';
import Button from '../Button.tsx';
import { CartItem } from "../../types.ts";
import Loader from "../../components/Loader.tsx";

interface CartDropdownItemProps {
    item: CartItem; 
    closeDropdown: () => void;
}

const CartDropdownItem: React.FC<CartDropdownItemProps> = ({ item, closeDropdown}) => {
    const [product, setProduct] = useState<any | null>(null); 
    const { cartItems, handleUpdateCart, refreshCart, handleRemoveFromCart } = useCartContext(); 
    

    // Necessary fetch of the full product in order for it to be saved as a state and be sent when clicked on the product in the cart
    useEffect(() => {
        const fetchFullProduct = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/catalog/products?name=${encodeURIComponent(item.name)}`
                );
                const data = await response.json();
                setProduct(data.products[0]);
            } catch (error) {
                console.error('Error fetching full product:', error);
            }
        };

        fetchFullProduct();
    }, [item.name]);

    // Handle cart updates
    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        try {
            const cartItem = cartItems.find((item) => item.product_id === productId);
            if (!cartItem) {
                console.error("Cart item not found for product_id:", productId);
                return;
            }

            await handleUpdateCart(productId, newQuantity);
            await refreshCart(); // Refresh cart data
        } catch (error) {
            console.error("Failed to update cart:", error);
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            const cartItem = cartItems.find((item) => item.product_id === productId);
            if (!cartItem) {
                console.error("Cart item not found for product_id:", productId);
                return;
            }
            await handleRemoveFromCart(productId);
            await refreshCart(); // Refresh cart data
        } catch (error) {
            console.error("Failed to update cart:", error);
        }
    };

    if (!product) {
    return (
        <div className="flex items-center justify-center h-full">
        <Loader />
        </div>
    );
    }


    // const location = useLocation();
    // console.log('Location State:', location.state); 
    return (
        <div className="flex px-3 py-3 border-b border-camel hover:bg-beige transition-colors duration-300">
            <div>
            <Link 
                to={`/catalog/products/${encodeURIComponent(item.name)}`}
                onClick={closeDropdown}
                state={product} // Pass the item as state
            >
                <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-[100px] h-[100px] mr-2"
                />
                </Link>
            </div>

            <div className="flex flex-1 flex-col">
                <Link 
                    to={`/catalog/products/${encodeURIComponent(item.name)}`}
                    onClick={closeDropdown}
                    state={product} // Pass the item as state
                >
                    <span className="font-bold">{item.name}</span>
                </Link>
                <div className="ml-3 flex flex-col text-sm">

                     <QuantityControl
                        quantity={item.quantity}
                        setQuantity={(newQuantity) => {
                            // Ensure the quantity does not exceed the available stock
                            if (newQuantity <= product.quantity) {
                                handleQuantityChange(item.product_id, newQuantity);
                            } else {
                                handleQuantityChange(item.product_id, product.quantity); // Limit to max stock
                            }
                        }}
                        disabled={item.quantity >= product.quantity} 
                    />

                        <div className="mr-6 flex items-center justify-between flex-row">
                            <div>Price: ${item.price.toFixed(2)}</div>
                            <div>
                                <Button onClick={() => handleRemove(item.product_id)} className="mt-0 px-1 py-0.5 ">Remove</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
   
    );
};

export default CartDropdownItem;