import cart from '../assets/cart.svg';
import { CartItem, addToCart, getCart } from '../cart/CartUtility'; 
import CartItemDisplay from './CartDropdownItem'; // Import the new component
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CartDropdown: React.FC = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Retrieve cart items when the component mounts
    useEffect(() => {
        const items = getCart();
        setCartItems(items);
    }, []);

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const closeDropdown = () => setDropdownOpen(false);

    return (
        <div className="relative">
            {/* Cart Icon */}
            <img
                src={cart}
                alt="Cart"
                className={`cursor-pointer transition-transform ${
                    isDropdownOpen ? 'scale-110' : ''
                }`}
                onClick={toggleDropdown}
            />

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full -right-0.5 mt-2 bg-cream text-black border border-camel shadow-md w-[350px] z-50">
                    <ul className="flex flex-col">
                        {cartItems.length === 0 ? (
                            // Empty cart dropdown
                            <>
                                <li className="px-3 py-1 border-b border-camel">
                                    Your cart is empty :(
                                </li>
                                <li 
                                    className="px-3 py-1 hover:text-white hover:font-medium hover:bg-camel"
                                    onClick={closeDropdown} 
                                >
                                    <Link to="/" className="block w-full h-full">Continue Shopping</Link>
                                </li>
                            </>
                        ) : (
                            // Cart items dropdown
                            <>
                                {cartItems.map((item) => (
                                   <li key={item.product_id}>
                                        <CartItemDisplay item={item} />
                                    </li>
                                ))}
                                <li 
                                    className="px-3 py-1 hover:text-white border-camel hover:font-medium hover:bg-camel"
                                    onClick={closeDropdown} 
                                >
                                    <Link to="/cart" className="block w-full h-full">Go to cart</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};


export default CartDropdown;


