import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  X, 
  Clock,
  ArrowRight
} from 'lucide-react';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPopover = ({ isOpen, onClose }: NotificationPopoverProps) => {
  const notifications = [
    {
      id: 1,
      type: 'bias',
      title: 'High Bias Detected',
      msg: 'Hiring_Data_v2.csv shows 22% disparity in Region attribute.',
      time: '2m ago',
      icon: <ShieldAlert className="text-amber-500" />,
      color: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/20'
    },
    {
      id: 2,
      type: 'success',
      title: 'Audit Complete',
      msg: 'Promotion_Equity_Report is now ready for download.',
      time: '1h ago',
      icon: <CheckCircle2 className="text-emerald-500" />,
      color: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/20'
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      msg: 'FairLens AI now supports EEOC 2026 compliance standards.',
      time: '3h ago',
      icon: <Info className="text-blue-500" />,
      color: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-4 w-[380px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[32px] overflow-hidden z-50 origin-top-right"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Notifications
                <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X size={18} className="text-slate-400 dark:text-slate-500" />
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer group ${n.color}`}
                >
                  <div className="flex gap-4">
                    <div className="mt-1 shrink-0">{n.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1 uppercase">
                          <Clock size={10} />
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {n.msg}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <button className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-800">
              View all activity
              <ArrowRight size={14} />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopover;
