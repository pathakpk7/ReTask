import React from 'react';
import { Card } from '../ui/Card';
import { Flame, Trophy, CalendarCheck, Zap } from 'lucide-react';
import { calculateStreakMetrics } from '../../services/analyticsService';
import { historyService } from '../../services/historyService';

export function StreakWidget({ tasks }) {
  const historyArray = historyService.getHistoryArray();
  const metrics = calculateStreakMetrics(tasks, historyArray);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#829188] uppercase block">Current Streak</span>
          <span className="font-mono text-3xl font-extrabold text-[#FFA502] flex items-center gap-1">
            {metrics.currentStreak} <span className="text-xs text-[#829188]">DAYS</span>
          </span>
        </div>
        <Flame className="w-8 h-8 text-[#FFA502] fill-current animate-pulse" />
      </Card>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#829188] uppercase block">Longest Record</span>
          <span className="font-mono text-3xl font-extrabold text-[#19C37D] flex items-center gap-1">
            {metrics.longestStreak} <span className="text-xs text-[#829188]">DAYS</span>
          </span>
        </div>
        <Trophy className="w-8 h-8 text-[#0B5D3B]" />
      </Card>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#829188] uppercase block">Active Days</span>
          <span className="font-mono text-3xl font-extrabold text-[#E8F0EA] flex items-center gap-1">
            {metrics.activeDays} <span className="text-xs text-[#829188]">TOTAL</span>
          </span>
        </div>
        <CalendarCheck className="w-8 h-8 text-[#19C37D]" />
      </Card>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#829188] uppercase block">Weekly Consistency</span>
          <span className="font-mono text-3xl font-extrabold text-[#1E90FF]">
            {metrics.weeklyConsistency}%
          </span>
        </div>
        <Zap className="w-8 h-8 text-[#1E90FF]" />
      </Card>
    </div>
  );
}
