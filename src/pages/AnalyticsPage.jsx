import React, { useMemo } from 'react';
import { useTaskContext } from '../store/TaskContext';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StreakWidget } from '../components/analytics/StreakWidget';
import { ProductivityHeatmap } from '../components/analytics/ProductivityHeatmap';
import { AvoidanceDetectionWidget } from '../components/analytics/AvoidanceDetectionWidget';
import { calculateEstimationMetrics } from '../services/analyticsService';
import { BarChart3, Clock, Target, Zap, Folder, Info } from 'lucide-react';

export function AnalyticsPage() {
  const { tasks, lists } = useTaskContext();

  const analyticsData = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalEstimatedMinutes = tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
    const completedEstimatedMinutes = tasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + (t.estimatedTime || 0), 0);

    const totalCarryForwards = tasks.reduce((sum, t) => sum + (t.carryForwardCount || 0), 0);
    const avgCarryForward = totalTasks > 0 ? (totalCarryForwards / totalTasks).toFixed(1) : '0';

    const estMetrics = calculateEstimationMetrics(tasks);

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
      totalEstimatedMinutes,
      completedEstimatedMinutes,
      totalCarryForwards,
      avgCarryForward,
      estMetrics,
    };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold text-zinc-200">
            Analytics Overview
          </h2>
        </div>
        <Card className="p-10 text-center space-y-3">
          <Info className="w-8 h-8 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">
            Not enough data yet
          </h3>
          <p className="text-xs text-zinc-400">
            Create and complete tasks to start generating productivity metrics.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold text-zinc-200">
            Productivity Analytics
          </h2>
        </div>
      </div>

      {/* Streak Metrics Widget */}
      <StreakWidget tasks={tasks} />

      {/* Productivity Intensity Heatmap */}
      <ProductivityHeatmap tasks={tasks} />

      {/* Behavioral Avoidance Detection */}
      <AvoidanceDetectionWidget tasks={tasks} />

      {/* Grid: Estimation & List Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estimation & Workload Analytics */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Workload & Estimation
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-[#161B22] border border-white/[0.05] flex justify-between">
              <span className="text-zinc-400">Total Workload Scope:</span>
              <span className="text-white font-medium">
                {Math.round(analyticsData.totalEstimatedMinutes / 60)} Hours ({analyticsData.totalEstimatedMinutes}m)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#161B22] border border-white/[0.05] flex justify-between">
              <span className="text-zinc-400">Completed Workload:</span>
              <span className="text-emerald-400 font-medium">
                {Math.round(analyticsData.completedEstimatedMinutes / 60)} Hours
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#161B22] border border-white/[0.05] flex justify-between">
              <span className="text-zinc-400">Average Rollovers per Task:</span>
              <span className="text-amber-400 font-medium">
                {analyticsData.avgCarryForward}x
              </span>
            </div>
          </div>
        </Card>

        {/* List Workload Distribution */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Folder className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              List Distribution
            </h3>
          </div>

          <div className="space-y-3">
            {lists.map((list) => {
              const listTaskCount = tasks.filter((t) => t.listId === list.id).length;
              const listPercent =
                analyticsData.totalTasks > 0
                  ? Math.round((listTaskCount / analyticsData.totalTasks) * 100)
                  : 0;
              return (
                <div key={list.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-200">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: list.color }} />
                      {list.name}
                    </span>
                    <span className="text-zinc-400">
                      {listTaskCount} tasks ({listPercent}%)
                    </span>
                  </div>
                  <ProgressBar percent={listPercent} size="sm" showLabel={false} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
