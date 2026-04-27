import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const Reports = () => {
  const reports = [
    { id: '1', name: 'Q1 Hiring Diversity Audit', date: '2026-04-24', status: 'Fair', score: '92%', type: 'CSV Analysis' },
    { id: '2', name: 'Loan Approval Bias Check', date: '2026-04-20', status: 'Biased', score: '64%', type: 'Dataset Audit' },
    { id: '3', name: 'Promotion Equity Report', date: '2026-04-15', status: 'Fair', score: '88%', type: 'Manual Upload' },
    { id: '4', name: 'University Admissions Final', date: '2026-04-02', status: 'Fair', score: '95%', type: 'API Integration' },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Reports" subtitle="Acme Corp • auditor" />

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Section */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Audit Reports</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage and download your historical fairness assessments.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search reports..." 
                    className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
                  />
                </div>
                <button className="p-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            {/* Reports Table Container */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden transition-colors">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Report Details</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Fairness Verdict</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                      {/* Report Name & Type */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{report.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{report.type}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
                          <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                          {report.date}
                        </div>
                      </td>

                      {/* Status Badge & Score */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                            report.status === 'Fair' 
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {report.status === 'Fair' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                            {report.status}
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{report.score}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                            <Download size={16} />
                            Download
                          </button>
                          <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Placeholder */}
              <div className="p-4 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex justify-center">
                <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All Historical Audits</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;