import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Menu, Megaphone, X, Loader2, Send, Bot } from "lucide-react";
import { useLocation } from "react-router-dom";
import NotificationBell from "../common/NotificationBell";
import { sendNotification } from "../../services/notificationService";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  if (!user) return null;

  const canBroadcast = user?.role === "ADMIN" || user?.role === "PLACEMENT_OFFICER";

  // Simple title mapping based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("stats")) return "Dashboard";
    if (path.includes("drives")) return "Placement Drives";
    if (path.includes("materials") || path.includes("saved")) return "Materials";
    if (path.includes("applications")) return "Applications";
    if (path.includes("forum")) return "Discussion Forum";
    if (path.includes("chat")) return "AI Assistant";
    if (path.includes("resume")) return "Resume Analyzer";
    if (path.includes("interview")) return "Interview Q&A";
    if (path.includes("profile")) return "Profile";
    return "CampusConnect";
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim() || isSending) return;
    setIsSending(true);
    try {
      await sendNotification({ message: broadcastMessage, type: "GENERAL" });
      setShowBroadcastModal(false);
      setBroadcastMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send broadcast notification.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button className="md:hidden text-slate-500 hover:text-slate-700 transition">
             <Menu size={20} />
          </button>
          {location.pathname.includes("chat") ? (
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg shadow-sm text-white">
                <Bot size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm md:text-lg leading-tight">
                  Campus Connect
                </span>
                <span className="text-[10px] text-slate-500 font-medium">AI Assistant</span>
              </div>
            </div>
          ) : (
            <>
              <span className="font-bold text-slate-800 hidden md:block text-lg">
                {getPageTitle()}
              </span>
              <span className="font-bold text-slate-800 md:hidden text-lg bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                CampusConnect
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {canBroadcast && (
            <button 
              onClick={() => setShowBroadcastModal(true)}
              className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-2 group"
              title="Broadcast Notification"
            >
              <Megaphone size={20} />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity absolute top-10 whitespace-nowrap right-0 shadow-sm border border-indigo-100">
                Broadcast Msg
              </span>
            </button>
          )}

          <NotificationBell />
          
          <div className="h-8 w-px bg-slate-200"></div>
          
          <button 
             onClick={logout}
             className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Megaphone size={20} className="fill-indigo-600/20" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">Broadcast Message</h3>
                    <p className="text-xs text-slate-500 font-medium">Notify all registered students</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6">
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type important updates, drive schedules, or system announcements..."
                  rows={4}
                  disabled={isSending}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-inner text-sm font-medium"
                ></textarea>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowBroadcastModal(false)}
                    disabled={isSending}
                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBroadcast}
                    disabled={!broadcastMessage.trim() || isSending}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:bg-indigo-300 disabled:cursor-not-allowed text-sm active:scale-[0.98]"
                  >
                    {isSending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Send Broadcast
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
