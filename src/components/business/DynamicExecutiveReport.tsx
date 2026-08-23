import React, { useState } from 'react';
import {
  Edit3,
  Check,
  Download,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Copy
} from 'lucide-react';
import { BusinessReport } from '../../types';

interface DynamicExecutiveReportProps {
  report: BusinessReport;
  onUpdateReport: (report: BusinessReport) => void;
}

export const DynamicExecutiveReport: React.FC<DynamicExecutiveReportProps> = ({
  report,
  onUpdateReport
}) => {
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(report.executiveSummary);
  const [copied, setCopied] = useState(false);

  const handleSaveSummary = () => {
    onUpdateReport({
      ...report,
      executiveSummary: summaryText,
      lastUpdated: `Edited at ${new Date().toLocaleTimeString()}`
    });
    setIsEditingSummary(false);
  };

  const handleCopyReport = () => {
    const text = `=== ${report.title} ===\nAuthor: ${report.authorAgent}\nUpdated: ${report.lastUpdated}\n\nEXECUTIVE SUMMARY:\n${report.executiveSummary}\n\nKEY DIRECTIVES:\n${report.strategicRecommendations.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#13141c] border border-white/[0.08] shadow-xl shadow-black/50 space-y-5 relative overflow-hidden">
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

      {/* Header: Title, Metadata, and Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              {report.category}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400">{report.authorAgent}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {report.title}
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {report.lastUpdated}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            title="Copy briefing to clipboard"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `executive-report-${Date.now()}.json`;
              a.click();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 1. Executive Summary Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Executive Synthesis & Board Directive</span>
          </h3>

          {!isEditingSummary ? (
            <button
              onClick={() => setIsEditingSummary(true)}
              className="text-xs text-zinc-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Summary</span>
            </button>
          ) : (
            <button
              onClick={handleSaveSummary}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        {isEditingSummary ? (
          <textarea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-indigo-500/50 text-zinc-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
          />
        ) : (
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.05] text-zinc-200 text-xs leading-relaxed font-sans">
            {report.executiveSummary}
          </div>
        )}
      </div>

      {/* 2. Key Strategic Directives (Compact & Clear) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          <span>Strategic Directives</span>
        </h3>

        <div className="space-y-2">
          {report.strategicRecommendations.slice(0, 3).map((rec, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-zinc-900/40 border border-white/[0.05] flex items-start gap-2.5 text-xs leading-relaxed text-zinc-200"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Primary Risk & Active Mitigations (Streamlined) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Key Risk Mitigations</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {report.riskMatrix.slice(0, 2).map((item, idx) => {
            const isHigh = item.impact === 'High';

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-zinc-900/40 border border-white/[0.05] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-white truncate">
                    {item.risk}
                  </h4>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${
                      isHigh
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/25'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  <span className="text-zinc-400 font-medium">Protocol: </span>
                  {item.mitigation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
