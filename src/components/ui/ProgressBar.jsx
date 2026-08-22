import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ProgressBar({ percent = 0, size = 'md', showLabel = true, className = '' }) {
  const safePercent = Math.min(100, Math.max(0, percent || 0));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={twMerge(clsx('w-full flex items-center gap-2', className))}>
      <div className={clsx('flex-1 bg-[#050705] border border-[#1A261E] relative overflow-hidden', heights[size])}>
        <div
          className="h-full bg-gradient-to-r from-[#0B5D3B] to-[#19C37D] transition-all duration-300 relative"
          style={{ width: `${safePercent}%` }}
        >
          {/* Subtle illumination highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#22E595]/50" />
        </div>
      </div>
      {showLabel && (
        <span className="font-mono text-[10px] text-[#829188] min-w-[32px] text-right font-medium">
          {safePercent}%
        </span>
      )}
    </div>
  );
}
