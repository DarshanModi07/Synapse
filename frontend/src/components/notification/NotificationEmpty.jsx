import { BellOff } from "lucide-react";
import { theme } from "@/lib/theme";

export const NotificationEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">

      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          backgroundColor: theme.surface,
        }}
      >
        <BellOff
          size={28}
          color={theme.secondary}
        />
      </div>

      <h3
        className="mt-5 text-lg font-semibold"
        style={{
          color: theme.text,
        }}
      >
        You're all caught up
      </h3>

      <p
        className="mt-2 text-center text-sm"
        style={{
          color: theme.secondary,
        }}
      >
        You don't have any unread notifications.
      </p>

    </div>
  );
};