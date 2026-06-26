import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";

import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/auth.service";

import { useNavigate } from "react-router-dom";

import { ProfileModal } from "./ProfileModal";

export const ProfileDropdown = () => {
  const navigate = useNavigate();

  const {
    profile,
    setProfile,
  } = useAuth();

  const [open, setOpen] = useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("accessToken");

      setProfile(null);

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        className="relative"
        ref={dropdownRef}
      >
        <button
          onClick={() =>
            setOpen(!open)
          }
          className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5"
        >
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt="avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full font-semibold"
              style={{
                backgroundColor:
                  theme.primary,
              }}
            >
              {profile?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div className="hidden text-left md:block">
            <p className="text-sm font-medium">
              {profile?.name}
            </p>

            <p
              className="text-xs"
              style={{
                color:
                  theme.secondary,
              }}
            >
              {profile?.email}
            </p>
          </div>

          <ChevronDown
            size={18}
            color={theme.secondary}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border bg-[#12121A]"
            style={{
              borderColor:
                theme.border,
            }}
          >
            <button
              onClick={() => {
                setShowProfile(true);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/5"
            >
              <User size={18} />

              My Profile
            </button>

            <div
              className="mx-4"
              style={{
                borderTop: `1px solid ${theme.border}`,
              }}
            />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-5 py-4 text-left text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut size={18} />

              Logout
            </button>
          </div>
        )}
      </div>

      <ProfileModal
        open={showProfile}
        onClose={() =>
          setShowProfile(false)
        }
      />
    </>
  );
};