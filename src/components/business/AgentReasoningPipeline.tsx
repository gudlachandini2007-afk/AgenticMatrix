import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldAlert,
  BarChart3,
  Search,
  FileText,
  Play,
  RotateCcw,
  Code2
} from 'lucide-react';
import { AgentStep } from '../../types';

interface AgentReasoningPipelineProps {
  steps: AgentStep[];
  isProcessing: boolean;
  onAdvanceStep?: () => void;
  onResetPipeline?: () => void;
  onRunFullPipeline?: () => void;
}

const AGENT_STEP_ICONS: Record<number, React.FC<{ className?: string }>> = {
  1: Search, // Validation Agent
  2: BarChart3, // Business Analysis Agent
  3: Cpu, // Forecasting Agent
  4: ShieldAlert, // Risk Agent
  5: FileText // Executive Strategist
};

export const AgentReasoningPipeline: React.FC<AgentReasoningPipelineProps> = ({
  steps,
  isProcessing,
  onAdvanceStep,
  onResetPipeline,
  onRunFullPipeline
}) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = (completedCount / steps.length) * 100;

  const toggleStepExpand = (stepId: string) => {
    setExpandedStepId((prev) => (prev === stepId ? null : stepId));
  };

  return (
    <div className="p-5 rounded-2xl bg-[#13141c] border border-white/[0.08] shadow-lg shadow-black/40 space-y-4">
      {/* Header with Pipeline Title and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              AI Multi-Agent Reasoning Chain
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Sequential multi-agent synthesis processing live connected data feeds
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {onRunFullPipeline && (
            <button
              onClick={onRunFullPipeline}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Agents Active...' : 'Re-Run Pipeline'}</span>
            </button>
          )}

          {onAdvanceStep && (
            <button
              onClick={onAdvanceStep}
              disabled={isProcessing || completedCount === steps.length}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-white/10 transition-colors disabled:opacity-40"
              title="Advance one agent step"
            >
              <span>Step</span>
            </button>
          )}

          {onResetPipeline && (
            <button
              onClick={onResetPipeline}
              className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-white/10 transition-colors"
              title="Reset pipeline state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Pipeline Sequence Flow Banner */}
      <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.05] flex items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-zinc-400">
          <span className="text-emerald-400 font-semibold">Live Data</span>
          <span className="text-zinc-600">→</span>
          <span className={steps[0]?.status === 'completed' ? 'text-indigo-300 font-semibold' : 'text-zinc-500'}>
            Validation
          </span>
          <span className="text-zinc-600">→</span>
          <span className={steps[1]?.status === 'completed' ? 'text-indigo-300 font-semibold' : 'text-zinc-500'}>
            Analysis
          </span>
          <span className="text-zinc-600">→</span>
          <span className={steps[2]?.status === 'completed' ? 'text-indigo-300 font-semibold' : 'text-zinc-500'}>
            Forecasting
          </span>
          <span className="text-zinc-600">→</span>
          <span className={steps[3]?.status === 'completed' ? 'text-indigo-300 font-semibold' : 'text-zinc-500'}>
            Risk
          </span>
          <span className="text-zinc-600">→</span>
          <span className={steps[4]?.status === 'completed' ? 'text-indigo-300 font-semibold' : 'text-zinc-500'}>
            Strategist
          </span>
        </div>

        <span className="text-[11px] font-mono text-cyan-400 font-bold shrink-0">
          {completedCount} / {steps.length} Synced ({Math.round(progressPercent)}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 5-Agent Step Timeline Cards */}
      <div className="space-y-2.5">
        {steps.map((step) => {
          const Icon = AGENT_STEP_ICONS[step.order] || Brain;
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isExpanded = expandedStepId === step.id;

          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all ${
                isRunning
                  ? 'bg-indigo-950/20 border-indigo-500/50 shadow-md shadow-indigo-950/30'
                  : isCompleted
                  ? 'bg-zinc-900/50 border-white/[0.06] hover:border-white/20'
                  : 'bg-zinc-900/20 border-white/[0.03] opacity-60'
              }`}
            >
              {/* Main Step Header Row */}
              <div
                onClick={() => toggleStepExpand(step.id)}
                className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Status Indicator Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isRunning
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isRunning ? (
                      <Sparkles className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Agent Details */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-tight">
                        Agent {step.order}: {step.agentName}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isRunning
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 animate-pulse'
                            : isCompleted
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {isRunning ? 'Processing Live Data...' : isCompleted ? 'Completed' : 'Pending'}
                      </span>
                      {step.confidenceScore > 0 && (
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                          {step.confidenceScore}% conf
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-medium text-zinc-300 mt-0.5 truncate">
                      {step.title}
                    </h4>

                    {/* Brief thought snippet */}
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {step.thoughtProcess}
                    </p>
                  </div>
                </div>

                {/* Right: Timestamp and Toggle Accordion */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{step.timestamp}</span>
                  </span>
                  <div className="text-zinc-400 hover:text-white">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Computation Details / Telemetry Inputs */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-white/[0.05] space-y-2.5 text-xs">
                  {step.computationDetails && (
                    <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-white/[0.05] text-zinc-300 font-mono text-[11px] leading-relaxed">
                      <div className="flex items-center gap-1.5 text-cyan-400 mb-1 font-semibold text-[10px] uppercase">
                        <Code2 className="w-3 h-3" />
                        <span>Live Calculation Proof</span>
                      </div>
                      <p>{step.computationDetails}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {step.tags && step.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {step.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-white/10 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
