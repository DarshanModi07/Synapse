import { theme } from "@/lib/theme";

export const NotificationLoading = () => {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-xl border p-4"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.surface,
          }}
        >
          <div className="h-4 w-32 rounded bg-zinc-700" />

          <div className="mt-3 h-3 w-full rounded bg-zinc-800" />

          <div className="mt-2 h-3 w-2/3 rounded bg-zinc-800" />

          <div className="mt-4 h-3 w-20 rounded bg-zinc-700" />
        </div>
      ))}
    </div>
  );
};