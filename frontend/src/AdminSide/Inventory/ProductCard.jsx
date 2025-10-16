import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

const ProductCard = ({ product, onAction }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
    <div className="relative">
      <img
        src={product.productImage || "https://via.placeholder.com/300"}
        alt={product.productName}
        className="w-full h-48 object-cover"
      />
      <span
        className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
          product.stocksStatus === "low" ? "bg-yellow-500" : "bg-deep-red"
        } text-white`}
      >
        {product.stocksStatus}
      </span>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-lg truncate">{product.productName}</h3>
      <p className="text-gray-600 text-sm">{product.productDescription}</p>
      <p className="text-gray-600 text-sm">{product.productType}</p>

      <div className="flex justify-between items-center my-3">
        <span className="text-deep-red font-bold">
          ₱{product.productPrice.toFixed(2)}
        </span>
        <span className="bg-gray-100 text-xs px-2 py-1 rounded">
          SKU: {product.sku || "N/A"}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Stock: <span className="font-bold">{product.availableStocks}</span>
        </span>
        <div className="flex space-x-2">
          <button
            className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
            onClick={() => onAction("add", product)}
          >
            <Plus size={16} />
          </button>
          <button
            className="p-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200"
            onClick={() => onAction("subtract", product)}
          >
            <Minus size={16} />
          </button>
          <button
            className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
            onClick={() => onAction("delete", product)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProductCard;
