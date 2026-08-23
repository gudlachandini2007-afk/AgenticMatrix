import React, { useState, useMemo } from 'react';
import { StudentExpense, SpendingCategory } from '../../types';
import { formatINR } from '../../utils/currency';
import { Search, PlusCircle, Trash2, Edit2, ArrowUpDown, Filter, AlertCircle } from 'lucide-react';

interface ExpenseTelemetryTableProps {
  expenses: StudentExpense[];
  categories: SpendingCategory[];
  selectedCategoryFilter: string | null;
  onSelectCategoryFilter: (categoryId: string | null) => void;
  onOpenAddExpense: () => void;
  onEditExpense: (expense: StudentExpense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const ExpenseTelemetryTable: React.FC<ExpenseTelemetryTableProps> = ({
  expenses,
  categories,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  onOpenAddExpense,
  onEditExpense,
  onDeleteExpense
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c]));
  }, [categories]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        if (selectedCategoryFilter && exp.categoryId !== selectedCategoryFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = exp.name.toLowerCase().includes(q);
          const matchesNote = exp.note?.toLowerCase().includes(q) || false;
          const catName = categoryMap.get(exp.categoryId)?.name.toLowerCase() || '';
          const matchesCat = catName.includes(q);
          return matchesName || matchesNote || matchesCat;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          return sortDirection === 'desc'
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : new Date(a.date).getTime() - new Date(b.date).getTime();
        } else {
          return sortDirection === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
      });
  }, [expenses, selectedCategoryFilter, searchQuery, sortField, sortDirection, categoryMap]);

  const filteredSum = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Student Expense Telemetry</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {filteredExpenses.length} Records
            </span>
          </h3>
          <p className="text-xs text-slate-400">Track, modify, and audit all student transactional outflows</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Filter Select */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategoryFilter || ''}
              onChange={(e) => onSelectCategoryFilter(e.target.value || null)}
              className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Expense Button */}
          <button
            onClick={onOpenAddExpense}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Banner */}
      {deleteConfirmId && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Are you sure you want to permanently delete this expense?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDeleteExpense(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white font-semibold"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Expense & Note</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 cursor-pointer hover:text-cyan-400" onClick={() => toggleSort('date')}>
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-cyan-400" onClick={() => toggleSort('amount')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Amount (INR)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No matching expense records found. Click &quot;Add Expense&quot; to log a new purchase.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => {
                const cat = categoryMap.get(exp.categoryId);
                return (
                  <tr key={exp.id} className="hover:bg-slate-900/50 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-100">{exp.name}</div>
                      {exp.note && <div className="text-[11px] text-slate-500 truncate max-w-xs">{exp.note}</div>}
                    </td>
                    <td className="py-3 px-3">
                      {cat ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border"
                          style={{
                            backgroundColor: `${cat.color}15`,
                            borderColor: `${cat.color}40`,
                            color: cat.color
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                      ) : (
                        <span className="text-slate-500">Uncategorized</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {exp.date}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-100 font-mono">
                      {formatINR(exp.amount)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditExpense(exp)}
                          className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(exp.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot className="bg-slate-900/70 border-t border-slate-800 text-slate-300 font-medium">
            <tr>
              <td colSpan={3} className="py-2.5 px-4 text-xs">
                Total for visible selection ({filteredExpenses.length} items):
              </td>
              <td className="py-2.5 px-4 text-right font-bold text-cyan-400 text-xs font-mono">
                {formatINR(filteredSum)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
