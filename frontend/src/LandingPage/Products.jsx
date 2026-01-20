// src/components/LandingPage/Products.jsx

import React, { useEffect, useState } from "react"; // 👈 1. Import hooks
import { FadeInWhenVisible } from "./FadeInWhenVisible";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Removed the static PRODUCTS array

export const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // 👈 3. State for products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/inventory/featured"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <section id="products" className="py-24 bg-white relative overflow-hidden">
      {/* ... Background divs ... */}
      <div className="absolute inset-0 bg-[radial-gradient(#7F0000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-100 rounded-full blur-[100px] opacity-30 -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-screen-xl mx-auto px-4 relative z-10">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            {/* ... Header Text ... */}
            <h2 className="text-deep-red font-semibold text-sm tracking-widest uppercase mb-2">
              Optical Boutique
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
              Premium Eyewear & Essentials
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Explore our curated selection of designer frames and advanced eye
              care products designed for your comfort and style.
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 👈 5. Map over fetched products */}
          {loading ? (
            <div className="col-span-3 text-center text-gray-400">
              Loading collection...
            </div>
          ) : (
            products.map((product, index) => (
              <FadeInWhenVisible
                key={product._id} // Use MongoDB _id
                delay={index * 100}
                className="h-full"
              >
                <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col relative">
                  <div className="relative h-64 overflow-hidden bg-slate-50 shrink-0">
                    <div className="absolute inset-0 bg-deep-red/0 group-hover:bg-deep-red/5 transition-colors duration-300 z-10 pointer-events-none"></div>

                    <img
                      src={
                        product.productImage ||
                        "https://via.placeholder.com/400"
                      } // Fallback image
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-deep-red shadow-sm border border-red-50">
                      {product.productType} {/* Display Type */}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4 gap-4 min-h-[3.5rem]">
                      <h4 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-deep-red transition-colors">
                        {product.productName}
                      </h4>
                      <span className="text-white font-bold text-sm bg-gradient-to-r from-deep-red to-dark-red px-3 py-1 rounded-full shadow-sm shrink-0 whitespace-nowrap">
                        ₱{product.productPrice.toLocaleString()}{" "}
                        {/* Format Price */}
                      </span>
                    </div>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                      {product.productDescription}
                    </p>

                    <div className="mt-auto">
                      <button
                        onClick={handleClick}
                        className="w-full py-3 border border-red-100 text-deep-red font-bold rounded-xl hover:bg-gradient-to-r hover:from-deep-red hover:to-dark-red hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                      >
                        View Details
                        <svg
                          className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))
          )}
        </div>

        {/* ... Rest of the component (Footer CTA) ... */}
        <FadeInWhenVisible delay={400}>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-red-50 text-deep-red rounded-full font-medium text-sm border border-red-100 shadow-sm hover:shadow-md hover:bg-red-100 transition-all cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Visit our clinic to try on frames and get professional
              measurements.
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};
