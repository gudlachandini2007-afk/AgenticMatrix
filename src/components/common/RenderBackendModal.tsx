import React, { useState, useEffect } from 'react';
import {
  Server,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Zap,
  Globe,
  Save,
  X,
  ShieldAlert
} from 'lucide-react';
import {
  getBackendUrl,
  setBackendUrl,
  testBackendConnection,
  DEFAULT_RENDER_URL
} from '../../services/apiClient';

interface RenderBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUrlUpdated?: (newUrl: string) => void;
}

export const RenderBackendModal: React.FC<RenderBackendModalProps> = ({
  isOpen,
  onClose,
  onUrlUpdated
}) => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrlInput(getBackendUrl());
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testBackendConnection(urlInput);
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const cleanUrl = urlInput.trim() || DEFAULT_RENDER_URL;
    setBackendUrl(cleanUrl);
    setSavedSuccess(true);
    if (onUrlUpdated) {
      onUrlUpdated(cleanUrl);
    }
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleResetDefault = () => {
    setUrlInput(DEFAULT_RENDER_URL);
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#12131a] border border-white/10 shadow-2xl p-6 overflow-hidden">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Render Cloud Backend Config
              </h3>
              <p className="text-xs text-zinc-400">
                Connect and manage your hosted FastAPI AI engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>FastAPI Backend URL (Render / Cloud)</span>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Reset Default
              </button>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://your-service.onrender.com"
                className="w-full pl-9 pr-24 py-2.5 bg-zinc-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !urlInput.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-200 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-40"
              >
                <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Pinging...' : 'Ping Test'}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Enter your deployed Render web service URL (e.g. <span className="font-mono text-zinc-400">https://my-app.onrender.com</span>).
            </p>
          </div>

          {/* Test Connection Status Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-fade-in ${
                testResult.ok
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{testResult.message}</p>
                {!testResult.ok && (
                  <p className="text-[11px] text-amber-400/80 mt-1">
                    Free Render instances sleep after inactivity and may take 30-50 seconds to boot on the first ping. The app automatically uses the intelligent client fallback if the server is sleeping.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quick Render Deployment Guide */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>FastAPI Endpoints Supported:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 font-mono">
              <span className="bg-black/30 px-2 py-1 rounded">POST /api/business/analyze</span>
              <span className="bg-black/30 px-2 py-1 rounded">GET /api/finance/quiz</span>
              <span className="bg-black/30 px-2 py-1 rounded">POST /api/agriculture/diagnose</span>
              <span className="bg-black/30 px-2 py-1 rounded">POST /api/ecommerce/chat</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div className="text-[11px] text-zinc-400">
            {savedSuccess ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully
              </span>
            ) : (
              <span>Saved in browser storage</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save URL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
