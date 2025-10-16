import { Star } from "lucide-react";

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={
          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }
      />
    ))}
    <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
  </div>
);

export default StarRating;
