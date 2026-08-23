import React, { useState, useEffect } from 'react';
import { X, Wallet, AlertCircle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { SpendingCategory } from '../../types';
import { formatINR } from '../../utils/currency';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalBudget: number;
  categories: SpendingCategory[];
  onSave: (newTotalBudget: number, updatedCategories: SpendingCategory[]) => void;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({
  isOpen,
  onClose,
  totalBudget,
  categories,
  onSave
}) => {
  const [tempTotalBudget, setTempTotalBudget] = useState<number>(totalBudget);
  const [tempCategories, setTempCategories] = useState<{ id: string; name: string; budget: number; color: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTempTotalBudget(totalBudget);
      setTempCategories(
        categories.map((c) => ({
          id: c.id,
          name: c.name,
          budget: c.budget,
          color: c.color
        }))
      );
    }
  }, [isOpen, totalBudget, categories]);

  if (!isOpen) return null;

  const allocatedSum = tempCategories.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
  const difference = tempTotalBudget - allocatedSum;
  const isBalanced = difference === 0;
  const isOverAllocated = difference < 0;

  const handleCategoryBudgetChange = (id: string, value: string) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setTempCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, budget: num } : c))
    );
  };

  const handleAutoSyncTotalToSum = () => {
    setTempTotalBudget(allocatedSum);
  };

  const handleDistributeEvenly = () => {
    if (tempCategories.length === 0) return;
    const perCat = Math.floor(tempTotalBudget / tempCategories.length);
    const remainder = tempTotalBudget % tempCategories.length;
    setTempCategories((prev) =>
      prev.map((c, i) => ({
        ...c,
        budget: perCat + (i === 0 ? remainder : 0)
      }))
    );
  };

  const handleResetDefaults = () => {
    setTempTotalBudget(40000);
    setTempCategories([
      { id: 'cat-tuition', name: 'Tuition & Academic', budget: 10000, color: '#38bdf8' },
      { id: 'cat-housing', name: 'Hostel / PG & Utilities', budget: 12000, color: '#818cf8' },
      { id: 'cat-food', name: 'Food & Groceries', budget: 8000, color: '#34d399' },
      { id: 'cat-transport', name: 'Transport', budget: 3000, color: '#fbbf24' },
      { id: 'cat-tech', name: 'Tech Gadgets', budget: 2500, color: '#a78bfa' },
      { id: 'cat-entertainment', name: 'Entertainment', budget: 2000, color: '#f472b6' },
      { id: 'cat-shopping', name: 'Shopping', budget: 1500, color: '#fb7185' },
      { id: 'cat-other', name: 'Other Expenses', budget: 1000, color: '#94a3b8' }
    ]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempTotalBudget <= 0) return;

    const updatedCategories: SpendingCategory[] = categories.map((cat) => {
      const match = tempCategories.find((tc) => tc.id === cat.id);
      const newBudget = match ? match.budget : cat.budget;
      const pct = tempTotalBudget > 0 ? Math.round((newBudget / tempTotalBudget) * 100) : 0;
      return {
        ...cat,
        budget: newBudget,
        percentage: pct
      };
    });

    onSave(tempTotalBudget, updatedCategories);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Edit Monthly Student Budget</h2>
              <p className="text-xs text-slate-400">Configure total monthly limit and category allocations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
            {/* Total Budget Input */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="total-monthly-budget" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Total Monthly Budget (₹ INR)
                </label>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Defaults (₹40,000)</span>
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                <input
                  id="total-monthly-budget"
                  type="number"
                  min="1000"
                  step="500"
                  value={tempTotalBudget || ''}
                  onChange={(e) => setTempTotalBudget(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="40000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-lg font-bold text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Category Allocation Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Category Allocations
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDistributeEvenly}
                    className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Distribute Evenly</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAutoSyncTotalToSum}
                    className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    <span>Match Sum ({formatINR(allocatedSum)})</span>
                  </button>
                </div>
              </div>

              {/* Category Rows */}
              <div className="space-y-2.5">
                {tempCategories.map((cat) => {
                  const pct = tempTotalBudget > 0 ? Math.round(((cat.budget || 0) / tempTotalBudget) * 100) : 0;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs font-medium text-slate-200 truncate">{cat.name}</span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-slate-500 font-mono w-10 text-right">
                          {pct}%
                        </span>
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="100"
                            value={cat.budget}
                            onChange={(e) => handleCategoryBudgetChange(cat.id, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md pl-6 pr-2 py-1.5 text-xs font-semibold text-slate-100 text-right focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reconciliation / Balance Telemetry Bar */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
              isBalanced
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : isOverAllocated
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <div className="flex items-center gap-2">
                {isBalanced ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>
                  {isBalanced
                    ? 'Perfect balance! Total allocations match monthly budget.'
                    : isOverAllocated
                    ? `Allocations exceed total budget by ${formatINR(Math.abs(difference))}`
                    : `Unallocated surplus buffer: ${formatINR(difference)}`}
                </span>
              </div>
              <span className="font-mono font-bold">
                {formatINR(allocatedSum)} / {formatINR(tempTotalBudget)}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md hover:shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
