import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FairnessProgress from "../components/FairnessProgress";
import NotificationPopover from "../components/NotificationPopover";
import { TrendingUp, AlertCircle, ShieldCheck, Bell } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";

// --- Mock Data ---
const chartData = [
  { name: "Gender", score: 85 },
  { name: "Age",    score: 92 },
  { name: "Region", score: 74 },
  { name: "Income", score: 88 },
];

// --- Sub-Components ---
const StatCard = ({
  title,
  value,
  icon,
  subtitle,
  gradient,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
  gradient: string;
}) => (
  <div
    className={`relative p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all duration-300 ${gradient}`}
  >
    {/* Decorative circle */}
    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 dark:bg-white/5 pointer-events-none" />
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-sm">
        {icon}
      </div>
    </div>
    <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest">
      {title}
    </p>
    <h4 className="text-3xl font-extrabold mt-1 text-slate-800 dark:text-slate-100">{value}</h4>
    {subtitle && (
      <p className="text-xs mt-2 font-semibold text-emerald-600 dark:text-emerald-400">{subtitle}</p>
    )}
  </div>
);

const AlertItem = ({
  label,
  status,
  color,
}: {
  label: string;
  status: string;
  color: string;
}) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200">
    <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>
      {status}
    </span>
  </div>
);

// --- Custom Tooltip for Recharts ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-2xl">
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-slate-800 dark:text-white text-2xl font-black">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// --- Main Dashboard ---
const Dashboard = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Welcome Back, John
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Here's how your AI models are performing today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 relative transition-colors p-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
              </button>
              <NotificationPopover 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
              />
            </div>

            <button
              id="export-audit-btn"
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200"
            >
              Export Audit ↗
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Uploads"
            value="12"
            icon={<TrendingUp size={22} className="text-blue-600 dark:text-blue-400" />}
            gradient="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-white dark:to-slate-800/50"
          />
          <StatCard
            title="Fairness Score"
            value="85%"
            icon={<ShieldCheck size={22} className="text-emerald-500 dark:text-emerald-400" />}
            subtitle="↑ +2% from last month"
            gradient="bg-gradient-to-br from-emerald-50 dark:from-emerald-900/20 to-white dark:to-slate-800/50"
          />
          <StatCard
            title="Risk Reports"
            value="5"
            icon={<AlertCircle size={22} className="text-amber-500 dark:text-amber-400" />}
            subtitle="3 High Priority"
            gradient="bg-gradient-to-br from-amber-50 dark:from-amber-900/20 to-white dark:to-slate-800/50"
          />
        </div>

        {/* Visualisations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-slate-900/50 p-6 pb-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-1 text-slate-800 dark:text-slate-100 font-['Plus_Jakarta_Sans']">
                Fairness Metrics by Category
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-tight">
                Bias score (higher = fairer)
              </p>
            </div>
            <div className="flex-1 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 14, fontWeight: 700 }}
                    dy={20}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ 
                      fill: "rgba(148, 163, 184, 0.15)", // Works for both light & dark
                      radius: 12 
                    }}
                    wrapperStyle={{ outline: 'none', zIndex: 1000 }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[10, 10, 0, 0]}
                    barSize={50}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill="#818cf8" 
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h3 className="font-bold text-lg mb-1 text-slate-800 dark:text-slate-100">
              Recent Bias Alerts
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
              Flagged metrics from the last analysis
            </p>
            <div className="space-y-3">
              <AlertItem
                label="Region Disparity"
                status="High Risk"
                color="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              />
              <AlertItem
                label="Gender Parity"
                status="Stable"
                color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              />
              <AlertItem
                label="Age-Based Bias"
                status="Moderate"
                color="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
              />
              <AlertItem
                label="Income Disparity"
                status="Low Risk"
                color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
              />
            </div>

            {/* Progress Summary */}
            <FairnessProgress percentage={85} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;