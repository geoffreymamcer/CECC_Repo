import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductPreview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simple seeded RNG (mulberry32) using today's date as seed so selection changes daily
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
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Use relative path so frontend proxy (if present) forwards to backend
        const res = await axios.get("/api/inventory", { headers });

        const docs =
          res.data && res.data.products ? res.data.products : res.data;

        if (!Array.isArray(docs) || docs.length === 0) {
          throw new Error("No products available");
        }

        // Seed derived from today's date (YYYYMMDD)
        const today = new Date();
        const seed =
          today.getFullYear() * 10000 +
          (today.getMonth() + 1) * 100 +
          today.getDate();

        const shuffled = seededShuffle(docs, seed);

        // Pick up to 4 products
        const picked = shuffled
          .slice(0, Math.min(4, shuffled.length))
          .map((d) => ({
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
              "https://via.placeholder.com/150x100?text=Product",
          }));

        if (mounted) setProducts(picked);
      } catch (err) {
        console.error("ProductPreview fetch error:", err);
        if (mounted)
          setError(
            err?.response?.data?.message ||
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

  const placeholders = [
    {
      name: "Blue Light Glasses",
      description: "Anti-reflective coating",
      status: "In stock",
      price: "₱129.99",
      statusColor: "green",
      image: "https://via.placeholder.com/150x100?text=Blue+Light+Glasses",
    },
    {
      name: "Contact Lens Solution",
      description: "Multi-purpose 10oz",
      status: "In stock",
      price: "₱14.99",
      statusColor: "green",
      image: "https://via.placeholder.com/150x100?text=Contact+Lens+Solution",
    },
    {
      name: "Progressive Lenses",
      description: "Premium package",
      status: "Backordered",
      price: "₱349.99",
      statusColor: "yellow",
      image: "https://via.placeholder.com/150x100?text=Progressive+Lenses",
    },
    {
      name: "Eye Drops",
      description: "For dry eyes relief",
      status: "Out of stock",
      price: "₱8.99",
      statusColor: "red",
      image: "https://via.placeholder.com/150x100?text=Eye+Drops",
    },
  ];

  const display =
    !loading && !error && products.length > 0 ? products : placeholders;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Recommended Products
        </h3>
        <a
          href="#"
          className="text-sm text-dark-red hover:underline transition-colors"
        >
          View all
        </a>
      </div>

      {loading ? (
        <div>Loading recommendations...</div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {display.map((product, index) => (
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
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-2">
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
    </div>
  );
};

export default ProductPreview;
