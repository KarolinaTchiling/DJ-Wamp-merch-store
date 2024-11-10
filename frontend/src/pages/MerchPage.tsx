import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CatalogProduct from "../components/CatalogProduct";
import SortDropdown from "../components/SortDropdown";
import axios from "axios";

interface MerchPageProps {
  searchQuery: string; // Search query from parent
}

interface Product {
  _id: string;
  name: string;
  price: number; // Updated to match API property
  image_url: string;
}

const MerchPage: React.FC<MerchPageProps> = ({ searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [sortBy, setSortBy] = useState<string>("name"); // Default sort field
  const [order, setOrder] = useState<string>("asc"); // Default sort order

  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ products: Product[] }>(
        `http://127.0.0.1:5000/catalog/products?sort_by=${sortBy}&order=${order}&name=${searchQuery}`
      );
      setProducts(response.data.products);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortBy, order, searchQuery]); // Re-fetch products when sorting changes

  const handleSortChange = (sortBy: string, order: string) => {
    setSortBy(sortBy);
    setOrder(order);
  };



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
        <div className="text-2xl">Merch</div>

        <div className="flex justify-between items-center py-5">
          {/* Heading section */}
          <div>Showing {products.length} products</div>
          <div>
            <SortDropdown onSortChange={handleSortChange}/>
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