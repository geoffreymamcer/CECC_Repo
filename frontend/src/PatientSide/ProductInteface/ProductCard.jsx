import { ChevronDown, ChevronUp } from "lucide-react";
import StarRating from "./StarRating";

const ProductCard = ({ product, isExpanded, onToggleDetails }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
    <div className="relative">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-3 left-3">
        <span className="bg-deep-red text-white text-xs px-2 py-1 rounded-full">
          {product.category}
        </span>
      </div>
    </div>

    <div className="p-4 md:p-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
        </div>
        <div className="text-deep-red font-bold text-xl">
          ₱{product.price.toFixed(2)}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <StarRating rating={product.rating} />
        <span className="text-sm text-gray-500">
          {product.reviewCount} reviews
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Key Features:</h4>
        <div className="flex flex-wrap gap-1">
          {product.features.slice(0, 3).map((feature, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={onToggleDetails}
          className="flex items-center text-deep-red hover:text-dark-red transition-colors w-full justify-center py-2"
        >
          <span className="mr-1">
            {isExpanded ? "Show Less" : "View Details"}
          </span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
            <h4 className="font-medium text-gray-800 mb-2">Specifications:</h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              {product.specifications.map((spec, i) => (
                <li key={i} className="flex">
                  <span className="min-w-[6px] h-[6px] rounded-full bg-deep-red mt-2 mr-2"></span>
                  {spec}
                </li>
              ))}
            </ul>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> This product is available for purchase
                during your appointment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ProductCard;
