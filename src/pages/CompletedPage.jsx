import React from 'react';
import { useTaskContext } from '../store/TaskContext';
import { Card } from '../components/ui/Card';
import { PriorityBadge } from '../components/ui/Badge';
import { formatDate } from '../utils/dateUtils';
import { CheckCircle2, RotateCcw, Trash2 } from 'lucide-react';

export function CompletedPage() {
  const {
    tasks,
    searchQuery,
    selectTask,
    toggleComplete,
    openDeleteModal,
  } = useTaskContext();

  const completedTasks = tasks.filter((t) => {
    if (!t.completed) return false;
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#829188]">
          // ARCHIVED COMPLETED OPERATIONS ({completedTasks.length})
        </h2>
      </div>

      {completedTasks.length === 0 ? (
        <Card className="p-8 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-[#829188] mx-auto" />
          <h3 className="font-mono text-sm font-bold text-[#E8F0EA] uppercase">
            Archive Empty
          </h3>
          <p className="text-xs font-sans text-[#829188]">
            No completed tasks found in system memory.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => selectTask(task.id)}
              className="flex items-center justify-between p-3 bg-[#0B100D] border border-[#1A261E] hover:border-[#0B5D3B] cursor-pointer clip-cut-tr transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                <div className="w-5 h-5 bg-[#0B5D3B] border border-[#19C37D] text-[#E8F0EA] flex items-center justify-center clip-cut-tr flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm font-medium text-[#829188] line-through truncate">
                      {task.title}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.completedAt && (
                    <span className="text-[10px] font-mono text-[#829188] block">
                      Finished on {formatDate(task.completedAt)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(task.id);
                  }}
                  title="Reopen task"
                  className="px-2.5 py-1 bg-[#101712] text-[#19C37D] border border-[#1A261E] hover:border-[#19C37D] font-mono text-xs flex items-center gap-1 clip-cut-tr"
                >
                  <RotateCcw className="w-3 h-3" /> Reopen
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(task);
                  }}
                  title="Delete task"
                  className="p-1 text-[#829188] hover:text-[#FF4757] hover:bg-[#2A0E13] clip-cut-tr"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
