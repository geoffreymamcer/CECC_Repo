// InventorySystem.jsx
import React, { useState, useEffect } from "react";
import { Search, Plus, Eye } from "lucide-react";
import StatsOverview from "./StatsOverview";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import InventoryModal from "./InventoryModal";
import AddProductModal from "./AddProductModal";
import axios from "axios";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalValue: 0,
  });

  // Add debouncing for search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    validateStatus: function (status) {
      return status >= 200 && status < 500; // Resolve only if the status code is less than 500
    },
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/inventory", {
        params: {
          page,
          limit: 12, // Items per page
          search: debouncedSearchQuery,
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/inventory/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Fetch products when page or search query changes
  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearchQuery]);

  // Fetch stats periodically
  useEffect(() => {
    fetchStats();
    // Refresh stats every 5 minutes
    const statsInterval = setInterval(fetchStats, 300000);
    return () => clearInterval(statsInterval);
  }, []);

  // Open modal
  const openModal = (action, product) => {
    setModalAction(action);
    setCurrentProduct(product);
    setQuantity(1);
    setPrice(product.productPrice.toFixed(2));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setCurrentProduct(null);
  };

  const handleAddProduct = async (productData) => {
    try {
      // Validate all required fields are present
      const requiredFields = [
        "productName",
        "productType",
        "productDescription",
        "productPrice",
        "availableStocks",
      ];

      const missingFields = requiredFields.filter(
        (field) => !productData[field]
      );
      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      const newProduct = {
        productName: productData.productName,
        productType: productData.productType,
        productDescription: productData.productDescription,
        productPrice: Number(productData.productPrice),
        availableStocks: Number(productData.availableStocks),
        stocksStatus: productData.stocksStatus || "in stock",
        productImage: productData.productImage || "",
      };

      console.log("Sending new product data:", newProduct);
      const response = await api.post("/inventory", newProduct);
      if (response.status === 201) {
        console.log("Product added successfully:", response.data);
        setProducts((prev) => [...prev, response.data]);
        fetchStats(); // Refresh stats
      } else {
        console.error("Failed to add product:", response.data);
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error(
        "Failed to add product:",
        error.response?.data || error.message
      );
      alert("Error adding product. Please check the console for details.");
    }
  };

  // Confirm modal actions
  const handleConfirm = async () => {
    try {
      if (modalAction === "delete") {
        await api.delete(`/inventory/${currentProduct._id}`);
        setProducts(products.filter((p) => p._id !== currentProduct._id));
      } else {
        const updatedData = {
          availableStocks:
            modalAction === "add"
              ? currentProduct.availableStocks + quantity
              : Math.max(0, currentProduct.availableStocks - quantity),
          productPrice: parseFloat(price),
        };
        const response = await api.put(
          `/inventory/${currentProduct._id}`,
          updatedData
        );
        setProducts(
          products.map((p) =>
            p._id === currentProduct._id ? response.data : p
          )
        );
      }
      fetchStats(); // Refresh stats
      closeModal();
    } catch (error) {
      console.error(`Failed to ${modalAction} product:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-auto">
      {/* Stats */}
      <StatsOverview stats={stats} />

      {/* Search and Add */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-deep-red"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="px-4 py-2 bg-deep-red text-white rounded-lg hover:bg-dark-red transition-colors flex items-center"
          onClick={() => setIsAddProductModalOpen(true)}
        >
          <Plus size={18} className="mr-1" />
          New Product
        </button>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-red"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAction={openModal}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Eye className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-medium text-gray-500">
                No products found
              </h3>
              <p className="text-gray-400">Try adjusting your search query</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <InventoryModal
          action={modalAction}
          product={currentProduct}
          quantity={quantity}
          setQuantity={setQuantity}
          price={price}
          setPrice={setPrice}
          onClose={closeModal}
          onConfirm={handleConfirm}
        />
      )}

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default Inventory;
