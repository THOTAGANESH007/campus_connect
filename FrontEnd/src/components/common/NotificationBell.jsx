import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import {
  getNotifications,
  markRead,
  markAllRead,
} from "../../services/notificationService";
import { Link } from "react-router-dom";

const typeColors = {
  NEW_DRIVE: "bg-indigo-100 text-indigo-700",
  STATUS_UPDATE: "bg-emerald-100 text-emerald-700",
  GENERAL: "bg-slate-100 text-slate-700",
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetch = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (_) { }
  };

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 5000); // poll every 5s for real-time feel
    return () => clearInterval(id);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    // Optimistic UI update for immediate response (real time)
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    try {
      await markRead(id);
    } catch (err) {
      console.error(err);
      fetch(); // Revert on failure
    }
  };

  const handleMarkAll = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllRead();
    } catch (err) {
      console.error(err);
      fetch(); // Revert on failure
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={22} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 z-[9999] overflow-hidden isolate">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
            <h3 className="font-bold text-slate-900 text-base">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50 bg-white relative z-10 w-full">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm bg-white">
                <Bell size={32} className="mx-auto mb-3 opacity-30" />
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 px-5 py-4 transition-colors ${n.isRead ? "bg-white" : "bg-indigo-50/50"}`}
                >
                  <span
                    className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${typeColors[n.type] || typeColors.GENERAL}`}
                  >
                    {n.type.replace("_", " ")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={(e) => handleMarkRead(e, n._id)}
                      className="shrink-0 text-indigo-400 hover:text-indigo-700 cursor-pointer"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
