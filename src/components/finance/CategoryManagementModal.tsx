import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check, Sparkles } from 'lucide-react';
import { SpendingCategory, StudentExpense } from '../../types';
import { formatINR } from '../../utils/currency';

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: SpendingCategory[];
  expenses: StudentExpense[];
  onAddCategory: (category: Omit<SpendingCategory, 'id' | 'amount' | 'percentage'>) => void;
  onUpdateCategory: (category: SpendingCategory) => void;
  onDeleteCategory: (categoryId: string, targetReassignCategoryId?: string) => void;
}

const PRESET_COLORS = [
  '#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#a78bfa',
  '#f472b6', '#fb7185', '#94a3b8', '#4ade80', '#f97316', '#2dd4bf', '#e879f9'
];

export const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({
  isOpen,
  onClose,
  categories,
  expenses,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('2000');
  const [newCatColor, setNewCatColor] = useState(PRESET_COLORS[0]);

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editColor, setEditColor] = useState('');

  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);
  const [reassignCatId, setReassignCatId] = useState<string>('');

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setIsCreating(true);
    setNewCatName('');
    setNewCatBudget('2000');
    setNewCatColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const parsedBudget = parseFloat(newCatBudget) || 1000;

    onAddCategory({
      name: newCatName.trim(),
      budget: parsedBudget,
      color: newCatColor,
      iconName: 'Tag'
    });

    setIsCreating(false);
    setNewCatName('');
  };

  const handleStartEdit = (cat: SpendingCategory) => {
    setEditingCatId(cat.id);
    setEditName(cat.name);
    setEditBudget(cat.budget.toString());
    setEditColor(cat.color);
  };

  const handleSaveEdit = (cat: SpendingCategory) => {
    if (!editName.trim()) return;
    onUpdateCategory({
      ...cat,
      name: editName.trim(),
      budget: parseFloat(editBudget) || cat.budget,
      color: editColor || cat.color
    });
    setEditingCatId(null);
  };

  const handleTriggerDelete = (catId: string) => {
    const attachedCount = expenses.filter((e) => e.categoryId === catId).length;
    if (attachedCount > 0) {
      setConfirmDeleteCatId(catId);
      const remainingCats = categories.filter((c) => c.id !== catId);
      setReassignCatId(remainingCats[0]?.id || '');
    } else {
      onDeleteCategory(catId);
    }
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteCatId) return;
    onDeleteCategory(confirmDeleteCatId, reassignCatId);
    setConfirmDeleteCatId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Manage Spending Categories</h2>
            <p className="text-xs text-slate-400">Add, customize colors, or adjust specific category allowances</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* Add New Category Button / Form */}
          {!isCreating ? (
            <button
              onClick={handleStartCreate}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Category</span>
            </button>
          ) : (
            <form onSubmit={handleSaveCreate} className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New Category</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gym & Fitness, Travel"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Monthly Budget (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    placeholder="2000"
                    value={newCatBudget}
                    onChange={(e) => setNewCatBudget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1.5">Color Tag</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewCatColor(col)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newCatColor === col ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* Delete Confirmation Alert Modal Slice */}
          {confirmDeleteCatId && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-3">
              <p className="font-semibold text-rose-300">
                This category has active expenses attached! Select where to reassign them:
              </p>
              <select
                value={reassignCatId}
                onChange={(e) => setReassignCatId(e.target.value)}
                className="w-full bg-slate-900 border border-rose-500/40 rounded-lg px-3 py-2 text-slate-100 text-xs"
              >
                {categories
                  .filter((c) => c.id !== confirmDeleteCatId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      Reassign to: {c.name}
                    </option>
                  ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmDeleteCatId(null)}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-3 py-1 bg-rose-500 text-white rounded font-medium hover:bg-rose-600"
                >
                  Reassign & Delete
                </button>
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Active Categories ({categories.length})
            </span>
            {categories.map((cat) => {
              const isEditing = editingCatId === cat.id;
              const catExpenses = expenses.filter((e) => e.categoryId === cat.id);
              const totalCatSpent = catExpenses.reduce((s, e) => s + e.amount, 0);

              if (isEditing) {
                return (
                  <div
                    key={cat.id}
                    className="p-3 rounded-lg bg-slate-950/80 border border-cyan-500/40 space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100"
                      />
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={editBudget}
                        onChange={(e) => setEditBudget(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex gap-1">
                        {PRESET_COLORS.slice(0, 6).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditColor(c)}
                            className={`w-4 h-4 rounded-full ${editColor === c ? 'ring-2 ring-white' : ''}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setEditingCatId(null)}
                          className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(cat)}
                          className="px-2.5 py-1 text-[11px] bg-cyan-400 text-slate-950 font-semibold rounded flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Done</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{cat.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {formatINR(totalCatSpent)} spent / {formatINR(cat.budget)} allocated • {catExpenses.length} transactions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {categories.length > 1 && (
                      <button
                        onClick={() => handleTriggerDelete(cat.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-slate-200 hover:bg-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
