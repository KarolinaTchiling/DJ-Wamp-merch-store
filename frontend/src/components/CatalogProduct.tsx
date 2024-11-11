import React from 'react';
import Button from './Button.tsx';

interface CatalogProduct {
    name: string;
    cost: string;
    image: string;
  }

  const CatalogProduct: React.FC<CatalogProduct> = ({ name, cost, image }) => {    
    return (
        <div className="">
            {/* Aspect Ratio Container */}
            <div className="relative w-full pt-[100%] overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="absolute top-0 left-0 w-full h-full object-cover"  // Ensures the image fills the container
                />
            </div>

            <div className="mt-2 text-sm">
                {name}
            </div>

            <div className="text-sm">
                {cost}
            </div>
        
            <Button className ="w-full mt-3">Add to Cart</Button>
        </div>
    );
};

export default CatalogProduct;

