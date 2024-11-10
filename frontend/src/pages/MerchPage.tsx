import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import CatalogProduct from "../components/CatalogProduct";
import SortDropdown from "../components/SortDropdown";
import axios from "axios";

interface MerchPageProps {
  searchQuery: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

const MerchPage: React.FC<MerchPageProps> = ({ searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [sortBy, setSortBy] = useState<string>("name");
  const [order, setOrder] = useState<string>("asc");
  const [selectedOption, setSelectedOption] = useState<string>("Product Name");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ products: Product[] }>(
        `http://127.0.0.1:5000/catalog/products?sort_by=${sortBy}&order=${order}&name=${searchQuery}`
      );
      const transformedProducts = response.data.products.map((product) => ({
        ...product,
        id: product.id || product.id,
      }));
      setProducts(transformedProducts);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching products:", err.message || err);
      setError("Failed to load products. Please try again.");
      setLoading(false);
    }
  }, [sortBy, order, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortChange = useCallback((sortBy: string, order: string, label: string) => {
    setSortBy(sortBy);
    setOrder(order);
    setSelectedOption(label);
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error)
    return (
      <div>
        <p>{error}</p>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );

  return (
    <div className="flex mt-4">
      <div className="border-r border-r-camel">
        <Sidebar />
      </div>

      <div className="flex-grow ml-[45px] mr-[200px]">
        <div className="text-2xl">Merch</div>

        <div className="flex justify-between items-center py-5">
          <div>Showing {products.length} products</div>
          <div>
            <SortDropdown
              onSortChange={handleSortChange}
              selectedOption={selectedOption}
            />
          </div>
        </div>

        <div
          className="grid gap-3 pt-0"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 0.3fr))" }}
        >
          {products.map((product) => (
            <div className="p-0 pb-8" key={product.id}>
              <CatalogProduct
                name={product.name}
                cost={`$${product.price.toFixed(2)}`}
                image={product.image_url}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchPage;