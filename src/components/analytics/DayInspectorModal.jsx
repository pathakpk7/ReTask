import React from 'react';
import { Modal } from '../ui/Modal';
import { formatDate } from '../../utils/dateUtils';
import { Calendar, CheckCircle2, Zap, Clock, AlertTriangle } from 'lucide-react';

export function DayInspectorModal({ isOpen, onClose, dayData }) {
  if (!dayData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Historical Day Audit: ${formatDate(dayData.date)}`}
    >
      <div className="space-y-4">
        {/* Metric Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
          <div className="p-3 bg-[#050705] border border-[#1A261E] clip-cut-tr">
            <span className="text-[10px] text-[#829188] uppercase block">Completed</span>
            <span className="font-bold text-lg text-[#19C37D]">{dayData.completedCount || 0}</span>
          </div>

          <div className="p-3 bg-[#050705] border border-[#1A261E] clip-cut-tr">
            <span className="text-[10px] text-[#829188] uppercase block">Created</span>
            <span className="font-bold text-lg text-[#E8F0EA]">{dayData.createdCount || 0}</span>
          </div>

          <div className="p-3 bg-[#050705] border border-[#1A261E] clip-cut-tr">
            <span className="text-[10px] text-[#829188] uppercase block">Focus Time</span>
            <span className="font-bold text-lg text-[#1E90FF]">{dayData.focusMinutes || 0}m</span>
          </div>

          <div className="p-3 bg-[#050705] border border-[#1A261E] clip-cut-tr">
            <span className="text-[10px] text-[#829188] uppercase block">Carried Forward</span>
            <span className="font-bold text-lg text-[#FFA502]">{dayData.carryCount || 0}x</span>
          </div>
        </div>

        {/* Audit Details */}
        <div className="p-4 bg-[#050705] border border-[#1A261E] clip-cut-tr space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-[#829188]">
            <span>Completion Rate:</span>
            <span className="text-[#19C37D] font-bold">{dayData.completionRate || 0}%</span>
          </div>
          <div className="flex items-center justify-between text-[#829188]">
            <span>Target Execution Window:</span>
            <span className="text-[#E8F0EA]">PASSED</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
