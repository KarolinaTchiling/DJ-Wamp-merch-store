import React, { memo } from "react";

interface SidebarTestProps {
  selectedAlbums: Record<string, boolean>;
  selectedCategories: Record<string, boolean>; // Updated to camelCase
  onAlbumChange: (album: string) => void;
  onCategoryChange: (category: string) => void; // Updated parameter name
}

const SidebarTest: React.FC<SidebarTestProps> = memo(
  ({ selectedAlbums, selectedCategories, onAlbumChange, onCategoryChange }) => {
    const albums = ["Stares from Above", "Heavens", "Angels", "Cloud Flare"];
    const categories = ["Apparel", "Music", "Accessories", "Pre-orders", "Concert"]; // Renamed from `types`

    // console.log("onCategoryChange:", onCategoryChange);
    return (
      <>
        {/* Albums Section */}
        <div className="w-[280px] text-black pl-[60px] text-sm">
          <h3 className="font-bold">Albums</h3>
          {albums.map((album) => (
            <label key={album} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedAlbums[album] || false}
                onChange={() => onAlbumChange(album)}
              />
              <span>{album}</span>
            </label>
          ))}
        </div>

        {/* Categories Section */}
        <div className="w-[280px] text-black pl-[60px] text-sm mt-4">
          <h3 className="font-bold">Category</h3>
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedCategories?.[category] || false} 
                onChange={() => onCategoryChange(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </>
    );
  }
);

export default SidebarTest;
