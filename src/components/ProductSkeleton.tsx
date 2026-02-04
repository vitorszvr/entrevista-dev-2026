export function ProductSkeleton() {
  return (
    <div className="group relative bg-white border border-stone-200 shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      <div className="relative aspect-square w-full bg-gray-200" />

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="h-3 w-1/3 bg-gray-200 rounded-sm" />

        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded-sm" />
          <div className="h-4 w-1/2 bg-gray-200 rounded-sm" />
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <div className="h-6 w-1/3 bg-gray-200 rounded-sm" />
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
