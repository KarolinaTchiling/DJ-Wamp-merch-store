import React, { useEffect, useState, useCallback } from "react";
import SidebarTest from "../components/SidebarTest";
import CatalogProduct from "../components/CatalogProduct";
import Button from '../components/Button';
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

const MerchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [selectedAlbums, setSelectedAlbums] = useState<Record<string, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    const selectedAlbumKeys = Object.keys(selectedAlbums).filter((key) => selectedAlbums[key]);
    const selectedCategoryKeys = Object.keys(selectedCategories).filter((key) => selectedCategories[key]);

    const queryParams = [
      selectedAlbumKeys.length > 0 ? `album=${selectedAlbumKeys.join(",")}` : "",
      selectedCategoryKeys.length > 0 ? `category=${selectedCategoryKeys.join(",")}` : "",
    ]
      .filter((param) => param !== "")
      .join("&");

    try {
      const response = await axios.get<{ products: Product[] }>(
        `http://127.0.0.1:5000/catalog/products${queryParams ? `?${queryParams}` : ""}`
      );
      setProducts(response.data.products);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
      setLoading(false);
    }
  }, [selectedAlbums, selectedCategories]); // Include both dependencies

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAlbumChange = (album: string) => {
    setSelectedAlbums((prev) => ({
      ...prev,
      [album]: !prev[album],
    }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const clearFilters = () => {
    setSelectedAlbums({});
    setSelectedCategories({});
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex mt-4">
      {/* Sidebar section */}
      <div className="border-r border-r-camel">
        <SidebarTest
          selectedAlbums={selectedAlbums}
          selectedCategories={selectedCategories}
          onAlbumChange={handleAlbumChange}
          onCategoryChange={handleCategoryChange} // Ensure this matches the expected prop name
        />
        <Button onClick={clearFilters} className ="text-sm mt-2 ml-[55px]">Clear Filters</Button>
      </div>

      {/* Main section */}
      <div className="flex-grow ml-[45px] mr-[200px]">
        <div className="text-2xl">Merch Page</div>

        <div className="flex justify-between items-center py-5">
          <div>Showing {products.length} products</div>
        </div>

        {/* Product section */}
        <div
          className="grid gap-3 pt-0"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 0.3fr))",
          }}
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
