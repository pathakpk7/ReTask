import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { DayInspectorModal } from './DayInspectorModal';
import { historyService } from '../../services/historyService';
import { Calendar } from 'lucide-react';

export function ProductivityHeatmap({ tasks }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const historyMap = historyService.getHistory();

  // Generate last 30 days grid
  const days = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - 86400000 * i);
    const dateStr = d.toISOString().split('T')[0];

    const completedTasksOnDate = tasks.filter(
      (t) => t.completed && t.completedAt && t.completedAt.split('T')[0] === dateStr
    ).length;

    const histEntry = historyMap[dateStr] || {};
    const totalActivity = completedTasksOnDate + Math.floor((histEntry.focusMinutes || 0) / 15);

    let level = 0;
    if (totalActivity > 0 && totalActivity <= 1) level = 1;
    else if (totalActivity > 1 && totalActivity <= 3) level = 2;
    else if (totalActivity > 3 && totalActivity <= 5) level = 3;
    else if (totalActivity > 5) level = 4;

    days.push({
      date: dateStr,
      completedCount: completedTasksOnDate,
      focusMinutes: histEntry.focusMinutes || 0,
      createdCount: histEntry.createdCount || 0,
      carryCount: histEntry.carryCount || 0,
      completionRate: histEntry.completionRate || 0,
      level,
    });
  }

  const levelStyles = {
    0: 'bg-white/[0.04] border border-white/[0.06]',
    1: 'bg-emerald-950/70 border border-emerald-800/40',
    2: 'bg-emerald-700/80 border border-emerald-600',
    3: 'bg-emerald-500 border border-emerald-400',
    4: 'bg-emerald-400 border border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.4)]',
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            30-Day Activity Heatmap
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded bg-white/[0.04] border border-white/[0.06]" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-950/70 border border-emerald-800/40" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-700/80 border border-emerald-600" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-400 border border-emerald-300" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-2">
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            onClick={() => setSelectedDay(day)}
            title={`${day.date}: ${day.completedCount} completed, ${day.focusMinutes}m focus`}
            className={`w-full aspect-square rounded transition-all hover:scale-105 cursor-pointer flex items-center justify-center text-[10px] ${
              levelStyles[day.level]
            }`}
          >
            <span className="opacity-0 hover:opacity-100 font-semibold text-white">
              {new Date(day.date).getDate()}
            </span>
          </button>
        ))}
      </div>

      <p className="text-xs text-zinc-500">
        Click any day cell to inspect historical activity.
      </p>

      {/* Inspector Modal */}
      <DayInspectorModal
        isOpen={Boolean(selectedDay)}
        onClose={() => setSelectedDay(null)}
        dayData={selectedDay}
      />
    </Card>
  );
}
