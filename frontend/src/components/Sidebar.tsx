import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  Lightbulb,
  LogOut,
  ShieldCheck,
  Menu,
  Settings,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: UploadCloud, label: "Upload", to: "/upload" },
  { icon: FileText, label: "Reports", to: "/reports" },
  { icon: Lightbulb, label: "Recommendations", to: "/recommendations" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U";
  const userName = user?.displayName || user?.email?.split('@')[0] || "User";

  return (
    <aside className={`${isCollapsed ? "w-20" : "w-64"} h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 flex flex-col p-4 shadow-xl border-r border-slate-200 dark:border-slate-800 shrink-0 transition-all duration-300 relative`}>
      {/* Header: Logo & Toggle */}
      <div className={`flex items-center mb-8 ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight italic whitespace-nowrap text-slate-900 dark:text-white">FairLens AI</h1>
          </div>
        )}
        <button 
          onClick={handleToggle}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Profile Badge */}
      <div className={`flex items-center gap-3 py-3 mb-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 ${isCollapsed ? 'px-2 justify-center' : 'px-3'}`}>
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm dark:shadow-md shrink-0 capitalize">
          {userInitial}
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{userName}</p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Workspace Member</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {navItems.map(({ icon: Icon, label, to }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              title={isCollapsed ? label : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : ''} ${
                active
                  ? "bg-indigo-50 dark:bg-indigo-600 text-indigo-700 dark:text-white font-bold border border-indigo-100 dark:border-transparent shadow-sm dark:shadow-indigo-900/30"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* EEOC Info Card */}
      {!isCollapsed && (
        <div className="mt-auto mb-4 bg-amber-50 dark:bg-slate-800/40 border border-amber-100 dark:border-slate-700/50 p-4 rounded-2xl">
          <h4 className="text-[10px] font-bold text-amber-800 dark:text-slate-300 uppercase tracking-wider mb-2">
            EEOC 4/5ths Rule
          </h4>
          <p className="text-[11px] text-amber-700 dark:text-slate-400 leading-relaxed font-medium">
            Automatic enforcement on every audit. Groups with DI &lt; 0.8 are flagged.
          </p>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        title={isCollapsed ? "Logout" : undefined}
        className={`flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-slate-800/50 ${isCollapsed ? 'justify-center px-0 mt-auto' : ''}`}
      >
        <LogOut size={20} className="shrink-0" />
        {!isCollapsed && <span className="font-medium">Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;