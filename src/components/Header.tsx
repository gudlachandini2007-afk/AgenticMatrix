import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  Bell, 
  Command, 
  Menu, 
  Cpu, 
  CheckCircle2,
  RefreshCw,
  Server,
  Cloud,
  LogOut,
  User
} from 'lucide-react';
import { HubType } from '../types';
import { UserProfile } from '../types/auth';
import { RenderBackendModal } from './common/RenderBackendModal';
import { getBackendUrl } from '../services/apiClient';

interface HeaderProps {
  currentHub: HubType;
  onToggleMobileSidebar: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  user?: UserProfile | null;
  onLogout?: () => void;
}

const HUB_TITLES: Record<HubType, { title: string; subtitle: string; badge: string; agentName: string }> = {
  business: {
    title: 'Business & Executive Hub',
    subtitle: 'Autonomous Strategic Synthesis & C-Suite Briefings',
    badge: 'Executive Strategist v4.2',
    agentName: 'Atlas Core'
  },
  finance: {
    title: 'Finance & Student Hub',
    subtitle: 'Personalized Budgeting, Spending Telemetry & Interactive Mastery',
    badge: 'Fiscal Sentinel v2.8',
    agentName: 'Sentinel Quantum'
  },
  agriculture: {
    title: 'Smart Agriculture Hub',
    subtitle: 'Computer Vision Crop Diagnostics & Micro-Climate Sensors',
    badge: 'PhytoScan Agro v5.1',
    agentName: 'PhytoVision Edge'
  },
  ecommerce: {
    title: 'E-Commerce & Retail Hub',
    subtitle: 'Concierge AI Support & Predictive Inventory Balancing',
    badge: 'OmniCommerce v3.9',
    agentName: 'OmniBalancer Node'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentHub,
  onToggleMobileSidebar,
  onRefreshData,
  isRefreshing = false,
  user,
  onLogout
}) => {
  const current = HUB_TITLES[currentHub];
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [activeBackendUrl, setActiveBackendUrl] = useState<string>(getBackendUrl());

  return (
    <header className="sticky top-0 z-20 w-full bg-[#0d0e12]/90 backdrop-blur-md border-b border-white/[0.07] px-4 lg:px-8 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3.5">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Navigation Menu"
          className="lg:hidden p-2 rounded-lg bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {current.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {current.badge}
            </span>
          </div>
          <p className="text-xs text-zinc-400 hidden md:block mt-0.5">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 lg:gap-3.5">
        {/* Render Backend Connection Trigger */}
        <button
          type="button"
          onClick={() => setIsRenderModalOpen(true)}
          title="Configure Render FastAPI Cloud URL"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-purple-200 text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Cloud className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Render Cloud</span>
          <span className="sm:hidden">Render</span>
        </button>

        {/* Cluster Telemetry Pill */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#14161d] border border-white/[0.08] text-xs text-zinc-300">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-zinc-400">Agent Node:</span>
            <span className="font-mono font-medium text-white">{current.agentName}</span>
          </div>
          <span className="w-1 h-3 bg-zinc-800 rounded-full" />
          <div className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-3.5 h-3.5" />
            <span className="font-mono">18ms Latency</span>
          </div>
        </div>

        {/* Action Button: Refresh / Sync */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Sync & Re-calculate Telemetry"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-[#15161c] hover:bg-[#1f2129] border border-white/10 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>
        )}

        {/* User Pill & Logout on Desktop */}
        {user && onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title={`Signed in as ${user.email} (Click to log out)`}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#15161c] hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/30 text-zinc-300 hover:text-rose-300 text-xs font-medium transition-all cursor-pointer group"
          >
            <div className="w-4 h-4 rounded bg-indigo-600 text-[10px] text-white flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
            <LogOut className="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-400 transition-colors" />
          </button>
        )}

        {/* Global Agent State Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">Multi-Agent Core</span>
          <span className="sm:hidden">Active</span>
        </div>
      </div>

      {/* Render Backend Configuration Modal */}
      <RenderBackendModal
        isOpen={isRenderModalOpen}
        onClose={() => setIsRenderModalOpen(false)}
        onUrlUpdated={(newUrl) => {
          setActiveBackendUrl(newUrl);
        }}
      />
    </header>
  );
};
