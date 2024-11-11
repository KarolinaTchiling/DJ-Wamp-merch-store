import React from 'react';
import { useLocation } from 'react-router-dom';
import { Product } from '../types'; 


const DetailPage: React.FC = () => {

    const location = useLocation();
    const product = location.state as Product;



    return(
        <div>
            <h1>{product.name}</h1>
            <p>Price: {product.price}</p>
            <img src={product.image_url} alt={product.name} />
        </div>
    );
};

export default DetailPage;

