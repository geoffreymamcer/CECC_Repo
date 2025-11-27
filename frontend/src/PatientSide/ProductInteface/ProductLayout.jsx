import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import ProductCard from "./ProductCard";
import SearchFilterBar from "./SearchFilterBar";
import ProductDetailsModal from "./ProductDetailsModal"; // New component
import instance from "../../api/axios";

const PRODUCT_LOADING_DURATION = 800;

const ProductInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];

  const mapBackendProduct = (doc) => ({
    id: doc._id,
    name: doc.productName || "Unnamed product",
    brand: doc.brand || "Generic",
    description: doc.productDescription || "No description available.",
    price: typeof doc.productPrice === "number" ? doc.productPrice : 0,
    rating: typeof doc.rating === "number" ? doc.rating : 0,
    reviewCount: typeof doc.reviewCount === "number" ? doc.reviewCount : 0,
    category: doc.productType || "General",
    image: doc.productImage || "/CECC.png",
    features: doc.features || [],
    specifications: doc.specifications || [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await instance.get("/inventory");
        const docs =
          res.data && res.data.products ? res.data.products : res.data;
        const mapped = Array.isArray(docs) ? docs.map(mapBackendProduct) : [];
        setAllProducts(mapped);
        setFilteredProducts(mapped);

        if (isInitialLoad) {
          const timer = setTimeout(() => {
            setLoading(false);
            setIsInitialLoad(false);
          }, PRODUCT_LOADING_DURATION);
          return () => clearTimeout(timer);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err?.response?.data?.message || "Error fetching products");
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, sortBy, allProducts]);

  return (
    <div className="h-full overflow-y-auto bg-gray-50/50 font-sans bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      {loading && isInitialLoad ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep-red mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">
              Loading collection...
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 mt-4 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Premium Eye Care
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover our curated selection of frames, lenses, and care
              products. Find the perfect match for your vision and style.
            </p>
          </div>

          {/* Floating Filter Bar */}
          <div
            className="sticky top-4 z-30 mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <SearchFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
            />
          </div>

          {/* Product Grid */}
          {error ? (
            <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="p-6 bg-gray-50 rounded-full mb-4">
                <Eye className="text-gray-300" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                We couldn't find matches for your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-6 text-deep-red font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductInterface;
