import { theme } from "@/lib/theme";

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = theme.primary,
}) => {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(13,13,18,.58)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 12px 30px rgba(0,0,0,.30),0 0 30px rgba(124,58,237,.05)",
      }}
    >
      {/* Glow */}

      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl transition-all duration-300 group-hover:scale-125"
        style={{
          background: `${color}22`,
        }}
      />

      {/* Icon */}

      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: `${color}18`,
          color,
        }}
      >
        <Icon
          size={24}
          strokeWidth={2}
        />
      </div>

      {/* Value */}

      <h2
        className="text-4xl font-bold"
        style={{
          color: theme.text,
        }}
      >
        {value}
      </h2>

      {/* Title */}

      <p
        className="mt-2 text-sm font-medium"
        style={{
          color: theme.secondary,
        }}
      >
        {title}
      </p>
    </div>
  );
};