import { theme } from "@/lib/theme";
import { Bell, Search, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";

export const WorkspaceNavbar = () => {
  const { profile } = useAuth();

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

        <h1
          className="text-3xl"
          style={{
            fontFamily: "ciguatera",
            color: theme.text,
          }}
        >
          Synapse
        </h1>

        {/* Search */}

        <div
          className="hidden w-[420px] items-center gap-3 rounded-2xl border px-4 py-2 md:flex"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.surface,
          }}
        >
          <Search
            size={18}
            color={theme.secondary}
          />

          <input
            type="text"
            placeholder="Search workspace..."
            className="w-full bg-transparent outline-none"
            style={{
              color: theme.text,
            }}
          />
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-5">

          {/* Notification */}

          <button
            className="rounded-xl p-2 transition hover:bg-white/5"
          >
            <Bell
              size={20}
              color={theme.secondary}
            />
          </button>

          {/* Profile */}

          <ProfileDropdown/>

        </div>
      </div>
    </nav>
  );
};