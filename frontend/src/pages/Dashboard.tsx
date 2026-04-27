import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FairnessProgress from "../components/FairnessProgress";
import NotificationPopover from "../components/NotificationPopover";
import { TrendingUp, AlertCircle, ShieldCheck, Bell, Loader2, Database, Upload, ChevronRight } from "lucide-react";
import { dashboardService, reportService } from "../services/api";
import type { DashboardSummary, RecentReport, Distribution } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";

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
  report
}: {
  report: RecentReport
}) => {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'Critical': return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case 'High': return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      case 'Medium': return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      default: return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200">
      <div className="flex flex-col">
        <span className="font-bold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{report.fileName}</span>
        <span className="text-[10px] text-slate-400 font-medium">Mapped to: {report.protectedAttribute}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-black text-slate-500">{report.score.toFixed(0)}%</span>
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${getSeverityColor(report.severity)}`}>
          {report.severity}
        </span>
      </div>
    </div>
  );
};

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportLatest = async () => {
    setIsExporting(true);
    try {
      const latest = await reportService.getLatest();
      const response = await reportService.export(latest.data.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `latest_audit_${latest.data.id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("No audits found to export or export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, recRes, distRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getRecentReports(),
          dashboardService.getDistribution(),
        ]);
        
        setSummary(sumRes.data);
        setRecentReports(recRes.data);
        setDistribution(distRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = distribution ? Object.entries(distribution.avgScoreByAttribute).map(([name, score]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    score: Math.round(score)
  })) : [];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-slate-400 font-bold animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  // Empty State Check
  if (!summary || summary.totalAudits === 0) {
    return (
      <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <Database size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">No Audits Found</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
            Start by uploading your first dataset to begin fairness analysis and unlock your dashboard metrics.
          </p>
          <button 
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
          >
            <Upload size={18} />
            Upload First Dataset
            <ChevronRight size={18} />
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Welcome Back, {user?.displayName?.split(' ')[0] || 'User'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Here's how your AI models are performing today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 relative transition-colors p-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center"
              >
                <Bell size={20} />
                {recentReports.length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
                )}
              </button>
              <NotificationPopover 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
              />
            </div>

            <button
              id="export-audit-btn"
              disabled={isExporting}
              onClick={handleExportLatest}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="animate-spin" size={16} /> : null}
              {isExporting ? 'Exporting...' : 'Export Audit ↗'}
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Uploads"
            value={summary.totalUploads.toString()}
            icon={<TrendingUp size={22} className="text-blue-600 dark:text-blue-400" />}
            gradient="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-white dark:to-slate-800/50"
          />
          <StatCard
            title="Avg Fairness"
            value={`${summary.avgFairnessScore.toFixed(0)}%`}
            icon={<ShieldCheck size={22} className="text-emerald-500 dark:text-emerald-400" />}
            subtitle="Overall parity ratio"
            gradient="bg-gradient-to-br from-emerald-50 dark:from-emerald-900/20 to-white dark:to-slate-800/50"
          />
          <StatCard
            title="Risk Alerts"
            value={summary.highRiskCount.toString()}
            icon={<AlertCircle size={22} className="text-amber-500 dark:text-amber-400" />}
            subtitle="High/Critical priority"
            gradient="bg-gradient-to-br from-amber-50 dark:from-amber-900/20 to-white dark:to-slate-800/50"
          />
        </div>

        {/* Visualisations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-slate-900/50 p-6 pb-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-1 text-slate-800 dark:text-slate-100 font-['Plus_Jakarta_Sans']">
                Fairness by Attribute
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-tight">
                Avg bias score per protected category
              </p>
            </div>
            <div className="flex-1 min-h-[280px]">
              {chartData.length > 0 ? (
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
                        fill: "rgba(148, 163, 184, 0.15)",
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
                          fill={entry.score < 80 ? "#f59e0b" : "#818cf8"} 
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 font-medium">
                  Insufficient attribute data to display chart.
                </div>
              )}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h3 className="font-bold text-lg mb-1 text-slate-800 dark:text-slate-100">
              Recent Bias Reports
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
              Latest analysis runs and risk classifications
            </p>
            <div className="space-y-3">
              {recentReports.length > 0 ? recentReports.map((report, idx) => (
                <AlertItem key={idx} report={report} />
              )) : (
                <div className="text-center py-10 text-slate-400 font-medium italic">
                  No recent reports found.
                </div>
              )}
            </div>

            {/* Progress Summary */}
            <FairnessProgress percentage={Math.round(summary.latestFairnessScore)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;