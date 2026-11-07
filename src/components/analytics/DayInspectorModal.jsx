import React from 'react';
import { Modal } from '../ui/Modal';
import { formatDate } from '../../utils/dateUtils';

export function DayInspectorModal({ isOpen, onClose, dayData }) {
  if (!dayData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Activity Summary: ${formatDate(dayData.date)}`}
    >
      <div className="space-y-4">
        {/* Metric Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
          <div className="p-3 rounded-xl bg-[#161B22] border border-white/[0.05]">
            <span className="text-[11px] text-zinc-400 block font-normal">Completed</span>
            <span className="font-semibold text-lg text-emerald-400 font-mono mt-0.5 block">{dayData.completedCount || 0}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#161B22] border border-white/[0.05]">
            <span className="text-[11px] text-zinc-400 block font-normal">Created</span>
            <span className="font-semibold text-lg text-white font-mono mt-0.5 block">{dayData.createdCount || 0}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#161B22] border border-white/[0.05]">
            <span className="text-[11px] text-zinc-400 block font-normal">Focus Time</span>
            <span className="font-semibold text-lg text-blue-400 font-mono mt-0.5 block">{dayData.focusMinutes || 0}m</span>
          </div>

          <div className="p-3 rounded-xl bg-[#161B22] border border-white/[0.05]">
            <span className="text-[11px] text-zinc-400 block font-normal">Rollovers</span>
            <span className="font-semibold text-lg text-amber-400 font-mono mt-0.5 block">{dayData.carryCount || 0}x</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 rounded-xl bg-[#161B22] border border-white/[0.05] space-y-2 text-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Completion Rate:</span>
            <span className="text-emerald-400 font-medium font-mono">{dayData.completionRate || 0}%</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
