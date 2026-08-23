import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  PieChart,
  Zap,
  ShieldCheck,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import { DynamicBusinessKPI } from '../../types';

interface DynamicKpiGridProps {
  kpis: DynamicBusinessKPI[];
  isSyncing: boolean;
  onKpiClick?: (kpi: DynamicBusinessKPI) => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  revenue: DollarSign,
  profitability: PieChart,
  efficiency: Zap,
  cash: ShieldCheck,
  expenses: Layers,
  market_fx: Globe,
  growth: TrendingUp
};

// Top 4 critical metrics prioritized for executive overview
const PRIORITY_METRIC_IDS = ['kpi-arr', 'kpi-ebitda', 'kpi-nrr', 'kpi-cashflow'];

export const DynamicKpiGrid: React.FC<DynamicKpiGridProps> = ({
  kpis,
  isSyncing,
  onKpiClick
}) => {
  const [showAllMetrics, setShowAllMetrics] = useState(false);

  // Split into core priority metrics and secondary metrics
  const coreKpis = kpis.filter((k) => PRIORITY_METRIC_IDS.includes(k.id));
  const fallbackCore = coreKpis.length >= 4 ? coreKpis : kpis.slice(0, 4);
  const displayedKpis = showAllMetrics ? kpis : fallbackCore;

  return (
    <div className="space-y-3.5">
      {/* Section Header with Quick View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Key Financial Telemetry</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time computed ledger benchmarks and live performance indicators
          </p>
        </div>

        {kpis.length > 4 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowAllMetrics(!showAllMetrics)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                showAllMetrics
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  : 'bg-[#15161f] border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAllMetrics ? 'Showing All (8)' : 'Core Metrics (4)'}</span>
              {showAllMetrics ? (
                <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Grid Display: Clean, high-contrast, uncluttered */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {displayedKpis.map((kpi) => {
          const IconComponent = CATEGORY_ICONS[kpi.category] || TrendingUp;
          const isUp = kpi.trend === 'up';
          const isDown = kpi.trend === 'down';

          return (
            <div
              key={kpi.id}
              onClick={() => onKpiClick?.(kpi)}
              className="p-4 rounded-2xl bg-[#13141c] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-[#161824] transition-all duration-200 shadow-md shadow-black/30 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              {/* Subtle top indicator glow */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header: Title & Category Icon */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80 block truncate">
                      {kpi.category.replace('_', ' ')}
                    </span>
                    <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                      {kpi.title}
                    </h3>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all shrink-0">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Primary Metric Display */}
                <div className="my-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white tracking-tight font-mono">
                      {kpi.value}
                    </span>
                    {isSyncing && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>

                  {/* Change & Delta */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div
                      className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-lg ${
                        kpi.isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isUp ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : isDown ? (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-value / Clean Secondary Context */}
                {kpi.subValue && (
                  <p className="text-[11px] text-zinc-400 line-clamp-1 border-t border-white/[0.05] pt-2 mt-2">
                    {kpi.subValue}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
