import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/services/notification.service";
import { useAuth } from "@/context/AuthContext";

// Singleton socket to prevent multiple connections across re-renders
let socketInstance = null;

export const useNotifications = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const [notificationRes, countRes] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);

      setNotifications(notificationRes.data || []);
      setUnreadCount(countRes.count || 0);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to fetch notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => {
        const notif = prev.find(n => n.id === notificationId);
        if (notif && !notif.is_read) {
          setUnreadCount(c => Math.max(c - 1, 0));
        }
        return prev.filter(n => n.id !== notificationId);
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Socket setup
  useEffect(() => {
    if (!profile) return; // Wait until authenticated

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    if (!socketInstance) {
        socketInstance = io(import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || "http://localhost:8080", {
            auth: { token },
            withCredentials: true
        });
    }

    const handleNewNotification = (notification) => {
      console.log("Notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socketInstance.on("notification", handleNewNotification);
    socketInstance.on("new_notification", handleNewNotification); // Support legacy emission
    socketInstance.on("notification:new", handleNewNotification); // Requested by user

    return () => {
      if (socketInstance) {
          socketInstance.off("notification", handleNewNotification);
          socketInstance.off("new_notification", handleNewNotification);
          socketInstance.off("notification:new", handleNewNotification);
      }
    };
  }, [profile]);

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
    removeNotification,
  };
};