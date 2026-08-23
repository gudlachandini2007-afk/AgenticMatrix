import React, { useState } from 'react';
import { PieChart as PieIcon, TrendingUp, BarChart3 } from 'lucide-react';
import { SpendingCategory, MonthlyTrend, StudentExpense } from '../../types';
import { formatINR } from '../../utils/currency';

interface FinanceChartsSectionProps {
  categories: SpendingCategory[];
  monthlyTrends: MonthlyTrend[];
  expenses: StudentExpense[];
}

export const FinanceChartsSection: React.FC<FinanceChartsSectionProps> = ({
  categories,
  monthlyTrends,
  expenses
}) => {
  const [activeTab, setActiveTab] = useState<'distribution' | 'trends' | 'comparison'>('distribution');

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const maxTrendSpending = Math.max(...monthlyTrends.map((t) => Math.max(t.spending, t.aiPredicted || 0, 40000)));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Visual Spending Analytics & Trajectory</span>
          </h3>
          <p className="text-xs text-slate-400">Multi-dimensional breakdown of student cashflow</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('distribution')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'distribution'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Distribution</span>
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'trends'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Monthly Trends</span>
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'comparison'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Budget vs Actual</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Category Distribution */}
      {activeTab === 'distribution' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-center">
          {/* Visual SVG Donut Chart */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let accumulatedPercent = 0;
                  return categories.map((cat) => {
                    const catSpent = expenses
                      .filter((e) => e.categoryId === cat.id)
                      .reduce((s, e) => s + e.amount, 0);
                    const pct = totalSpent > 0 ? (catSpent / totalSpent) * 100 : 0;
                    if (pct <= 0) return null;

                    const strokeDasharray = `${pct} ${100 - pct}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += pct;

                    return (
                      <circle
                        key={cat.id}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth="14"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        pathLength="100"
                        className="hover:opacity-80 transition-all cursor-pointer"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Spent</span>
                <span className="text-sm font-bold text-slate-100">{formatINR(totalSpent)}</span>
                <span className="text-[10px] text-cyan-400 font-medium">Aug 2026</span>
              </div>
            </div>
          </div>

          {/* Detailed Category Legend Grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {categories.map((cat) => {
              const catSpent = expenses
                .filter((e) => e.categoryId === cat.id)
                .reduce((s, e) => s + e.amount, 0);
              const pct = totalSpent > 0 ? Math.round((catSpent / totalSpent) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 truncate">{cat.name}</div>
                      <div className="text-[10px] text-slate-500">{pct}% of total outflows</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-slate-100">{formatINR(catSpent)}</div>
                    <div className="text-[10px] text-slate-400">Cap: {formatINR(cat.budget)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Spending Trends & AI Predictions */}
      {activeTab === 'trends' && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-6 gap-2 sm:gap-4 h-56 items-end pt-6 pb-2 px-2 border-b border-slate-800">
            {monthlyTrends.map((t) => {
              const spendHeight = (t.spending / maxTrendSpending) * 100;
              const aiHeight = t.aiPredicted ? (t.aiPredicted / maxTrendSpending) * 100 : spendHeight;

              return (
                <div key={t.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {formatINR(t.spending)}
                  </div>
                  <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-40">
                    {/* Actual spending bar */}
                    <div
                      style={{ height: `${spendHeight}%` }}
                      className="w-3.5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all group-hover:brightness-125"
                      title={`${t.month}: ${formatINR(t.spending)} Spent`}
                    />
                    {/* AI Predicted / Savings bar */}
                    {t.aiPredicted && (
                      <div
                        style={{ height: `${aiHeight}%` }}
                        className="w-3.5 bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-md opacity-70 group-hover:opacity-100 transition-all"
                        title={`${t.month} AI Forecast: ${formatINR(t.aiPredicted)}`}
                      />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{t.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-400" />
                <span>Actual Spending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-violet-400" />
                <span>AI Predicted Trajectory</span>
              </div>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">
              Avg Monthly Burn: ₹35,483 • Projected Stability: High
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Budget vs Actual Comparison */}
      {activeTab === 'comparison' && (
        <div className="space-y-3 pt-2">
          {categories.map((cat) => {
            const catSpent = expenses
              .filter((e) => e.categoryId === cat.id)
              .reduce((s, e) => s + e.amount, 0);
            const isOver = catSpent > cat.budget;
            const maxVal = Math.max(cat.budget, catSpent, 1000);

            return (
              <div key={cat.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-400">Limit: <strong className="text-slate-200">{formatINR(cat.budget)}</strong></span>
                    <span className={isOver ? 'text-rose-400 font-bold' : 'text-emerald-400 font-medium'}>
                      Actual: {formatINR(catSpent)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Budget allocation bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${Math.min(100, (cat.budget / maxVal) * 100)}%` }}
                      className="h-full bg-slate-600 rounded-full"
                    />
                  </div>
                  {/* Actual spent bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      style={{
                        width: `${Math.min(100, (catSpent / maxVal) * 100)}%`,
                        backgroundColor: isOver ? '#f43f5e' : cat.color
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
