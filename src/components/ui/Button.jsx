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
    'relative inline-flex items-center justify-center font-sans font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed select-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]';

  const variants = {
    primary:
      'bg-[#10B981] text-[#08090A] font-semibold hover:bg-[#34D399] shadow-sm hover:shadow-glow-emerald active:bg-[#059669]',
    secondary:
      'bg-[#161B22] text-[#F3F4F6] border border-white/10 hover:border-white/20 hover:bg-[#1C222B] shadow-subtle',
    ghost:
      'bg-transparent text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5',
    danger:
      'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300',
    outline:
      'bg-transparent text-[#10B981] border border-[#10B981]/40 hover:bg-[#10B981]/10 hover:border-[#10B981]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    icon: 'p-2 text-sm',
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
