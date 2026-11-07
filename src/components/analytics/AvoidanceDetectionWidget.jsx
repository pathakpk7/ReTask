import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { classifyAvoidanceRisk } from '../../services/analyticsService';
import { useTaskContext } from '../../store/TaskContext';
import { AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export function AvoidanceDetectionWidget({ tasks }) {
  const { openEditModal, selectTask } = useTaskContext();
  const flaggedTasks = classifyAvoidanceRisk(tasks);

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Avoidance Intelligence ({flaggedTasks.length})
            </h3>
            <span className="text-xs text-zinc-500 font-normal">
              Identifies tasks postponed 3+ times to help adjust scope
            </span>
          </div>
        </div>
      </div>

      {flaggedTasks.length === 0 ? (
        <div className="p-6 text-center space-y-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-semibold text-white">
            No Avoidance Bottlenecks
          </h4>
          <p className="text-xs text-zinc-400">
            All tasks are progressing within healthy scheduling cycles.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {flaggedTasks.slice(0, 4).map((item) => (
            <div
              key={item.task.id}
              onClick={() => selectTask(item.task.id)}
              className="p-3.5 rounded-lg bg-[#161B22] border border-white/[0.05] hover:border-amber-400/40 cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <AlertTriangle
                    className={`w-4 h-4 flex-shrink-0 ${
                      item.riskLevel === 'HIGH' ? 'text-red-400' : 'text-amber-400'
                    }`}
                  />
                  <span className="text-sm font-medium text-white truncate">
                    {item.task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium border ${
                      item.riskLevel === 'HIGH'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    Postponed {item.carryCount}x
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(item.task);
                    }}
                  >
                    Adjust <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>

              {item.recommendations.length > 0 && (
                <p className="text-xs text-zinc-400 pl-6">
                  Recommendation: {item.recommendations[0]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
