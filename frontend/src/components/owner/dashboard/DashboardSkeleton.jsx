const Skeleton = ({ className }) => (
  <div
    className={`animate-pulse rounded-3xl bg-white/5 ${className}`}
  />
);

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">

      {/* Welcome */}

      <Skeleton className="h-36 w-full" />

      {/* Stats */}

      <div className="grid grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-36"
          />
        ))}
      </div>

      {/* Bottom */}

      <div className="grid grid-cols-12 gap-6">

        <Skeleton className="col-span-8 h-[420px]" />

        <Skeleton className="col-span-4 h-[420px]" />

      </div>

      <Skeleton className="h-40 w-full" />

    </div>
  );
};