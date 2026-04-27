import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationPopover from "./NotificationPopover";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const TopBar = ({ title, subtitle }: TopBarProps) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center justify-between px-8 shrink-0 transition-colors duration-300">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        {/* Notification bell */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 relative transition-colors p-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <NotificationPopover 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
