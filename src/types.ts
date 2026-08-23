export type HubType = 'business' | 'finance' | 'agriculture' | 'ecommerce';

export interface AgentMetric {
  id: string;
  name: string;
  role: string;
  hub: HubType;
  status: 'active' | 'idle' | 'processing' | 'optimizing';
  latencyMs: number;
  accuracy: number;
  tokensProcessed: number;
  avatarIcon: string;
}

// -------------------------------------------------------------
// 1. Business & Executive Hub Types
// -------------------------------------------------------------
export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadTimestamp: string;
  status: 'ready' | 'analyzing' | 'completed' | 'error';
  summary?: string;
  keyInsights?: string[];
  tokenCount?: number;
}

export type StepStatus = 'pending' | 'running' | 'completed' | 'flagged';

export interface AgentStep {
  id: string;
  order: number;
  agentName: string;
  title: string;
  thoughtProcess: string;
  timestamp: string;
  status: StepStatus;
  confidenceScore: number;
  tags?: string[];
  computationDetails?: string;
  dataInputSnippet?: string;
}

export interface BusinessReport {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  authorAgent: string;
  executiveSummary: string;
  financialHighlights: {
    metric: string;
    value: string;
    change: string;
    positive: boolean;
    dataSource?: string;
    lastUpdated?: string;
  }[];
  strategicRecommendations: string[];
  riskMatrix: {
    risk: string;
    impact: 'High' | 'Medium' | 'Low';
    mitigation: string;
    affectedMetric?: string;
  }[];
  forecastScenarios?: {
    scenario: 'Conservative' | 'Base Case' | 'Accelerated';
    projectedArrCr: number;
    projectedMargin: number;
    probability: number;
  }[];
  keyRisks?: string[];
  projections?: any;
  isEditable?: boolean;
}

export type DataSourceType = 'erp_api' | 'fx_market_api' | 'cloud_db' | 'custom_webhook' | 'disconnected';
export type DataSourceStatus = 'connected' | 'syncing' | 'unavailable' | 'error';

export interface BusinessDataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  endpointUrl?: string;
  latencyMs: number;
  lastSyncTimestamp: string;
  recordCount?: number;
  errorMessage?: string;
}

export interface DynamicBusinessKPI {
  id: string;
  title: string;
  category: 'revenue' | 'profitability' | 'efficiency' | 'cash' | 'expenses' | 'market_fx' | 'growth';
  value: string;
  numericValue: number;
  unit: string;
  change: string;
  changePercent: number;
  isPositive: boolean;
  trend: 'up' | 'down' | 'neutral';
  lastUpdated: string;
  dataSource: string;
  description: string;
  subValue?: string;
}

export interface LiveBusinessPayload {
  arrCr: number;
  previousArrCr: number;
  operatingMarginPercent: number;
  previousMarginPercent: number;
  cacPaybackMonths: number;
  previousCacMonths: number;
  monthlyCashFlowCr: number;
  previousCashFlowCr: number;
  cashRunwayMonths: number;
  totalExpensesCr: number;
  expensesBreakdown: {
    rdComputeCr: number;
    salesMarketingCr: number;
    infrastructureCr: number;
    generalAdminCr: number;
  };
  marketFx: {
    usdInr: number;
    eurInr: number;
    gbpInr: number;
    jpyInr: number;
    fxHedgingCoveragePercent: number;
    source: string;
  };
  nrrPercent: number;
  ruleOf40Score: number;
  activeEnterpriseAccounts: number;
  confidenceScore: number;
  timestamp: string;
  sourceName: string;
}

// -------------------------------------------------------------
// 2. Finance & Student Hub Types
// -------------------------------------------------------------
export interface StudentExpense {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  date: string;
  note?: string;
}

export interface SpendingCategory {
  id: string;
  name: string;
  amount: number;
  budget: number;
  color: string;
  iconName: string;
  percentage: number;
  isCustom?: boolean;
}

export interface MonthlyTrend {
  month: string;
  spending: number;
  savings: number;
  aiPredicted: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: QuizOption[];
  conceptKey: string;
}

export interface FinancialTopic {
  id: string;
  name: string;
  description: string;
  iconName: string;
  question: QuizQuestion;
}

export interface FinanceChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

// -------------------------------------------------------------
// 3. Smart Agriculture Hub Types
// -------------------------------------------------------------
export interface PlantDiagnosticSample {
  id: string;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  imagePlaceholder: string;
  imageUrl?: string;
  symptoms: string[];
  recommendedAction: string;
  treatmentSteps: string[];
  preventionTip: string;
}

export interface WeatherAlert {
  id: string;
  type: 'Frost Warning' | 'Heat Stress' | 'High Humidity / Spore Risk' | 'Optimal Spray Window' | 'Heavy Precipitation';
  severity: 'critical' | 'warning' | 'info';
  zone: string;
  timestamp: string;
  forecastWindow: string;
  metricValue: string;
  advisory: string;
}

export interface EmergencyFarmerAlert {
  id: string;
  type: 'pest' | 'weather' | 'mandi' | 'government';
  title: string;
  titleTe?: string;
  titleHi?: string;
  urgency: 'high' | 'medium' | 'critical';
  issuedAt: string;
  description: string;
  descriptionTe?: string;
  descriptionHi?: string;
  actionRequired: string;
  actionRequiredTe?: string;
  actionRequiredHi?: string;
}

export interface TelemetryLog {
  id: string;
  zone: string;
  crop: string;
  soilMoisture: number; // percentage
  soilTemp: number; // celsius
  ambientHumidity: number; // percentage
  lightIntensity: number; // lux
  healthIndex: number; // 0-100
  status: 'Optimal' | 'Attention' | 'Warning';
  lastUpdated: string;
}

// -------------------------------------------------------------
// 4. E-Commerce & Retail Hub Types
// -------------------------------------------------------------
export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentName?: string;
  text: string;
  timestamp: string;
  confidence?: number;
  suggestedActions?: string[];
  relatedItemSku?: string;
  recommendedProducts?: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockLevel: number;
  reorderPoint: number;
  maxCapacity: number;
  price: number;
  velocity: 'High' | 'Medium' | 'Low';
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Critical' | 'Reordered';
  restockLeadDays: number;
  marketplace?: string;
  storeUrl?: string;
  rating?: number;
  reviewsCount?: number;
  imageEmoji?: string;
  sourceSystem?: string;
}
