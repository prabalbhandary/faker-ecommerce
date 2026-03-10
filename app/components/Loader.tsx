interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

const sizeMap = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

export default function Loader({
  size = "md",
  text,
  fullPage = false,
}: LoaderProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={[
          "rounded-full border-gray-200 border-t-gray-900 animate-spin",
          sizeMap[size],
        ].join(" ")}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-gray-100 rounded w-1/4" />
          <div className="h-8 bg-gray-100 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
