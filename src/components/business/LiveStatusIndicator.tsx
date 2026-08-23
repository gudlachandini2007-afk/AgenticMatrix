import React from 'react';
import {
  Radio,
  RefreshCw,
  Database,
  SlidersHorizontal,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { BusinessDataSource } from '../../types';

interface LiveStatusIndicatorProps {
  currentSource: BusinessDataSource;
  lastUpdated: string;
  isSyncing: boolean;
  autoSyncInterval: number; // 0 = manual, 10 = 10s, 30 = 30s, 60 = 60s
  error: string | null;
  onSyncNow: () => void;
  onChangeAutoSync: (interval: number) => void;
  onOpenSourceModal: () => void;
  onRetryConnection: () => void;
}

export const LiveStatusIndicator: React.FC<LiveStatusIndicatorProps> = ({
  currentSource,
  lastUpdated,
  isSyncing,
  autoSyncInterval,
  error,
  onSyncNow,
  onChangeAutoSync,
  onOpenSourceModal,
  onRetryConnection
}) => {
  const isDisconnected = currentSource.type === 'disconnected' || currentSource.status === 'unavailable' || !!error;

  return (
    <div className="space-y-3">
      {/* 1. Main Top Live Data Status Banner */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isDisconnected
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            : 'bg-[#10121a] border-emerald-500/30 shadow-lg shadow-emerald-950/10 text-zinc-100'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Live Status & Source */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isDisconnected
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {isDisconnected ? (
                <AlertTriangle className="w-5 h-5 animate-pulse text-rose-400" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
                  <Radio className="w-5 h-5 text-emerald-400" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                    isDisconnected
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDisconnected ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'
                    }`}
                  />
                  <span>{isDisconnected ? '⚠️ Data Source Unavailable' : '🟢 Live Data'}</span>
                </span>

                {!isDisconnected && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-white/10 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Last updated: {lastUpdated}</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-zinc-300 mt-1 flex flex-wrap items-center gap-2">
                <span>
                  <strong className="text-zinc-400 font-normal">Source: </strong>
                  <span className="font-semibold text-white">{currentSource.name}</span>
                </span>
                {!isDisconnected && currentSource.latencyMs > 0 && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald-400 font-mono text-[11px]">
                      Latency: {currentSource.latencyMs}ms
                    </span>
                    {currentSource.recordCount && (
                      <>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400 text-[11px]">
                          {currentSource.recordCount.toLocaleString()} stream records
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Controls & Data Source Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-center">
            {/* Auto-Sync Select */}
            <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-white/10 px-2.5 py-1.5 rounded-xl text-xs">
              <span className="text-zinc-400 text-[11px]">Auto-Sync:</span>
              <select
                value={autoSyncInterval}
                onChange={(e) => onChangeAutoSync(Number(e.target.value))}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value={0} className="bg-zinc-900 text-zinc-200">Manual Only</option>
                <option value={10} className="bg-zinc-900 text-zinc-200">Every 10s (Fast)</option>
                <option value={30} className="bg-zinc-900 text-zinc-200">Every 30s</option>
                <option value={60} className="bg-zinc-900 text-zinc-200">Every 60s</option>
              </select>
            </div>

            {/* Sync Now Button */}
            <button
              onClick={isDisconnected ? onRetryConnection : onSyncNow}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                isDisconnected
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              } disabled:opacity-50`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Fetching Live...' : isDisconnected ? 'Retry Connection' : 'Sync Now'}</span>
            </button>

            {/* Switch Source Modal Trigger */}
            <button
              onClick={onOpenSourceModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-white/10 text-xs font-medium transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Data Sources</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert Display if Disconnected */}
      {isDisconnected && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-200">
                ⚠️ Data source unavailable: {currentSource.name}
              </p>
              <p className="text-[11px] text-rose-300/90 mt-0.5">
                {error || currentSource.errorMessage || 'Live stream handshake failed. No hardcoded or fabricated values are displayed in adherence to data integrity protocols.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRetryConnection}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
            >
              Retry Handshake
            </button>
            <button
              onClick={onOpenSourceModal}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-white/10 transition-colors"
            >
              Switch Live Source
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
