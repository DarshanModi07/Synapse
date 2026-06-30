import { theme } from "@/lib/theme";
import { Sparkles, CalendarDays, Building2 } from "lucide-react";

export const WelcomeCard = ({ workspace }) => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8"
      style={{
        background:
          "linear-gradient(135deg, rgba(124,58,237,.18), rgba(13,13,18,.95))",
        border: "1px solid rgba(167,139,250,.12)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 16px 40px rgba(0,0,0,.35),0 0 40px rgba(124,58,237,.08)",
      }}
    >
      {/* Background Glow */}

      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full blur-[90px]"
        style={{
          background: "rgba(124,58,237,.20)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between">

        {/* Left */}

        <div>

          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: "rgba(124,58,237,.12)",
              color: theme.primaryLight,
            }}
          >
            <Sparkles size={16} />

            <span className="text-sm font-medium">
              Owner Dashboard
            </span>
          </div>

          <h1
            className="text-4xl font-bold"
            style={{
              color: theme.text,
            }}
          >
            Welcome back 👋
          </h1>

          <p
            className="mt-3 text-lg"
            style={{
              color: theme.secondary,
            }}
          >
            Manage{" "}
            <span
              className="font-semibold"
              style={{
                color: theme.text,
              }}
            >
              {workspace?.name}
            </span>{" "}
            from one centralized workspace.
          </p>

          <div
            className="mt-8 flex items-center gap-8"
            style={{
              color: theme.secondary,
            }}
          >
            <div className="flex items-center gap-2">
              <CalendarDays size={18} />

              <span className="text-sm">
                {today}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 size={18} />

              <span className="text-sm capitalize">
                {workspace?.memberRole?.sysRole}
              </span>
            </div>
          </div>

        </div>

        {/* Right */}

        <div
          className="hidden h-28 w-28 items-center justify-center rounded-3xl xl:flex"
          style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.06)",
          }}
        >
          <Building2
            size={52}
            color={theme.primaryLight}
          />
        </div>

      </div>
    </div>
  );
};