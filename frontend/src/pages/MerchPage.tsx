import React from 'react';
import Sidebar from '../components/Sidebar';
import CatalogProduct from '../components/CatalogProduct';

const MerchPage: React.FC = () => {

  const products = [
    { id: 1, name: 'Product 1', cost: '$25', image: 'butterfly.jpg' },
    { id: 2, name: 'Product 2', cost: '$35', image: 'butterfly.jpg' },
    { id: 3, name: 'Product 3', cost: '$45', image: 'butterfly.jpg' },
    { id: 1, name: 'Product 1', cost: '$25', image: 'butterfly.jpg' },
    { id: 2, name: 'Product 2', cost: '$35', image: 'butterfly.jpg' },
    { id: 3, name: 'Product 3', cost: '$45', image: 'butterfly.jpg' },
    { id: 1, name: 'Product 1', cost: '$25', image: 'butterfly.jpg' },
    { id: 2, name: 'Product 2', cost: '$35', image: 'butterfly.jpg' },
    { id: 3, name: 'Product 3', cost: '$45', image: 'butterfly.jpg' },
    // Add more products here
  ];

  return (
    <div className="flex mt-4">
      <Sidebar />
      <div className="flex-grow ml-[45px] mr-[200px]">

        <div className="text-2xl">
          Page Name
        </div>

        <div className="flex justify-between pt-5">
          {/* Heading section */}
          <div>
            Showing pageMin - pageMax of total products
          </div>
          <div>
            Sort by: Price(low to high)
          </div>
        </div>

        {/* Product section */}
        <div className="grid grid-cols-4 gap-8 pt-2">
          {products.map((product) => (
            <CatalogProduct
              key={product.id}
              name={product.name}
              cost={product.cost}
              image={product.image}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default MerchPage;