import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CatalogProduct from "../components/CatalogProduct";
import SortDropdown from "../components/SortDropdown";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  price: number; // Updated to match API property
  image_url: string;
}

const MerchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<{ products: Product[] }>(
          "http://127.0.0.1:5000/catalog/products" // Backend API URL
        );
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex mt-4">
      {/* Sidebar section */}
      <div className="border-r border-r-camel">
        <Sidebar />
      </div>

      {/* Main section */}
      <div className="flex-grow ml-[45px] mr-[200px]">
        <div className="text-2xl">Page Name</div>

        <div className="flex justify-between items-center py-5">
          {/* Heading section */}
          <div>Showing {products.length} products</div>
          <div>
            <SortDropdown />
          </div>
        </div>

        {/* Product section */}
        <div
          className="grid gap-3 pt-0"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
        >
          {products.map((product) => (
            <div className="p-0 pb-8" key={product._id}>
              <CatalogProduct
                name={product.name}
                cost={`$${product.price.toFixed(2)}`} // Format price
                image={product.image_url} // Pass image URL
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchPage;