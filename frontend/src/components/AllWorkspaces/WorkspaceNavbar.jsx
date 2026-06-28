import { theme } from "@/lib/theme";
import { NotificationBell } from "@/components/notification/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

export const WorkspaceNavbar = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-4 z-50 px-6">
      <div
        className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-3xl px-6"
        style={{
          background: "rgba(13,13,18,0.30)",
          border: "1px solid rgba(167,139,250,0.15)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
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



        {/* Right Side */}

        <div className="flex items-center gap-4">
          <NotificationBell />

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5"
          >
            <ProfileAvatar
              user={profile}
              size="h-10 w-10"
            />

            <div className="hidden text-left lg:block">
              <p
                className="text-sm font-medium"
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