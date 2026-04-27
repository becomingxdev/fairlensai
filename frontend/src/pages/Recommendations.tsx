import { useEffect, useState } from "react";
import { 
  Scale, 
  UserPlus, 
  Settings, 
  ShieldCheck, 
  ArrowUpRight,
  Info,
  Loader2,
  Sparkles,
  Database,
  Upload,
  ChevronRight
} from 'lucide-react';
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { recommendationService } from "../services/api";
import type { Recommendation } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Recommendations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await recommendationService.getAll();
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const getImpactStyle = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'High': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Medium': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      default: return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    }
  };

  const getIcon = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('data') || lowerAction.includes('sample')) return <Database size={24} className="text-amber-600" />;
    if (lowerAction.includes('selection') || lowerAction.includes('threshold')) return <Scale size={24} className="text-purple-600" />;
    if (lowerAction.includes('collect') || lowerAction.includes('more')) return <UserPlus size={24} className="text-blue-600" />;
    return <Settings size={24} className="text-indigo-600" />;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Recommendations" subtitle={`Personalized insights for ${user?.displayName || 'User'}`} />

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Area */}
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                  Bias Mitigation Center
                  <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={10} />
                    Data Driven
                  </span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Actionable suggestions to improve fairness scores across your audited models.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800 text-sm font-bold shadow-sm">
                <ShieldCheck size={18} />
                Compliance Ready
              </div>
            </header>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/30 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-slate-400 font-bold">Analyzing audit data for insights...</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="bg-white dark:bg-slate-900/30 p-12 rounded-[32px] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No active recommendations</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
                  Run more fairness audits to generate data-driven insights and mitigation strategies.
                </p>
                <button 
                  onClick={() => navigate('/upload')}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <Upload size={18} />
                  Run New Audit
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {recommendations.map((rec, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[24px] p-8 shadow-sm dark:shadow-none hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center"
                  >
                    <div className={`p-4 rounded-2xl shrink-0 bg-slate-50 dark:bg-slate-800 shadow-inner`}>
                      {getIcon(rec.action)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded ${getImpactStyle(rec.priority)}`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-tight">Report: {rec.reportName}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                        {rec.action}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
                        {rec.reasoning} Generated on {rec.date}.
                      </p>
                    </div>

                    <button 
                      onClick={() => navigate(`/audit/${rec.reportId}`)}
                      className="shrink-0 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                    >
                      View Report
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pro Tip Card */}
            <div className="mt-12 p-6 bg-slate-900 dark:bg-slate-800 rounded-[32px] text-white flex items-center gap-6 relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[40px]" />
              <div className="w-12 h-12 bg-white/10 dark:bg-slate-700 rounded-2xl flex items-center justify-center shrink-0 z-10">
                <Info className="text-indigo-300" />
              </div>
              <div className="z-10">
                <h4 className="font-bold text-lg">Pro Tip: Automated Retraining</h4>
                <p className="text-slate-400 dark:text-slate-300 text-sm">
                  Connect your PostgreSQL database to FairLens AI to automatically balance datasets during the next training cycle.
                </p>
              </div>
              <button className="ml-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10">
                Connect Database
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;