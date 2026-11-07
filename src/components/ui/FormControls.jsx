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
        <label className="block text-xs font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={twMerge(
          clsx(
            'w-full bg-[#161B22] border border-white/10 rounded-lg px-3 py-2 text-xs font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all duration-150',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
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
        <label className="block text-xs font-medium text-zinc-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={twMerge(
          clsx(
            'w-full bg-[#161B22] border border-white/10 rounded-lg px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all duration-150 cursor-pointer',
            error && 'border-red-500',
            className
          )
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
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
        <label className="block text-xs font-medium text-zinc-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={twMerge(
          clsx(
            'w-full bg-[#161B22] border border-white/10 rounded-lg px-3 py-2 text-xs font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all duration-150 resize-none',
            error && 'border-red-500',
            className
          )
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});
