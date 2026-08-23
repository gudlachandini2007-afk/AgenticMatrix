import { SpendingCategory, StudentExpense, FinancialTopic, MonthlyTrend, QuizQuestion } from '../types';

export const DEFAULT_MONTHLY_BUDGET = 40000;

export const INITIAL_SPENDING_CATEGORIES: SpendingCategory[] = [
  { id: 'cat-tuition', name: 'Tuition & Academic', amount: 9200, budget: 10000, color: '#38bdf8', iconName: 'GraduationCap', percentage: 27 },
  { id: 'cat-housing', name: 'Hostel / PG & Utilities', amount: 11500, budget: 12000, color: '#818cf8', iconName: 'Home', percentage: 33 },
  { id: 'cat-food', name: 'Food & Groceries', amount: 7150, budget: 8000, color: '#34d399', iconName: 'Utensils', percentage: 21 },
  { id: 'cat-transport', name: 'Transport', amount: 2400, budget: 3000, color: '#fbbf24', iconName: 'Bus', percentage: 7 },
  { id: 'cat-tech', name: 'Tech Gadgets', amount: 1850, budget: 2500, color: '#a78bfa', iconName: 'Laptop', percentage: 5 },
  { id: 'cat-entertainment', name: 'Entertainment', amount: 1200, budget: 2000, color: '#f472b6', iconName: 'Film', percentage: 3 },
  { id: 'cat-shopping', name: 'Shopping', amount: 1200, budget: 1500, color: '#fb7185', iconName: 'ShoppingBag', percentage: 3 },
  { id: 'cat-other', name: 'Other Expenses', amount: 0, budget: 1000, color: '#94a3b8', iconName: 'MoreHorizontal', percentage: 0 }
];

export const INITIAL_STUDENT_EXPENSES: StudentExpense[] = [
  { id: 'exp-1', name: 'PG Monthly Rent & Electricity', amount: 11500, categoryId: 'cat-housing', date: '2026-08-01', note: 'Single occupancy PG rent + shared power' },
  { id: 'exp-2', name: 'Semester Lab & Coursepack Fees', amount: 9200, categoryId: 'cat-tuition', date: '2026-08-05', note: 'AI & Data Science textbook + lab access pass' },
  { id: 'exp-3', name: 'College Mess Prepaid Coupons', amount: 4500, categoryId: 'cat-food', date: '2026-08-06', note: 'Monthly lunch and dinner meal coupons' },
  { id: 'exp-4', name: 'Delhi Metro SmartCard Auto-Recharge', amount: 2400, categoryId: 'cat-transport', date: '2026-08-10', note: 'Daily campus commute pass' },
  { id: 'exp-5', name: 'Blinkit Hostel Snacks & Fruit Bowl', amount: 2300, categoryId: 'cat-food', date: '2026-08-14', note: 'Oats, milk, almonds & green tea' },
  { id: 'exp-6', name: 'USB-C Fast Charger & Mousepad', amount: 1850, categoryId: 'cat-tech', date: '2026-08-16', note: '65W GaN adapter for laptop' },
  { id: 'exp-7', name: 'PVR Inox Movie Night & Snacks', amount: 1200, categoryId: 'cat-entertainment', date: '2026-08-18', note: 'Weekend outing with batchmates' },
  { id: 'exp-8', name: 'Campus Fest Official Hoodie', amount: 1200, categoryId: 'cat-shopping', date: '2026-08-20', note: 'TechFest merchandise' },
  { id: 'exp-9', name: 'Swiggy Mess Late-Night Dinner', amount: 350, categoryId: 'cat-food', date: '2026-08-23', note: 'Exam night paneer wrap & lemonade' }
];

export const INITIAL_MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: 'Apr', spending: 36200, savings: 3800, aiPredicted: 36000 },
  { month: 'May', spending: 34800, savings: 5200, aiPredicted: 35000 },
  { month: 'Jun', spending: 38500, savings: 1500, aiPredicted: 37500 },
  { month: 'Jul', spending: 33900, savings: 6100, aiPredicted: 34500 },
  { month: 'Aug', spending: 34500, savings: 5500, aiPredicted: 34200 },
  { month: 'Sep', spending: 35000, savings: 5000, aiPredicted: 34800 }
];

export const FINANCIAL_TOPICS: FinancialTopic[] = [
  {
    id: 'topic-budgeting',
    name: 'Budgeting',
    description: 'Frameworks like 50/30/20 & zero-based budgeting for college life',
    iconName: 'PieChart',
    question: {
      id: 'quiz-budgeting',
      topic: 'Budgeting',
      difficulty: 'Beginner',
      question: 'In the standard 50/30/20 student budgeting framework, what should the 20% portion be allocated toward?',
      conceptKey: '50/30/20 Budgeting Rule',
      options: [
        { id: 'opt-b1', text: 'Dining out and weekend cinema trips', isCorrect: false, explanation: 'Discretionary leisure and entertainment fit inside the 30% wants category.' },
        { id: 'opt-b2', text: 'Rent, tuition, and essential utilities', isCorrect: false, explanation: 'Living essentials and unavoidable baseline costs take up the 50% needs category.' },
        { id: 'opt-b3', text: 'Emergency buffer, savings, and debt reduction', isCorrect: true, explanation: 'Correct! 20% must be reserved for building your cash cushion, emergency fund, and future investments.' },
        { id: 'opt-b4', text: 'Discretionary gadget upgrades', isCorrect: false, explanation: 'Tech gadgets and accessories fall under discretionary wants (30%).' }
      ]
    }
  },
  {
    id: 'topic-saving',
    name: 'Saving',
    description: 'Automating high-yield savings & micro-saving strategies',
    iconName: 'PiggyBank',
    question: {
      id: 'quiz-saving',
      topic: 'Saving',
      difficulty: 'Beginner',
      question: 'What is the "Pay Yourself First" financial principle for students?',
      conceptKey: 'Pay Yourself First',
      options: [
        { id: 'opt-s1', text: 'Transferring a fixed percentage into savings immediately upon receiving allowance/stipend', isCorrect: true, explanation: 'Correct! Automated allocation before discretionary spending guarantees you consistently build wealth.' },
        { id: 'opt-s2', text: 'Spending freely and saving whatever coins remain at month end', isCorrect: false, explanation: 'Saving leftover scraps usually results in zero savings due to lifestyle inflation.' },
        { id: 'opt-s3', text: 'Buying personal luxury items before paying rent', isCorrect: false, explanation: 'Essential bills and obligations must never be delayed for luxuries.' },
        { id: 'opt-s4', text: 'Borrowing money to pay for weekend parties', isCorrect: false, explanation: 'High-interest consumer borrowing erodes financial stability.' }
      ]
    }
  },
  {
    id: 'topic-emergency',
    name: 'Emergency Fund',
    description: 'How much safety reserve a university student needs',
    iconName: 'ShieldAlert',
    question: {
      id: 'quiz-emergency',
      topic: 'Emergency Fund',
      difficulty: 'Beginner',
      question: 'How many months of essential living expenses should a student ideally keep in an easily accessible emergency fund?',
      conceptKey: 'Emergency Fund Buffer Size',
      options: [
        { id: 'opt-e1', text: '1 to 2 weeks of food money', isCorrect: false, explanation: 'Too small to cover unexpected medical bills, laptop repairs, or sudden travel.' },
        { id: 'opt-e2', text: '3 to 6 months of essential baseline expenses', isCorrect: true, explanation: 'Correct! 3 to 6 months in a liquid savings account or sweep-in FD protects you against emergencies.' },
        { id: 'opt-e3', text: '3 to 5 years of all living expenses', isCorrect: false, explanation: 'Excessive cash drag reduces returns against inflation; 3-6 months is standard.' },
        { id: 'opt-e4', text: 'Zero, relying entirely on high-interest credit cards', isCorrect: false, explanation: 'Relying on debt in emergencies leads to compounding interest traps.' }
      ]
    }
  },
  {
    id: 'topic-compound',
    name: 'Compound Interest',
    description: 'The mathematical exponential growth engine of early wealth',
    iconName: 'TrendingUp',
    question: {
      id: 'quiz-compound',
      topic: 'Compound Interest',
      difficulty: 'Intermediate',
      question: 'If a student invests ₹10,000 in an index mutual fund averaging 8% annual return, approximately how long will it take to double to ₹20,000 using the Rule of 72?',
      conceptKey: 'Rule of 72 (72 / 8 = 9 Years)',
      options: [
        { id: 'opt-c1', text: '6 Years', isCorrect: false, explanation: 'Incorrect. 72 divided by 8 is 9, not 6.' },
        { id: 'opt-c2', text: '9 Years', isCorrect: true, explanation: 'Correct! 72 ÷ 8 = 9 years to double your initial capital without adding any extra deposits.' },
        { id: 'opt-c3', text: '12 Years', isCorrect: false, explanation: 'Incorrect. At 8% annual compound growth, money doubles much faster.' },
        { id: 'opt-c4', text: '15 Years', isCorrect: false, explanation: 'Incorrect. 15 years would imply an annual growth rate below 5%.' }
      ]
    }
  },
  {
    id: 'topic-investing',
    name: 'Investing Basics',
    description: 'Systematic Investment Plans (SIP) vs lumpsum & index funds',
    iconName: 'BarChart2',
    question: {
      id: 'quiz-investing',
      topic: 'Investing Basics',
      difficulty: 'Beginner',
      question: 'Why is Rupee Cost Averaging via a monthly SIP (Systematic Investment Plan) advantageous for students?',
      conceptKey: 'Rupee Cost Averaging',
      options: [
        { id: 'opt-i1', text: 'It guarantees the stock market will never experience a downturn', isCorrect: false, explanation: 'Market volatility is natural; SIP does not prevent markets from fluctuating.' },
        { id: 'opt-i2', text: 'It automatically buys more units when prices are low and fewer units when prices are high', isCorrect: true, explanation: 'Correct! By investing a disciplined fixed sum every month, you average out purchase prices over time.' },
        { id: 'opt-i3', text: 'It eliminates the need to pay any fund management fees forever', isCorrect: false, explanation: 'Expense ratios still apply to mutual funds and ETFs.' },
        { id: 'opt-i4', text: 'It prevents you from withdrawing money for 30 years', isCorrect: false, explanation: 'Standard open-ended mutual funds remain liquid.' }
      ]
    }
  },
  {
    id: 'topic-loans',
    name: 'Loans & Interest',
    description: 'Debt payoff strategies: Avalanche vs Snowball methods',
    iconName: 'FileText',
    question: {
      id: 'quiz-loans',
      topic: 'Loans & Interest',
      difficulty: 'Intermediate',
      question: 'Under the "Avalanche Method" of student loan repayment, which loan should receive maximum extra payments first?',
      conceptKey: 'Debt Avalanche Method',
      options: [
        { id: 'opt-l1', text: 'The loan with the highest interest rate (APR)', isCorrect: true, explanation: 'Correct! Targeting the highest interest rate mathematically minimizes the total interest paid over the life of the debt.' },
        { id: 'opt-l2', text: 'The loan with the smallest balance (Snowball method)', isCorrect: false, explanation: 'Targeting the smallest balance first is the Snowball method (psychological wins).' },
        { id: 'opt-l3', text: 'The loan with the longest remaining term', isCorrect: false, explanation: 'Loan duration is not the optimization metric for minimal interest payout.' },
        { id: 'opt-l4', text: 'The loan from a government bank rather than private NBFC', isCorrect: false, explanation: 'Interest rate percentage dictates the mathematical priority.' }
      ]
    }
  },
  {
    id: 'topic-credit',
    name: 'Credit Cards',
    description: 'Building credit score safely & avoiding 36-42% APR traps',
    iconName: 'CreditCard',
    question: {
      id: 'quiz-credit',
      topic: 'Credit Cards',
      difficulty: 'Intermediate',
      question: 'What is the recommended maximum Credit Utilization Ratio to maintain an excellent credit score (CIBIL / Experian)?',
      conceptKey: 'Credit Utilization Ratio (< 30%)',
      options: [
        { id: 'opt-cr1', text: 'Under 30% of your total credit limit', isCorrect: true, explanation: 'Correct! Keeping utilization below 30% (ideally under 10-20%) shows lenders responsible debt usage and boosts your score.' },
        { id: 'opt-cr2', text: '90% to 100% of your limit each cycle', isCorrect: false, explanation: 'Maxing out cards severely damages your credit score and flags you as high risk.' },
        { id: 'opt-cr3', text: '50% to 75% of your limit', isCorrect: false, explanation: 'Over 30% begins to negatively affect your credit score calculation.' },
        { id: 'opt-cr4', text: 'Exactly 0% by never using the card at all', isCorrect: false, explanation: 'Some on-time activity is required to build an active payment history.' }
      ]
    }
  },
  {
    id: 'topic-planning',
    name: 'Financial Planning',
    description: 'Setting SMART student financial goals & managing inflation',
    iconName: 'Target',
    question: {
      id: 'quiz-planning',
      topic: 'Financial Planning',
      difficulty: 'Beginner',
      question: 'What makes a student financial goal "SMART"?',
      conceptKey: 'SMART Financial Goals',
      options: [
        { id: 'opt-p1', text: 'Specific, Measurable, Achievable, Relevant, and Time-bound', isCorrect: true, explanation: 'Correct! E.g. "Save ₹12,000 for a laptop in 6 months by cutting ₹2,000/mo" is a SMART goal.' },
        { id: 'opt-p2', text: 'Simple, Monetary, Automatic, Rapid, and Tax-free', isCorrect: false, explanation: 'Incorrect acronym.' },
        { id: 'opt-p3', text: 'Secret, Monthly, Aggressive, Risky, and Theoretical', isCorrect: false, explanation: 'Goals should be realistic, balanced, and clearly defined.' },
        { id: 'opt-p4', text: 'Stock-focused, Mutual, Analytical, Real-time, and Tangible', isCorrect: false, explanation: 'Incorrect acronym.' }
      ]
    }
  }
];

export const FINANCIAL_QUIZ_QUESTIONS: QuizQuestion[] = FINANCIAL_TOPICS.map((t) => t.question);

export const SUGGESTED_AI_PROMPTS = [
  'Why am I overspending?',
  'Where am I spending the most?',
  'How much can I save this month?',
  'Can I afford to spend ₹2,000 on a new pair of shoes?',
  'How much did I spend on food this month?',
  'Which category should I reduce?',
  'Predict my expenses for next month.',
  'Give me a plan to save ₹5,000.',
  'Compare this month with last month.'
];
