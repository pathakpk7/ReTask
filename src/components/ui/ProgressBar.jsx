import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ProgressBar({ percent = 0, size = 'md', showLabel = true, className = '' }) {
  const safePercent = Math.min(100, Math.max(0, Math.round(percent || 0)));

  const heights = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2.5',
  };

  return (
    <div className={twMerge(clsx('w-full flex items-center gap-3', className))}>
      <div
        role="progressbar"
        aria-valuenow={safePercent}
        aria-valuemin={0}
        aria-valuemax={100}
        className={clsx('flex-1 bg-white/[0.06] rounded-full relative overflow-hidden', heights[size])}
      >
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safePercent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-zinc-400 min-w-[32px] text-right font-medium">
          {safePercent}%
        </span>
      )}
    </div>
  );
}
