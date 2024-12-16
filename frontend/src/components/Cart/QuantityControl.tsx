import React from 'react';

interface QuantityControlProps {
    quantity: number;
    setQuantity: (value: number) => void;
    hideLabel?: boolean;
    disabled?: boolean;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, setQuantity, hideLabel, disabled }) => {
    const increment = () => {
        if (!disabled) setQuantity(quantity + 1); // Only increment if not disabled
    };

    const decrement = () => {
        if (!disabled && quantity > 1) setQuantity(quantity - 1); // Only decrement if not disabled and greater than 1
    };

    return (
        <div className="flex items-center space-x-4">
            {!hideLabel && <p>Quantity:</p>}
            <button
                onClick={decrement}
                disabled={disabled}
                className={`px-4 py-2 text-camel font-bold ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                -
            </button>
            <span>{quantity}</span>
            <button
                onClick={increment}
                disabled={disabled}
                className={`px-4 py-2 text-camel font-bold ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                +
            </button>
        </div>
    );
};

export default QuantityControl;

