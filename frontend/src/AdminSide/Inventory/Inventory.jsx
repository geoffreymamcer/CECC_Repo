// InventorySystem.jsx
import React, { useState, useEffect } from "react";
import { Search, Plus, Eye } from "lucide-react";
import StatsOverview from "./StatsOverview";
import ProductCard from "./ProductCard";
import InventoryModal from "./InventoryModal";
import AddProductModal from "./AddProductModal";
import instance from "../../api/axios";
import AddProductSuccessModal from "./SuccessModal";

// --- Loading Configuration (in milliseconds) ---
// Adjust this value to control the loading state duration across all environments
const INVENTORY_LOADING_DURATION = 1500; // 1.5 seconds

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
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load phase
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalValue: 0,
  });

  const [successModalData, setSuccessModalData] = useState({
    isOpen: false,
    productName: "",
    productImage: "",
  });

  // Add debouncing for search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get("/inventory", {
        params: {
          search: debouncedSearchQuery,
        },
      });
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await instance.get("/inventory/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Fetch products when page or search query changes
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchQuery]);

  // Fetch stats periodically
  useEffect(() => {
    fetchStats();
    // Refresh stats every 5 minutes
    const statsInterval = setInterval(fetchStats, 300000);
    return () => clearInterval(statsInterval);
  }, []);

  // --- Loading State Timer ---
  // Show loading spinner for configured duration, then hide it
  useEffect(() => {
    if (isInitialLoad && isLoading) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, INVENTORY_LOADING_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad, isLoading]);

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
        productCost: Number(productData.productCost),
        availableStocks: Number(productData.availableStocks),
        stocksStatus: productData.stocksStatus || "in stock",
        productImage: productData.productImage || "",
        isPrescriptionTableRequired: productData.isPrescriptionTableRequired,
        tags: productData.tags || [], // Ensure tags are included
      };

      console.log("Sending new product data:", newProduct);
      const response = await instance.post("/inventory", newProduct);
      if (response.status === 201) {
        console.log("Product added successfully:", response.data);
        setProducts((prev) => [...prev, response.data]);
        fetchStats();

        setSuccessModalData({
          isOpen: true,
          productName: response.data.productName,
          productImage: response.data.productImage,
        });
        setIsAddProductModalOpen(false);
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
        await instance.delete(`/inventory/${currentProduct._id}`);
        setProducts(products.filter((p) => p._id !== currentProduct._id));
      } else {
        const updatedData = {
          availableStocks:
            modalAction === "add"
              ? currentProduct.availableStocks + quantity
              : Math.max(0, currentProduct.availableStocks - quantity),
          productPrice: parseFloat(price),
        };
        const response = await instance.put(
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
      {isInitialLoad && isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep-red"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading inventory...
            </p>
          </div>
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

      <AddProductSuccessModal
        isOpen={successModalData.isOpen}
        onClose={() =>
          setSuccessModalData({ ...successModalData, isOpen: false })
        }
        productName={successModalData.productName}
        productImage={successModalData.productImage}
      />
    </div>
  );
};

export default Inventory;
