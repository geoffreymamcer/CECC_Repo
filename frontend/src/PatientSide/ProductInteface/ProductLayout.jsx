import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
// ...existing static placeholder import removed; we'll fetch from backend
import ProductCard from "./ProductCard";
import SearchFilterBar from "./SearchFilterBar";
import instance from "../../api/axios";

const PRODUCT_LOADING_DURATION = 500;

const ProductInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "All",
    ...new Set(filteredProducts.map((p) => p.category)),
  ];

  // Helper: map backend product document to UI-friendly product shape
  const mapBackendProduct = (doc) => ({
    id: doc._id,
    name: doc.productName || "Unnamed product",
    brand: doc.brand || "",
    description: doc.productDescription || "",
    price: typeof doc.productPrice === "number" ? doc.productPrice : 0,
    rating: typeof doc.rating === "number" ? doc.rating : 0,
    reviewCount: typeof doc.reviewCount === "number" ? doc.reviewCount : 0,
    category: doc.productType || "General",
    image: doc.productImage || "/CECC.png",
    features: doc.features || [],
    specifications: doc.specifications || [],
  });

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await instance.get("/inventory");

        const docs =
          res.data && res.data.products ? res.data.products : res.data;

        const mapped = Array.isArray(docs) ? docs.map(mapBackendProduct) : [];
        setFilteredProducts(mapped);

        // Apply loading duration only on initial load
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
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Error fetching products"
        );
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Apply client-side search/filter/sort on fetched products
    let filtered = [...filteredProducts];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, sortBy]);

  const toggleProductDetails = (id) =>
    setExpandedProduct((current) => (current === id ? null : id));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {loading && isInitialLoad ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-dark-red"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading products...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-deep-red mb-2">
              Our Eye Care Products
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Browse our premium selection of eye care products recommended by
              our specialists.
            </p>
          </div>

          {/* Search & Filters */}
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
          />

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isExpanded={expandedProduct === product.id}
                  onToggleDetails={() => toggleProductDetails(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Eye className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-medium text-gray-500">
                No products found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductInterface;
