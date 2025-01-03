import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface Metadata {
  categories: string[];
  albums: string[];
}

interface MetadataContextType {
  metadata: Metadata | null;
  validProductIds: Set<string>;
  refreshMetadata: () => void;
  refreshValidProductIds: () => void;
}

const MetadataContext = createContext<MetadataContextType | null>(null);

export const MetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [validProductIds, setValidProductIds] = useState<Set<string>>(new Set());

  // Fetch metadata function
  const fetchMetadata = async () => {
    try {
      const response = await axios.get<{ categories: string[]; albums: string[] }>(
        `${import.meta.env.VITE_BASE_URL}/catalog/metadata`
      );
      setMetadata(response.data);
    } catch (error) {
      console.error("Failed to load metadata:", error);
    }
  };

    // Fetch valid product IDs function
    const fetchValidProductIds = async () => {
      try {
          const response = await axios.get<{ products: { id: string }[] }>(
              `${import.meta.env.VITE_BASE_URL}/catalog/products`
          );
          const validProductIdsSet = new Set<string>(response.data.products.map((product) => product.id));
          console.log("fetching valid products");
          setValidProductIds(validProductIdsSet);
      } catch (error: any) {
          console.error("Failed to fetch valid product IDs:", error.message);
      }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchMetadata();
    fetchValidProductIds();
  }, []);

  // Expose the fetch function as a "refresh" action
  const refreshMetadata = () => {
    fetchMetadata();
  };

  const refreshValidProductIds = () => {
    fetchValidProductIds();
  };

  return (
    <MetadataContext.Provider
      value={{
        metadata,
        validProductIds,
        refreshMetadata,
        refreshValidProductIds,
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};