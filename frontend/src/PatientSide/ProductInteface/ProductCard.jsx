import { Star, ArrowRight } from "lucide-react";

const ProductCard = ({ product, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
  >
    {/* Image Container */}
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />

      {/* Category Badge */}
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
          {product.category}
        </span>
      </div>

      {/* Price Badge */}
      <div className="absolute bottom-4 right-4">
        <span className="bg-deep-red text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-red-900/20">
          ₱
          {product.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-grow">
      <div className="mb-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-deep-red transition-colors line-clamp-1">
          {product.name}
        </h3>
      </div>

      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
        {product.description}
      </p>

      {/* Features Pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.features.slice(0, 2).map((feature, i) => (
          <span
            key={i}
            className="bg-gray-50 text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-md border border-gray-100"
          >
            {feature}
          </span>
        ))}
        {product.features.length > 2 && (
          <span className="text-[10px] text-gray-400 px-1 self-center">
            +{product.features.length - 2} more
          </span>
        )}
      </div>

      {/* Action Area */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between group/btn">
        <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
          View Details
        </span>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-deep-red group-hover:text-white transition-all duration-300">
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  </div>
);

export default ProductCard;
