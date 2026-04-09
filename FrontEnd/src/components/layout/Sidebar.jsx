import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Bookmark,
  MessageCircle,
  FileSearch,
  BrainCircuit,
  User,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const isOfficer = user.role === "PLACEMENT_OFFICER" || user.role === "ADMIN";

  const PO_LINKS = [
    { label: "Dashboard", path: "/placement_stats", icon: LayoutDashboard },
    { label: "Placement Drives", path: "/drives", icon: Briefcase },
    { label: "Materials", path: "/placement-materials", icon: FileText },
    { label: "Send Mail", path: "/send-mail", icon: Mail },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const STUDENT_LINKS = [
    { label: "Dashboard", path: "/placement_stats", icon: LayoutDashboard },
    { label: "Drives", path: "/drives", icon: Briefcase },
    { label: "My Applications", path: "/my-applications", icon: FileText },
    { label: "Forum", path: "/forum", icon: MessageSquare },
    { label: "Materials", path: "/placement-materials", icon: FileText },
    { label: "Saved Items", path: "/saved", icon: Bookmark },
    { label: "AI Chat", path: "/chat", icon: MessageCircle },
    { label: "ATS Resume Checker", path: "/resume-analyzer", icon: FileSearch },
    { label: "Interview Q&A", path: "/interview-questions", icon: BrainCircuit },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const links = isOfficer ? PO_LINKS : STUDENT_LINKS;

  return (
    <aside
      className={clsx(
        "bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0 h-screen transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 shrink-0 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold  truncate">
            CampusConnect
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-slate-100 mx-auto"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path) &&
            (link.path !== '/' || location.pathname === '/');

          return (
            <Link
              key={link.path}
              to={link.path}
              title={collapsed ? link.label : undefined}
              className={clsx(
                "flex items-center px-3 py-2.5 rounded-xl font-medium transition-all duration-200",
                collapsed ? "justify-center" : "gap-3",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              <Icon size={20} className={collapsed ? "mx-auto shrink-0" : "shrink-0"} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 shrink-0">
        {!collapsed ? (
          <div className="px-1 py-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Current User
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-700 truncate">{user.name}</p>
                <p className="text-xs font-semibold text-slate-500 truncate">{user.role?.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0" title={user.name}>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
