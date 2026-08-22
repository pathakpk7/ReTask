import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function PriorityBadge({ priority, className = '' }) {
  const configs = {
    urgent: {
      label: 'URGENT',
      styles: 'bg-[#2A0E13] text-[#FF4757] border-[#FF4757]/40 shadow-[0_0_8px_rgba(255,71,87,0.3)]',
    },
    high: {
      label: 'HIGH',
      styles: 'bg-[#2B1D06] text-[#FFA502] border-[#FFA502]/40',
    },
    medium: {
      label: 'MEDIUM',
      styles: 'bg-[#0B1C2E] text-[#1E90FF] border-[#1E90FF]/40',
    },
    low: {
      label: 'LOW',
      styles: 'bg-[#16191D] text-[#829188] border-[#1A261E]',
    },
  };

  const config = configs[priority?.toLowerCase()] || configs.low;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border clip-cut-tr',
          config.styles,
          className
        )
      )}
    >
      {config.label}
    </span>
  );
}

export function DifficultyBadge({ difficulty, className = '' }) {
  const configs = {
    extreme: { label: 'EXTREME', styles: 'text-[#FF4757] border-[#FF4757]/30 bg-[#2A0E13]/50' },
    hard: { label: 'HARD', styles: 'text-[#FFA502] border-[#FFA502]/30 bg-[#2B1D06]/50' },
    medium: { label: 'MEDIUM', styles: 'text-[#19C37D] border-[#19C37D]/30 bg-[#0B5D3B]/30' },
    easy: { label: 'EASY', styles: 'text-[#829188] border-[#1A261E] bg-[#101712]' },
  };

  const config = configs[difficulty?.toLowerCase()] || configs.easy;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider border',
          config.styles,
          className
        )
      )}
    >
      {config.label}
    </span>
  );
}
