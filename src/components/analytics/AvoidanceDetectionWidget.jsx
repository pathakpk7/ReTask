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
      <div className="flex items-center justify-between border-b border-[#1A261E] pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#FFA502]" />
          <div>
            <h3 className="font-mono text-xs font-bold text-[#E8F0EA] uppercase tracking-wider">
              Behavioral Task Avoidance Detection ({flaggedTasks.length})
            </h3>
            <span className="text-[10px] font-mono text-[#829188]">
              AUTOMATED POSTPONEMENT & RISK PATTERN CLASSIFIER
            </span>
          </div>
        </div>

        <span className="font-mono text-[10px] bg-[#2B1D06] text-[#FFA502] border border-[#FFA502]/40 px-2 py-0.5 clip-cut-tr">
          BEHAVIORAL ANALYTICS ONLY
        </span>
      </div>

      {flaggedTasks.length === 0 ? (
        <div className="p-6 text-center space-y-2">
          <CheckCircle2 className="w-6 h-6 text-[#19C37D] mx-auto" />
          <h4 className="font-mono text-xs font-bold text-[#E8F0EA] uppercase">
            No Avoidance Risks Detected
          </h4>
          <p className="text-xs font-sans text-[#829188]">
            No tasks exhibit high postponement or repeated carry-forward indicators.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {flaggedTasks.slice(0, 4).map((item) => (
            <div
              key={item.task.id}
              onClick={() => selectTask(item.task.id)}
              className="p-3 bg-[#050705] border border-[#1A261E] hover:border-[#FFA502] clip-cut-tr cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <AlertTriangle
                    className={`w-4 h-4 flex-shrink-0 ${
                      item.riskLevel === 'HIGH' ? 'text-[#FF4757]' : 'text-[#FFA502]'
                    }`}
                  />
                  <span className="font-sans text-xs font-bold text-[#E8F0EA] truncate">
                    {item.task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`font-mono text-[9px] font-bold px-2 py-0.5 border ${
                      item.riskLevel === 'HIGH'
                        ? 'bg-[#2A0E13] text-[#FF4757] border-[#FF4757]/40'
                        : 'bg-[#2B1D06] text-[#FFA502] border-[#FFA502]/40'
                    }`}
                  >
                    {item.riskLevel} AVOIDANCE RISK ({item.carryCount}x Carried)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(item.task);
                    }}
                  >
                    Adjust <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>

              {item.recommendations.length > 0 && (
                <p className="text-[11px] font-sans text-[#829188] pl-6">
                  💡 Recommendation: {item.recommendations[0]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
