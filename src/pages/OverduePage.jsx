import React from 'react';
import { useTaskContext } from '../store/TaskContext';
import { isOverdue } from '../utils/dateUtils';
import { TaskTree } from '../features/tasks/TaskTree';
import { buildTaskTree } from '../utils/taskTreeUtils';
import { Card } from '../components/ui/Card';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export function OverduePage() {
  const {
    tasks,
    searchQuery,
    selectTask,
    toggleComplete,
    toggleCollapse,
    openAddModal,
    openEditModal,
    openDeleteModal,
  } = useTaskContext();

  const overdueTasks = tasks.filter((t) => {
    if (t.completed) return false;
    if (!isOverdue(t.dueDate, t.completed)) return false;
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const treeData = buildTaskTree(overdueTasks);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <h2 className="text-sm font-semibold text-red-300">
              Overdue Tasks ({overdueTasks.length})
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Items with past due dates that need rescheduling or completion.
            </p>
          </div>
        </div>
      </div>

      {overdueTasks.length === 0 ? (
        <Card className="p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">
            No overdue tasks
          </h3>
          <p className="text-xs text-zinc-400">
            All your scheduled tasks are on track.
          </p>
        </Card>
      ) : (
        <TaskTree
          tasks={treeData}
          allTasks={tasks}
          onSelect={selectTask}
          onToggleComplete={toggleComplete}
          onToggleCollapse={toggleCollapse}
          onAddSubtask={(parentId) => openAddModal(parentId)}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}
    </div>
  );
}
