import React from 'react';
import { Wallet, TrendingUp, Award, Sparkles, Edit3, Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface FinanceOverviewCardsProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  budgetEfficiency: number;
  masteryScore: number;
  totalQuizzes: number;
  learningStreak: number;
  potentialSavings: number;
  projectedSpending: number;
  onOpenEditBudget: () => void;
}

export const FinanceOverviewCards: React.FC<FinanceOverviewCardsProps> = ({
  totalBudget,
  totalSpent,
  remainingBudget,
  budgetEfficiency,
  masteryScore,
  totalQuizzes,
  learningStreak,
  potentialSavings,
  projectedSpending,
  onOpenEditBudget
}) => {
  // Determine efficiency status
  const getEfficiencyBadge = (eff: number) => {
    if (eff >= 85) {
      return { text: 'Optimal', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 };
    }
    if (eff >= 70) {
      return { text: 'Moderate', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: TrendingUp };
    }
    return { text: 'Buffer Watch', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: AlertTriangle };
  };

  const effStatus = getEfficiencyBadge(budgetEfficiency);
  const EffIcon = effStatus.icon;

  const isOverBudget = totalSpent > totalBudget;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Monthly Budget Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Budget</span>
            </div>
            <button
              onClick={onOpenEditBudget}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all font-medium"
              title="Modify total budget & category caps"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Budget</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-100 tracking-tight">
              {formatINR(totalBudget)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Spent: <strong className="text-slate-200">{formatINR(totalSpent)}</strong></span>
              <span className={isOverBudget ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                {isOverBudget ? `Over by ${formatINR(totalSpent - totalBudget)}` : `Remaining: ${formatINR(remainingBudget)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-3">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverBudget ? 'bg-rose-500' : (totalSpent / (totalBudget || 1)) > 0.8 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, Math.round((totalSpent / (totalBudget || 1)) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>{Math.round((totalSpent / (totalBudget || 1)) * 100)}% utilized</span>
            <span>Target: 100%</span>
          </div>
        </div>
      </div>

      {/* 2. Budget Efficiency Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget Efficiency</span>
            </div>
            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-medium ${effStatus.color}`}>
              <EffIcon className="w-3 h-3" />
              {effStatus.text}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-100 tracking-tight flex items-baseline gap-2">
              <span>{Math.max(0, budgetEfficiency)}%</span>
              <span className="text-xs text-slate-500 font-normal">Score</span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Formula: (Total Budget − Overspending) ÷ Total × 100
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                budgetEfficiency >= 85 ? 'bg-emerald-400' : budgetEfficiency >= 70 ? 'bg-amber-400' : 'bg-rose-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, budgetEfficiency))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Discipline index</span>
            <span>{budgetEfficiency >= 80 ? 'Low Risk' : 'Review Caps'}</span>
          </div>
        </div>
      </div>

      {/* 3. Student Mastery Score Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-violet-500/15 transition-all" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Student Mastery</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{learningStreak} Streak</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-100 tracking-tight flex items-baseline gap-1.5">
              <span>{masteryScore}</span>
              <span className="text-sm font-normal text-slate-500">/ {totalQuizzes}</span>
              <span className="text-xs text-violet-400 font-medium ml-1">Topics Mastered</span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              {masteryScore === totalQuizzes
                ? 'All 8 fundamental topics conquered!'
                : `${totalQuizzes - masteryScore} more topics to unlock full certification.`}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-violet-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((masteryScore / (totalQuizzes || 1)) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>{Math.round((masteryScore / (totalQuizzes || 1)) * 100)}% completed</span>
            <span>8 Total Topics</span>
          </div>
        </div>
      </div>

      {/* 4. AI Savings Forecast Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/15 transition-all" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Savings Forecast</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
              Aug 2026
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-amber-400 tracking-tight">
              {formatINR(potentialSavings)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Expected: <strong className="text-slate-300">{formatINR(projectedSpending)}</strong></span>
              <span className="text-emerald-400 font-medium">Potential Buffer</span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((potentialSavings / (totalBudget || 1)) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Burn velocity calibrated</span>
            <span>Est. EOM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
