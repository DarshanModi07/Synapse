import { Clock } from "lucide-react";
import { theme } from "@/lib/theme";

export const NotificationCard = ({
  notification,
  onRead,
}) => {
  const formatTime = (date) => {
    const now = new Date();
    const created = new Date(date);

    const diff =
      Math.floor((now - created) / 1000);

    if (diff < 60) {
      return "Just now";
    }

    if (diff < 3600) {
      return `${Math.floor(diff / 60)} min ago`;
    }

    if (diff < 86400) {
      return `${Math.floor(diff / 3600)} hr ago`;
    }

    return created.toLocaleDateString();
  };

  return (
    <button
      onClick={() => onRead(notification.id)}
      className="w-full rounded-xl border p-4 text-left transition hover:bg-white/5"
      style={{
        borderColor: theme.border,
      }}
    >
      <div className="flex items-start justify-between">

        <div className="flex-1">

          <h3
            className="font-medium"
            style={{
              color: theme.text,
            }}
          >
            {notification.type}
          </h3>

          <p
            className="mt-2 text-sm"
            style={{
              color: theme.secondary,
            }}
          >
            {notification.payload?.title}
          </p>
          <div
            className="mt-3 flex items-center gap-2 text-xs"
            style={{
              color: theme.secondary,
            }}
          >
            <Clock size={14} />

            {formatTime(notification.createdAt)}
          </div>

        </div>

        {!notification.is_read && (
          <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
        )}

      </div>
    </button>
  );
};