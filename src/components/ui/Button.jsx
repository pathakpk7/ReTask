import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-mono font-medium uppercase tracking-wider transition-all duration-150 active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-[#0B5D3B] text-[#E8F0EA] border border-[#19C37D] shadow-[0_0_12px_rgba(25,195,125,0.25)] hover:bg-[#19C37D] hover:text-[#050705] hover:shadow-[0_0_20px_rgba(25,195,125,0.5)] active:bg-[#0B5D3B]',
    secondary:
      'bg-[#101712] text-[#E8F0EA] border border-[#1A261E] hover:border-[#0B5D3B] hover:text-[#19C37D] hover:bg-[#152019] shadow-neo-btn active:shadow-neo-btn-pressed',
    ghost:
      'bg-transparent text-[#829188] hover:text-[#E8F0EA] hover:bg-[#101712] border border-transparent',
    danger:
      'bg-[#2A0E13] text-[#FF4757] border border-[#FF4757]/40 hover:bg-[#FF4757] hover:text-[#050705] hover:shadow-[0_0_15px_rgba(255,71,87,0.4)]',
    outline:
      'bg-transparent text-[#19C37D] border border-[#19C37D]/60 hover:bg-[#19C37D]/10 hover:border-[#19C37D]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 clip-cut-tr',
    md: 'text-xs px-4 py-2 gap-2 clip-cut-tr-lg',
    lg: 'text-sm px-6 py-3 gap-2.5 clip-cut-tr-lg',
    icon: 'p-2 text-xs clip-cut-tr',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
}
