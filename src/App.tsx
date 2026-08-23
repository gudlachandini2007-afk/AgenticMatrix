import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './components/auth/AuthPage';
import { BusinessHub } from './components/hubs/BusinessHub';
import { FinanceHub } from './components/hubs/FinanceHub';
import { AgricultureHub } from './components/hubs/AgricultureHub';
import { EcommerceHub } from './components/hubs/EcommerceHub';
import {
  HubType,
  UploadedDocument,
  AgentStep,
  BusinessReport,
  SpendingCategory,
  MonthlyTrend,
  QuizQuestion,
  WeatherAlert,
  TelemetryLog,
  ChatMessage,
  InventoryItem
} from './types';
import { UserProfile } from './types/auth';
import { getStoredUser, setStoredUser } from './services/authService';
import {
  INITIAL_DOCUMENTS,
  INITIAL_AGENT_STEPS,
  INITIAL_BUSINESS_REPORT,
  INITIAL_SPENDING_CATEGORIES,
  INITIAL_MONTHLY_TRENDS,
  FINANCIAL_QUIZ_QUESTIONS,
  INITIAL_WEATHER_ALERTS,
  INITIAL_TELEMETRY_LOGS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_INVENTORY_ITEMS
} from './mockData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5
    }
  }
});

function DashboardContent({
  user,
  onLogout
}: {
  user: UserProfile;
  onLogout: () => void;
}) {
  // Main Navigation State
  const [currentHub, setCurrentHub] = useState<HubType>('business');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Business Hub State
  const [documents, setDocuments] = useState<UploadedDocument[]>(INITIAL_DOCUMENTS);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>(INITIAL_AGENT_STEPS);
  const [businessReport, setBusinessReport] = useState<BusinessReport>(INITIAL_BUSINESS_REPORT);

  // 2. Finance Hub State
  const [spendingCategories, setSpendingCategories] = useState<SpendingCategory[]>(INITIAL_SPENDING_CATEGORIES);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>(INITIAL_MONTHLY_TRENDS);
  const [quizQuestions] = useState<QuizQuestion[]>(FINANCIAL_QUIZ_QUESTIONS);

  // 3. Agriculture Hub State
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>(INITIAL_WEATHER_ALERTS);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>(INITIAL_TELEMETRY_LOGS);

  // 4. E-Commerce Hub State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);

  // Keyboard shortcut listener (1, 2, 3, 4) for rapid hub switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === '1') setCurrentHub('business');
      if (e.key === '2') setCurrentHub('finance');
      if (e.key === '3') setCurrentHub('agriculture');
      if (e.key === '4') setCurrentHub('ecommerce');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // React Query simulated telemetry health query
  const { isLoading: isInitialLoading } = useQuery({
    queryKey: ['clusterHealth'],
    queryFn: async () => {
      // Quick simulated handshake
      await new Promise((res) => setTimeout(res, 200));
      return { status: 'healthy', nodeCount: 4 };
    }
  });

  // Business Hub Handlers
  const handleAddDocument = (doc: UploadedDocument) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // E-Commerce Hub Handlers
  const handleSendMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const handleRestockItem = (itemId: string, quantity: number) => {
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newLevel = Math.min(item.stockLevel + quantity, item.maxCapacity);
          return {
            ...item,
            stockLevel: newLevel,
            status: newLevel >= item.reorderPoint ? ('In Stock' as const) : ('Low Stock' as const)
          };
        }
        return item;
      })
    );
  };

  const handleBuyItem = (itemId: string, quantity: number = 1) => {
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newLevel = Math.max(item.stockLevel - quantity, 0);
          return {
            ...item,
            stockLevel: newLevel,
            status:
              newLevel === 0
                ? ('Critical' as const)
                : newLevel <= item.reorderPoint
                ? ('Low Stock' as const)
                : ('In Stock' as const)
          };
        }
        return item;
      })
    );
  };

  // Sync / Refresh data simulation
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Add slight jitter to telemetry values for realism
      setTelemetryLogs((prev) =>
        prev.map((log) => ({
          ...log,
          soilMoisture: Number((log.soilMoisture + (Math.random() * 0.8 - 0.4)).toFixed(1)),
          lastUpdated: 'Just now'
        }))
      );
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-zinc-100 flex flex-col lg:flex-row antialiased selection:bg-indigo-600 selection:text-white">
      {/* Fixed Left-Sidebar Navigation */}
      <Sidebar
        currentHub={currentHub}
        onSelectHub={(hub) => setCurrentHub(hub)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Top Sticky Header */}
        <Header
          currentHub={currentHub}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
          user={user}
          onLogout={onLogout}
        />

        {/* Dynamic Hub Body with Error Boundary */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isInitialLoading ? (
            <LoadingSkeleton type="card" count={4} />
          ) : (
            <ErrorBoundary
              fallbackTitle={`An error occurred in ${currentHub} hub`}
              onReset={() => setCurrentHub('business')}
            >
              {currentHub === 'business' && (
                <BusinessHub
                  documents={documents}
                  agentSteps={agentSteps}
                  report={businessReport}
                  onAddDocument={handleAddDocument}
                  onRemoveDocument={handleRemoveDocument}
                  onUpdateStep={setAgentSteps}
                  onUpdateReport={setBusinessReport}
                />
              )}

              {currentHub === 'finance' && (
                <FinanceHub
                  categories={spendingCategories}
                  trends={monthlyTrends}
                  onUpdateCategory={setSpendingCategories}
                />
              )}

              {currentHub === 'agriculture' && (
                <AgricultureHub
                  weatherAlerts={weatherAlerts}
                  telemetryLogs={telemetryLogs}
                  onRefreshTelemetry={handleRefreshData}
                />
              )}

              {currentHub === 'ecommerce' && (
                <EcommerceHub
                  chatMessages={chatMessages}
                  inventoryItems={inventoryItems}
                  onSendMessage={handleSendMessage}
                  onRestockItem={handleRestockItem}
                  onBuyItem={handleBuyItem}
                />
              )}
            </ErrorBoundary>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredUser());

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setStoredUser(null);
    setCurrentUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {!currentUser ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <DashboardContent user={currentUser} onLogout={handleLogout} />
      )}
    </QueryClientProvider>
  );
}
