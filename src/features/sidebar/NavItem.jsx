import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export function NavItem({ to, icon: Icon, label, badgeCount, badgeVariant = 'default', onClick }) {
  const badgeStyles = {
    default: 'bg-[#101712] text-[#19C37D] border-[#0B5D3B]',
    urgent: 'bg-[#2A0E13] text-[#FF4757] border-[#FF4757]/40 shadow-[0_0_8px_rgba(255,71,87,0.3)]',
    muted: 'bg-[#101712] text-[#829188] border-[#1A261E]',
  };

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'group relative flex items-center justify-between px-3 py-2.5 text-xs font-mono tracking-wide transition-all duration-150 clip-cut-tr',
          isActive
            ? 'bg-[#101712] text-[#19C37D] border-l-2 border-[#19C37D] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
            : 'text-[#829188] hover:bg-[#101712]/60 hover:text-[#E8F0EA]'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-2.5">
            <Icon
              className={clsx(
                'w-4 h-4 transition-colors',
                isActive ? 'text-[#19C37D]' : 'text-[#829188] group-hover:text-[#E8F0EA]'
              )}
            />
            <span>{label}</span>
          </div>

          {typeof badgeCount === 'number' && (
            <span
              className={clsx(
                'px-1.5 py-0.5 text-[10px] font-mono border font-semibold',
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
