import { motion, AnimatePresence } from 'framer-motion';
import { 
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
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X size={18} className="text-slate-400 dark:text-slate-500" />
              </button>
            </div>

            {/* Empty State */}
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700">
                <CheckCircle2 size={32} className="text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">All caught up!</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No new notifications at this time.</p>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopover;
