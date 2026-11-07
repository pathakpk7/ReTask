import React from 'react';
import { Card } from '../ui/Card';
import { Flame, Trophy, CalendarCheck, Zap } from 'lucide-react';
import { calculateStreakMetrics } from '../../services/analyticsService';
import { historyService } from '../../services/historyService';

export function StreakWidget({ tasks }) {
  const historyArray = historyService.getHistoryArray();
  const metrics = calculateStreakMetrics(tasks, historyArray);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-zinc-400 block font-normal">Current Streak</span>
          <span className="text-2xl font-bold text-white font-mono flex items-baseline gap-1 mt-0.5">
            {metrics.currentStreak} <span className="text-xs font-sans text-zinc-400 font-normal">days</span>
          </span>
        </div>
        <Flame className="w-6 h-6 text-amber-400 fill-amber-400/20" />
      </Card>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-zinc-400 block font-normal">Longest Record</span>
          <span className="text-2xl font-bold text-white font-mono flex items-baseline gap-1 mt-0.5">
            {metrics.longestStreak} <span className="text-xs font-sans text-zinc-400 font-normal">days</span>
          </span>
        </div>
        <Trophy className="w-6 h-6 text-emerald-400" />
      </Card>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-zinc-400 block font-normal">Active Days</span>
          <span className="text-2xl font-bold text-white font-mono flex items-baseline gap-1 mt-0.5">
            {metrics.activeDays} <span className="text-xs font-sans text-zinc-400 font-normal">total</span>
          </span>
        </div>
        <CalendarCheck className="w-6 h-6 text-emerald-400" />
      </Card>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-zinc-400 block font-normal">Consistency</span>
          <span className="text-2xl font-bold text-white font-mono mt-0.5 block">
            {metrics.weeklyConsistency}%
          </span>
        </div>
        <Zap className="w-6 h-6 text-blue-400" />
      </Card>
    </div>
  );
}
