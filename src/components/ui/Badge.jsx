import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function PriorityBadge({ priority, className = '' }) {
  const configs = {
    urgent: {
      label: 'Urgent',
      dot: 'bg-red-500',
      styles: 'bg-red-500/10 text-red-400 border-red-500/20',
    },
    high: {
      label: 'High',
      dot: 'bg-amber-500',
      styles: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    medium: {
      label: 'Medium',
      dot: 'bg-blue-400',
      styles: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    low: {
      label: 'Low',
      dot: 'bg-zinc-400',
      styles: 'bg-white/5 text-zinc-400 border-white/10',
    },
  };

  const config = configs[priority?.toLowerCase()] || configs.low;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border',
          config.styles,
          className
        )
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

export function DifficultyBadge({ difficulty, className = '' }) {
  const configs = {
    extreme: { label: 'Extreme', styles: 'text-red-400 bg-red-500/10 border-red-500/20' },
    hard: { label: 'Hard', styles: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    medium: { label: 'Medium', styles: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    easy: { label: 'Easy', styles: 'text-zinc-400 bg-white/5 border-white/10' },
  };

  const config = configs[difficulty?.toLowerCase()] || configs.easy;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded border',
          config.styles,
          className
        )
      )}
    >
      {config.label}
    </span>
  );
}
