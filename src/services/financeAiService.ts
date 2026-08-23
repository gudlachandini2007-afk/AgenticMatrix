import { SpendingCategory, StudentExpense, MonthlyTrend } from '../types';
import { formatINR } from '../utils/currency';

export interface AIInsightItem {
  id: string;
  type: 'alert' | 'opportunity' | 'trend' | 'progress';
  title: string;
  message: string;
  actionHint?: string;
  categoryName?: string;
}

export interface AIFinancialForecast {
  currentSpent: number;
  remainingBudget: number;
  dailyBurnRate: number;
  daysPassedInMonth: number;
  daysRemainingInMonth: number;
  projectedMonthEndSpending: number;
  potentialSavings: number;
  isOverbudgetProjected: boolean;
  variancePercentage: number;
  insight: string;
}

/**
 * Calculates current month burn rate, forecast, and potential savings
 */
export function calculateAIForecast(
  totalBudget: number,
  expenses: StudentExpense[]
): AIFinancialForecast {
  const currentSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, totalBudget - currentSpent);
  
  // Simulation anchor: August 2026 (Day 23 of 31)
  const daysPassed = 23;
  const totalDays = 31;
  const daysRemaining = totalDays - daysPassed;

  const dailyBurnRate = daysPassed > 0 ? Math.round(currentSpent / daysPassed) : 0;
  // Estimate end of month: current spent + (daily burn for discretionary only ~50% of fixed costs already paid)
  // Usually rent/tuition is paid early, so daily discretionary is lower
  const projectedDiscretionaryDaily = Math.round((currentSpent * 0.3) / daysPassed);
  const projectedRemainingSpending = projectedDiscretionaryDaily * daysRemaining;
  const projectedMonthEndSpending = Math.round(currentSpent + projectedRemainingSpending);
  
  const potentialSavings = Math.max(0, totalBudget - projectedMonthEndSpending);
  const isOverbudgetProjected = projectedMonthEndSpending > totalBudget;
  const variancePercentage = totalBudget > 0 ? Math.round(((projectedMonthEndSpending - totalBudget) / totalBudget) * 100) : 0;

  let insight = '';
  if (isOverbudgetProjected) {
    insight = `At your current velocity of ${formatINR(dailyBurnRate)}/day, you are projected to exceed your budget by ${formatINR(projectedMonthEndSpending - totalBudget)}. Slow discretionary spending for the remaining ${daysRemaining} days.`;
  } else if (potentialSavings > 0) {
    insight = `Excellent discipline! You are on track to save approximately ${formatINR(potentialSavings)} by the end of this month. Consider sweeping this into a liquid FD or SIP.`;
  } else {
    insight = `Your spending matches your target budget perfectly. Maintain your daily cap of under ${formatINR(Math.round(remainingBudget / Math.max(1, daysRemaining)))}/day.`;
  }

  return {
    currentSpent,
    remainingBudget,
    dailyBurnRate,
    daysPassedInMonth: daysPassed,
    daysRemainingInMonth: daysRemaining,
    projectedMonthEndSpending,
    potentialSavings,
    isOverbudgetProjected,
    variancePercentage,
    insight
  };
}

/**
 * Generates proactive contextual insights banner
 */
export function generateFinancialInsights(
  totalBudget: number,
  categories: SpendingCategory[],
  expenses: StudentExpense[]
): AIInsightItem[] {
  const insights: AIInsightItem[] = [];
  const forecast = calculateAIForecast(totalBudget, expenses);

  // 1. Overspending Alerts
  const overBudgetCats = categories.filter((c) => c.amount > c.budget && c.budget > 0);
  const nearBudgetCats = categories.filter((c) => c.amount >= c.budget * 0.85 && c.amount <= c.budget && c.budget > 0);

  if (overBudgetCats.length > 0) {
    const topOver = overBudgetCats[0];
    const excess = topOver.amount - topOver.budget;
    insights.push({
      id: 'alert-overbudget',
      type: 'alert',
      title: `Overbudget Alert: ${topOver.name}`,
      message: `You have exceeded your ${topOver.name} budget by ${formatINR(excess)} (${Math.round((topOver.amount / topOver.budget) * 100)}% utilized).`,
      actionHint: 'Freeze discretionary purchases in this category for the rest of August.',
      categoryName: topOver.name
    });
  } else if (nearBudgetCats.length > 0) {
    const near = nearBudgetCats[0];
    insights.push({
      id: 'alert-near-limit',
      type: 'alert',
      title: `Budget Warning: ${near.name}`,
      message: `${near.name} is at ${Math.round((near.amount / near.budget) * 100)}% of its limit (${formatINR(near.amount)} / ${formatINR(near.budget)}).`,
      actionHint: `Only ${formatINR(near.budget - near.amount)} buffer remaining.`,
      categoryName: near.name
    });
  }

  // 2. Saving Opportunity
  const foodCat = categories.find((c) => c.name.toLowerCase().includes('food'));
  if (foodCat && foodCat.amount > 0) {
    const foodSavings = Math.round(foodCat.amount * 0.15);
    insights.push({
      id: 'opp-food',
      type: 'opportunity',
      title: 'Micro-Saving Opportunity',
      message: `Cooking in hostel or utilizing meal coupons 3 days/week could unlock ~${formatINR(foodSavings)} in surplus monthly capital.`,
      actionHint: 'Set a weekly mess meal goal'
    });
  } else {
    insights.push({
      id: 'opp-general',
      type: 'opportunity',
      title: 'Auto-SIP Wealth Building',
      message: `Allocating ${formatINR(Math.round(forecast.potentialSavings * 0.5))} from your surplus into a Nifty 50 Index Fund could double in ~9 years.`,
      actionHint: 'Review Compound Interest Topic'
    });
  }

  // 3. Spending Velocity Trend
  insights.push({
    id: 'trend-velocity',
    type: 'trend',
    title: 'Velocity & Burn Rate',
    message: `Current daily spend rate: ${formatINR(forecast.dailyBurnRate)}/day across 23 days. Projected month-end total: ${formatINR(forecast.projectedMonthEndSpending)}.`,
    actionHint: `${forecast.daysRemainingInMonth} days remaining in August billing cycle.`
  });

  // 4. Good Progress
  const wellManaged = categories.filter((c) => c.amount > 0 && c.amount <= c.budget * 0.6);
  if (wellManaged.length > 0) {
    const topSafe = wellManaged[0];
    insights.push({
      id: 'prog-safe',
      type: 'progress',
      title: `Strong Control: ${topSafe.name}`,
      message: `Only ${Math.round((topSafe.amount / topSafe.budget) * 100)}% utilized (${formatINR(topSafe.amount)} of ${formatINR(topSafe.budget)}). Great discipline!`,
      actionHint: 'Keep this pace'
    });
  }

  return insights;
}

/**
 * Intelligent financial assistant query evaluator
 */
export function answerFinancialQuery(
  query: string,
  context: {
    totalBudget: number;
    categories: SpendingCategory[];
    expenses: StudentExpense[];
    monthlyTrends: MonthlyTrend[];
  }
): { text: string; suggestedActions: string[] } {
  const q = query.toLowerCase().trim();
  const { totalBudget, categories, expenses } = context;
  const currentSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = Math.max(0, totalBudget - currentSpent);
  const forecast = calculateAIForecast(totalBudget, expenses);

  // 1. Overspending
  if (q.includes('overspend') || q.includes('why am i') || q.includes('loss') || q.includes('exceed')) {
    const overCats = categories.filter((c) => c.amount > c.budget);
    if (overCats.length > 0) {
      const details = overCats
        .map((c) => `• **${c.name}**: ${formatINR(c.amount)} spent vs ${formatINR(c.budget)} limit (+${formatINR(c.amount - c.budget)} overrun)`)
        .join('\n');
      return {
        text: `Here is the root-cause analysis of your spending overruns:\n\n${details}\n\n**Key Takeaway**: Discretionary orders and high upfront costs early in the month triggered immediate category deficits. You still have ${formatINR(remaining)} in your total pool, but need to restrict these categories.`,
        suggestedActions: ['Edit Category Budgets', 'Filter Overbudget Expenses', 'Check Savings Forecast']
      };
    }
    return {
      text: `Good news! You are **not overspending** your overall budget. You have used ${formatINR(currentSpent)} out of ${formatINR(totalBudget)} (${Math.round((currentSpent / totalBudget) * 100)}%), leaving a healthy **${formatINR(remaining)}** reserve.`,
      suggestedActions: ['Where am I spending the most?', 'How much can I save this month?']
    };
  }

  // 2. Where spending the most
  if (q.includes('spending the most') || q.includes('highest') || q.includes('top expense') || q.includes('where')) {
    const sorted = [...categories].sort((a, b) => b.amount - a.amount);
    const top3 = sorted.slice(0, 3);
    const breakdown = top3
      .map((c, i) => `${i + 1}. **${c.name}**: ${formatINR(c.amount)} (${Math.round((c.amount / (currentSpent || 1)) * 100)}% of all spending)`)
      .join('\n');
    return {
      text: `Your top expense drivers this month are:\n\n${breakdown}\n\n**Analysis**: Fixed essentials (Housing & Academic fees) dominate the list at ~${Math.round(((top3[0].amount + (top3[1]?.amount || 0)) / (currentSpent || 1)) * 100)}% of total outflows, which is expected for university students.`,
      suggestedActions: ['Which category should I reduce?', 'How much did I spend on food this month?']
    };
  }

  // 3. How much can I save
  if (q.includes('how much can i save') || q.includes('savings') || q.includes('save this month')) {
    return {
      text: `Based on your live burn rate analysis:\n\n• **Monthly Total Budget**: ${formatINR(totalBudget)}\n• **Spent so far (23 Days)**: ${formatINR(currentSpent)}\n• **Remaining Cash**: ${formatINR(remaining)}\n• **AI Estimated Month-End Spend**: ${formatINR(forecast.projectedMonthEndSpending)}\n• **Projected Savings**: **${formatINR(forecast.potentialSavings)}**\n\n💡 **Tip**: If you limit food delivery & retail shopping for the remaining 8 days, your potential savings can climb up to **${formatINR(forecast.potentialSavings + 1500)}**.`,
      suggestedActions: ['Give me a plan to save ₹5,000.', 'Predict my expenses for next month.']
    };
  }

  // 4. Affordability check (e.g. ₹2,000 on shoes or item)
  if (q.includes('afford') || q.includes('shoes') || q.includes('buy') || q.includes('₹') || /\d+/.test(q)) {
    const match = q.match(/\d+[\d,]*/);
    const cost = match ? parseInt(match[0].replace(/,/g, ''), 10) : 2000;
    const shoppingCat = categories.find((c) => c.name.toLowerCase().includes('shopping')) || { budget: 1500, amount: 1200 };
    const shoppingRemain = Math.max(0, shoppingCat.budget - shoppingCat.amount);

    if (remaining >= cost && shoppingRemain >= cost) {
      return {
        text: `**Verdict: YES, AFFORDABLE ✅**\n\n• Target Cost: ${formatINR(cost)}\n• Available Category Buffer: ${formatINR(shoppingRemain)}\n• Overall Remaining Budget: ${formatINR(remaining)}\n\nYou can comfortably purchase this without exceeding either your Shopping category limit or monthly pool.`,
        suggestedActions: ['Add Expense', 'Where am I spending the most?']
      };
    } else if (remaining >= cost) {
      return {
        text: `**Verdict: CONDITIONALLY AFFORDABLE ⚠️**\n\n• Target Cost: ${formatINR(cost)}\n• Overall Remaining Budget: ${formatINR(remaining)}\n• Shopping Category Buffer: ${formatINR(shoppingRemain)}\n\nWhile your overall wallet has ${formatINR(remaining)}, purchasing this will exceed your dedicated Shopping budget by ${formatINR(cost - shoppingRemain)}. If you buy it, consider reallocating ₹${cost - shoppingRemain} from your Entertainment or Discretionary reserve.`,
        suggestedActions: ['Edit Category Budgets', 'Add Expense']
      };
    } else {
      return {
        text: `**Verdict: NOT RECOMMENDED ❌**\n\n• Target Cost: ${formatINR(cost)}\n• Total Remaining Budget: ${formatINR(remaining)}\n\nThis purchase exceeds your remaining monthly liquidity. Delay this purchase until next month's fresh budget cycle.`,
        suggestedActions: ['Give me a plan to save ₹5,000.', 'How much can I save this month?']
      };
    }
  }

  // 5. Food spending
  if (q.includes('food') || q.includes('mess') || q.includes('groceries') || q.includes('swiggy') || q.includes('zomato')) {
    const foodCat = categories.find((c) => c.name.toLowerCase().includes('food')) || { amount: 7150, budget: 8000 };
    const foodExpenses = expenses.filter((e) => e.categoryId === 'cat-food' || e.name.toLowerCase().includes('food') || e.name.toLowerCase().includes('mess') || e.name.toLowerCase().includes('dinner') || e.name.toLowerCase().includes('snack'));
    
    return {
      text: `Here is your detailed Food & Groceries breakdown:\n\n• **Total Food Spending**: ${formatINR(foodCat.amount)} (of ${formatINR(foodCat.budget)} allocated)\n• **Remaining Food Buffer**: ${formatINR(Math.max(0, foodCat.budget - foodCat.amount))}\n• **Total Transactions**: ${foodExpenses.length} transactions recorded\n\n💡 **Insight**: Prepaid college mess coupons accounted for ${formatINR(4500)}, while quick snacks and Swiggy delivery totaled ${formatINR(2650)}. You have ${formatINR(foodCat.budget - foodCat.amount)} left for the rest of August.`,
      suggestedActions: ['Filter Food Expenses', 'Which category should I reduce?']
    };
  }

  // 6. Which category should I reduce
  if (q.includes('reduce') || q.includes('cut down') || q.includes('lower')) {
    return {
      text: `Based on discretionary vs essential weighting, here are the top 2 categories to trim:\n\n1. **Food Deliveries & Late Night Orders**: Cut Swiggy/Zomato orders from 3x/week to 1x/week → **Saves ~₹1,200/mo**.\n2. **Tech Accessories & Impulse Shopping**: Enforce a 48-hour cool-off rule before buying gadgets → **Saves ~₹1,500/mo**.\n\nCombined potential monthly liquidity boost: **+₹2,700/month**.`,
      suggestedActions: ['Give me a plan to save ₹5,000.', 'How much can I save this month?']
    };
  }

  // 7. Predict next month
  if (q.includes('predict') || q.includes('next month') || q.includes('forecast')) {
    const fixedEst = 11500 + 9200; // Rent + tuition
    const varEst = 14500;
    const totalProj = fixedEst + varEst;
    return {
      text: `**AI Projection for September 2026**:\n\n• **Fixed Commitments** (PG Rent & Academic Fees): ~${formatINR(fixedEst)}\n• **Variable Living** (Food, Commute, Utilities): ~${formatINR(varEst)}\n• **Projected Baseline**: **${formatINR(totalProj)}**\n• **Recommended Budget Cap**: **${formatINR(totalBudget)}**\n\nThis leaves you with an expected surplus buffer of **${formatINR(totalBudget - totalProj)}** for unexpected contingencies.`,
      suggestedActions: ['Edit Budget', 'Compare this month with last month.']
    };
  }

  // 8. Plan to save ₹5,000
  if (q.includes('plan') || q.includes('5000') || q.includes('5,000') || q.includes('goal')) {
    return {
      text: `**Tactical 4-Step Plan to Save ₹5,000/Month**:\n\n1. **Mess Utilization (Save ₹1,800)**: Rely 80% on college prepaid meals instead of outside deliveries.\n2. **Metro SmartCard Pass (Save ₹600)**: Use monthly concession passes rather than daily single-journey tokens.\n3. **Subscription Audit (Save ₹500)**: Share Spotify Student / OTT family plans with hostel roommates.\n4. **Discretionary Cool-Off (Save ₹2,100)**: Limit impulsive tech and apparel purchases to 1 item per quarter.\n\n**Total Monthly Target**: **₹5,000** → Invest in a direct Nifty 50 Index Fund for exponential compound interest!`,
      suggestedActions: ['Review Compound Interest Topic', 'Edit Budget']
    };
  }

  // 9. Compare with last month
  if (q.includes('compare') || q.includes('last month') || q.includes('previous')) {
    return {
      text: `**Monthly Comparative Analysis (July vs August 2026)**:\n\n• **July Spending**: ₹33,900 (Savings: ₹6,100)\n• **August Current Spent**: ${formatINR(currentSpent)} (Projected: ${formatINR(forecast.projectedMonthEndSpending)})\n• **Savings Difference**: ${forecast.potentialSavings >= 6100 ? `+${formatINR(forecast.potentialSavings - 6100)} more saved` : `-${formatINR(6100 - forecast.potentialSavings)} less saved`}\n\n**Insight**: August expenses had a one-time semester textbook fee of ₹9,200 which wasn't present in July, explaining the higher outflow.`,
      suggestedActions: ['Where am I spending the most?', 'How much can I save this month?']
    };
  }

  // Fallback intelligent response
  return {
    text: `I've analyzed your financial telemetry:\n\n• Total Budget: **${formatINR(totalBudget)}**\n• Total Spent: **${formatINR(currentSpent)}**\n• Remaining Buffer: **${formatINR(remaining)}**\n• Burn Rate: **${formatINR(forecast.dailyBurnRate)}/day**\n\nYou are managing your student finances steadily! Ask me about specific categories, affordability checks, savings plans, or quiz concepts anytime.`,
    suggestedActions: ['Why am I overspending?', 'How much can I save this month?', 'Give me a plan to save ₹5,000.']
  };
}
