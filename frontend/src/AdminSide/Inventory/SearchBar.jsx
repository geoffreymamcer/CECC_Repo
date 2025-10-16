// SearchBar.jsx
import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import AddProductModal from "./AddProductModal";

const SearchBar = ({ query, setQuery, onAddProduct }) => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between">
      <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-red"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button
        className="px-4 py-2 bg-deep-red text-white rounded-lg hover:bg-dark-red transition-colors flex items-center"
        onClick={() => setIsAddProductModalOpen(true)}
      >
        <Plus size={18} className="mr-1" />
        New Product
      </button>

      {isAddProductModalOpen && (
        <AddProductModal
          isOpen={isAddProductModalOpen} // ✅ pass it
          onClose={() => setIsAddProductModalOpen(false)}
          onAddProduct={(newProduct) => {
            onAddProduct(newProduct);
            setIsAddProductModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;
