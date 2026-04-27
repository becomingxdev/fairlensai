import { 
  Scale, 
  UserPlus, 
  Settings, 
  ShieldCheck, 
  ArrowUpRight,
  Info
} from 'lucide-react';
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const Recommendations = () => {
  const recommendations = [
    {
      id: 1,
      title: "Balance Protected Group Representation",
      description: "The 'Female' and 'Other' categories are under-represented in your training data. This leads to higher error rates for these groups.",
      impact: "High",
      category: "Data Collection",
      icon: <Scale className="text-amber-600" />,
      action: "Oversample Minority Classes"
    },
    {
      id: 2,
      title: "Mitigate Proxy Feature Influence",
      description: "Features like 'Zip Code' are highly correlated with 'Region' and 'Income,' acting as proxies for sensitive attributes.",
      impact: "Medium",
      category: "Feature Engineering",
      icon: <Settings className="text-blue-600" />,
      action: "Remove Proxy Columns"
    },
    {
      id: 3,
      title: "Adjust Decision Thresholds",
      description: "Applying a global 0.5 threshold is causing disparate impact. Consider lowering the threshold for the unprivileged group.",
      impact: "Critical",
      category: "Post-Processing",
      icon: <UserPlus className="text-purple-600" />,
      action: "Apply Equalized Odds"
    }
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Recommendations" subtitle="Acme Corp • auditor" />

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Area */}
            <header className="mb-10 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                  Bias Mitigation Center
                  <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-widest">AI Generated</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Suggested improvements to reach a <span className="text-emerald-600 dark:text-emerald-500 font-bold">95%+ Fairness Score</span>.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800 text-sm font-bold">
                <ShieldCheck size={18} />
                Compliance Ready
              </div>
            </header>

            {/* Recommendations List */}
            <div className="grid gap-6">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[24px] p-8 shadow-sm dark:shadow-none hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  {/* Icon & Category */}
                  <div className={`p-4 rounded-2xl shrink-0 ${
                    rec.impact === 'Critical' ? 'bg-purple-50 dark:bg-purple-900/20' : 
                    rec.impact === 'High' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}>
                    {rec.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded ${
                        rec.impact === 'Critical' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 
                        rec.impact === 'High' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>
                        {rec.impact} Impact
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-tight">{rec.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
                      {rec.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button className="shrink-0 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-slate-200 dark:shadow-none">
                    {rec.action}
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              ))}
            </div>

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