import React from 'react';

interface CatalogProduct {
    name: string;
    cost: string;
    image: string;
  }

const CatalogProduct: React.FC<CatalogProduct>= ({ name, cost, image }) => {    
    return (
        <div className="w-[250px] mt-8">
            <img src={image} alt={name} className="w-full h-[14vw] object-cover"  />

            <div className="mt-2 text-base">
                {name}
            </div>

            <div className="text-base">
                {cost}
            </div>

            <button className="border border-camel w-full mt-1 border-black bg-transparent text-black text-base py-0.5 px-4 hover:bg-camel">
                    Add to Cart
            </button>
        </div>
    );
}

export default CatalogProduct;