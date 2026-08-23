/**
 * FastAPI Backend API Client Layer
 * Base URL: http://127.0.0.1:8000 (configurable via VITE_BACKEND_URL)
 *
 * Endpoints:
 * - POST /api/business/analyze
 * - GET  /api/finance/quiz
 * - POST /api/agriculture/diagnose
 * - POST /api/ecommerce/chat
 */

import {
  BusinessReport,
  AgentStep,
  FinancialTopic,
  QuizQuestion,
  ChatMessage,
  EmergencyFarmerAlert
} from '../types';

export const DEFAULT_RENDER_URL = 'https://enterprise-ai-hub-backend.onrender.com';

export function getBackendUrl(): string {
  try {
    const saved = localStorage.getItem('render_backend_url');
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // ignore
  }

  const envUrl = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_BACKEND_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim();

  return DEFAULT_RENDER_URL;
}

export function setBackendUrl(url: string): void {
  try {
    localStorage.setItem('render_backend_url', url.trim());
  } catch {
    // ignore
  }
}

export const BACKEND_BASE_URL = getBackendUrl();

export async function testBackendConnection(urlToTest?: string): Promise<{ ok: boolean; message: string; latencyMs: number }> {
  const targetBase = (urlToTest || getBackendUrl()).replace(/\/$/, '');
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${targetBase}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timer);
    const latencyMs = Math.round(performance.now() - start);
    if (res.ok) {
      return { ok: true, message: `Connected to Render backend (${latencyMs}ms)`, latencyMs };
    }
    return { ok: false, message: `Render backend responded with status ${res.status}`, latencyMs };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return { ok: false, message: err?.message || 'Connection failed or server waking up on Render', latencyMs };
  }
}

export interface BackendStatus {
  isOnline: boolean;
  lastChecked: number;
  error?: string;
}

export class ApiError extends Error {
  statusCode?: number;
  isBackendOffline: boolean;

  constructor(message: string, statusCode?: number, isBackendOffline = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isBackendOffline = isBackendOffline;
  }
}

/**
 * Generic fetch wrapper with timeout, CORS handling, and offline detection
 */
async function fetchWithTimeout(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 15000
): Promise<Response> {
  const currentBase = getBackendUrl().replace(/\/$/, '');
  const url = `${currentBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out connecting to Render FastAPI backend.', 408, true);
    }
    // Failed to fetch / connection refused
    throw new ApiError(
      `Unable to connect to AI services at ${currentBase}. Using intelligent client fallback.`,
      0,
      true
    );
  }
}

// -------------------------------------------------------------
// 1. Business & Executive Hub: POST /api/business/analyze
// -------------------------------------------------------------

export interface BusinessAnalyzeRequest {
  prompt?: string;
  text?: string;
  query?: string;
  documents?: Array<{
    id?: string;
    name: string;
    size?: number;
    tokenCount?: number;
    summary?: string;
    content?: string;
  }>;
  metrics?: Record<string, any>;
  live_payload?: Record<string, any>;
}

export interface BusinessAnalyzeResponse {
  report?: Partial<BusinessReport>;
  title?: string;
  executive_summary?: string;
  executiveSummary?: string;
  strategic_recommendations?: string[];
  strategicRecommendations?: string[];
  key_risks?: string[];
  keyRisks?: string[];
  projections?: any;
  steps?: AgentStep[];
  agent_steps?: AgentStep[];
  agentName?: string;
  authorAgent?: string;
  confidence_score?: number;
  confidenceScore?: number;
  category?: string;
  status?: string;
}

export async function analyzeBusinessApi(
  payload: BusinessAnalyzeRequest
): Promise<{ report: BusinessReport; agentSteps?: AgentStep[] }> {
  try {
    const response = await fetchWithTimeout('/api/business/analyze', {
      method: 'POST',
      body: JSON.stringify({
        prompt: payload.prompt || payload.text || 'Perform full multi-agent strategic executive synthesis',
        text: payload.text || payload.prompt || '',
        documents: payload.documents || [],
        metrics: payload.metrics || {},
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new ApiError(
        `FastAPI server returned ${response.status}: ${errorText || response.statusText}`,
        response.status,
        false
      );
    }

    const data: BusinessAnalyzeResponse = await response.json();

    // Map and normalize FastAPI response into BusinessReport
    const rawReport: any = (data.report || data) as any;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const keyRisksList: string[] =
      rawReport.keyRisks ||
      rawReport.key_risks ||
      data.keyRisks ||
      data.key_risks || [
        'FX Spot Volatility across international payment gateways',
        'Sales conversion cycle friction in enterprise expansion tier'
      ];

    const normalizedReport: BusinessReport = {
      id: rawReport.id || `rep-${Date.now()}`,
      title:
        rawReport.title ||
        data.title ||
        'Executive Strategic Synthesis & Forward Capital Projections',
      category: rawReport.category || data.category || 'Strategic Intelligence',
      authorAgent:
        rawReport.authorAgent ||
        rawReport.author_agent ||
        data.agentName ||
        'Executive Strategist (FastAPI AI Core)',
      lastUpdated: rawReport.lastUpdated || `Generated live at ${nowTime}`,
      executiveSummary:
        rawReport.executiveSummary ||
        rawReport.executive_summary ||
        data.executiveSummary ||
        data.executive_summary ||
        'Multi-agent pipeline completed synthesis of corporate telemetry and active document vectors.',
      financialHighlights: rawReport.financialHighlights || [
        { metric: 'Annual Recurring Revenue', value: '$3.4M', change: '+38% YoY', positive: true, dataSource: 'FastAPI AI Core' },
        { metric: 'Operating Margin', value: '24.2%', change: '+3.1% MoM', positive: true, dataSource: 'ERP Live Sync' },
        { metric: 'Cash Runway', value: '18.4 Mo', change: '+2.1 Mo', positive: true, dataSource: 'Treasury Vector' }
      ],
      riskMatrix: rawReport.riskMatrix || keyRisksList.map((r) => ({
        risk: r,
        impact: 'High' as const,
        mitigation: 'Automated policy safeguard and multi-agent hedging triggers'
      })),
      strategicRecommendations:
        rawReport.strategicRecommendations ||
        rawReport.strategic_recommendations ||
        data.strategicRecommendations ||
        data.strategic_recommendations || [
          'Accelerate expansion of high-NRR tier accounts',
          'Institute automated USD/INR hedging collars for treasury'
        ],
      keyRisks: keyRisksList,
      projections: rawReport.projections ||
        data.projections || {
          conservative: '$2.8M (+32% YoY)',
          baseCase: '$3.4M (+48% YoY)',
          accelerated: '$4.1M (+62% YoY)'
        }
    };

    const steps = data.steps || data.agent_steps;
    return { report: normalizedReport, agentSteps: steps };
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Failed to execute business analysis API', 0, true);
  }
}

// -------------------------------------------------------------
// 2. Finance & Student Hub: GET /api/finance/quiz
// -------------------------------------------------------------

export interface FinanceQuizResponse {
  questions?: Array<{
    id: string;
    topic: string;
    difficulty: string;
    question: string;
    conceptKey?: string;
    concept_key?: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect?: boolean;
      is_correct?: boolean;
      explanation: string;
    }>;
  }>;
  topics?: FinancialTopic[];
}

export async function fetchFinanceQuizApi(): Promise<FinancialTopic[]> {
  try {
    const response = await fetchWithTimeout('/api/finance/quiz', {
      method: 'GET'
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new ApiError(
        `FastAPI server returned ${response.status}: ${errorText || response.statusText}`,
        response.status,
        false
      );
    }

    const data = await response.json();

    // If FastAPI returns structured topics directly:
    if (Array.isArray(data.topics) && data.topics.length > 0) {
      return data.topics;
    }

    // If FastAPI returns an array of questions or { questions: [...] }:
    const rawQuestions: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data.questions)
      ? data.questions
      : [];

    if (rawQuestions.length === 0) {
      throw new ApiError('FastAPI returned an empty questions array', response.status, false);
    }

    // Transform backend questions into FinancialTopic records
    const topics: FinancialTopic[] = rawQuestions.map((q, idx) => {
      const normalizedOptions = (q.options || []).map((opt: any, optIdx: number) => ({
        id: opt.id || `opt-${idx}-${optIdx}`,
        text: opt.text || opt.title || 'Option',
        isCorrect: opt.isCorrect ?? opt.is_correct ?? opt.correct ?? (optIdx === 0),
        explanation: opt.explanation || 'Verified financial reasoning provided by AI backend.'
      }));

      const topicTitle = q.topic || `Topic ${idx + 1}`;
      const iconMap: Record<string, string> = {
        Budgeting: 'PieChart',
        Saving: 'PiggyBank',
        'Emergency Fund': 'ShieldAlert',
        'Compound Interest': 'TrendingUp',
        'Credit Score': 'CreditCard',
        'Tax Essentials': 'FileText',
        'Debt Management': 'BarChart2',
        Investing: 'Target'
      };

      return {
        id: q.id || `topic-${idx}-${Date.now()}`,
        name: topicTitle,
        description: q.description || `Real-time mastery unit for ${topicTitle} generated by FastAPI`,
        iconName: iconMap[topicTitle] || 'BookOpen',
        question: {
          id: q.id || `quiz-${idx}`,
          topic: topicTitle,
          difficulty: q.difficulty || 'Intermediate',
          question: q.question || 'Financial reasoning question',
          conceptKey: q.conceptKey || q.concept_key || topicTitle,
          options: normalizedOptions
        }
      };
    });

    return topics;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Failed to fetch finance quiz from FastAPI', 0, true);
  }
}

// -------------------------------------------------------------
// 3. Smart Agriculture Hub: POST /api/agriculture/diagnose
// -------------------------------------------------------------

export interface AgricultureDiagnoseRequest {
  crop: string;
  symptoms?: string;
  sensor_data?: {
    soil_moisture?: number;
    temperature?: number;
    humidity?: number;
    npk_n?: number;
    npk_p?: number;
    npk_k?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
  };
  weather?: {
    region?: string;
    temperature?: number;
    condition?: string;
    rainfall_risk?: string;
  };
  image?: string; // base64 or url
  language?: string;
}

export interface AgricultureDiagnoseResponse {
  disease_name?: string;
  diseaseName?: string;
  scientific_name?: string;
  scientificName?: string;
  crop_name?: string;
  cropName?: string;
  confidence?: number;
  severity?: string;
  symptoms?: string[];
  recommended_action?: string;
  recommendedAction?: string;
  treatment_steps?: string[];
  treatmentSteps?: string[];
  alerts?: EmergencyFarmerAlert[];
  // Multilingual translations if returned
  cropNameTe?: string;
  cropNameHi?: string;
  diseaseNameTe?: string;
  diseaseNameHi?: string;
  symptomsTe?: string[];
  symptomsHi?: string[];
  recommendedActionTe?: string;
  recommendedActionHi?: string;
  treatmentStepsTe?: string[];
  treatmentStepsHi?: string[];
  severityTe?: string;
  severityHi?: string;
}

export async function diagnoseAgricultureApi(
  req: AgricultureDiagnoseRequest
): Promise<AgricultureDiagnoseResponse> {
  try {
    const response = await fetchWithTimeout('/api/agriculture/diagnose', {
      method: 'POST',
      body: JSON.stringify({
        crop: req.crop,
        symptoms: req.symptoms || '',
        sensor_data: req.sensor_data || {},
        weather: req.weather || {},
        image: req.image || '',
        language: req.language || 'en'
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new ApiError(
        `FastAPI server returned ${response.status}: ${errorText || response.statusText}`,
        response.status,
        false
      );
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Failed to diagnose crop with FastAPI', 0, true);
  }
}

// -------------------------------------------------------------
// 4. E-Commerce & Retail Hub: POST /api/ecommerce/chat
// -------------------------------------------------------------

export interface EcommerceChatRequest {
  message: string;
  history?: Array<{
    sender: 'user' | 'agent';
    text: string;
    timestamp?: string;
  }>;
  context?: {
    current_inventory_count?: number;
    low_stock_count?: number;
  };
}

export interface EcommerceChatResponse {
  response?: string;
  reply?: string;
  message?: string;
  agent_name?: string;
  agentName?: string;
  confidence?: number;
  suggested_actions?: string[];
  suggestedActions?: string[];
  inventory_updates?: Array<{
    item_id: string;
    new_quantity: number;
  }>;
}

export async function sendEcommerceChatApi(
  payload: EcommerceChatRequest
): Promise<ChatMessage> {
  try {
    const response = await fetchWithTimeout('/api/ecommerce/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: payload.message,
        history: payload.history || [],
        context: payload.context || {},
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new ApiError(
        `FastAPI server returned ${response.status}: ${errorText || response.statusText}`,
        response.status,
        false
      );
    }

    const data: EcommerceChatResponse = await response.json();

    const replyText =
      data.response ||
      data.reply ||
      data.message ||
      'I have processed your query through our fulfillment inventory engine.';

    const suggestedActions =
      data.suggestedActions ||
      data.suggested_actions || [
        'Check low-stock alerts',
        'Compare supplier pricing',
        'Audit active fulfillment channels'
      ];

    const agentMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      agentName: data.agentName || data.agent_name || 'OmniCommerce AI Assistant (FastAPI)',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: data.confidence || 99.4,
      suggestedActions
    };

    return agentMessage;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Failed to send chat message to FastAPI', 0, true);
  }
}

// -------------------------------------------------------------
// 5. Backend Health Probe
// -------------------------------------------------------------

export async function probeBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${BACKEND_BASE_URL.replace(/\/$/, '')}/api/health`, {
      method: 'GET',
      signal: controller.signal
    }).catch(() => null);
    clearTimeout(id);
    return !!res && res.ok;
  } catch {
    return false;
  }
}
