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
    <div className="space-y-6">
      {/* Daily Carry-Forward Banner */}
      {carriedForwardCount > 0 && (
        <div className="p-3.5 bg-[#2B1D06] border border-[#FFA502]/40 clip-cut-tr flex items-center justify-between text-[#FFA502] font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 fill-current animate-pulse flex-shrink-0" />
            <span>
              <strong>SMART CARRY-FORWARD ACTIVE:</strong> {carriedForwardCount} incomplete task(s) advanced from previous day. Original schedule preserved.
            </span>
          </div>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#829188] uppercase block">Due Today</span>
            <span className="font-mono text-2xl font-bold text-[#19C37D]">{todayTasks.length}</span>
          </div>
          <Calendar className="w-7 h-7 text-[#0B5D3B]" />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#829188] uppercase block">Finished Today</span>
            <span className="font-mono text-2xl font-bold text-[#E8F0EA]">{completedTodayTasks.length}</span>
          </div>
          <CheckCircle2 className="w-7 h-7 text-[#19C37D]" />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#829188] uppercase block">Overdue Queue</span>
            <span className={`font-mono text-2xl font-bold ${overdueCount > 0 ? 'text-[#FF4757]' : 'text-[#829188]'}`}>
              {overdueCount}
            </span>
          </div>
          <AlertTriangle className={`w-7 h-7 ${overdueCount > 0 ? 'text-[#FF4757]' : 'text-[#829188]'}`} />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#829188] uppercase block">Recurring Engine</span>
            <span className="font-mono text-2xl font-bold text-[#19C37D]">{recurringCount}</span>
          </div>
          <Repeat className="w-7 h-7 text-[#0B5D3B]" />
        </Card>
      </div>

      {/* Daily Completion Progress Bar */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-[#829188] uppercase font-bold">Daily Workflow Velocity</span>
          <span className="text-[#19C37D] font-bold">
            {completedTodayTasks.length} of {totalTodayWorkload} Finished ({todayProgress}%)
          </span>
        </div>
        <ProgressBar percent={todayProgress} size="md" showLabel={false} />
      </Card>

      {/* Task Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#829188]">
            Today's Operations ({todayTasks.length})
          </h2>
          <Button variant="secondary" size="sm" onClick={() => openAddModal()}>
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </Button>
        </div>

        {todayTasks.length === 0 ? (
          <Card className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#050705] border border-[#19C37D] flex items-center justify-center mx-auto text-[#19C37D]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-mono text-sm font-bold text-[#E8F0EA] uppercase">
                {tasks.length === 0 ? 'No Tasks Created Yet' : 'All Operations Clear'}
              </h3>
              <p className="text-xs font-sans text-[#829188] max-w-sm mx-auto">
                {tasks.length === 0
                  ? 'Your task workspace is empty. Click "+ Add Task" to create your first task.'
                  : 'No pending tasks due for today. All scheduled operations completed on target.'}
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
