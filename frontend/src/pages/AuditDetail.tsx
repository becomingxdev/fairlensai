import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, AlertTriangle, Lightbulb, ShieldAlert, 
  RefreshCw, FileDown, LayoutDashboard, Loader2, ChevronLeft
} from 'lucide-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import { reportService } from '../services/api';
import type { AnalysisResult } from '../services/api';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const AuditDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const reportId = parseInt(id);
        if (isNaN(reportId)) throw new Error("Invalid ID");
        const response = await reportService.getById(reportId);
        const data = response.data.detailsJson;
        setReport(typeof data === 'string' ? JSON.parse(data) : data);
      } catch (error) {
        console.error("Failed to fetch report:", error);
        alert("Report not found.");
        navigate('/reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate]);

  const handleDownload = async () => {
    if (!id) return;
    try {
      const reportId = parseInt(id);
      const response = await reportService.export(reportId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_report_${id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to export report.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (!report) return null;

  const severityTextColors: Record<string, string> = {
    Low: 'text-emerald-600 dark:text-emerald-500',
    Medium: 'text-blue-600 dark:text-blue-500',
    High: 'text-amber-600 dark:text-amber-500',
    Critical: 'text-red-600 dark:text-red-500'
  };

  const biasData = report.groupStats.map((stat) => ({
    group: stat.name,
    rate: stat.approvalRate,
    count: stat.totalCount
  }));

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Audit Details" subtitle={`Report ID: ${id}`} />

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <button 
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold text-sm mb-8 transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Reports
            </button>

            <div className="bg-white dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* TOP SUCCESS BANNER */}
              <div className={`p-10 text-center border-b border-slate-50 dark:border-slate-800/50 ${report.severity === 'Low' ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : 'bg-amber-50/30 dark:bg-amber-900/10'}`}>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                    report.severity === 'Low' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}
                >
                  {report.severity === 'Low' ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
                </motion.div>
                
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">Fairness Audit Result</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Risk Level: <span className={`font-bold ${severityTextColors[report.severity] || 'text-slate-500'}`}>{report.severity} Risk</span>
                </p>
              </div>

              {/* RESULTS GRID */}
              <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Fairness Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-6xl font-black ${severityTextColors[report.severity] || 'text-slate-500'}`}>
                        {report.fairnessScore}
                      </span>
                      <span className="text-slate-400 text-sm font-bold">/ 100</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium italic">
                      "{report.summary}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Key Metrics</p>
                    {report.metrics.map((metric, i) => (
                      <div key={i} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{metric.name}</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            metric.status === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 
                            metric.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {metric.status}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            {metric.value.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400">Target: {metric.threshold}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-8">Approval Rate Comparison</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={biasData} layout="vertical" margin={{ left: 20 }}>
                          <XAxis type="number" hide domain={[0, 1]} />
                          <YAxis 
                            dataKey="group" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fontWeight: 700, fill: '#475569' }} 
                          />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{borderRadius: '12px', border: 'none'}}
                            formatter={(value: any) => [`${(Number(value) * 100).toFixed(1)}%`, 'Approval Rate']}
                          />
                          <Bar dataKey="rate" radius={[0, 8, 8, 0]} barSize={32}>
                            {biasData.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={_entry.rate < report.metrics[0].threshold ? '#f59e0b' : '#6366f1'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-lg">
                      <h4 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Lightbulb size={16} /> Recommendations
                      </h4>
                      <ul className="space-y-3">
                        {report.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs font-medium leading-relaxed flex gap-2">
                            <span className="opacity-50">•</span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <ShieldAlert size={16} /> Warnings
                      </h4>
                      <ul className="space-y-3">
                        {report.warnings.length > 0 ? report.warnings.map((warn, i) => (
                          <li key={i} className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed flex gap-2">
                            <span className="text-amber-500">⚠</span> {warn}
                          </li>
                        )) : (
                          <li className="text-xs font-medium text-slate-400">No critical data warnings detected.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM ACTIONS */}
              <div className="p-8 pt-10 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
                <button 
                  onClick={() => navigate('/upload')}
                  className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold text-sm transition-all group"
                >
                  <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                  Run New Audit
                </button>
                
                <div className="flex gap-4">
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3.5 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <FileDown size={18} />
                    Download JSON
                  </button>

                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm transition-all hover:bg-indigo-500 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)]"
                  >
                    <LayoutDashboard size={18} />
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuditDetail;
