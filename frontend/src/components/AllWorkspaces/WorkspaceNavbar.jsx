import { theme } from "@/lib/theme";
import { NotificationBell } from "@/components/notification/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

export const WorkspaceNavbar = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-5 z-50 px-8">
      <div
        className="mx-auto flex h-[76px] max-w-[1800px] items-center justify-between rounded-3xl px-8"
        style={{
          background: "rgba(13,13,18,.58)",
          border: "1px solid rgba(167,139,250,.10)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow:
            "0 18px 40px rgba(0,0,0,.35),0 0 40px rgba(124,58,237,.08)",
        }}
      >
        {/* Left Side */}
        <button
          onClick={() => navigate("/")}
          className="transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
        >
          <h1
            className="text-[40px]"
            style={{
              fontFamily: "ciguatera",
              color: theme.text,
            }}
          >
            Synapse
          </h1>
        </button>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <NotificationBell />

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-4 rounded-2xl px-2 py-2 transition-all duration-200 hover:bg-white/5"
          >
            <ProfileAvatar
              user={profile}
              size="h-11 w-11"
            />

            <div className="hidden text-left lg:block">
              <p
                className="text-[15px] font-semibold"
                style={{
                  color: theme.text,
                }}
              >
                {profile?.name}
              </p>

              <p
                className="text-[13px]"
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