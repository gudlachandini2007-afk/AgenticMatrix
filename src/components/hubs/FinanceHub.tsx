import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SpendingCategory, MonthlyTrend, StudentExpense, FinancialTopic } from '../../types';
import {
  DEFAULT_MONTHLY_BUDGET,
  INITIAL_SPENDING_CATEGORIES,
  INITIAL_STUDENT_EXPENSES,
  INITIAL_MONTHLY_TRENDS,
  FINANCIAL_TOPICS
} from '../../data/financeData';
import { calculateAIForecast, generateFinancialInsights } from '../../services/financeAiService';
import { fetchFinanceQuizApi, ApiError } from '../../services/apiClient';
import { FinanceOverviewCards } from '../finance/FinanceOverviewCards';
import { FinanceInsightsBanner } from '../finance/FinanceInsightsBanner';
import { CategoryAllocationList } from '../finance/CategoryAllocationList';
import { FinanceChartsSection } from '../finance/FinanceChartsSection';
import { ExpenseTelemetryTable } from '../finance/ExpenseTelemetryTable';
import { FinanceAiAssistant } from '../finance/FinanceAiAssistant';
import { FinancialMasterySection } from '../finance/FinancialMasterySection';
import { EditBudgetModal } from '../finance/EditBudgetModal';
import { AddExpenseModal } from '../finance/AddExpenseModal';
import { CategoryManagementModal } from '../finance/CategoryManagementModal';

interface FinanceHubProps {
  categories?: SpendingCategory[];
  trends?: MonthlyTrend[];
  onUpdateCategory?: (categories: SpendingCategory[]) => void;
}

export const FinanceHub: React.FC<FinanceHubProps> = ({
  categories: initialCategoriesProp,
  trends: initialTrendsProp,
  onUpdateCategory
}) => {
  // -------------------------------------------------------------
  // 1. Core State with LocalStorage Persistence
  // -------------------------------------------------------------
  const [totalBudget, setTotalBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('student_monthly_budget');
      return saved ? JSON.parse(saved) : DEFAULT_MONTHLY_BUDGET;
    } catch {
      return DEFAULT_MONTHLY_BUDGET;
    }
  });

  const [categories, setCategories] = useState<SpendingCategory[]>(() => {
    try {
      const saved = localStorage.getItem('student_spending_categories');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialCategoriesProp && initialCategoriesProp.length > 0
      ? initialCategoriesProp
      : INITIAL_SPENDING_CATEGORIES;
  });

  const [expenses, setExpenses] = useState<StudentExpense[]>(() => {
    try {
      const saved = localStorage.getItem('student_expenses_list');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_STUDENT_EXPENSES;
  });

  const [monthlyTrends] = useState<MonthlyTrend[]>(() => {
    return initialTrendsProp && initialTrendsProp.length > 0
      ? initialTrendsProp
      : INITIAL_MONTHLY_TRENDS;
  });

  const [masteryScore, setMasteryScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('student_mastery_score');
      return saved ? JSON.parse(saved) : 3;
    } catch {
      return 3;
    }
  });

  const [learningStreak, setLearningStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('student_learning_streak');
      return saved ? JSON.parse(saved) : 4;
    } catch {
      return 4;
    }
  });

  // -------------------------------------------------------------
  // 2. Dynamic Backend Quiz & Questions State (GET /api/finance/quiz)
  // -------------------------------------------------------------
  const [topics, setTopics] = useState<FinancialTopic[]>(FINANCIAL_TOPICS);
  const [isQuizLoading, setIsQuizLoading] = useState<boolean>(true);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [backendOffline, setBackendOffline] = useState<boolean>(false);

  // Load Real Dynamic Quiz from FastAPI
  const loadBackendQuiz = useCallback(async () => {
    setIsQuizLoading(true);
    setQuizError(null);
    try {
      const liveTopics = await fetchFinanceQuizApi();
      if (liveTopics && liveTopics.length > 0) {
        setTopics(liveTopics);
      }
      setBackendOffline(false);
    } catch (err: any) {
      if (err instanceof ApiError && err.isBackendOffline) {
        setBackendOffline(true);
      }
      setQuizError(err?.message || 'Failed to fetch dynamic quiz questions from FastAPI');
      // Graceful fallback to default topics structure
      setTopics(FINANCIAL_TOPICS);
    } finally {
      setIsQuizLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendQuiz();
  }, [loadBackendQuiz]);

  // -------------------------------------------------------------
  // 3. Modals & Filter State
  // -------------------------------------------------------------
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<StudentExpense | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // -------------------------------------------------------------
  // 4. LocalStorage Synchronization
  // -------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('student_monthly_budget', JSON.stringify(totalBudget));
  }, [totalBudget]);

  useEffect(() => {
    localStorage.setItem('student_spending_categories', JSON.stringify(categories));
    onUpdateCategory?.(categories);
  }, [categories, onUpdateCategory]);

  useEffect(() => {
    localStorage.setItem('student_expenses_list', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('student_mastery_score', JSON.stringify(masteryScore));
  }, [masteryScore]);

  useEffect(() => {
    localStorage.setItem('student_learning_streak', JSON.stringify(learningStreak));
  }, [learningStreak]);

  // -------------------------------------------------------------
  // 5. Synchronize Category Amounts with Actual Outflows
  // -------------------------------------------------------------
  const syncedCategories = useMemo(() => {
    const totalSpentAcrossAll = expenses.reduce((sum, e) => sum + e.amount, 0);

    return categories.map((cat) => {
      const catSpent = expenses
        .filter((e) => e.categoryId === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);

      const pct = totalSpentAcrossAll > 0 ? Math.round((catSpent / totalSpentAcrossAll) * 100) : 0;

      return {
        ...cat,
        amount: catSpent,
        percentage: pct
      };
    });
  }, [categories, expenses]);

  // -------------------------------------------------------------
  // 6. Derived Computations (Budget, Efficiency, Forecast, Insights)
  // -------------------------------------------------------------
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  // Overspending sum across all categories where spent > budget
  const categoryOverspending = useMemo(() => {
    return syncedCategories.reduce((sum, cat) => {
      return cat.amount > cat.budget ? sum + (cat.amount - cat.budget) : sum;
    }, 0);
  }, [syncedCategories]);

  // Budget Efficiency Formula: "(Total Budget - Overspending) / Total Budget * 100"
  const budgetEfficiency = useMemo(() => {
    if (totalBudget <= 0) return 0;
    const efficiency = ((totalBudget - categoryOverspending) / totalBudget) * 100;
    return Math.max(0, Math.round(efficiency));
  }, [totalBudget, categoryOverspending]);

  // AI Forecast & proactive dynamic insights
  const aiForecast = useMemo(() => {
    return calculateAIForecast(totalBudget, expenses);
  }, [totalBudget, expenses]);

  const dynamicInsights = useMemo(() => {
    return generateFinancialInsights(totalBudget, syncedCategories, expenses);
  }, [totalBudget, syncedCategories, expenses]);

  // -------------------------------------------------------------
  // 7. Event Handlers (CRUD for Expenses, Categories, Budget)
  // -------------------------------------------------------------
  const handleSaveBudget = (newTotalBudget: number, updatedCategories: SpendingCategory[]) => {
    setTotalBudget(newTotalBudget);
    setCategories(updatedCategories);
  };

  const handleSaveExpense = (expenseData: Omit<StudentExpense, 'id'> & { id?: string }) => {
    if (expenseData.id) {
      // Update existing
      setExpenses((prev) =>
        prev.map((e) => (e.id === expenseData.id ? (expenseData as StudentExpense) : e))
      );
    } else {
      // Create new
      const newExpense: StudentExpense = {
        ...expenseData,
        id: `exp-${Date.now()}`
      };
      setExpenses((prev) => [newExpense, ...prev]);
    }
    setExpenseToEdit(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  const handleOpenEditExpenseModal = (expense: StudentExpense) => {
    setExpenseToEdit(expense);
    setIsAddExpenseOpen(true);
  };

  const handleAddCategory = (newCat: Omit<SpendingCategory, 'id' | 'amount' | 'percentage'>) => {
    const newId = `cat-${Date.now()}`;
    const category: SpendingCategory = {
      ...newCat,
      id: newId,
      amount: 0,
      percentage: 0
    };
    setCategories((prev) => [...prev, category]);
  };

  const handleUpdateCategory = (updatedCat: SpendingCategory) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (categoryId: string, targetReassignCategoryId?: string) => {
    if (targetReassignCategoryId) {
      setExpenses((prev) =>
        prev.map((e) => (e.categoryId === categoryId ? { ...e, categoryId: targetReassignCategoryId } : e))
      );
    }
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    if (selectedCategoryFilter === categoryId) {
      setSelectedCategoryFilter(null);
    }
  };

  const handleTopicMastered = () => {
    setMasteryScore((prev) => Math.min(topics.length, prev + 1));
  };

  const handleStreakUpdate = (newStreak: number) => {
    setLearningStreak(newStreak);
  };

  const handleInsightActionClick = (hint?: string) => {
    if (!hint) return;
    if (hint.includes('Budget') || hint.includes('limit')) {
      setIsEditBudgetOpen(true);
    } else if (hint.includes('Topic') || hint.includes('Interest')) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview 4 Summary Cards */}
      <FinanceOverviewCards
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        remainingBudget={remainingBudget}
        budgetEfficiency={budgetEfficiency}
        masteryScore={masteryScore}
        totalQuizzes={topics.length}
        learningStreak={learningStreak}
        potentialSavings={aiForecast.potentialSavings}
        projectedSpending={aiForecast.projectedMonthEndSpending}
        onOpenEditBudget={() => setIsEditBudgetOpen(true)}
      />

      {/* 2. Proactive AI Financial Insights Banner */}
      <FinanceInsightsBanner
        insights={dynamicInsights}
        onActionClick={handleInsightActionClick}
      />

      {/* 3. Category Allocations & Live Telemetry Breakdown */}
      <CategoryAllocationList
        categories={syncedCategories}
        expenses={expenses}
        selectedCategoryFilter={selectedCategoryFilter}
        onSelectCategoryFilter={setSelectedCategoryFilter}
        onOpenManageCategories={() => setIsManageCategoriesOpen(true)}
        onOpenAddExpense={() => {
          setExpenseToEdit(null);
          setIsAddExpenseOpen(true);
        }}
      />

      {/* 4. Visual Spending Analytics (Donut, Monthly Trend, Budget vs Actual) */}
      <FinanceChartsSection
        categories={syncedCategories}
        monthlyTrends={monthlyTrends}
        expenses={expenses}
      />

      {/* 5. Two-Column Layout: Student Expense Telemetry Table & AI Finance Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ExpenseTelemetryTable
            expenses={expenses}
            categories={syncedCategories}
            selectedCategoryFilter={selectedCategoryFilter}
            onSelectCategoryFilter={setSelectedCategoryFilter}
            onOpenAddExpense={() => {
              setExpenseToEdit(null);
              setIsAddExpenseOpen(true);
            }}
            onEditExpense={handleOpenEditExpenseModal}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>

        <div className="lg:col-span-5">
          <FinanceAiAssistant
            totalBudget={totalBudget}
            categories={syncedCategories}
            expenses={expenses}
            monthlyTrends={monthlyTrends}
            onOpenEditBudget={() => setIsEditBudgetOpen(true)}
            onOpenAddExpense={() => {
              setExpenseToEdit(null);
              setIsAddExpenseOpen(true);
            }}
          />
        </div>
      </div>

      {/* 6. Financial Mastery & Interactive Quiz Hub from FastAPI GET /api/finance/quiz */}
      <FinancialMasterySection
        topics={topics}
        masteryScore={masteryScore}
        learningStreak={learningStreak}
        onTopicMastered={handleTopicMastered}
        onStreakUpdate={handleStreakUpdate}
      />

      {/* Modals */}
      <EditBudgetModal
        isOpen={isEditBudgetOpen}
        onClose={() => setIsEditBudgetOpen(false)}
        totalBudget={totalBudget}
        categories={syncedCategories}
        onSave={handleSaveBudget}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setExpenseToEdit(null);
        }}
        categories={syncedCategories}
        expenseToEdit={expenseToEdit}
        onSave={handleSaveExpense}
      />

      <CategoryManagementModal
        isOpen={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
        categories={syncedCategories}
        expenses={expenses}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};
