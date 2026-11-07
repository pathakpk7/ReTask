import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export function NavItem({ to, icon: Icon, label, badgeCount, badgeVariant = 'default', onClick }) {
  const badgeStyles = {
    default: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    urgent: 'bg-red-500/10 text-red-400 border border-red-500/20',
    muted: 'bg-white/5 text-zinc-400 border border-white/10',
  };

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'group relative flex items-center justify-between px-3 py-2 text-sm font-medium transition-all duration-150 rounded-lg',
          isActive
            ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-2.5">
            <Icon
              className={clsx(
                'w-4 h-4 transition-colors',
                isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-200'
              )}
            />
            <span>{label}</span>
          </div>

          {typeof badgeCount === 'number' && (
            <span
              className={clsx(
                'px-1.5 py-0.5 text-xs font-mono rounded font-medium',
                badgeStyles[badgeVariant] || badgeStyles.default
              )}
            >
              {badgeCount}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
