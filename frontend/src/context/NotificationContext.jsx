import { createContext, useCallback, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/services/notification.service";
import { useAuth } from "@/context/AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // We use a ref so the cleanup function always has access to the exact same instance
  const socketRef = useRef(null);

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
        const notif = prev.find((n) => n.id === notificationId);
        if (notif && !notif.is_read) {
          setUnreadCount((c) => Math.max(c - 1, 0));
        }
        return prev.filter((n) => n.id !== notificationId);
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Socket setup
  useEffect(() => {
    if (!profile) {
      // If user logs out, disconnect the socket and clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const socketUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/api.*/, '') || "http://localhost:8080";
    
    // Create new socket instance
    const newSocket = io(socketUrl, {
        auth: { token },
        withCredentials: true
    });
    
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
        console.log("FRONTEND SOCKET CONNECTED:", newSocket.id);
    });
    
    newSocket.on("disconnect", () => {
        console.log("FRONTEND SOCKET DISCONNECTED");
    });

    const handleNewNotification = (payload) => {
      console.log("RECEIVED NOTIFICATION VIA SOCKET:", payload);
      
      // Handle both legacy (direct notification object) and new ({ notification, invitation }) structures
      const notification = payload.notification || payload;
      const invitation = payload.invitation;

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      if (invitation) {
          // If there's an invitation in the payload, we need to update the invites list.
          // We can dispatch a custom event that useWorkspaceInvites can listen to.
          window.dispatchEvent(new CustomEvent('new_workspace_invite', { detail: invitation }));
      }
    };

    newSocket.on("notification", handleNewNotification);
    newSocket.on("new_notification", handleNewNotification);
    newSocket.on("notification:new", handleNewNotification);

    return () => {
      if (newSocket) {
        newSocket.off("notification", handleNewNotification);
        newSocket.off("new_notification", handleNewNotification);
        newSocket.off("notification:new", handleNewNotification);
        newSocket.disconnect();
        if (socketRef.current === newSocket) {
            socketRef.current = null;
        }
      }
    };
  }, [profile]);

  useEffect(() => {
    if (profile) {
        fetchNotifications();
    }
  }, [profile, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markRead,
        markAllRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
