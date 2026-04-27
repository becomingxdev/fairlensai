import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Check,
  Database,
  Info,
  X,
  ShieldAlert,
  Target,
  CheckCircle2,
  Search,
  BarChart3,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  FileDown,
  RefreshCw,
  Users,
  ChevronRight,
  LayoutDashboard,
  Lightbulb,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { biasService } from "../services/api";
import type { AnalysisResult } from "../services/api";

// ─── Stepper ────────────────────────────────────────────────────────

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, label: 'Upload' },
    { id: 2, label: 'Map columns' },
    { id: 3, label: 'Analyze' },
    { id: 4, label: 'Results' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 mb-6">
      <div className="relative flex items-center justify-between">
        
        {/* PROGRESS LINE TRACK (The Background) */}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-200 dark:bg-slate-700 z-0" />

        {/* ACTIVE PROGRESS LINE (The "Fill") */}
        <div 
          className="absolute top-5 left-0 h-[3px] bg-indigo-600 transition-all duration-700 ease-in-out z-0" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* STEP NODES */}
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center group relative z-10">
            {/* Step Circle */}
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 ${
                currentStep >= step.id 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] scale-110' 
                  : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
              }`}
            >
              {currentStep > step.id ? (
                <Check size={18} strokeWidth={3} className="text-white" />
              ) : (
                <span className={currentStep === step.id ? 'text-white' : ''}>{step.id}</span>
              )}
            </div>

            {/* Step Label */}
            <span 
              className={`mt-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                currentStep >= step.id ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Upload Zone ─────────────────────────────────────────────────────

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
}

const UploadZone = ({ onFileAccepted }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileAccepted(file);
    },
    [onFileAccepted]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileAccepted(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative bg-white dark:bg-slate-900/50 border-2 border-dashed rounded-[32px] p-20 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
        isDragging
          ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-900/20 scale-[1.01]"
          : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
      }`}
      onClick={() => inputRef.current?.click()}
    >
      {/* Hidden real file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
        className="hidden"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Icon overlapping the top border */}
      <div
        className={`absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${
          isDragging
            ? "bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] scale-110"
            : "bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
        }`}
      >
        <Upload className="text-white" size={32} />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 mt-4">
        Drop your file here
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-4 font-medium italic">
        or click anywhere to browse
      </p>

      {/* Accepted formats */}
      <div className="flex items-center gap-2 mb-8 mt-2">
        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide">CSV</span>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide">XLSX</span>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide">XLS</span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">· Up to 10 MB</span>
      </div>

      <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
        <button
          id="choose-file-btn"
          onClick={() => inputRef.current?.click()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.5)] flex items-center gap-2 transition-all active:scale-95"
        >
          <Database size={18} />
          Choose file
        </button>
        <button
          id="load-demo-btn"
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
          onClick={() => {
            const content = "Candidate_ID,Gender,Age,Years_Experience,Qualification,Region,Hiring_Decision\n1,Male,30,5,Bachelors,North,1";
            const demoFile = new File([content], "hiring_data_v2.csv", { type: "text/csv" });
            onFileAccepted(demoFile);
          }}
        >
          Load demo data
        </button>
      </div>

      {/* Info callout */}
      <div className="mt-10 flex items-start gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 max-w-lg">
        <Info size={14} className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          Expected columns include a decision outcome (e.g.{" "}
          <code className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            selected
          </code>
          ) and at least one protected attribute such as{" "}
          <code className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            gender
          </code>{" "}
          or{" "}
          <code className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            race
          </code>
          .
        </p>
      </div>
    </div>
  );
};

// ─── File Preview Card ───────────────────────────────────────────────

interface FileCardProps {
  file: File;
  onRemove: () => void;
  onContinue: () => void;
}

const FileCard = ({ file, onRemove, onContinue }: FileCardProps) => {
  const sizeKB = (file.size / 1024).toFixed(1);
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm mt-6 animate-fade-in">
      {/* Icon */}
      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
        <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{file.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {displaySize} • {file.name.split('.').pop()?.toUpperCase() ?? 'FILE'}
        </p>
        {/* Progress bar (simulated "ready") */}
        <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
          <div className="bg-indigo-500 h-1.5 rounded-full w-full transition-all duration-700" />
        </div>
      </div>

      {/* Status badge */}
      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full shrink-0">
        Ready
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 transition-all"
          title="Remove file"
        >
          <X size={16} />
        </button>
        <button
          id="continue-to-map-btn"
          onClick={onContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)]"
        >
          Continue
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ─── Column Type Badge ───────────────────────────────────────────────

const TypeBadge = ({ type }: { type: string }) => {
  const colours: Record<string, string> = {
    Binary:      "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    Categorical: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    Numerical:   "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    ID:          "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${colours[type] ?? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
      {type}
    </span>
  );
};

// ─── Column Mapping UI ───────────────────────────────────────────────

interface Column {
  name: string;
  type: string;
  mapping: "feature" | "protected" | "target" | "ignore";
}

interface ColumnMappingUIProps {
  fileName: string;
  headers: string[];
  onAnalyze: (mapping: { targetColumn: string, protectedColumn: string, groupA: string, groupB: string, approvalValue: string }) => void;
  onBack: () => void;
  onDashboard: () => void;
}

const DEFAULT_COLUMNS: Column[] = [
  { name: "Candidate_ID",    type: "ID",          mapping: "ignore" },
  { name: "Gender",          type: "Categorical",  mapping: "protected" },
  { name: "Age",             type: "Numerical",    mapping: "protected" },
  { name: "Years_Experience",type: "Numerical",    mapping: "feature" },
  { name: "Qualification",   type: "Categorical",  mapping: "feature" },
  { name: "Region",          type: "Categorical",  mapping: "protected" },
  { name: "Hiring_Decision", type: "Binary",       mapping: "target" },
];

const MAPPING_OPTIONS: { value: Column["mapping"]; label: string }[] = [
  { value: "feature",   label: "General Feature" },
  { value: "protected", label: "Protected Attribute" },
  { value: "target",    label: "Decision Outcome" },
  { value: "ignore",    label: "Skip Column" },
];

const ColumnMappingUI = ({ fileName, headers, onAnalyze }: ColumnMappingUIProps) => {
  const [columns, setColumns] = useState<Column[]>(
    headers.length > 0 
      ? headers.map(h => ({ name: h, type: "Categorical", mapping: "feature" }))
      : DEFAULT_COLUMNS
  );

  const [mappingDetails, setMappingDetails] = useState({
    groupA: "",
    groupB: "",
    approvalValue: ""
  });

  const handleMappingChange = (index: number, value: Column["mapping"]) => {
    setColumns((prev) => {
      const next = [...prev];
      // Only allow one target
      if (value === "target") {
        next.forEach((c, i) => { if (i !== index && c.mapping === "target") c.mapping = "feature"; });
      }
      next[index] = { ...next[index], mapping: value };
      return next;
    });
  };

  const hasTarget    = columns.some((c) => c.mapping === "target");
  const hasProtected = columns.some((c) => c.mapping === "protected");
  const detailsComplete = mappingDetails.groupA && mappingDetails.groupB && mappingDetails.approvalValue;
  const canAnalyze   = hasTarget && hasProtected && detailsComplete;

  const targetCount    = columns.filter((c) => c.mapping === "target").length;
  const protectedCount = columns.filter((c) => c.mapping === "protected").length;

  const selectClass = (mapping: Column["mapping"]) => {
    if (mapping === "target")
      return "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold";
    if (mapping === "protected")
      return "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold";
    if (mapping === "ignore")
      return "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500";
    return "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">

        {/* Header */}
        <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Database size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Map Your Columns</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto text-sm leading-relaxed">
            We detected{" "}
            <code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded text-xs">
              {fileName}
            </code>
            . Assign each column a role before running the audit.
          </p>

          {/* Summary pills */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              hasTarget
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700"
            }`}>
              <Target size={12} />
              {targetCount} Decision Outcome{targetCount !== 1 ? "s" : ""}
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              hasProtected
                ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700"
            }`}>
              <ShieldAlert size={12} />
              {protectedCount} Protected Attribute{protectedCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Column Name
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Detected Type
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Map To
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {columns.map((col, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors group ${
                      col.mapping === "target"
                        ? "bg-indigo-50/30 dark:bg-indigo-900/20"
                        : col.mapping === "protected"
                        ? "bg-amber-50/20 dark:bg-amber-900/20"
                        : "hover:bg-white dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {col.mapping === "target" && (
                          <Target size={14} className="text-indigo-500 shrink-0" />
                        )}
                        {col.mapping === "protected" && (
                          <ShieldAlert size={14} className="text-amber-500 shrink-0" />
                        )}
                        {col.mapping === "ignore" && (
                          <span className="w-3.5 h-3.5 shrink-0" />
                        )}
                        {col.mapping === "feature" && (
                          <span className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span
                          className={`font-mono text-sm font-semibold ${
                            col.mapping === "ignore"
                              ? "text-slate-300 dark:text-slate-600 line-through"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {col.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={col.type} />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={col.mapping}
                        onChange={(e) =>
                          handleMappingChange(idx, e.target.value as Column["mapping"])
                        }
                        className={`text-sm py-1.5 px-3 rounded-lg border outline-none transition-all cursor-pointer ${
                          selectClass(col.mapping)
                        }`}
                      >
                        {MAPPING_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* New: Group Details Entry */}
          {(hasTarget || hasProtected) && (
            <div className="mt-8 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 mx-6 mb-6">
              <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                <Info size={16} />
                Detailed Analysis Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1.5 ml-1">Group A (e.g. Male)</label>
                  <input 
                    type="text" 
                    placeholder="Reference Group"
                    value={mappingDetails.groupA}
                    onChange={(e) => setMappingDetails(prev => ({ ...prev, groupA: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1.5 ml-1">Group B (e.g. Female)</label>
                  <input 
                    type="text" 
                    placeholder="Comparison Group"
                    value={mappingDetails.groupB}
                    onChange={(e) => setMappingDetails(prev => ({ ...prev, groupB: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1.5 ml-1">Approval Value (e.g. 1 or Selected)</label>
                  <input 
                    type="text" 
                    placeholder="Success Outcome"
                    value={mappingDetails.approvalValue}
                    onChange={(e) => setMappingDetails(prev => ({ ...prev, approvalValue: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50/60 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          {/* Validation hint */}
          <div className="flex items-center gap-2">
            {canAnalyze ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <p className="text-xs font-semibold text-emerald-600">
                  Ready — all required roles and group values are assigned.
                </p>
              </>
            ) : (
              <>
                <Info size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {!hasTarget || !hasProtected
                    ? "Select 1 Decision Outcome and at least 1 Protected Attribute."
                    : !detailsComplete
                    ? "Fill in Group A, Group B, and Approval Value."
                    : ""}
                </p>
              </>
            )}
          </div>

          <button
            id="analyze-dataset-btn"
            onClick={() => {
              const target = columns.find(c => c.mapping === "target")?.name || "";
              const protectedCol = columns.find(c => c.mapping === "protected")?.name || "";
              onAnalyze({
                targetColumn: target,
                protectedColumn: protectedCol,
                ...mappingDetails
              });
            }}
            disabled={!canAnalyze}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
              canAnalyze
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 group"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            Analyze Dataset
            <ChevronRight
              size={18}
              className={canAnalyze ? "group-hover:translate-x-1 transition-transform" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Analysis Step ─────────────────────────────────────────────────────
const AnalysisStep = ({ file, mapping, onComplete }: { file: File, mapping: any, onComplete: (result: any) => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        // Start progress simulation for UX
        const interval = setInterval(() => {
          setProgress(p => Math.min(p + 1, 95));
        }, 100);

        const response = await biasService.analyze(file, mapping);
        
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => onComplete(response.data), 1000);
      } catch (error) {
        console.error("Analysis failed:", error);
        alert("Error analyzing file. Please check if the format is correct.");
      }
    };
    runAnalysis();
  }, [file, mapping, onComplete]);

  const phases = [
    { label: "Loading Protected Attributes: Gender, Age", icon: <Database size={16} /> },
    { label: "Queuing Fairness Metrics: Disparate Impact, Group Parity", icon: <Search size={16} /> },
    { label: "Calculating Statistical Disparity (Disparate Impact)", icon: <BarChart3 size={16} /> },
    { label: "Finalizing Audit Report...", icon: <ShieldCheck size={16} /> }
  ];

  // Update text phases based on progress percentage
  useEffect(() => {
    if (progress < 25) setCurrentPhase(0);
    else if (progress < 50) setCurrentPhase(1);
    else if (progress < 75) setCurrentPhase(2);
    else setCurrentPhase(3);
  }, [progress]);

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className="bg-white dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm p-12 flex flex-col items-center text-center relative overflow-hidden transition-colors duration-300">
        
        {/* Subtle Background Glow during Analysis */}
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-900/20 to-transparent pointer-events-none"
        />

        {/* The Animated Icon Container */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center shadow-inner">
            <Database size={32} />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 rounded-full p-1 shadow-md border border-indigo-50 dark:border-slate-700"
          >
            <Loader2 size={24} />
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">Analyzing Dataset...</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium">
          Running fairness checks against your defined protected attributes.
        </p>

        {/* Detailed Analysis Console */}
        <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-8 text-left relative z-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Process Log</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]"
            />
          </div>

          {/* Phase Information with AnimatePresence */}
          <div className="h-12 flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 w-full"
              >
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-indigo-500 dark:text-indigo-400 shadow-sm">
                  {phases[currentPhase].icon}
                </div>
                <p className="text-sm font-semibold leading-tight">
                  {phases[currentPhase].label}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Analyze Button (Disabled while loading) */}
        <button 
          disabled 
          className="bg-indigo-600/50 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 cursor-wait"
        >
          {progress < 100 ? "Calculating..." : "Analysis Complete"}
          <Loader2 size={18} className="animate-spin" />
        </button>

      </div>
    </div>
  );
};

// ─── Analysis Results UI ───────────────────────────────────────────────

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  onNewAudit: () => void;
  onDashboard: () => void;
  onViewFixes: () => void;
}

const AnalysisResults = ({ result, onNewAudit, onDashboard, onViewFixes }: AnalysisResultsProps) => {
  if (!result) return null;

  const severityTextColors: Record<string, string> = {
    Low: 'text-emerald-600 dark:text-emerald-500',
    Medium: 'text-blue-600 dark:text-blue-500',
    High: 'text-amber-600 dark:text-amber-500',
    Critical: 'text-red-600 dark:text-red-500'
  };

  const biasData = result.groupStats.map((stat) => ({
    group: stat.name,
    rate: stat.approvalRate,
    count: stat.totalCount
  }));

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        
        {/* TOP SUCCESS BANNER */}
        <div className={`p-10 text-center border-b border-slate-50 dark:border-slate-800/50 ${result.severity === 'Low' ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : 'bg-amber-50/30 dark:bg-amber-900/10'}`}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
              result.severity === 'Low' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {result.severity === 'Low' ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
          </motion.div>
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">Analysis Complete</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Risk Level: <span className={`font-bold ${severityTextColors[result.severity] || 'text-slate-500'}`}>{result.severity} Risk</span>
          </p>
        </div>

        {/* RESULTS GRID */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Verdict Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Fairness Score</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-black ${severityTextColors[result.severity] || 'text-slate-500'}`}>
                  {result.fairnessScore}
                </span>
                <span className="text-slate-400 text-sm font-bold">/ 100</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium italic">
                "{result.summary}"
              </p>
            </div>

            {/* Metrics List */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Key Metrics</p>
              {result.metrics.map((metric, i: number) => (
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

          {/* Visualization Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Approval Rate Comparison</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Comparison across mapped groups</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Users size={14} />
                  Total N = {result.groupStats.reduce((acc: number, curr) => acc + curr.totalCount, 0).toLocaleString()}
                </div>
              </div>

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
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                      formatter={(value: any) => [`${(Number(value) * 100).toFixed(1)}%`, 'Approval Rate']}
                    />
                    <Bar dataKey="rate" radius={[0, 8, 8, 0]} barSize={32}>
                      {biasData.map((_entry, index: number) => (
                        <Cell key={`cell-${index}`} fill={_entry.rate < result.metrics[0].threshold ? '#f59e0b' : '#6366f1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations & Warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <Lightbulb size={16} /> Recommendations
                  </h4>
                  <button 
                    onClick={onViewFixes}
                    className="text-[10px] font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                  >
                    Details
                  </button>
                </div>
                <ul className="space-y-3">
                  {result.recommendations.map((rec: string, i: number) => (
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
                  {result.warnings.length > 0 ? result.warnings.map((warn: string, i: number) => (
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
            onClick={onNewAudit}
            className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold text-sm transition-all group"
          >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Run New Audit
          </button>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all">
              <FileDown size={18} />
              Download Full PDF
            </button>

            <button 
              onClick={onDashboard}
              className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)]"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────

const UploadDataset = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);

  const [analysisMapping, setAnalysisMapping] = useState({
    targetColumn: "",
    protectedColumn: "",
    groupA: "",
    groupB: "",
    approvalValue: ""
  });

  const handleFileAccepted = (file: File) => {
    setUploadedFile(file);
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setAnalysisMapping({
      targetColumn: "",
      protectedColumn: "",
      groupA: "",
      groupB: "",
      approvalValue: ""
    });
  };

  const handleContinue = async () => {
    if (!uploadedFile) return;
    
    try {
      // Step 1: Upload and get headers
      const response = await biasService.upload(uploadedFile);
      setDetectedHeaders(response.data.headers);
      
      // We pass the headers to the next step
      setCurrentStep(2);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload dataset. Please check your connection.");
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Shared sidebar — active state handled via useLocation inside Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Upload Dataset" subtitle="Acme Corp • auditor" />

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Page Header - Only show on Upload Step */}
            {currentStep === 1 && (
              <header className="mb-10">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
                  Upload Dataset
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  CSV or Excel up to 10 MB. We'll auto-detect decision and
                  protected-attribute columns.
                </p>
              </header>
            )}

            {/* Stepper */}
            <Stepper currentStep={currentStep} />

            {/* Step Content */}
            {currentStep === 1 ? (
              <>
                <UploadZone onFileAccepted={handleFileAccepted} />
                {uploadedFile && (
                  <FileCard
                    file={uploadedFile}
                    onRemove={handleRemove}
                    onContinue={handleContinue}
                  />
                )}
              </>
            ) : currentStep === 2 ? (
              <ColumnMappingUI
                fileName={uploadedFile?.name ?? "your file"}
                headers={detectedHeaders}
                onAnalyze={(mapping) => {
                  setAnalysisMapping(mapping);
                  setCurrentStep(3);
                }}
                onBack={() => setCurrentStep((s) => Math.max(1, s - 1))}
                onDashboard={() => navigate("/dashboard")}
              />
            ) : currentStep === 3 ? (
              <AnalysisStep 
                file={uploadedFile!} 
                mapping={analysisMapping}
                onComplete={(res) => {
                  setAnalysisResult(res);
                  setCurrentStep(4);
                }} 
              />
            ) : (
              <AnalysisResults
                result={analysisResult}
                onNewAudit={() => {
                  setCurrentStep(1);
                  setUploadedFile(null);
                  setAnalysisResult(null);
                }}
                onDashboard={() => navigate("/dashboard")}
                onViewFixes={() => navigate("/recommendations")}
              />
            )}

            {/* Bottom nav (hidden on step 4 since it has its own Footer) */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  ← Back to Dashboard
                </button>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                    className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    ← Previous step
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadDataset;