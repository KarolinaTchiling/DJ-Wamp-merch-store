import React, { useEffect, useState } from 'react';
import { CartItem, addToCart, getCart } from '../cart/CartUtility'; 
import QuantityControl from '../components/QuantityControl.tsx';

interface CartDropdownItemProps {
    item: CartItem;
}

const CartDropdownItem: React.FC<CartDropdownItemProps> = ({ item }) => {
    const [selectedQuantity, setSelectedQuantity] = useState<number>(item.quantity);
    return (
        <div className="flex px-3 py-3 border-b border-camel">
            <div>
                <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-[100px] h-[100px] mr-2"
                />
            </div>

            <div className="flex flex-1 flex-col">
                <span className="font-bold">{item.name}</span>

                <div className="ml-5 flex flex-col text-sm">
                        <QuantityControl
                            quantity={selectedQuantity}
                            setQuantity={setSelectedQuantity}
                        />

                        <div className="mr-3 flex justify-between flex-row">
                            <div>Price: </div>
                            <div>${item.price.toFixed(2)}</div>
                        </div>
                    </div>


                </div>
            </div>
   
    );
};

export default CartDropdownItem;