import { Star } from "lucide-react";

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={
          star <= rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-200 fill-gray-100"
        }
      />
    ))}
  </div>
);

export default StarRating;
