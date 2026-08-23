import React, { useState } from 'react';
import {
  X,
  Database,
  Radio,
  Check,
  AlertTriangle,
  Server,
  Globe,
  Sliders,
  PlugZap,
  RefreshCw,
  Plus
} from 'lucide-react';
import { BusinessDataSource } from '../../types';
import { AVAILABLE_DATA_SOURCES } from '../../services/liveBusinessDataService';

interface DataSourceModalProps {
  isOpen: boolean;
  activeSource: BusinessDataSource;
  onSelectSource: (source: BusinessDataSource) => void;
  onClose: () => void;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  activeSource,
  onSelectSource,
  onClose
}) => {
  const [sources, setSources] = useState<BusinessDataSource[]>(AVAILABLE_DATA_SOURCES);
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  if (!isOpen) return null;

  const handleAddCustomSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customUrl.trim()) return;

    const newSource: BusinessDataSource = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      type: 'custom_webhook',
      status: 'connected',
      endpointUrl: customUrl.trim(),
      latencyMs: 95,
      lastSyncTimestamp: new Date().toLocaleTimeString(),
      recordCount: 50000
    };

    setSources((prev) => [newSource, ...prev]);
    onSelectSource(newSource);
    setCustomName('');
    setCustomUrl('');
    setShowAddCustom(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#13141c] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Live Business Data Stream Connectors
              </h2>
              <p className="text-xs text-zinc-400">
                Connect enterprise APIs, databases, or public market feeds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Selection List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {sources.map((source) => {
            const isSelected = activeSource.id === source.id;
            const isDisconnected = source.type === 'disconnected' || source.status === 'unavailable';

            return (
              <div
                key={source.id}
                onClick={() => {
                  onSelectSource(source);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? isDisconnected
                      ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/20'
                      : 'bg-indigo-950/30 border-cyan-500/60 shadow-lg shadow-indigo-950/20'
                    : 'bg-zinc-900/50 border-white/[0.06] hover:bg-zinc-900 hover:border-white/15'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isDisconnected
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : isSelected
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {isDisconnected ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : source.type === 'fx_market_api' ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <Server className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">
                        {source.name}
                      </h4>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${
                          isDisconnected
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {isDisconnected ? 'Offline / Error' : 'Live Connected'}
                      </span>
                    </div>

                    {source.endpointUrl && (
                      <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                        {source.endpointUrl}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-400 mt-1.5">
                      {!isDisconnected ? (
                        <>
                          <span className="text-emerald-400 font-mono">
                            Latency: {source.latencyMs}ms
                          </span>
                          {source.recordCount && (
                            <span>
                              {source.recordCount.toLocaleString()} stream records
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-rose-400">
                          {source.errorMessage || 'Demonstrates "⚠️ Data source unavailable" condition'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? isDisconnected
                          ? 'bg-rose-500 border-rose-400 text-white'
                          : 'bg-cyan-500 border-cyan-400 text-white'
                        : 'border-zinc-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom API Stream Form Toggle */}
        {!showAddCustom ? (
          <button
            onClick={() => setShowAddCustom(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-white/20 hover:border-cyan-500/50 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all bg-zinc-900/30 hover:bg-zinc-900"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Connect Custom REST / Webhook API</span>
          </button>
        ) : (
          <form
            onSubmit={handleAddCustomSource}
            className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3 animate-in fade-in"
          >
            <h4 className="text-xs font-bold text-white">
              Connect Custom API Endpoint
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Data Source Name (e.g., Snowflake Financial Warehouse)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-1.5 bg-zinc-800 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="url"
                placeholder="HTTPS Endpoint URL (e.g., https://api.corp.internal/metrics)"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-zinc-800 border border-white/10 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="px-3 py-1 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
              >
                Save & Connect
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
          <span>Active: <strong className="text-white font-semibold">{activeSource.name}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
