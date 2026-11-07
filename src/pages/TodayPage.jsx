import React from 'react';
import { useTaskContext } from '../store/TaskContext';
import { buildTaskTree } from '../utils/taskTreeUtils';
import { isToday, isOverdue } from '../utils/dateUtils';
import { TaskTree } from '../features/tasks/TaskTree';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Calendar, CheckCircle2, AlertTriangle, Plus, Zap, Repeat } from 'lucide-react';

export function TodayPage() {
  const {
    tasks,
    searchQuery,
    activeListId,
    carriedForwardCount,
    selectTask,
    toggleComplete,
    toggleCollapse,
    openAddModal,
    openEditModal,
    openDeleteModal,
  } = useTaskContext();

  const todayTasks = tasks.filter((t) => {
    if (t.completed) return false;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesList = activeListId === 'all' || t.listId === activeListId;

    const isDueTodayOrOverdue = isToday(t.dueDate) || isOverdue(t.dueDate, t.completed);
    return matchesSearch && matchesList && isDueTodayOrOverdue;
  });

  const treeData = buildTaskTree(todayTasks);
  const completedTodayTasks = tasks.filter((t) => t.completed && isToday(t.completedAt));
  const overdueCount = tasks.filter((t) => !t.completed && isOverdue(t.dueDate, t.completed)).length;
  const recurringCount = tasks.filter((t) => t.recurrence && t.recurrence.enabled).length;

  const totalTodayWorkload = todayTasks.length + completedTodayTasks.length;
  const todayProgress = totalTodayWorkload > 0 ? Math.round((completedTodayTasks.length / totalTodayWorkload) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Daily Carry-Forward Banner */}
      {carriedForwardCount > 0 && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-amber-300 text-xs">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Smart rollover active:</strong> {carriedForwardCount} incomplete task(s) seamlessly carried forward from yesterday.
            </span>
          </div>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block font-normal">Due Today</span>
            <span className="text-2xl font-bold text-white font-mono mt-0.5 block">{todayTasks.length}</span>
          </div>
          <Calendar className="w-6 h-6 text-emerald-400/80" />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block font-normal">Finished Today</span>
            <span className="text-2xl font-bold text-white font-mono mt-0.5 block">{completedTodayTasks.length}</span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400/80" />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block font-normal">Overdue</span>
            <span className={`text-2xl font-bold font-mono mt-0.5 block ${overdueCount > 0 ? 'text-red-400' : 'text-zinc-500'}`}>
              {overdueCount}
            </span>
          </div>
          <AlertTriangle className={`w-6 h-6 ${overdueCount > 0 ? 'text-red-400' : 'text-zinc-500'}`} />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block font-normal">Recurring</span>
            <span className="text-2xl font-bold text-white font-mono mt-0.5 block">{recurringCount}</span>
          </div>
          <Repeat className="w-6 h-6 text-emerald-400/80" />
        </Card>
      </div>

      {/* Daily Completion Progress Bar */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">Daily completion progress</span>
          <span className="text-emerald-400 font-medium font-mono">
            {completedTodayTasks.length} of {totalTodayWorkload} completed ({todayProgress}%)
          </span>
        </div>
        <ProgressBar percent={todayProgress} size="md" showLabel={false} />
      </Card>

      {/* Task Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-sm font-semibold text-zinc-200">
            Today's Tasks ({todayTasks.length})
          </h2>
          <Button variant="secondary" size="sm" onClick={() => openAddModal()}>
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </Button>
        </div>

        {todayTasks.length === 0 ? (
          <Card className="p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">
                {tasks.length === 0 ? 'Your workspace is clear' : 'All tasks completed for today'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {tasks.length === 0
                  ? 'Get started by creating your first task or breaking down an upcoming goal.'
                  : 'Great work! You have cleared everything scheduled for today.'}
              </p>
            </div>
            {tasks.length === 0 && (
              <Button variant="primary" size="md" onClick={() => openAddModal()} className="mx-auto">
                <Plus className="w-4 h-4" />
                <span>Create First Task</span>
              </Button>
            )}
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
    </div>
  );
}
