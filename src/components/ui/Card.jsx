import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({
  children,
  className = '',
  selected = false,
  hoverable = false,
  cutCorner = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'relative bg-[#0B100D] border text-[#E8F0EA] transition-all duration-150',
          cutCorner ? 'clip-cut-tr-lg' : 'rounded-none',
          selected
            ? 'border-[#19C37D] shadow-[0_0_15px_rgba(25,195,125,0.25)] bg-[#101712]'
            : 'border-[#1A261E] shadow-neo-card',
          hoverable && !selected && 'hover:border-[#0B5D3B] hover:bg-[#152019] cursor-pointer',
          onClick && 'cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {/* Top chamfer highlight line */}
      <div className="absolute top-0 left-0 right-3 h-[1px] bg-gradient-to-r from-transparent via-[#26382C] to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
