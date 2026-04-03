import { useAuth } from "../../context/AuthContext";
import { LogOut, Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

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
    if (path.includes("interview")) return "Mock Interview";
    if (path.includes("profile")) return "Profile";
    return "CampusConnect";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button className="md:hidden text-slate-500 hover:text-slate-700 transition">
           <Menu size={20} />
        </button>
        <span className="font-bold text-slate-800 hidden md:block text-lg">
          {getPageTitle()}
        </span>
        <span className="font-bold text-slate-800 md:hidden text-lg bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          CampusConnect
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
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
  );
}
