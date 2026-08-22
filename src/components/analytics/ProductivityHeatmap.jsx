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
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - 86400000 * i);
    const dateStr = d.toISOString().split('T')[0];

    // Compute task completions on this date
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
    0: 'bg-[#050705] border-[#1A261E]',
    1: 'bg-[#0B5D3B]/40 border-[#0B5D3B]',
    2: 'bg-[#0B5D3B] border-[#19C37D]/60',
    3: 'bg-[#19C37D]/80 border-[#19C37D]',
    4: 'bg-[#19C37D] border-[#19C37D] shadow-[0_0_10px_rgba(25,195,125,0.6)]',
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#19C37D]" />
          <h3 className="font-mono text-xs font-bold text-[#E8F0EA] uppercase tracking-wider">
            30-Day Productivity Intensity Heatmap
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#829188]">
          <span>Less</span>
          <div className="w-2.5 h-2.5 bg-[#050705] border border-[#1A261E]" />
          <div className="w-2.5 h-2.5 bg-[#0B5D3B]/40 border border-[#0B5D3B]" />
          <div className="w-2.5 h-2.5 bg-[#0B5D3B] border border-[#19C37D]/60" />
          <div className="w-2.5 h-2.5 bg-[#19C37D]" />
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
            title={`${day.date}: ${day.completedCount} finished, ${day.focusMinutes}m focus`}
            className={`w-full aspect-square border transition-all hover:scale-110 clip-cut-tr cursor-pointer flex items-center justify-center font-mono text-[9px] ${
              levelStyles[day.level]
            }`}
          >
            <span className="opacity-0 hover:opacity-100 font-bold text-[#E8F0EA]">
              {new Date(day.date).getDate()}
            </span>
          </button>
        ))}
      </div>

      <p className="text-[10px] font-mono text-[#829188]">
        Click any day cell to inspect detailed historical activity snapshots.
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
