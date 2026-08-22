import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(function Input(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#829188]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={twMerge(
          clsx(
            'w-full bg-[#050705] border border-[#1A261E] px-3 py-2 text-xs font-sans text-[#E8F0EA] placeholder-[#4B5850] focus:outline-none focus:border-[#19C37D] focus:ring-1 focus:ring-[#19C37D] transition-all duration-150 clip-cut-tr',
            error && 'border-[#FF4757] focus:border-[#FF4757]',
            className
          )
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-mono text-[#FF4757]">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, children, className = '', ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#829188]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={twMerge(
          clsx(
            'w-full bg-[#050705] border border-[#1A261E] px-3 py-2 text-xs font-sans text-[#E8F0EA] focus:outline-none focus:border-[#19C37D] focus:ring-1 focus:ring-[#19C37D] transition-all duration-150 clip-cut-tr cursor-pointer',
            error && 'border-[#FF4757]',
            className
          )
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-[10px] font-mono text-[#FF4757]">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, className = '', rows = 3, ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#829188]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={twMerge(
          clsx(
            'w-full bg-[#050705] border border-[#1A261E] px-3 py-2 text-xs font-sans text-[#E8F0EA] placeholder-[#4B5850] focus:outline-none focus:border-[#19C37D] focus:ring-1 focus:ring-[#19C37D] transition-all duration-150 clip-cut-tr resize-none',
            error && 'border-[#FF4757]',
            className
          )
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-mono text-[#FF4757]">{error}</p>}
    </div>
  );
});
