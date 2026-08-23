import React from 'react';
import { AlertOctagon, RefreshCw, ServerOff, WifiOff } from 'lucide-react';
import { BACKEND_BASE_URL } from '../../services/apiClient';

interface BackendOfflineBadgeProps {
  error?: string | null;
  onRetry?: () => void;
  isRetrying?: boolean;
  compact?: boolean;
  className?: string;
}

export const BackendOfflineBadge: React.FC<BackendOfflineBadgeProps> = ({
  error,
  onRetry,
  isRetrying = false,
  compact = false,
  className = ''
}) => {
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium backdrop-blur-md shadow-lg shadow-rose-950/30 ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
        </span>
        <span className="font-semibold text-rose-200">Backend Offline</span>
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="ml-1 p-1 hover:bg-rose-500/20 rounded text-rose-300 transition-colors disabled:opacity-50"
            title="Retry Connection"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-2xl bg-[#180f12] border border-rose-500/30 shadow-xl shadow-rose-950/40 relative overflow-hidden ${className}`}
    >
      {/* Top crimson accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-red-500 to-rose-700" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
            <ServerOff className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <h4 className="text-sm font-bold text-rose-200 tracking-tight">
                Backend Offline
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                {BACKEND_BASE_URL}
              </span>
            </div>

            <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
              {error || 'Unable to connect to AI services. Please check that the FastAPI server is running.'}
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-900/40 border border-rose-400/30 transition-all active:scale-95 disabled:opacity-50 shrink-0 self-end sm:self-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Reconnecting...' : 'Retry Handshake'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
