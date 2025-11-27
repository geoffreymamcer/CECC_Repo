import { X, ShoppingBag, Info, CheckCircle2 } from "lucide-react";
import StarRating from "./StarRating";

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-gray-500 hover:text-gray-900 hover:bg-white transition-all shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 bg-gray-50 relative h-64 md:h-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex gap-2 flex-wrap">
              {product.features.map((feature, i) => (
                <span
                  key={i}
                  className="bg-white/90 backdrop-blur text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-deep-red uppercase tracking-wide">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <StarRating rating={product.rating} />
              <span className="text-xs text-gray-400">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
            {product.name}
          </h2>

          <div className="text-2xl font-bold text-gray-900 mb-6">
            ₱
            {product.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Info size={16} className="text-deep-red" /> Specifications
            </h3>
            <ul className="space-y-2">
              {product.specifications.map((spec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <CheckCircle2
                    size={16}
                    className="text-green-500 mt-0.5 shrink-0"
                  />
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer / CTA Area */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm">
              <ShoppingBag size={18} />
              <p>Available for purchase during your clinic appointment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
