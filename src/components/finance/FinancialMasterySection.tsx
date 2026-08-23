import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  PieChart,
  PiggyBank,
  ShieldAlert,
  TrendingUp,
  BarChart2,
  FileText,
  CreditCard,
  Target
} from 'lucide-react';
import { FinancialTopic } from '../../types';

interface FinancialMasterySectionProps {
  topics: FinancialTopic[];
  masteryScore: number;
  learningStreak: number;
  onTopicMastered: (topicId: string) => void;
  onStreakUpdate: (newStreak: number) => void;
}

const TOPIC_ICONS: Record<string, React.FC<{ className?: string }>> = {
  PieChart,
  PiggyBank,
  ShieldAlert,
  TrendingUp,
  BarChart2,
  FileText,
  CreditCard,
  Target
};

export const FinancialMasterySection: React.FC<FinancialMasterySectionProps> = ({
  topics,
  masteryScore,
  learningStreak,
  onTopicMastered,
  onStreakUpdate
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || 'topic-budgeting');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [masteredTopicIds, setMasteredTopicIds] = useState<Set<string>>(new Set(['topic-budgeting', 'topic-saving', 'topic-compound']));

  // Sync selectedTopicId when topics prop updates from backend
  React.useEffect(() => {
    if (topics.length > 0 && !topics.some((t) => t.id === selectedTopicId)) {
      setSelectedTopicId(topics[0].id);
      setSelectedOptionId(null);
      setHasSubmitted(false);
    }
  }, [topics, selectedTopicId]);

  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[0] || {
    id: 'topic-default',
    name: 'Financial Literacy',
    description: 'Bite-sized financial scenarios',
    iconName: 'BookOpen',
    question: {
      id: 'quiz-default',
      topic: 'Financial Literacy',
      difficulty: 'Beginner' as const,
      question: 'Loading interactive questions from backend...',
      conceptKey: 'Financial Fundamentals',
      options: []
    }
  };
  const question = currentTopic.question;

  const handleSelectOption = (optId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmitQuiz = () => {
    if (!selectedOptionId || hasSubmitted) return;
    setHasSubmitted(true);

    const chosen = question.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 }
        });
      } catch {
        // Fallback gracefully
      }

      if (!masteredTopicIds.has(currentTopic.id)) {
        const nextSet = new Set(masteredTopicIds);
        nextSet.add(currentTopic.id);
        setMasteredTopicIds(nextSet);
        onTopicMastered(currentTopic.id);
      }
      onStreakUpdate(learningStreak + 1);
    }
  };

  const handleResetQuiz = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleSwitchTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const selectedOpt = question.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOpt?.isCorrect;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Financial Mastery & Interactive Learning</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono">
                {masteryScore} / {topics.length} Mastered
              </span>
            </h3>
            <p className="text-xs text-slate-400">Master fundamental financial literacy with bite-sized scenario quizzes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{learningStreak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Topics Tabs / Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {topics.map((topic) => {
          const isSelected = topic.id === selectedTopicId;
          const isMastered = masteredTopicIds.has(topic.id);
          const IconComponent = TOPIC_ICONS[topic.iconName] || BookOpen;

          return (
            <button
              key={topic.id}
              onClick={() => handleSwitchTopic(topic.id)}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all select-none ${
                isSelected
                  ? 'bg-violet-500/20 border-violet-400 text-violet-200 ring-1 ring-violet-400/50 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="relative">
                <IconComponent className="w-4 h-4" />
                {isMastered && (
                  <span className="absolute -top-1.5 -right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                )}
              </div>
              <span className="text-[11px] font-semibold truncate w-full">{topic.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Topic Quiz Card */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
              {currentTopic.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {question.difficulty}
            </span>
          </div>
          <span className="text-xs text-slate-500">{currentTopic.description}</span>
        </div>

        {/* Question Prompt */}
        <div className="text-sm font-semibold text-slate-100 leading-snug">
          {question.question}
        </div>

        {/* Options */}
        <div className="space-y-2 pt-1">
          {question.options.map((opt) => {
            const isChosen = selectedOptionId === opt.id;
            let optStyle = 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700';

            if (hasSubmitted) {
              if (opt.isCorrect) {
                optStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 ring-1 ring-emerald-500/50';
              } else if (isChosen && !opt.isCorrect) {
                optStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-200 ring-1 ring-rose-500/50';
              } else {
                optStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60';
              }
            } else if (isChosen) {
              optStyle = 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 ring-1 ring-cyan-500/50';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 select-none ${optStyle}`}
              >
                <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center flex-shrink-0 text-[11px] font-semibold mt-0.5">
                  {hasSubmitted && opt.isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : hasSubmitted && isChosen && !opt.isCorrect ? (
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <span className={isChosen ? 'text-cyan-400' : 'text-slate-500'}>
                      {opt.id.slice(-1).toUpperCase()}
                    </span>
                  )}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{opt.text}</div>
                  {hasSubmitted && (opt.isCorrect || isChosen) && (
                    <p className="mt-1.5 text-[11px] opacity-90 leading-relaxed pt-1 border-t border-slate-800">
                      {opt.explanation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls & Concept Key */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Concept: <strong className="text-slate-300">{question.conceptKey}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {hasSubmitted ? (
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCorrect ? '🎉 Correct Answer!' : '❌ Keep learning!'}
                </span>
                <button
                  onClick={handleResetQuiz}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Try Again</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={!selectedOptionId}
                className="px-5 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Submit Answer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
