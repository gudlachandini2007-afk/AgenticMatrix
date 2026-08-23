import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, HelpCircle } from 'lucide-react';
import { FinanceChatMessage, SpendingCategory, StudentExpense, MonthlyTrend } from '../../types';
import { SUGGESTED_AI_PROMPTS } from '../../data/financeData';
import { answerFinancialQuery } from '../../services/financeAiService';

interface FinanceAiAssistantProps {
  totalBudget: number;
  categories: SpendingCategory[];
  expenses: StudentExpense[];
  monthlyTrends: MonthlyTrend[];
  onTriggerFilterCategory?: (categoryName: string) => void;
  onOpenEditBudget?: () => void;
  onOpenAddExpense?: () => void;
}

export const FinanceAiAssistant: React.FC<FinanceAiAssistantProps> = ({
  totalBudget,
  categories,
  expenses,
  monthlyTrends,
  onOpenEditBudget,
  onOpenAddExpense
}) => {
  const [messages, setMessages] = useState<FinanceChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Hello! I am your AI Student Finance Advisor. I monitor your live budgets, daily burn rate, and category limits. Ask me anything or click one of the quick prompt pills below!',
      timestamp: 'Just now',
      suggestedActions: ['Why am I overspending?', 'How much can I save this month?', 'Where am I spending the most?']
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const userMsg: FinanceChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI thinking and calculation
    setTimeout(() => {
      const response = answerFinancialQuery(queryText, {
        totalBudget,
        categories,
        expenses,
        monthlyTrends
      });

      const aiMsg: FinanceChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (action: string) => {
    if (action.includes('Edit') || action.includes('Budget')) {
      onOpenEditBudget?.();
    } else if (action.includes('Add Expense')) {
      onOpenAddExpense?.();
    } else {
      handleSendMessage(action);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col h-[520px] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>AI Student Finance Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Live Data Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">Trained on college budgeting, student loan strategies & burn rate</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time Math</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
        <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1 flex-shrink-0">
          <HelpCircle className="w-3 h-3 text-cyan-400" />
          <span>Try asking:</span>
        </span>
        {SUGGESTED_AI_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-950/80 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 text-[11px] transition-all whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
        {messages.map((msg) => {
          const isAi = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                  isAi
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[85%] space-y-1.5 ${isAi ? '' : 'items-end'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isAi
                      ? 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-sm'
                      : 'bg-cyan-600 text-white rounded-tr-sm'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>

                {/* AI Suggested Action Pills */}
                {isAi && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(action)}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700/80 transition-colors"
                      >
                        ⚡ {action}
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] text-slate-500 px-1 ${isAi ? '' : 'text-right'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 rounded-tl-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-400 ml-1">Analyzing telemetry...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputQuery);
        }}
        className="relative flex items-center gap-2 pt-2 border-t border-slate-800"
      >
        <input
          type="text"
          placeholder="Ask AI: 'Can I afford ₹1,500 for dinner?', 'Why am I overspending?'"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 pr-12 transition-all"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 w-8 h-8 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
