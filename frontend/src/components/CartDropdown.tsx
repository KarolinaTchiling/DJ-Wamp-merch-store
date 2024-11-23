import cart from '../assets/cart.svg';
import { CartItem, getCart } from '../cart/CartUtility'; 
import CartItemDisplay from './CartDropdownItem'; // Import the new component
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CartDropdown: React.FC = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Retrieve cart items when the component mounts
    useEffect(() => {
        const items = getCart();
        setCartItems(items);
    }, []);

    const toggleDropdown = () => {
        if (!isDropdownOpen) {
            // If opening the dropdown, refresh the cart items
            const updatedItems = getCart();
            setCartItems(updatedItems);
        }
        setDropdownOpen(!isDropdownOpen);
    };
    const closeDropdown = () => setDropdownOpen(false);

    // Add event listener to detect outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target as Node) // Click is outside the dropdown
            ) {
                closeDropdown();
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
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
                                        <CartItemDisplay item={item} closeDropdown={closeDropdown}/>
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


