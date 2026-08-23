import React from 'react';
import { AlertCircle, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { AIInsightItem } from '../../services/financeAiService';

interface FinanceInsightsBannerProps {
  insights: AIInsightItem[];
  onActionClick?: (actionHint?: string) => void;
}

export const FinanceInsightsBanner: React.FC<FinanceInsightsBannerProps> = ({
  insights,
  onActionClick
}) => {
  if (!insights || insights.length === 0) return null;

  const getStyleForType = (type: AIInsightItem['type']) => {
    switch (type) {
      case 'alert':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50',
          iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          badge: 'bg-rose-500/20 text-rose-300',
          icon: AlertCircle
        };
      case 'opportunity':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50',
          iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          badge: 'bg-amber-500/20 text-amber-300',
          icon: Sparkles
        };
      case 'trend':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50',
          iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          badge: 'bg-cyan-500/20 text-cyan-300',
          icon: TrendingUp
        };
      case 'progress':
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50',
          iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          badge: 'bg-emerald-500/20 text-emerald-300',
          icon: CheckCircle2
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {insights.map((item) => {
        const style = getStyleForType(item.type);
        const Icon = style.icon;

        return (
          <div
            key={item.id}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${style.bg} relative overflow-hidden`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${style.iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${style.badge}`}>
                    {item.type}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-100 mb-1">{item.title}</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">{item.message}</p>
            </div>

            {item.actionHint && (
              <div
                onClick={() => onActionClick?.(item.actionHint)}
                className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-semibold text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
              >
                <span className="truncate">{item.actionHint}</span>
                <ArrowRight className="w-3 h-3 flex-shrink-0 ml-1" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
