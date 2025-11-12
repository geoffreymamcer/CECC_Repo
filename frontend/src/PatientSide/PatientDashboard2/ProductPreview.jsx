import React, { useEffect, useState } from "react";
import instance from "../../api/axios"; // Adjust path if necessary
// --- 1. Import the custom hook for navigation ---
import { useDashboardNav } from "./DashboardLayout";

const ProductPreview = () => {
  // --- 2. Get the navigation setter function from the context ---
  const { setActiveNav } = useDashboardNav();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mulberry32 = (a) => () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const seededShuffle = (arr, seed) => {
    const a = arr.slice();
    const rand = mulberry32(seed);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    let mounted = true;

    const fetchAndPick = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await instance.get("/inventory");
        const docs = res.data?.products || res.data;

        if (!Array.isArray(docs) || docs.length === 0) {
          throw new Error("No products available");
        }

        const today = new Date();
        const seed =
          today.getFullYear() * 10000 +
          (today.getMonth() + 1) * 100 +
          today.getDate();
        const shuffled = seededShuffle(docs, seed);

        const picked = shuffled.slice(0, 4).map((d) => ({
          name: d.productName || "Unnamed product",
          description: d.productDescription || "",
          status: d.stocksStatus || "in stock",
          price: d.productPrice ? `₱${d.productPrice.toFixed(2)}` : "₱0.00",
          statusColor:
            d.stocksStatus === "in stock"
              ? "green"
              : d.stocksStatus === "low"
              ? "yellow"
              : "red",
          image:
            d.productImage ||
            `https://via.placeholder.com/150x100?text=${d.productName.replace(
              /\s/g,
              "+"
            )}`,
        }));

        if (mounted) setProducts(picked);
      } catch (err) {
        console.error("ProductPreview fetch error:", err);
        if (mounted)
          setError(
            err.response?.data?.message ||
              err.message ||
              "Error fetching products"
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAndPick();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Recommended Products
        </h3>
        {/* --- 3. Changed from an `<a>` tag to a `<button>` --- */}
        <button
          // --- 4. Added the onClick handler to navigate to the products page ---
          onClick={() => setActiveNav("products")}
          className="text-sm text-dark-red hover:underline transition-colors"
        >
          View all
        </button>
      </div>

      {/* --- RENDER LOGIC REMAINS UNCHANGED --- */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-40"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-10 text-red-500">{error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No products to recommend at this time.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-gray-100 h-40 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium truncate">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 bg-${product.statusColor}-100 text-${product.statusColor}-800 rounded`}
                  >
                    {product.status}
                  </span>
                  <span className="font-medium">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPreview;
