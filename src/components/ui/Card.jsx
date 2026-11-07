import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({
  children,
  className = '',
  selected = false,
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'relative bg-[#0F1216] border rounded-xl text-[#F3F4F6] transition-all duration-200',
          selected
            ? 'border-[#10B981]/60 shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)] bg-[#12171E]'
            : 'border-white/[0.07] shadow-card',
          hoverable && !selected && 'hover:border-white/[0.16] hover:bg-[#14181F] cursor-pointer',
          onClick && 'cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
