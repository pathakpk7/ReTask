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

  // Memoized metric calculations to prevent redundant recalculation
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
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#19C37D]" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#829188]">
            Productivity Intelligence Dashboard
          </h2>
        </div>
        <Card className="p-8 text-center space-y-3">
          <Info className="w-8 h-8 text-[#829188] mx-auto" />
          <h3 className="font-mono text-sm font-bold text-[#E8F0EA] uppercase">
            Not Enough Data Yet
          </h3>
          <p className="text-xs font-sans text-[#829188]">
            Create and complete tasks to generate productivity intelligence analytics.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#19C37D]" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#829188]">
            Productivity Intelligence Dashboard
          </h2>
        </div>
        <span className="font-mono text-[10px] text-[#19C37D] bg-[#0B5D3B]/40 border border-[#19C37D]/30 px-2 py-0.5 clip-cut-tr">
          LIVE DATA ENGINE
        </span>
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
          <div className="flex items-center gap-2 border-b border-[#1A261E] pb-3">
            <Clock className="w-4 h-4 text-[#19C37D]" />
            <h3 className="font-mono text-xs font-bold text-[#E8F0EA] uppercase tracking-wider">
              Estimation & Workload Accuracy
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#050705] border border-[#1A261E] flex justify-between clip-cut-tr">
              <span className="text-[#829188]">Total Workload Scope:</span>
              <span className="text-[#E8F0EA] font-bold">
                {Math.round(analyticsData.totalEstimatedMinutes / 60)} Hours ({analyticsData.totalEstimatedMinutes}m)
              </span>
            </div>

            <div className="p-3 bg-[#050705] border border-[#1A261E] flex justify-between clip-cut-tr">
              <span className="text-[#829188]">Finished Workload:</span>
              <span className="text-[#19C37D] font-bold">
                {Math.round(analyticsData.completedEstimatedMinutes / 60)} Hours
              </span>
            </div>

            <div className="p-3 bg-[#050705] border border-[#1A261E] flex justify-between clip-cut-tr">
              <span className="text-[#829188]">Average Carry-Forward Count:</span>
              <span className="text-[#FFA502] font-bold">
                {analyticsData.avgCarryForward}x per task
              </span>
            </div>
          </div>
        </Card>

        {/* List Workload Distribution */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1A261E] pb-3">
            <Folder className="w-4 h-4 text-[#19C37D]" />
            <h3 className="font-mono text-xs font-bold text-[#E8F0EA] uppercase tracking-wider">
              Categorical List Workload
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
                <div key={list.id}>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="flex items-center gap-1.5 text-[#E8F0EA]">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: list.color }} />
                      {list.name}
                    </span>
                    <span className="text-[#829188]">
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
