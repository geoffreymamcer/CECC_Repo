import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import { useDashboardNav } from "./DashboardLayout";
import { FiShoppingBag } from "react-icons/fi";

const ProductPreview = () => {
  const { setActiveNav } = useDashboardNav();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    instance
      .get("/inventory")
      .then((res) => {
        const docs = res.data?.products || res.data || [];
        if (docs.length > 0)
          setProduct(docs[Math.floor(Math.random() * docs.length)]);
      })
      .catch(console.error);
  }, []);

  if (!product) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-black rounded-3xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
            Featured
          </h3>
          <FiShoppingBag />
        </div>

        <div className="flex gap-4 items-center">
          {product.productImage && (
            <img
              src={product.productImage}
              alt={product.productName}
              className="w-16 h-16 rounded-lg object-cover bg-white"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold truncate">{product.productName}</h4>
            <p className="text-white/60 text-xs truncate">{product.brand}</p>
            <p className="text-[#ff6b6b] font-bold mt-1">
              ₱{product.productPrice?.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveNav("products")}
          className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-xs font-bold transition-colors"
        >
          Browse Store
        </button>
      </div>
    </div>
  );
};

export default ProductPreview;
