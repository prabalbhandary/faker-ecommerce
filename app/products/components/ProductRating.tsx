import { Star } from "lucide-react";
import type { ProductRatingProps } from "@/utils/types";
import { formatRating } from "@/utils/formatters";

export default function ProductRating({
  rating,
  showCount = false,
}: ProductRatingProps) {
  const fullStars = Math.floor(rating.rate);
  const hasHalfStar = rating.rate % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Rating: ${rating.rate} out of 5`}
    >
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={13}
          className="fill-amber-400 text-amber-400 shrink-0"
        />
      ))}

      {hasHalfStar && (
        <span
          className="relative inline-flex shrink-0"
          style={{ width: 13, height: 13 }}
        >
          <Star size={13} className="text-gray-200 fill-gray-200" />
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <Star size={13} className="fill-amber-400 text-amber-400" />
          </span>
        </span>
      )}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={13}
          className="text-gray-200 fill-gray-200 shrink-0"
        />
      ))}

      <span className="text-xs font-medium text-gray-700 ml-0.5">
        {formatRating(rating.rate)}
      </span>

      {showCount && (
        <span className="text-xs text-gray-400">
          ({rating.count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
