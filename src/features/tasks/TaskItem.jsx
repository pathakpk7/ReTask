import React from 'react';
import {
  ChevronRight,
  ChevronDown,
  Check,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Folder,
  Zap,
  Repeat,
  GripVertical,
  MoreVertical,
} from 'lucide-react';
import { PriorityBadge, DifficultyBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { calculateSubtaskMetrics } from '../../utils/taskTreeUtils';

export function TaskItem({
  task,
  allTasks,
  lists,
  depth = 0,
  selected = false,
  multiSelected = false,
  onSelect,
  onToggleMultiSelect,
  onToggleComplete,
  onToggleCollapse,
  onAddSubtask,
  onEdit,
  onDelete,
  onContextMenu,
  // Drag & Drop handlers
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDropTarget = false,
  dropPosition = null,
}) {
  const { totalChildren, completedChildren, percentComplete } = calculateSubtaskMetrics(
    task.id,
    allTasks
  );
  const hasChildren = task.children && task.children.length > 0;
  const taskOverdue = isOverdue(task.dueDate, task.completed);
  const listInfo = lists.find((l) => l.id === task.listId);
  const indentPadding = depth * 24;

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleComplete(task.id);
  };

  const handleMultiSelectClick = (e) => {
    e.stopPropagation();
    onToggleMultiSelect(task.id);
  };

  const handleCollapseClick = (e) => {
    e.stopPropagation();
    onToggleCollapse(task.id);
  };

  const handleAddSubtaskClick = (e) => {
    e.stopPropagation();
    onAddSubtask(task.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(task);
  };

  const handleContextMenuEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContextMenu) {
      onContextMenu(e.clientX, e.clientY, task);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      onDragOver={(e) => onDragOver && onDragOver(e, task)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop && onDrop(e, task)}
      onContextMenu={handleContextMenuEvent}
      className={`relative group my-1.5 ${
        isDropTarget && dropPosition === 'before'
          ? 'border-t-2 border-emerald-500'
          : isDropTarget && dropPosition === 'after'
          ? 'border-b-2 border-emerald-500'
          : ''
      }`}
    >
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 border-l border-white/10 pointer-events-none"
          style={{ left: `${indentPadding - 12}px` }}
        />
      )}

      <div
        onClick={() => onSelect(task.id)}
        style={{ paddingLeft: `${Math.max(12, indentPadding + 12)}px` }}
        className={`relative flex flex-col md:flex-row md:items-center justify-between p-3.5 transition-all duration-150 rounded-xl border cursor-pointer ${
          isDropTarget && dropPosition === 'inside'
            ? 'bg-[#161B22] border-emerald-500 ring-2 ring-emerald-500/50'
            : selected || multiSelected
            ? 'bg-[#161B22] border-emerald-500/60 shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)]'
            : task.completed
            ? 'bg-[#0F1216]/50 border-white/[0.04] opacity-60'
            : 'bg-[#0F1216] border-white/[0.07] hover:border-white/[0.14] hover:bg-[#13171F]'
        }`}
      >
        {/* Drag handle & Checkboxes */}
        <div className="flex items-start md:items-center gap-2.5 flex-1 min-w-0 pr-2">
          {/* Drag Handle */}
          <div className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 mt-0.5 md:mt-0 flex-shrink-0">
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Multi-Select Checkbox */}
          <input
            type="checkbox"
            checked={multiSelected}
            onChange={handleMultiSelectClick}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${task.title}`}
            className="accent-emerald-500 w-3.5 h-3.5 rounded cursor-pointer mt-0.5 md:mt-0 flex-shrink-0"
          />

          {/* Expand / Collapse Chevron */}
          {hasChildren ? (
            <button
              type="button"
              onClick={handleCollapseClick}
              aria-label={task.collapsed ? 'Expand subtasks' : 'Collapse subtasks'}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
            >
              {task.collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Complete Toggle Button */}
          <button
            type="button"
            onClick={handleCheckboxClick}
            aria-label={task.completed ? 'Reopen task' : 'Complete task'}
            className={`w-5 h-5 mt-0.5 md:mt-0 flex items-center justify-center rounded transition-all duration-150 flex-shrink-0 ${
              task.completed
                ? 'bg-emerald-500 text-[#08090A]'
                : 'border border-white/20 hover:border-emerald-400'
            }`}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Content Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm font-medium tracking-normal truncate ${
                  task.completed
                    ? 'line-through text-zinc-500'
                    : 'text-zinc-100 group-hover:text-emerald-300 transition-colors'
                }`}
              >
                {task.title}
              </span>

              <PriorityBadge priority={task.priority} />
              {task.difficulty && <DifficultyBadge difficulty={task.difficulty} />}

              {task.carryForwardCount > 0 && !task.completed && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-normal">
                  <Zap className="w-3 h-3" /> Carried ({task.carryForwardCount}x)
                </span>
              )}

              {task.recurrence && task.recurrence.enabled && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-normal">
                  <Repeat className="w-3 h-3" /> {task.recurrence.frequency}
                </span>
              )}

              {listInfo && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: listInfo.color }} />
                  {listInfo.name}
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-normal">
                {task.description}
              </p>
            )}

            {totalChildren > 0 && (
              <div className="mt-2 max-w-xs">
                <ProgressBar percent={percentComplete} size="sm" />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  {completedChildren} of {totalChildren} subtasks finished
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Badges & Action Toolbar */}
        <div className="flex items-center justify-between md:justify-end gap-3 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs">
            {task.dueDate && (
              <span
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${
                  taskOverdue
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-white/5 text-zinc-400 border-white/10'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
              </span>
            )}

            {task.estimatedTime > 0 && (
              <span className="hidden sm:flex items-center gap-1 text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3 text-emerald-400" />
                {task.estimatedTime}m
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Context Menu Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                if (onContextMenu) onContextMenu(rect.left, rect.bottom + 5, task);
              }}
              title="Task Actions"
              aria-label="Task context menu"
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAddSubtaskClick}
              title="Add subtask"
              aria-label="Add subtask"
              className="p-1 text-zinc-400 hover:text-emerald-400 rounded hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleEditClick}
              title="Edit task"
              aria-label="Edit task"
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDeleteClick}
              title="Delete task"
              aria-label="Delete task"
              className="p-1 text-zinc-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
