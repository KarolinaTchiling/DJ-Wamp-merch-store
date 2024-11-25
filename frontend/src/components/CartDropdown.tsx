import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCentralCart } from '../cart/centralCart'; 
import CartIcon from './CartIcon';
import CartItemDisplay from './CartDropdownItem';

const CartDropdown: React.FC = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [cartCount, setCartCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const { handleGetCart, handleCartTotal, handleCartCount } = useCentralCart();


    // Fetch cart items and total
    const fetchCartData = async () => {
        setLoading(true);
        try {
            const [items, total, count] = await Promise.all([
                handleGetCart().catch(() => []), // Fallback to empty array if it fails
                handleCartTotal().catch(() => 0), // Fallback to 0 if it fails
                handleCartCount().catch(() => 0), // Fallback to 0 if it fails
            ]);
    
            setCartItems(items);
            setTotalPrice(total);
            setCartCount(count);
        } catch (error: any) {
            console.error("Failed to fetch cart data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = async () => {
        if (!isDropdownOpen) {
            await fetchCartData(); // Refresh cart items when dropdown is opened
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

    useEffect(() => {
        fetchCartData();
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Cart Icon */}
            <CartIcon 
                count={cartCount} 
                onClick={toggleDropdown}
                className={`transition-transform ${isDropdownOpen ? 'scale-110' : ''}`} 
             />
            

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full -right-0.5 mt-2 bg-cream text-black border border-camel shadow-lg w-[350px] z-50">
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
                                        <CartItemDisplay item={item} closeDropdown={closeDropdown} onUpdate={fetchCartData} />
                                    </li>
                                ))}
                                <li 
                                    className="px-5 pr-8 py-2 hover:text-white border-camel hover:font-medium hover:bg-camel flex justify-between items-center"
                                    onClick={closeDropdown} 
                                >
                                    <span className="inline font-bold">Cart Total: &nbsp;$ {totalPrice.toFixed(2)}</span>
                                    <Link to="/cart" className="text-right inline">Go to Cart &nbsp;&nbsp; →</Link>
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


