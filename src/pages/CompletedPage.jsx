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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">
          Completed Archive ({completedTasks.length})
        </h2>
      </div>

      {completedTasks.length === 0 ? (
        <Card className="p-10 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-zinc-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">
            Archive is empty
          </h3>
          <p className="text-xs text-zinc-400">
            Tasks you complete will appear here with completion timestamps.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => selectTask(task.id)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F1216] border border-white/[0.07] hover:border-white/[0.14] cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                <div className="w-5 h-5 rounded bg-emerald-500 text-[#08090A] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-400 line-through truncate">
                      {task.title}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.completedAt && (
                    <span className="text-xs text-zinc-500 block mt-0.5">
                      Completed on {formatDate(task.completedAt)}
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
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
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
                  className="p-1.5 text-zinc-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
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
