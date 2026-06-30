import { theme } from "@/lib/theme";

export const EmptyState = ({
  title = "Nothing to display",
  description = "There is currently no data available.",
  icon: Icon,
}) => {
  return (
    <div
      className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed text-center"
      style={{
        borderColor: "rgba(167,139,250,.18)",
        background: "rgba(255,255,255,.015)",
      }}
    >
      {Icon && (
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(124,58,237,.12)",
            color: theme.primary,
          }}
        >
          <Icon size={30} />
        </div>
      )}

      <h2
        className="text-xl font-semibold"
        style={{
          color: theme.text,
        }}
      >
        {title}
      </h2>

      <p
        className="mt-3 max-w-sm text-sm leading-6"
        style={{
          color: theme.secondary,
        }}
      >
        {description}
      </p>
    </div>
  );
};
