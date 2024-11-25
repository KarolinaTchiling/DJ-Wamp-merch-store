import React, { useEffect, useState } from 'react';
import { useCentralCart } from '../cart/centralCart';
import QuantityControl from '../components/QuantityControl.tsx';
import { Link } from 'react-router-dom';
import Button from '../components/Button.tsx';
import { Product, CartItem } from "../types.ts";

interface CartDropdownItemProps {
    item: CartItem; 
    closeDropdown: () => void;
    onUpdate: () => void;
}

const CartDropdownItem: React.FC<CartDropdownItemProps> = ({ item, closeDropdown, onUpdate }) => {
    const [selectedQuantity, setSelectedQuantity] = useState<number>(item.quantity);
    const [product, setProduct] = useState<any | null>(null); 
    const { handleUpdateCart } = useCentralCart(); 
    

    // Necessary fetch of the full product in order for it to be saved as a state and be sent when clicked on the product in the cart
    useEffect(() => {
        const fetchFullProduct = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/catalog/products?name=${encodeURIComponent(item.name)}`
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
    const handleUpdate = async () => {
        console.log(`Updating ${selectedQuantity} of ${item.name} in the cart.`);
        try {
            await handleUpdateCart(item, selectedQuantity); // Use centralized cart update function
            onUpdate(); // Trigger parent component update
        } catch (error: any) {
            console.error('Failed to update cart:', error.message);
        }
    };

    if (!product) {
        return <div>Loading...</div>; // Show a loading indicator until data is fetched
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
                            quantity={selectedQuantity}
                            setQuantity={setSelectedQuantity}
                        />

                        <div className="mr-6 flex items-center justify-between flex-row">
                            <div>Price: ${item.price.toFixed(2)}</div>
                            <div>
                                <Button onClick={handleUpdate} className="mt-0 px-1 py-0.5 ">Update</Button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
   
    );
};

export default CartDropdownItem;