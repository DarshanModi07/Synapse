import { useCallback, useEffect, useState } from "react";

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notification.service";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchNotifications =
    useCallback(async () => {
      try {
        setLoading(true);

        const [notificationRes, countRes] =
          await Promise.all([
            getNotifications(),
            getUnreadCount(),
          ]);

        setNotifications(
          notificationRes.data || []
        );

        setUnreadCount(
          countRes.count || 0
        );

        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to fetch notifications."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const markRead = async (
    notificationId
  ) => {
    try {
      await markNotificationRead(
        notificationId
      );

      setNotifications((prev) =>
        prev.filter(
          (n) => n.id !== notificationId
        )
      );

      setUnreadCount((prev) =>
        Math.max(prev - 1, 0)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications([]);

      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,

    fetchNotifications,

    markRead,

    markAllRead,

    setNotifications,

    setUnreadCount,
  };
};