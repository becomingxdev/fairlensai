import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Monitor, CheckCircle2, Palette, ShieldCheck,
  Layout, BellRing, Mail, Key, Smartphone, Users, Database, Globe,
  Monitor as MonitorIcon
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { highContrast, setHighContrast, reduceMotion, setReduceMotion } = useAccessibility();
  const [activeTab, setActiveTab] = useState('appearance');

  const themes = [
    {
      id: 'light',
      name: 'Light Mode',
      icon: <Sun size={16} />,
      colors: { bg: 'bg-[#f8fafc]', card: 'bg-white', text: 'bg-slate-200', accent: 'bg-indigo-500/40' }
    },
    {
      id: 'dark',
      name: 'Cyber Dark',
      icon: <Moon size={16} />,
      colors: { bg: 'bg-[#070a13]', card: 'bg-[#0a0f1e]', text: 'bg-slate-700', accent: 'bg-indigo-500' }
    },
    {
      id: 'system',
      name: 'System Default',
      icon: <Monitor size={16} />,
      isSplit: true
    }
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Plus_Jakarta_Sans']">
          
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Personalize your FairLens AI experience and workspace.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Settings Sidebar */}
            <nav className="space-y-1">
              <SettingTab onClick={() => setActiveTab('appearance')} icon={<Palette size={18} />} label="Appearance" active={activeTab === 'appearance'} />
              <SettingTab onClick={() => setActiveTab('notifications')} icon={<BellRing size={18} />} label="Notifications" active={activeTab === 'notifications'} />
              <SettingTab onClick={() => setActiveTab('workspace')} icon={<Layout size={18} />} label="Workspace" active={activeTab === 'workspace'} />
              <SettingTab onClick={() => setActiveTab('security')} icon={<ShieldCheck size={18} />} label="Security" active={activeTab === 'security'} />
            </nav>

            {/* Settings Content */}
            <div className="md:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === 'appearance' && (
                  <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    {/* Appearance Section */}
                    <section className="bg-white dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-colors">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">Theme Preference</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {themes.map((t) => (
                          <button 
                            key={t.id}
                            onClick={() => setTheme(t.id as any)}
                            className={`flex flex-col p-2 rounded-[32px] border-2 transition-all duration-300 group ${
                              theme === t.id 
                                ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/5' 
                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className={`w-full h-32 rounded-[24px] overflow-hidden relative border border-slate-200/50 dark:border-slate-700/50 mb-4 shadow-inner`}>
                              {t.isSplit ? (
                                <div className="absolute inset-0 flex">
                                  <div className="w-1/2 h-full bg-white p-3 relative">
                                    <div className="w-6 h-1 bg-indigo-500/40 rounded-full mb-1" />
                                    <div className="w-10 h-1 bg-slate-200 rounded-full" />
                                  </div>
                                  <div className="w-1/2 h-full bg-[#0a0f1e] p-3 relative">
                                    <div className="w-6 h-1 bg-indigo-500 rounded-full mb-1 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    <div className="w-10 h-1 bg-slate-700 rounded-full" />
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-br from-transparent from-50% via-indigo-600/20 to-indigo-600/20 pointer-events-none" />
                                </div>
                              ) : (
                                <div className={`absolute inset-0 ${t.colors?.bg} p-4`}>
                                  <div className={`w-full h-full ${t.colors?.card} rounded-xl border border-slate-200/20 p-3 shadow-sm`}>
                                    <div className={`w-8 h-1.5 ${t.colors?.accent} rounded-full mb-2 ${t.id === 'dark' ? 'shadow-[0_0_8px_rgba(99,102,241,0.4)]' : ''}`} />
                                    <div className={`w-12 h-1.5 ${t.colors?.text} rounded-full`} />
                                  </div>
                                </div>
                              )}
                              {theme === t.id && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-3 right-3 bg-indigo-600 text-white rounded-full p-1 shadow-lg z-10">
                                  <CheckCircle2 size={14} strokeWidth={3} />
                                </motion.div>
                              )}
                            </div>
                            <div className={`flex items-center gap-2 px-4 pb-2 font-bold text-sm ${theme === t.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                              {t.icon}
                              {t.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="bg-white dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-colors">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Accessibility</h3>
                      <div className="space-y-6">
                        <ToggleRow 
                          title="High Contrast Mode" 
                          desc="Increase contrast for better legibility of audits." 
                          active={highContrast} 
                          onChange={setHighContrast} 
                        />
                        <ToggleRow 
                          title="Reduce Motion" 
                          desc="Minimize animations in dashboards and reports." 
                          active={reduceMotion} 
                          onChange={setReduceMotion} 
                        />
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
                {activeTab === 'workspace' && <WorkspaceTab key="workspace" />}
                {activeTab === 'security' && <SecurityTab key="security" />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- TABS --- */
const NotificationsTab = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
    <SectionCard title="Alert Preferences">
      <ToggleRow title="Critical Bias Alerts" desc="Immediate notification when a Disparate Impact ratio falls below 0.8." active />
      <ToggleRow title="Weekly Audit Summaries" desc="A summarized PDF of all audits performed during the week." />
      <ToggleRow title="Dataset Health Updates" desc="Alerts when a connected database schema changes." active />
    </SectionCard>
    <SectionCard title="Delivery Channels">
      <div className="grid grid-cols-2 gap-4">
        <ChannelCard icon={<Mail />} label="Email" status="Active" />
        <ChannelCard icon={<Smartphone />} label="Push" status="Disabled" />
      </div>
    </SectionCard>
  </motion.div>
);

const WorkspaceTab = () => {
  const { user } = useAuth();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <SectionCard title="Organization Details">
        <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-slate-900 dark:text-white font-bold">{user?.displayName || 'Personal Workspace'}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Standard Workspace</p>
          </div>
          <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Manage Account</button>
        </div>
      </SectionCard>
      <SectionCard title="Data Connectivity">
        <div className="space-y-4">
          <StatusItem icon={<Database />} label="Built-in H2 Engine" status="Running" color="text-emerald-600 dark:text-emerald-500" />
          <StatusItem icon={<Globe />} label="Firebase Auth" status="Active" color="text-emerald-600 dark:text-emerald-500" />
        </div>
      </SectionCard>
    </motion.div>
  );
};

const SecurityTab = () => {
  const { user } = useAuth();
  const browserInfo = navigator.userAgent.split(') ')[0].split(' (')[1] || "Modern Browser";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <SectionCard title="Authentication">
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl">
            <div className="flex gap-4">
              <ShieldCheck className="text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Adds an extra layer of security to your audit logs.</p>
              </div>
            </div>
            <button className="bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed">Coming Soon</button>
          </div>
          <ActionRow icon={<Key />} title="Registered Email" desc={user?.email || 'No email found'} action="Update" />
        </div>
      </SectionCard>
      <SectionCard title="Active Session">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-700/50">
          <div className="flex gap-4">
            <MonitorIcon className="text-slate-400" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{browserInfo}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 font-bold">Current Active Session</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
};

/* --- REUSABLE UI COMPONENTS --- */
const SectionCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white dark:bg-[#0f172a]/40 border border-slate-200 dark:border-slate-800/50 backdrop-blur-md rounded-[32px] p-8 shadow-sm dark:shadow-2xl transition-colors">
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 tracking-tight">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const SettingTab = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
    active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
  }`}>
    {icon}
    {label}
  </button>
);

const ToggleRow = ({ title, desc, active = false, onChange }: { title: string, desc: string, active?: boolean, onChange?: (val: boolean) => void }) => {
  const [internalOn, setInternalOn] = useState(active);
  const isOn = onChange !== undefined ? active : internalOn;
  
  const handleToggle = () => {
    if (onChange) {
      onChange(!active);
    } else {
      setInternalOn(!internalOn);
    }
  };

  return (
    <div className="flex justify-between items-center py-2">
      <div className="max-w-md">
        <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{title}</p>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
      </div>
      <button onClick={handleToggle} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isOn ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
        <motion.div animate={{ x: isOn ? 26 : 4 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" />
      </button>
    </div>
  );
};

const ChannelCard = ({ icon, label, status }: { icon: React.ReactNode, label: string, status: string }) => (
  <div className={`p-4 rounded-2xl border flex flex-col gap-3 transition-all ${status === 'Active' ? 'bg-indigo-50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/30' : 'bg-slate-50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800'}`}>
    <div className={status === 'Active' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}>{icon}</div>
    <div className="flex justify-between items-end">
      <span className="text-sm font-bold text-slate-900 dark:text-white">{label}</span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Active' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>{status}</span>
    </div>
  </div>
);

const StatusItem = ({ icon, label, status, color }: { icon: React.ReactNode, label: string, status: string, color: string }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
    <div className="flex gap-4 items-center">
      <div className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{icon}</div>
      <span className="text-sm font-bold text-slate-900 dark:text-white">{label}</span>
    </div>
    <span className={`text-xs font-bold ${color}`}>{status}</span>
  </div>
);

const ActionRow = ({ icon, title, desc, action }: { icon: React.ReactNode, title: string, desc: string, action: string }) => (
  <div className="flex justify-between items-center">
    <div className="flex gap-4">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
    <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">{action}</button>
  </div>
);

export default SettingsPage;
