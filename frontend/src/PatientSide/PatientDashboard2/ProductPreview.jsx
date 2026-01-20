import React, { useEffect, useState } from "react";
import { useDashboardNav } from "./DashboardLayout";
import { FiShoppingBag, FiInfo } from "react-icons/fi";
import useProductRecommendations from "../../hooks/useProductRecommendations";

const ProductPreview = () => {
  const { setActiveNav } = useDashboardNav();
  const { products, loading, error, recommendationReason } =
    useProductRecommendations();
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    if (products && products.length > 0) {
      // Pick one at random to show to keep the "Featured" feel,
      // but ensure it rotates on refresh or we could implement a timer to rotate them.
      // For now, static random per load.
      setCurrentProduct(products[Math.floor(Math.random() * products.length)]);
    }
  }, [products]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-3xl shadow-lg p-6 h-48 animate-pulse text-white relative overflow-hidden">
        <div className="flex justify-between mb-4">
          <div className="h-4 w-20 bg-gray-700 rounded"></div>
          <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 bg-gray-700 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="mt-4 h-8 w-full bg-gray-700 rounded-xl"></div>
      </div>
    );
  }

  // Graceful degradation on error - just return null or empty to minimize disruption
  if (error || !currentProduct) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-black rounded-3xl shadow-lg p-6 text-white relative overflow-hidden border border-white/5">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
              Recommended
            </h3>
            {recommendationReason && (
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <FiInfo className="inline" />{" "}
                {recommendationReason.length > 30
                  ? recommendationReason.substring(0, 30) + "..."
                  : recommendationReason}
              </span>
            )}
          </div>
          <FiShoppingBag className="text-white/50" />
        </div>

        <div className="flex gap-4 items-center mt-3">
          {currentProduct.productImage ? (
            <img
              src={currentProduct.productImage}
              alt={currentProduct.productName}
              className="w-16 h-16 rounded-lg object-cover bg-white shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center text-xs text-white/50 shrink-0">
              No Img
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold truncate text-lg">
              {currentProduct.productName}
            </h4>
            <p className="text-white/60 text-xs truncate">
              {currentProduct.productType}
            </p>
            <p className="text-[#ff6b6b] font-bold mt-1">
              ₱{currentProduct.productPrice?.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveNav("products")}
          className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 hover:scale-[1.02] active:scale-95 backdrop-blur rounded-xl text-xs font-bold transition-all duration-300 border border-white/10"
        >
          View Recommendations
        </button>
      </div>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
    </div>
  );
};

export default ProductPreview;
