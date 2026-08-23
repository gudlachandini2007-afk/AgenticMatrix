import {
  AgentStep,
  BusinessReport,
  UploadedDocument,
  SpendingCategory,
  StudentExpense,
  FinancialTopic,
  MonthlyTrend,
  QuizQuestion,
  PlantDiagnosticSample,
  WeatherAlert,
  TelemetryLog,
  ChatMessage,
  InventoryItem,
  AgentMetric
} from './types';

export const AGENT_METRICS: AgentMetric[] = [
  {
    id: 'agent-exec',
    name: 'Executive Strategist AI',
    role: 'Corporate Synthesis & Decision Matrix',
    hub: 'business',
    status: 'active',
    latencyMs: 18,
    accuracy: 99.4,
    tokensProcessed: 1420800,
    avatarIcon: 'Briefcase'
  },
  {
    id: 'agent-fin',
    name: 'Fiscal Sentinel AI',
    role: 'Student Portfolio & Expense Optimization',
    hub: 'finance',
    status: 'active',
    latencyMs: 24,
    accuracy: 98.9,
    tokensProcessed: 984200,
    avatarIcon: 'PieChart'
  },
  {
    id: 'agent-agro',
    name: 'PhytoScan Agro AI',
    role: 'Precision Agronomy & Crop Vision',
    hub: 'agriculture',
    status: 'processing',
    latencyMs: 32,
    accuracy: 97.8,
    tokensProcessed: 2150400,
    avatarIcon: 'Sprout'
  },
  {
    id: 'agent-retail',
    name: 'OmniCommerce AI',
    role: 'Concierge Support & Inventory Balancer',
    hub: 'ecommerce',
    status: 'active',
    latencyMs: 14,
    accuracy: 99.1,
    tokensProcessed: 3410900,
    avatarIcon: 'ShoppingBag'
  }
];

// -------------------------------------------------------------
// 1. Business & Executive Hub Initial Data
// -------------------------------------------------------------
export const INITIAL_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-1',
    name: 'Q3_Global_Expansion_Strategy.pdf',
    size: 2450000,
    type: 'application/pdf',
    uploadTimestamp: '10 mins ago',
    status: 'completed',
    tokenCount: 42350,
    summary: 'Comprehensive analysis of APAC and EMEA market penetration, operational risk factors, and capital requirements for 2026.',
    keyInsights: [
      'APAC cloud infra investments show 34% higher ROI than initially projected.',
      'Recommended currency hedging on EUR/USD to buffer against volatility.',
      'Talent acquisition in Singapore office needs 15% accelerated budget.'
    ]
  },
  {
    id: 'doc-2',
    name: 'Board_Executive_Summary_2026.docx',
    size: 1120000,
    type: 'application/docx',
    uploadTimestamp: '1 hour ago',
    status: 'completed',
    tokenCount: 18400,
    summary: 'Consolidated executive memo summarizing EBITDA margins and AI automation milestones.',
    keyInsights: [
      'Operating margins expanded by 410 bps due to automated workflow pipeline.',
      'Customer acquisition cost reduced by 22% quarter-over-quarter.'
    ]
  }
];

export const INITIAL_AGENT_STEPS: AgentStep[] = [
  {
    id: 'step-1',
    order: 1,
    agentName: 'Vector Parsing Agent',
    title: 'Document Ingestion & Semantic Chunking',
    thoughtProcess: 'Extracted 14 distinct data tables and validated schema alignment. Normalized currency tokens to USD equivalents.',
    timestamp: '09:41:02 AM',
    status: 'completed',
    confidenceScore: 99.8,
    tags: ['OCR Pass', 'Vector Embeddings', 'JSON Schema']
  },
  {
    id: 'step-2',
    order: 2,
    agentName: 'Hypothesis Generator',
    title: 'Macro Market & Competitor Correlation',
    thoughtProcess: 'Cross-referencing revenue trajectories with top 3 competitors in enterprise cloud services. Flagged unexpected CAC dip in Q2.',
    timestamp: '09:41:18 AM',
    status: 'completed',
    confidenceScore: 98.4,
    tags: ['Market Grounding', 'Risk Scan']
  },
  {
    id: 'step-3',
    order: 3,
    agentName: 'Quantitative Synthesizer',
    title: 'Discounted Cash Flow (DCF) Valuation Engine',
    thoughtProcess: 'Simulating 10,000 Monte Carlo iterations for capital expenditure scenarios under varying interest rates (3.2% - 4.8%).',
    timestamp: '09:41:45 AM',
    status: 'running',
    confidenceScore: 96.7,
    tags: ['Monte Carlo', 'DCF', 'Active Computation']
  },
  {
    id: 'step-4',
    order: 4,
    agentName: 'Executive Narrative Drafter',
    title: 'Drafting Board-Ready Briefing Document',
    thoughtProcess: 'Structuring output into Executive Summary, Strategic Imperatives, and Mitigation Matrix with Linear-style typography.',
    timestamp: 'Pending',
    status: 'pending',
    confidenceScore: 95.0,
    tags: ['Synthesis', 'Tone: C-Suite']
  }
];

export const INITIAL_BUSINESS_REPORT: BusinessReport = {
  id: 'rep-2026-q3',
  title: 'Executive Strategic Assessment: Enterprise AI & Market Growth',
  category: 'Corporate Strategy & Governance',
  lastUpdated: 'Just now by Executive Strategist AI',
  authorAgent: 'Executive Strategist AI v4.2',
  executiveSummary:
    'Over the trailing 90 days, multi-agent automated workflows have condensed strategic report generation cycles from 14 days down to 6 minutes. Cross-functional productivity has climbed 38.4%, while operational expenditures remain well below the 2026 conservative baseline. Accelerating APAC infrastructure deployment while maintaining currency hedging remains the highest-yield capital allocation priority.',
  financialHighlights: [
    { metric: 'Annualized Run Rate (ARR)', value: '₹355.2 Cr', change: '+31.2% YoY', positive: true },
    { metric: 'Operating Margin (EBITDA)', value: '34.6%', change: '+4.1% QoQ', positive: true },
    { metric: 'CAC Payback Period', value: '4.2 Months', change: '-1.8 Months', positive: true },
    { metric: 'R&D Token Efficiency', value: '99.4%', change: '+8.7% vs Benchmark', positive: true }
  ],
  strategicRecommendations: [
    'Expand secondary data node in Mumbai & Bangalore by Q4 to minimize latency for Indian enterprise clients.',
    'Deploy autonomous inventory reconciliation agents across retail partners to lower stockout risk.',
    'Authorize ₹28.5 Cr hedge allocation for FX fluctuations during cross-border trade rebalancing.'
  ],
  riskMatrix: [
    {
      risk: 'Regional Compliance & Data Residency',
      impact: 'High',
      mitigation: 'Implement sovereign enclaves and localized cryptographic key vaults.'
    },
    {
      risk: 'Compute Infrastructure Latency Spike',
      impact: 'Medium',
      mitigation: 'Multi-region failover cluster with automated fallback to edge nodes.'
    },
    {
      risk: 'Model Drift in Quantitative Forecasting',
      impact: 'Low',
      mitigation: 'Continuous active-learning pipeline with daily backtesting against actual revenues.'
    }
  ]
};

// -------------------------------------------------------------
// 2. Finance & Student Hub Initial Data
// -------------------------------------------------------------
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
  { id: 'exp-1', name: 'PG Monthly Rent & Electricity', amount: 11500, categoryId: 'cat-housing', date: '2026-08-01', note: 'Single occupancy PG rent + power' },
  { id: 'exp-2', name: 'Semester Lab & Coursepack Fees', amount: 9200, categoryId: 'cat-tuition', date: '2026-08-05', note: 'AI & Data Science textbook + lab access pass' },
  { id: 'exp-3', name: 'College Mess Prepaid Coupons', amount: 4500, categoryId: 'cat-food', date: '2026-08-06', note: 'Monthly lunch and dinner coupons' },
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

export const FINANCIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1',
    topic: 'Compound Interest & Investing',
    difficulty: 'Beginner',
    question: 'If a student invests ₹10,000 in an index fund averaging 8% annual return, approximately how many years will it take to double to ₹20,000 using the Rule of 72?',
    conceptKey: 'Rule of 72 (72 / 8 = 9 Years)',
    options: [
      { id: 'opt-1', text: '6 Years', isCorrect: false, explanation: 'Incorrect. 72 divided by 8 is 9, not 6.' },
      { id: 'opt-2', text: '9 Years', isCorrect: true, explanation: 'Correct! According to the Rule of 72: 72 ÷ 8 = 9 years to double your initial capital.' },
      { id: 'opt-3', text: '12 Years', isCorrect: false, explanation: 'Incorrect. At 8%, capital doubles significantly faster than 12 years.' },
      { id: 'opt-4', text: '15 Years', isCorrect: false, explanation: 'Incorrect. 15 years would correspond to an annual return under 5%.' }
    ]
  },
  {
    id: 'quiz-2',
    topic: 'Credit Score Optimization',
    difficulty: 'Intermediate',
    question: 'Which single factor carries the highest weight (35%) in calculating a standard FICO credit score?',
    conceptKey: 'FICO Score Components',
    options: [
      { id: 'opt-5', text: 'Credit Utilization Ratio', isCorrect: false, explanation: 'Amounts owed/utilization represents 30%, which is the 2nd largest factor.' },
      { id: 'opt-6', text: 'Payment History (On-time Payments)', isCorrect: true, explanation: 'Correct! Payment history makes up 35% of your FICO score, making on-time payments essential.' },
      { id: 'opt-7', text: 'Length of Credit History', isCorrect: false, explanation: 'Length of credit history accounts for 15% of your total score.' },
      { id: 'opt-8', text: 'Types of Credit in Use', isCorrect: false, explanation: 'Credit mix only represents 10% of the overall score.' }
    ]
  },
  {
    id: 'quiz-3',
    topic: 'Student Loan Repayment',
    difficulty: 'Intermediate',
    question: 'Under the "Avalanche Method" of student debt payoff, which loan balance should you prioritize with extra payments?',
    conceptKey: 'Debt Avalanche vs Snowball',
    options: [
      { id: 'opt-9', text: 'The loan with the highest interest rate', isCorrect: true, explanation: 'Correct! The Avalanche method prioritizes the highest interest rate first, mathematically minimizing total interest paid.' },
      { id: 'opt-10', text: 'The loan with the lowest principal balance', isCorrect: false, explanation: 'Incorrect. Targeting the smallest balance first is called the "Snowball Method".' },
      { id: 'opt-11', text: 'The loan with the shortest remaining tenure', isCorrect: false, explanation: 'Incorrect. Loan tenure is not the primary optimization target in the Avalanche method.' },
      { id: 'opt-12', text: 'The loan from a federal provider rather than private', isCorrect: false, explanation: 'Incorrect. Provider type does not dictate mathematically optimal debt sequencing.' }
    ]
  },
  {
    id: 'quiz-4',
    topic: 'Student Budgeting Frameworks',
    difficulty: 'Beginner',
    question: 'In the classic 50/30/20 budgeting rule, what does the 20% portion represent?',
    conceptKey: '50/30/20 Budgeting Rule',
    options: [
      { id: 'opt-13', text: 'Discretionary Dining & Entertainment', isCorrect: false, explanation: 'Incorrect. Wants and leisure belong in the 30% bucket.' },
      { id: 'opt-14', text: 'Rent, Tuition & Essential Needs', isCorrect: false, explanation: 'Incorrect. Essential living expenses take up the 50% category.' },
      { id: 'opt-15', text: 'Savings, Emergency Fund & Debt Repayment', isCorrect: true, explanation: 'Correct! 20% is reserved for building your emergency buffer, high-yield savings, and paying down debt.' },
      { id: 'opt-16', text: 'Taxes & Administrative Fees', isCorrect: false, explanation: 'Incorrect. The 50/30/20 rule is calculated on after-tax net income.' }
    ]
  }
];

// -------------------------------------------------------------
// 3. Smart Agriculture Hub Initial Data
// -------------------------------------------------------------
export const SAMPLE_PLANT_DIAGNOSTICS: PlantDiagnosticSample[] = [
  {
    id: 'plant-1',
    cropName: 'Solanum lycopersicum (Tomato)',
    diseaseName: 'Early Blight (Alternaria solani)',
    scientificName: 'Alternaria solani',
    confidence: 96.4,
    severity: 'High',
    imagePlaceholder: '🍅',
    symptoms: [
      'Concentric target-like rings with dark brown necrotic spots on lower leaves',
      'Surrounding chlorotic yellow halos',
      'Stem collar lesions near soil baseline'
    ],
    recommendedAction: 'Apply copper-based bio-fungicide within 24 hours and prune affected lower canopy leaves.',
    treatmentSteps: [
      'Isolate irrigation lines to prevent splash dispersal of fungal spores.',
      'Apply Copper Octanoate solution at 15ml/gallon during early morning hours.',
      'Mulch soil bed with sterilized straw to block soil-borne spore uplift.'
    ],
    preventionTip: 'Maintain minimum 60cm row spacing to maximize airflow and lower canopy humidity.'
  },
  {
    id: 'plant-2',
    cropName: 'Zea mays (Maize / Sweet Corn)',
    diseaseName: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    scientificName: 'Exserohilum turcicum',
    confidence: 94.1,
    severity: 'Moderate',
    imagePlaceholder: '🌽',
    symptoms: [
      'Long, elliptical grayish-green or tan lesions (cigar-shaped)',
      'Lesions expanding along leaf veins (2-15 cm in length)',
      'Premature leaf senescence in upper whorl'
    ],
    recommendedAction: 'Deploy foliar Azoxystrobin spray and regulate overhead pivot irrigation timing.',
    treatmentSteps: [
      'Calibrate pivot to water between 04:00 and 08:00 to reduce leaf wetness duration.',
      'Deploy targeted bio-stimulant containing Trichoderma harzianum.'
    ],
    preventionTip: 'Practice 2-year crop rotation with legumes to break spore reservoir in residue.'
  },
  {
    id: 'plant-3',
    cropName: 'Malus domestica (Honeycrisp Apple)',
    diseaseName: 'Apple Scab (Venturia inaequalis)',
    scientificName: 'Venturia inaequalis',
    confidence: 98.2,
    severity: 'Critical',
    imagePlaceholder: '🍏',
    symptoms: [
      'Olive-green to velvety dark spots on upper leaf surfaces',
      'Distorted fruit skin with corky brown scabs',
      'Early season leaf drop leading to reduced photosynthetic vigor'
    ],
    recommendedAction: 'Immediate systemic fungicide treatment with Difenoconazole before next rain event.',
    treatmentSteps: [
      'Scan orchard rows with drone vision for localized hotspots.',
      'Apply protectant fungicide at green tip stage.',
      'Collect and shred fallen autumn leaves with flail mower.'
    ],
    preventionTip: 'Select scab-resistant rootstocks and prune water sprouts annually.'
  },
  {
    id: 'plant-4',
    cropName: 'Triticum aestivum (Winter Wheat)',
    diseaseName: 'Optimal Leaf Health (No Pathogens Detected)',
    scientificName: 'Healthy Chlorophyll Profile',
    confidence: 99.1,
    severity: 'Low',
    imagePlaceholder: '🌾',
    symptoms: [
      'Uniform dark green coloration across flag leaf',
      'Healthy stomatal conductance and turgor pressure',
      'Zero necrotic lesions or rust pustules observed'
    ],
    recommendedAction: 'Continue current nitrogen feeding and scheduled soil moisture telemetry check.',
    treatmentSteps: [
      'Maintain standard macro-nutrient delivery at 120 kg N/ha.',
      'Monitor satellite NDVI vegetation index every 72 hours.'
    ],
    preventionTip: 'Soil microbiome is in peak balance. Retain current cover crop strategy.'
  }
];

export const INITIAL_WEATHER_ALERTS: WeatherAlert[] = [
  {
    id: 'w-1',
    type: 'Frost Warning',
    severity: 'critical',
    zone: 'Zone B (Vineyard & Orchard Terraces)',
    timestamp: 'Alert for Tonight 03:00 - 06:30 AM',
    forecastWindow: 'Next 8 Hours',
    metricValue: '-1.8°C / 28.7°F',
    advisory: 'Activate automated frost fans and micro-sprinkler thermal insulation systems across low-lying orchard blocks.'
  },
  {
    id: 'w-2',
    type: 'High Humidity / Spore Risk',
    severity: 'warning',
    zone: 'Zone A (Hydroponic Greenhouse Complex)',
    timestamp: 'Current Condition: 94% RH',
    forecastWindow: 'Active for 14 hrs',
    metricValue: '94% RH @ 21.4°C',
    advisory: 'High risk index for Botrytis cinerea and powdery mildew sporulation. Trigger exhaust ventilation louvers.'
  },
  {
    id: 'w-3',
    type: 'Optimal Spray Window',
    severity: 'info',
    zone: 'Zone C (Open Cereal Field Sector 4)',
    timestamp: 'Tomorrow 06:00 - 10:00 AM',
    forecastWindow: 'Optimal Window',
    metricValue: 'Wind: 4 km/h | 0% Precip',
    advisory: 'Atmospheric conditions ideal for bio-pesticide and micronutrient drone application with minimal drift.'
  }
];

export const INITIAL_TELEMETRY_LOGS: TelemetryLog[] = [
  { id: 'tel-01', zone: 'Sector A-1 (Tomatoes)', crop: 'Heirloom Tomato', soilMoisture: 42.1, soilTemp: 21.8, ambientHumidity: 68, lightIntensity: 48500, healthIndex: 94, status: 'Optimal', lastUpdated: '12s ago' },
  { id: 'tel-02', zone: 'Sector A-2 (Bell Peppers)', crop: 'Sweet Bell Pepper', soilMoisture: 31.4, soilTemp: 23.2, ambientHumidity: 74, lightIntensity: 52000, healthIndex: 88, status: 'Attention', lastUpdated: '45s ago' },
  { id: 'tel-03', zone: 'Sector B-1 (Vineyard)', crop: 'Pinot Noir Grape', soilMoisture: 28.2, soilTemp: 19.5, ambientHumidity: 88, lightIntensity: 31000, healthIndex: 76, status: 'Warning', lastUpdated: '1m ago' },
  { id: 'tel-04', zone: 'Sector B-2 (Orchard)', crop: 'Honeycrisp Apple', soilMoisture: 45.0, soilTemp: 18.2, ambientHumidity: 82, lightIntensity: 29000, healthIndex: 91, status: 'Optimal', lastUpdated: '2m ago' },
  { id: 'tel-05', zone: 'Sector C-1 (Maize Fields)', crop: 'Sweet Corn Hybrid', soilMoisture: 38.6, soilTemp: 24.1, ambientHumidity: 59, lightIntensity: 64000, healthIndex: 96, status: 'Optimal', lastUpdated: '3m ago' },
  { id: 'tel-06', zone: 'Sector C-2 (Winter Wheat)', crop: 'Soft White Wheat', soilMoisture: 36.9, soilTemp: 20.4, ambientHumidity: 61, lightIntensity: 58000, healthIndex: 95, status: 'Optimal', lastUpdated: '4m ago' },
  { id: 'tel-07', zone: 'Sector D-1 (Berries)', crop: 'Organic Blackberry', soilMoisture: 29.8, soilTemp: 22.0, ambientHumidity: 79, lightIntensity: 44000, healthIndex: 82, status: 'Attention', lastUpdated: '5m ago' }
];

// -------------------------------------------------------------
// 4. E-Commerce & Retail Hub Initial Data
// -------------------------------------------------------------
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'agent',
    agentName: 'OmniCommerce AI Concierge',
    text: 'Namaste! I am your OmniCommerce AI Assistant. I monitor real-time orders, customer inquiries, and inventory sync across your storefronts. You can ask for product recommendations (e.g., "buy a red dress with rupees 1000"), check stock alerts, or track orders.',
    timestamp: '10:14 AM',
    confidence: 99.2,
    suggestedActions: [
      'Buy a red dress with rupees 1000',
      'Check low-stock alerts',
      'Lookup order #ORD-9824',
      'Analyze return rate for Fashion category'
    ]
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Can you show me why the Wireless Noise-Cancelling Headphones are running low on stock and suggest a reorder quantity?',
    timestamp: '10:15 AM'
  },
  {
    id: 'msg-3',
    sender: 'agent',
    agentName: 'OmniCommerce AI Concierge',
    text: 'Analyzing SKU `AUD-NC-700`: Sales velocity spiked +142% this week following a viral creator campaign. You currently have 14 units left with a daily burn rate of 8.2 units.\n\nRecommended action: Generate an expedited purchase order for **250 units** from Shenzhen Audio Labs (Lead time: 5 days) to avoid a complete stockout before Friday.',
    timestamp: '10:15 AM',
    confidence: 98.7,
    suggestedActions: ['Approve 250 unit Reorder PO', 'Adjust price by +₹1,200 to slow burn', 'Notify VIP waitlist'],
    relatedItemSku: 'AUD-NC-700'
  }
];

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  // Fashion & Apparel (Curated dresses from top Indian e-commerce platforms)
  {
    id: 'inv-dr-1',
    sku: 'DRS-RED-FLR',
    name: 'Crimson Elegance Floral Anarkali Red Dress',
    category: 'Fashion & Apparel',
    stockLevel: 45,
    reorderPoint: 20,
    maxCapacity: 150,
    price: 799,
    velocity: 'High',
    supplier: 'Surat Silk & Cotton Mills',
    status: 'In Stock',
    restockLeadDays: 3,
    marketplace: 'Myntra',
    storeUrl: 'https://www.myntra.com/red-anarkali-dress',
    rating: 4.8,
    reviewsCount: 2340,
    imageEmoji: '👗',
    sourceSystem: 'Myntra Partner API v2.4 (Warehouse ID: BLR-04)'
  },
  {
    id: 'inv-dr-2',
    sku: 'DRS-RED-GEO',
    name: 'Scarlet Georgette A-Line Party Red Dress',
    category: 'Fashion & Apparel',
    stockLevel: 32,
    reorderPoint: 15,
    maxCapacity: 100,
    price: 899,
    velocity: 'High',
    supplier: 'Jaipur Heritage Weaves',
    status: 'In Stock',
    restockLeadDays: 4,
    marketplace: 'Ajio',
    storeUrl: 'https://www.ajio.com/s/red-georgette-dress',
    rating: 4.7,
    reviewsCount: 1890,
    imageEmoji: '💃',
    sourceSystem: 'Ajio Direct Merchant Network (Warehouse ID: DEL-02)'
  },
  {
    id: 'inv-dr-3',
    sku: 'DRS-RED-COT',
    name: 'Ruby Casual Pure Cotton Tiered Red Dress',
    category: 'Fashion & Apparel',
    stockLevel: 68,
    reorderPoint: 25,
    maxCapacity: 200,
    price: 649,
    velocity: 'High',
    supplier: 'Coimbatore Handlooms',
    status: 'In Stock',
    restockLeadDays: 3,
    marketplace: 'Amazon India',
    storeUrl: 'https://www.amazon.in/s?k=cotton+red+dress',
    rating: 4.9,
    reviewsCount: 4120,
    imageEmoji: '👘',
    sourceSystem: 'Amazon India FBA Inventory Central (Warehouse ID: HYD-01)'
  },
  {
    id: 'inv-dr-4',
    sku: 'DRS-RED-SLK',
    name: 'Maroon Velvet Red Maxi Festive Dress',
    category: 'Fashion & Apparel',
    stockLevel: 22,
    reorderPoint: 10,
    maxCapacity: 80,
    price: 999,
    velocity: 'Medium',
    supplier: 'Varanasi Brocade Artisans',
    status: 'In Stock',
    restockLeadDays: 5,
    marketplace: 'Flipkart',
    storeUrl: 'https://www.flipkart.com/search?q=red+maxi+dress',
    rating: 4.6,
    reviewsCount: 980,
    imageEmoji: '✨',
    sourceSystem: 'Flipkart Assured Seller Cloud (Warehouse ID: MAA-03)'
  },
  {
    id: 'inv-dr-5',
    sku: 'DRS-RED-SLM',
    name: 'Cherry Red Fit & Flare Summer Midi Dress',
    category: 'Fashion & Apparel',
    stockLevel: 54,
    reorderPoint: 20,
    maxCapacity: 160,
    price: 849,
    velocity: 'High',
    supplier: 'Tirupur Apparel Exports',
    status: 'In Stock',
    restockLeadDays: 2,
    marketplace: 'Myntra',
    storeUrl: 'https://www.myntra.com/red-midi-dress',
    rating: 4.8,
    reviewsCount: 1560,
    imageEmoji: '🌸',
    sourceSystem: 'Myntra Partner Hub (Warehouse ID: BOM-07)'
  },
  {
    id: 'inv-dr-6',
    sku: 'DRS-RED-PRM',
    name: 'Royal Bridal Red Chiffon Evening Gown',
    category: 'Fashion & Apparel',
    stockLevel: 8,
    reorderPoint: 10,
    maxCapacity: 40,
    price: 2499,
    velocity: 'Low',
    supplier: 'Delhi Couture Studio',
    status: 'Low Stock',
    restockLeadDays: 8,
    marketplace: 'Tata CLiQ Luxury',
    storeUrl: 'https://luxury.tatacliq.com/search?q=red+gown',
    rating: 4.9,
    reviewsCount: 340,
    imageEmoji: '👑',
    sourceSystem: 'Tata CLiQ Verified Brand Channel (Warehouse ID: DEL-01)'
  },
  // Electronics & Gadgets
  {
    id: 'inv-1',
    sku: 'AUD-NC-700',
    name: 'AcousticPro Studio Wireless Headphones',
    category: 'Audio & Acoustics',
    stockLevel: 14,
    reorderPoint: 45,
    maxCapacity: 500,
    price: 18999,
    velocity: 'High',
    supplier: 'Shenzhen Soundworks Ltd',
    status: 'Critical',
    restockLeadDays: 5,
    marketplace: 'Amazon India',
    storeUrl: 'https://www.amazon.in/s?k=wireless+headphones',
    rating: 4.8,
    reviewsCount: 3890,
    imageEmoji: '🎧',
    sourceSystem: 'Amazon India FBA Logistics (Warehouse ID: BLR-01)'
  },
  {
    id: 'inv-2',
    sku: 'MCH-KB-87',
    name: 'Tactile MechKeyboard TKL (RGB Frost)',
    category: 'Computer Peripherals',
    stockLevel: 28,
    reorderPoint: 50,
    maxCapacity: 350,
    price: 8499,
    velocity: 'High',
    supplier: 'KeyMaster Industrial Corp',
    status: 'Low Stock',
    restockLeadDays: 7,
    marketplace: 'Amazon India',
    storeUrl: 'https://www.amazon.in/s?k=mechanical+keyboard+tkl',
    rating: 4.7,
    reviewsCount: 1420,
    imageEmoji: '⌨️',
    sourceSystem: 'Amazon India Merchant Hub (Warehouse ID: PNQ-02)'
  },
  {
    id: 'inv-3',
    sku: 'ERG-CH-01',
    name: 'AeroMesh Executive Ergonomic Chair',
    category: 'Office Furniture',
    stockLevel: 82,
    reorderPoint: 30,
    maxCapacity: 150,
    price: 24999,
    velocity: 'Medium',
    supplier: 'Nordic Comfort Systems',
    status: 'In Stock',
    restockLeadDays: 14,
    marketplace: 'Flipkart',
    storeUrl: 'https://www.flipkart.com/search?q=ergonomic+chair',
    rating: 4.6,
    reviewsCount: 890,
    imageEmoji: '🪑',
    sourceSystem: 'Flipkart Direct Supplier Fulfillment (MAA-01)'
  },
  {
    id: 'inv-4',
    sku: 'PWR-BNK-65',
    name: 'GaN 65W Rapid Dual-Port Travel Brick',
    category: 'Power & Charging',
    stockLevel: 19,
    reorderPoint: 60,
    maxCapacity: 600,
    price: 2999,
    velocity: 'High',
    supplier: 'VoltTech Microelectronics',
    status: 'Critical',
    restockLeadDays: 4,
    marketplace: 'Amazon India',
    storeUrl: 'https://www.amazon.in/s?k=gan+65w+charger',
    rating: 4.9,
    reviewsCount: 5210,
    imageEmoji: '⚡',
    sourceSystem: 'Amazon India Prime Feed (Warehouse ID: HYD-02)'
  },
  {
    id: 'inv-5',
    sku: 'DIS-4K-27',
    name: 'UltraFine 27" 4K IPS Creator Monitor',
    category: 'Displays',
    stockLevel: 115,
    reorderPoint: 25,
    maxCapacity: 200,
    price: 34999,
    velocity: 'Medium',
    supplier: 'VisionOptics Global',
    status: 'In Stock',
    restockLeadDays: 10,
    marketplace: 'Amazon India',
    storeUrl: 'https://www.amazon.in/s?k=4k+monitor+27+inch',
    rating: 4.8,
    reviewsCount: 1680,
    imageEmoji: '🖥️',
    sourceSystem: 'Amazon India FBA Center (DEL-03)'
  },
  {
    id: 'inv-6',
    sku: 'CAM-4K-STRM',
    name: 'Lumina 4K Auto-Focus Streaming Webcam',
    category: 'Peripherals',
    stockLevel: 42,
    reorderPoint: 40,
    maxCapacity: 300,
    price: 6999,
    velocity: 'Medium',
    supplier: 'VisionOptics Global',
    status: 'Low Stock',
    restockLeadDays: 6,
    marketplace: 'Croma',
    storeUrl: 'https://www.croma.com/search/?text=4k+webcam',
    rating: 4.7,
    reviewsCount: 940,
    imageEmoji: '📷',
    sourceSystem: 'Croma Enterprise Retail Feed (Warehouse ID: BOM-02)'
  },
  {
    id: 'inv-7',
    sku: 'MIC-USB-PR',
    name: 'Cardioid Studio Condenser USB Mic',
    category: 'Audio & Acoustics',
    stockLevel: 0,
    reorderPoint: 35,
    maxCapacity: 250,
    price: 7499,
    velocity: 'High',
    supplier: 'Shenzhen Soundworks Ltd',
    status: 'Reordered',
    restockLeadDays: 3,
    marketplace: 'Amazon India',
    storeUrl: 'https://www.amazon.in/s?k=usb+condenser+microphone',
    rating: 4.8,
    reviewsCount: 2800,
    imageEmoji: '🎙️',
    sourceSystem: 'Amazon India FBA Inventory Central (BLR-02)'
  }
];
