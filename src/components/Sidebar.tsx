import React from 'react';
import {
  Briefcase,
  TrendingUp,
  Sprout,
  ShoppingBag,
  Bot,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  LogOut,
  UserCheck
} from 'lucide-react';
import { HubType } from '../types';
import { UserProfile } from '../types/auth';

interface SidebarProps {
  currentHub: HubType;
  onSelectHub: (hub: HubType) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  user?: UserProfile | null;
  onLogout?: () => void;
}

interface NavItem {
  id: HubType;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeText?: string;
  keyboardShortcut: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'business',
    label: 'Business & Executive Hub',
    sublabel: 'Live Intelligence & Decision Support',
    icon: Briefcase,
    accentColor: 'from-blue-500 to-indigo-600',
    badgeText: 'Live Doc OCR',
    keyboardShortcut: '1'
  },
  {
    id: 'finance',
    label: 'Finance & Student',
    sublabel: 'Spend Graphs & Flash Quiz',
    icon: TrendingUp,
    accentColor: 'from-emerald-500 to-teal-600',
    badgeText: 'Interactive Quiz',
    keyboardShortcut: '2'
  },
  {
    id: 'agriculture',
    label: 'Smart Agriculture',
    sublabel: 'Crop Vision & Sensor Logs',
    icon: Sprout,
    accentColor: 'from-lime-500 to-emerald-600',
    badgeText: 'Vision AI',
    keyboardShortcut: '3'
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce & Retail',
    sublabel: 'Support Chat & Inventory',
    icon: ShoppingBag,
    accentColor: 'from-purple-500 to-pink-600',
    badgeText: 'Split View',
    keyboardShortcut: '4'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentHub,
  onSelectHub,
  isMobileOpen,
  onCloseMobile,
  user,
  onLogout
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 lg:w-72 bg-[#101115] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className="p-5 flex items-center justify-between border-b border-white/[0.07]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-[#101115] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-white">Agentic Matrix</span>
                  <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium">Multi-Agent Intelligence</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-4 space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Intelligence Hubs
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentHub === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectHub(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1b1d24] text-white shadow-md border border-white/[0.12]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15171e]/80 border border-transparent'
                  }`}
                >
                  {/* Active highlight bar on left */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full" />
                  )}

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                        : 'bg-zinc-800/60 text-zinc-400 group-hover:text-zinc-200 border border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate tracking-tight text-white">
                        {item.label}
                      </span>
                      <kbd className="hidden group-hover:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-white/10 rounded">
                        {item.keyboardShortcut}
                      </kbd>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {item.sublabel}
                    </p>
                  </div>

                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 ml-1 opacity-80" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Panel with User Info & System Status */}
        <div className="p-3.5 border-t border-white/[0.07] space-y-3">
          {/* User Profile Bar & Logout Option */}
          {user && (
            <div className="p-2.5 rounded-xl bg-[#15171f] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Cluster Status Box */}
          <div className="p-3 rounded-xl bg-[#14161d] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Cluster Health
              </span>
              <span className="text-emerald-400 font-medium text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% Operational
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-zinc-400">
              <div className="flex justify-between items-center">
                <span>Active Agents</span>
                <span className="font-mono text-zinc-200">4 / 4 Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Embeddings</span>
                <span className="font-mono text-zinc-200">7.96M Tokens</span>
              </div>
            </div>

            <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-4/5 rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Realtime Local Auth</span>
            </span>
            <span className="font-mono text-zinc-400">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
