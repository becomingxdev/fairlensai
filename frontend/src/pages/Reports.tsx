import { useEffect, useState } from "react";
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Loader2,
  Trash2,
  Eye,
  Database,
  Upload,
  ChevronRight
} from 'lucide-react';
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { reportService } from "../services/api";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReports = async () => {
    try {
      const response = await reportService.getAll();
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      try {
        await reportService.delete(id);
        fetchReports();
      } catch (error) {
        alert("Failed to delete report.");
      }
    }
  };

  const handleDownload = async (id: number, fileName: string) => {
    try {
      const response = await reportService.export(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}_audit.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download report.");
    }
  };

  const filteredReports = reports.filter(r => 
    r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.targetColumn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'High': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Medium': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      default: return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Reports" subtitle="Manage your historical fairness assessments" />

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Audit History</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Review, export, and manage your AI fairness logs.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search reports..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
                  />
                </div>
                <button className="p-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/30 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-slate-400 font-bold">Fetching reports...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="bg-white dark:bg-slate-900/30 p-12 rounded-[32px] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                  <Database size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                  {searchQuery ? "No Matching Reports" : "No Reports Found"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
                  {searchQuery 
                    ? `We couldn't find any audits matching "${searchQuery}".` 
                    : "Upload and analyze your first dataset to generate fairness reports."}
                </p>
                {!searchQuery && (
                  <button 
                    onClick={() => navigate('/upload')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <Upload size={18} />
                    Start New Audit
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900/50 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Dataset Details</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Date</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Fairness Verdict</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                      {filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <FileText size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{report.fileName}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Attribute: {report.protectedAttribute}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
                              <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                              {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${getSeverityStyle(report.severity)}`}>
                                {report.severity === 'Low' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                {report.severity} Risk
                              </div>
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{report.fairnessScore.toFixed(0)}%</span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleDownload(report.id, report.fileName)}
                                className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                                title="Download JSON"
                              >
                                <Download size={18} />
                              </button>
                              <button 
                                onClick={() => navigate(`/audit/${report.id}`)}
                                className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(report.id)}
                                className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                title="Delete Report"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;