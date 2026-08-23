import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'timeline' | 'chat' | 'grid';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-[#14151a] border border-white/5 rounded-xl p-6 animate-pulse flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-zinc-800" />
              <div className="w-16 h-5 rounded-full bg-zinc-800" />
            </div>
            <div className="w-3/4 h-5 rounded bg-zinc-800" />
            <div className="space-y-2">
              <div className="w-full h-3 rounded bg-zinc-800/60" />
              <div className="w-5/6 h-3 rounded bg-zinc-800/60" />
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="w-20 h-4 rounded bg-zinc-800" />
              <div className="w-12 h-4 rounded bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div className="space-y-4 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 rounded-xl bg-[#14151a] border border-white/5 animate-pulse"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-40 h-4 rounded bg-zinc-800" />
                <div className="w-16 h-3 rounded bg-zinc-800" />
              </div>
              <div className="w-full h-3 rounded bg-zinc-800/60" />
              <div className="w-2/3 h-3 rounded bg-zinc-800/60" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full rounded-xl bg-[#14151a] border border-white/5 p-4 animate-pulse">
        <div className="h-10 border-b border-white/5 mb-4 flex gap-4">
          <div className="w-1/4 h-5 rounded bg-zinc-800" />
          <div className="w-1/4 h-5 rounded bg-zinc-800" />
          <div className="w-1/4 h-5 rounded bg-zinc-800" />
          <div className="w-1/4 h-5 rounded bg-zinc-800" />
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
            <div className="w-1/4 h-4 rounded bg-zinc-800/60" />
            <div className="w-1/4 h-4 rounded bg-zinc-800/60" />
            <div className="w-1/4 h-4 rounded bg-zinc-800/60" />
            <div className="w-1/4 h-4 rounded bg-zinc-800/60" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full p-8 rounded-2xl bg-[#14151a] border border-white/5 animate-pulse space-y-4">
      <div className="w-1/3 h-6 rounded bg-zinc-800" />
      <div className="w-full h-24 rounded bg-zinc-800/40" />
      <div className="flex gap-3">
        <div className="w-24 h-8 rounded bg-zinc-800" />
        <div className="w-24 h-8 rounded bg-zinc-800" />
      </div>
    </div>
  );
};
