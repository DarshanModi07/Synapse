import { theme } from "@/lib/theme";
import { NotificationBell } from "@/components/notification/NotificationBell";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";

import { useNavigate } from "react-router-dom";

import {
  Building2,
  ChevronRight,
  Menu,
} from "lucide-react";

export const OwnerNavbar = ({ onToggleSidebar }) => {
  const { profile } = useAuth();
  const { workspace } = useWorkspace();

  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 md:top-5 z-40 md:px-8">
      <div
        className="mx-auto flex h-[70px] md:h-[76px] max-w-[1800px] items-center justify-between rounded-none md:rounded-3xl px-4 md:px-8"
        style={{
          background: "rgba(13,13,18,.85)",
          borderBottom: "1px solid rgba(167,139,250,.10)",
          border: "1px solid rgba(167,139,250,.10)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow:
            "0 18px 40px rgba(0,0,0,.35),0 0 40px rgba(124,58,237,.08)",
        }}
      >
        {/* LEFT */}

        <div className="flex items-center gap-3 md:gap-7">
          {/* Mobile Hamburger */}
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-gray-400 hover:text-white md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <button
            onClick={() =>
              navigate(`/workspace/${workspace?.slug}`)
            }
            className="transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
          >
            <h1
              className="text-[32px] md:text-[40px]"
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
            className="hidden md:block h-10 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(167,139,250,.2), transparent)",
            }}
          />

          {/* Change Workspace */}

          <button
            onClick={() => navigate("/workspace")}
            className="hidden md:flex group items-center gap-4 rounded-2xl px-5 py-3 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,.025)",
              border: "1px solid rgba(255,255,255,.05)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: "rgba(124,58,237,.15)",
                color: theme.primary,
              }}
            >
              <Building2 size={20} />
            </div>

            <div className="text-left">
              <p
                className="text-[15px] font-semibold"
                style={{
                  color: theme.text,
                }}
              >
                {workspace?.name || "Workspace"}
              </p>

              <p
                className="text-[13px]"
                style={{
                  color: theme.secondary,
                }}
              >
                Change Workspace
              </p>
            </div>

            <ChevronRight
              size={18}
              color={theme.secondary}
              className="transition group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* RIGHT */}

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