import { theme } from "@/lib/theme";
import { NotificationBell } from "@/components/notification/NotificationBell";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export const OwnerNavbar = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky mt-5 top-4 z-50 px-6">
      <div
        className="mx-auto flex h-[70px] max-w-7xl items-center justify-between rounded-2xl px-6"
        style={{
          background: "rgba(13,13,18,0.55)",
          border: "1px solid rgba(167,139,250,0.12)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:"0 12px 32px rgba(0,0,0,0.35), 0 0 32px rgba(124,58,237,0.08)",
        }}
      >
        {/* Left Side */}
        <div className="flex items-center gap-5">

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="select-none transition-opacity hover:opacity-90"
          >
            <h1
              className="text-3xl"
              style={{
                fontFamily: "ciguatera",
                color: theme.text,
              }}
            >
              Synapse
            </h1>
          </button>

          {/* Divider */}
          <div
            className="h-8 w-px"
            style={{
              background: "rgba(255,255,255,0.08)",
            }}
          />

          {/* Workspace Switcher */}
          <button
            className="group flex items-center gap-3 rounded-xl px-4 py-2 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold"
              style={{
                background: theme.primary,
                color: theme.text,
              }}
            >
              ST
            </div>

            <div className="hidden text-left md:block">
              <p
                className="text-sm font-semibold"
                style={{
                  color: theme.text,
                }}
              >
                Synapse Technologies
              </p>

              <p
                className="text-xs"
                style={{
                  color: theme.secondary,
                }}
              >
                Owner Workspace
              </p>
            </div>

            <ChevronDown
              size={18}
              color={theme.secondary}
              className="transition group-hover:rotate-180"
            />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <NotificationBell />

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-white/5"
          >
            <ProfileAvatar
              user={profile}
              size="h-10 w-10"
            />

            <div className="hidden text-left lg:block">
              <p
                className="text-sm font-semibold"
                style={{
                  color: theme.text,
                }}
              >
                {profile?.name}
              </p>

              <p
                className="text-xs"
                style={{
                  color: theme.secondary,
                }}
              >
                {profile?.email}
              </p>
            </div>
          </button>

        </div>
      </div>
    </nav>
  );
};