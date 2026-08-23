import React from 'react';
import { SpendingCategory, StudentExpense } from '../../types';
import { formatINR } from '../../utils/currency';
import { Layers, Settings2, PlusCircle, AlertTriangle } from 'lucide-react';

interface CategoryAllocationListProps {
  categories: SpendingCategory[];
  expenses: StudentExpense[];
  selectedCategoryFilter: string | null;
  onSelectCategoryFilter: (categoryId: string | null) => void;
  onOpenManageCategories: () => void;
  onOpenAddExpense: () => void;
}

export const CategoryAllocationList: React.FC<CategoryAllocationListProps> = ({
  categories,
  expenses,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  onOpenManageCategories,
  onOpenAddExpense
}) => {
  const totalAllocated = categories.reduce((sum, c) => sum + c.budget, 0);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
      {/* Header with quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Category Allocations & Limits</h3>
            <p className="text-xs text-slate-400">Real-time budget utilization vs live transaction velocity</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedCategoryFilter && (
            <button
              onClick={() => onSelectCategoryFilter(null)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              Clear Filter
            </button>
          )}
          <button
            onClick={onOpenManageCategories}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Visual Multi-Segment Allocations Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
          {categories.map((cat) => {
            const widthPct = totalAllocated > 0 ? (cat.budget / totalAllocated) * 100 : 0;
            if (widthPct <= 0) return null;
            return (
              <div
                key={cat.id}
                style={{ width: `${widthPct}%`, backgroundColor: cat.color }}
                className="h-full hover:opacity-90 transition-opacity cursor-pointer"
                title={`${cat.name}: ${formatINR(cat.budget)} (${Math.round(widthPct)}%)`}
                onClick={() => onSelectCategoryFilter(cat.id === selectedCategoryFilter ? null : cat.id)}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Click any category card or bar segment to filter transactions below</span>
          <span>Allocated: {formatINR(totalAllocated)}</span>
        </div>
      </div>

      {/* Category Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const catExpenses = expenses.filter((e) => e.categoryId === cat.id);
          const catSpent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
          const usagePct = cat.budget > 0 ? Math.round((catSpent / cat.budget) * 100) : 0;
          const isOver = catSpent > cat.budget;
          const isNear = catSpent >= cat.budget * 0.85 && !isOver;
          const isSelected = selectedCategoryFilter === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategoryFilter(isSelected ? null : cat.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs font-semibold text-slate-200 truncate">{cat.name}</span>
                  </div>
                  {isOver ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      +{formatINR(catSpent - cat.budget)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {usagePct}%
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between text-xs mb-2">
                  <span className="text-slate-100 font-bold">{formatINR(catSpent)}</span>
                  <span className="text-slate-400 text-[11px]">of {formatINR(cat.budget)}</span>
                </div>
              </div>

              {/* Mini progress bar */}
              <div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOver ? 'bg-rose-500' : isNear ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{
                      width: `${Math.min(100, usagePct)}%`,
                      backgroundColor: !isOver && !isNear ? cat.color : undefined
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>{catExpenses.length} items</span>
                  <span>{isOver ? 'Over Limit' : `Rem: ${formatINR(Math.max(0, cat.budget - catSpent))}`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
