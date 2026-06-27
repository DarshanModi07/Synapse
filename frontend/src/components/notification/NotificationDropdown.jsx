import { theme } from "@/lib/theme";

import { NotificationCard } from "./NotificationCard";
import { NotificationEmpty } from "./NotificationEmpty";
import { NotificationLoading } from "./NotificationLoading";

export const NotificationDropdown = ({
  notifications,
  loading,
  markRead,
  markAllRead,
  closeDropdown,
}) => {
  return (
    <div
      className="absolute right-0 top-14 w-[380px] overflow-hidden rounded-2xl border shadow-2xl"
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
    >
      {/* Header */}

      <div
        className="flex items-center justify-between border-b px-5 py-4"
        style={{
          borderColor: theme.border,
        }}
      >
        <div>
          <h2 className="text-lg font-semibold">
            Notifications
          </h2>

          <p
            className="text-xs"
            style={{
              color: theme.secondary,
            }}
          >
            Recent updates
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={async () => {
              await markAllRead();
              closeDropdown();
            }}
            className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
          >
            Mark all
          </button>
        )}
      </div>

      {/* Body */}

      <div className="max-h-[420px] overflow-y-auto">

        {loading && <NotificationLoading />}

        {!loading &&
          notifications.length === 0 && (
            <NotificationEmpty />
          )}

        {!loading &&
          notifications.length > 0 && (
            <div className="space-y-3 p-3">

              {notifications.map(
                (notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onRead={async (id) => {
                      await markRead(id);
                    }}
                  />
                )
              )}

            </div>
          )}

      </div>
    </div>
  );
};