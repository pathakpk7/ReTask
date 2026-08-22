import React from 'react';
import { useTaskContext } from '../store/TaskContext';
import { isOverdue } from '../utils/dateUtils';
import { TaskTree } from '../features/tasks/TaskTree';
import { buildTaskTree } from '../utils/taskTreeUtils';
import { Card } from '../components/ui/Card';
import { AlertTriangle } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-[#2A0E13] border border-[#FF4757]/40 clip-cut-tr">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-[#FF4757]" />
          <div>
            <h2 className="font-mono text-sm font-bold text-[#FF4757] uppercase">
              CRITICAL OVERDUE OPERATIONS AUDIT ({overdueTasks.length})
            </h2>
            <p className="text-xs font-sans text-[#E8F0EA]">
              Tasks past target execution window requires priority intervention.
            </p>
          </div>
        </div>
      </div>

      {overdueTasks.length === 0 ? (
        <Card className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#050705] border border-[#19C37D] flex items-center justify-center mx-auto text-[#19C37D]">
            ✓
          </div>
          <h3 className="font-mono text-sm font-bold text-[#E8F0EA] uppercase">
            No Overdue Tasks
          </h3>
          <p className="text-xs font-sans text-[#829188]">
            All active deadlines are inside target temporal parameters.
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
