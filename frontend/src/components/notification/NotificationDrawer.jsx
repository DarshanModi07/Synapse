import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCheck, Trash2, Filter, Bell, UserPlus } from "lucide-react";
import { isToday, isYesterday, isThisWeek, parseISO } from "date-fns";

import { theme } from "@/lib/theme";
import { NotificationCard } from "./NotificationCard";
import { NotificationEmpty } from "./NotificationEmpty";
import { NotificationLoading } from "./NotificationLoading";
import { useWorkspaceInvites } from "@/hooks/useWorkspaceInvites";

export const NotificationDrawer = ({
  isOpen,
  closeDrawer,
  notifications,
  loading,
  markRead,
  markAllRead,
  removeNotification,
}) => {
  const [filterType, setFilterType] = useState("all"); // 'all' or 'unread'
  
  const { invites, accept, reject } = useWorkspaceInvites();

  // Disable scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const groupedNotifications = useMemo(() => {
    const filtered = notifications.filter(n => {
      if (filterType === "unread") return !n.is_read;
      return true;
    });

    const groups = {
      unread: [],
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    filtered.forEach((n) => {
      if (!n.is_read) {
        groups.unread.push(n);
        return;
      }

      const date = new Date(n.createdAt);
      if (isToday(date)) {
        groups.today.push(n);
      } else if (isYesterday(date)) {
        groups.yesterday.push(n);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(n);
      } else {
        groups.older.push(n);
      }
    });

    return groups;
  }, [notifications, filterType]);

  const renderGroup = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold tracking-wide text-gray-400 mb-3 px-2 uppercase">
          {title} ({items.length})
        </h3>
        <div className="space-y-2">
          {items.map((notification) => (
            <div key={notification.id} className="relative group">
               <NotificationCard
                  notification={notification}
                  onRead={async (id) => await markRead(id)}
                />
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Notification"
                >
                  <Trash2 size={16} />
                </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRequests = () => {
    if (!invites || invites.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold tracking-wide text-violet-400 mb-3 px-2 uppercase flex items-center gap-2">
          <UserPlus size={16} />
          Workspace Requests ({invites.length})
        </h3>
        <div className="space-y-2">
          {invites.map((invite) => (
            <div key={invite.id} className="p-4 rounded-xl border flex flex-col gap-3 relative" style={{ backgroundColor: theme.surfaceHover, borderColor: theme.border }}>
               <div>
                 <p className="text-sm text-white font-medium mb-1">
                   {invite.invitedBy?.name || "Someone"} invited you to join <span className="font-bold text-violet-400">{invite.workspace?.name}</span>
                 </p>
                 <p className="text-xs text-gray-400">Role: <span className="capitalize">{invite.sys_role}</span></p>
               </div>
               <div className="flex items-center gap-2 mt-1">
                 <button onClick={() => accept(invite.token)} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium py-2 rounded-lg transition">
                   Accept
                 </button>
                 <button onClick={() => reject(invite.token)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium py-2 rounded-lg transition border border-white/10">
                   Reject
                 </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[420px] flex-col border-l shadow-2xl"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: theme.border }}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <Bell size={20} className="text-violet-400" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">Notifications</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => await markAllRead()}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                  title="Mark all as read"
                >
                  <CheckCheck size={20} />
                </button>
                <button
                  onClick={closeDrawer}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-3 border-b flex gap-2" style={{ borderColor: theme.border }}>
               <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filterType === 'all' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
               >
                 All
               </button>
               <button
                  onClick={() => setFilterType("unread")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${filterType === 'unread' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
               >
                 Unread
                 {filterType !== 'unread' && groupedNotifications.unread.length > 0 && (
                   <span className="bg-violet-500 w-2 h-2 rounded-full"></span>
                 )}
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
              {loading && <NotificationLoading />}

              {!loading && notifications.length === 0 && (!invites || invites.length === 0) && <NotificationEmpty />}

              {!loading && (notifications.length > 0 || (invites && invites.length > 0)) && (
                <>
                  {renderRequests()}
                  {renderGroup("Unread", groupedNotifications.unread)}
                  {renderGroup("Today", groupedNotifications.today)}
                  {renderGroup("Yesterday", groupedNotifications.yesterday)}
                  {renderGroup("This Week", groupedNotifications.thisWeek)}
                  {renderGroup("Older", groupedNotifications.older)}
                  
                  {/* Empty state when filtering */}
                  {filterType === 'unread' && groupedNotifications.unread.length === 0 && (
                      <div className="text-center mt-12 text-gray-500">
                          <CheckCheck size={40} className="mx-auto mb-4 opacity-50" />
                          <p>You're all caught up!</p>
                      </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
