import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

import { theme } from "@/lib/theme";
import { useNotifications } from "@/hooks/useNotification";

import { NotificationDropdown } from "./NotificationDropdown";

export const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
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

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl p-2 transition hover:bg-white/5"
      >
        <Bell
          size={20}
          color={theme.secondary}
        />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-[20px]
              items-center
              justify-center
              rounded-full
              bg-violet-600
              px-1
              text-[11px]
              font-semibold
              text-white
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          loading={loading}
          markRead={markRead}
          markAllRead={markAllRead}
          closeDropdown={() =>
            setOpen(false)
          }
        />
      )}
    </div>
  );
};