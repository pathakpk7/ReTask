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
      className={`relative group my-1 ${
        isDropTarget && dropPosition === 'before'
          ? 'border-t-2 border-[#19C37D]'
          : isDropTarget && dropPosition === 'after'
          ? 'border-b-2 border-[#19C37D]'
          : ''
      }`}
    >
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 border-l border-[#1A261E] pointer-events-none"
          style={{ left: `${indentPadding - 12}px` }}
        />
      )}

      <div
        onClick={() => onSelect(task.id)}
        style={{ paddingLeft: `${Math.max(12, indentPadding + 12)}px` }}
        className={`relative flex flex-col md:flex-row md:items-center justify-between p-3 transition-all duration-150 clip-cut-tr border cursor-pointer ${
          isDropTarget && dropPosition === 'inside'
            ? 'bg-[#101712] border-[#19C37D] ring-2 ring-[#19C37D]'
            : selected || multiSelected
            ? 'bg-[#101712] border-[#19C37D] shadow-[0_0_15px_rgba(25,195,125,0.25)]'
            : task.completed
            ? 'bg-[#050705]/60 border-[#1A261E]/50 opacity-60'
            : 'bg-[#0B100D] border-[#1A261E] hover:border-[#0B5D3B] hover:bg-[#152019]'
        }`}
      >
        {/* Drag handle & Checkboxes */}
        <div className="flex items-start md:items-center gap-2 flex-1 min-w-0 pr-2">
          {/* Drag Handle */}
          <div className="cursor-grab active:cursor-grabbing text-[#4B5850] hover:text-[#19C37D] mt-0.5 md:mt-0 flex-shrink-0">
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Multi-Select Checkbox */}
          <input
            type="checkbox"
            checked={multiSelected}
            onChange={handleMultiSelectClick}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${task.title}`}
            className="accent-[#19C37D] w-3.5 h-3.5 cursor-pointer mt-0.5 md:mt-0 flex-shrink-0"
          />

          {/* Expand / Collapse Chevron */}
          {hasChildren ? (
            <button
              type="button"
              onClick={handleCollapseClick}
              aria-label={task.collapsed ? 'Expand subtasks' : 'Collapse subtasks'}
              className="p-0.5 text-[#829188] hover:text-[#19C37D] hover:bg-[#1A261E] clip-cut-tr transition-colors"
            >
              {task.collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#19C37D]" />
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
            className={`w-5 h-5 mt-0.5 md:mt-0 flex items-center justify-center border transition-all duration-150 clip-cut-tr flex-shrink-0 ${
              task.completed
                ? 'bg-[#0B5D3B] border-[#19C37D] text-[#E8F0EA]'
                : 'bg-[#050705] border-[#1A261E] hover:border-[#19C37D]'
            }`}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Content Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-sans text-xs md:text-sm font-medium tracking-wide truncate ${
                  task.completed
                    ? 'line-through text-[#829188]'
                    : 'text-[#E8F0EA] group-hover:text-[#19C37D]'
                }`}
              >
                {task.title}
              </span>

              <PriorityBadge priority={task.priority} />
              {task.difficulty && <DifficultyBadge difficulty={task.difficulty} />}

              {task.carryForwardCount > 0 && !task.completed && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-[#FFA502] bg-[#2B1D06] border border-[#FFA502]/40 px-1.5 py-0.5 clip-cut-tr">
                  <Zap className="w-2.5 h-2.5 fill-current" /> Carried ({task.carryForwardCount}x)
                </span>
              )}

              {task.recurrence && task.recurrence.enabled && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-[#19C37D] bg-[#0B5D3B]/40 border border-[#19C37D]/30 px-1.5 py-0.5 clip-cut-tr">
                  <Repeat className="w-2.5 h-2.5" /> {task.recurrence.frequency}
                </span>
              )}

              {listInfo && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#829188] bg-[#050705] border border-[#1A261E] px-1.5 py-0.5">
                  <Folder className="w-2.5 h-2.5" style={{ color: listInfo.color }} />
                  {listInfo.name}
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-[11px] font-sans text-[#829188] line-clamp-1 mt-0.5">
                {task.description}
              </p>
            )}

            {totalChildren > 0 && (
              <div className="mt-2 max-w-xs">
                <ProgressBar percent={percentComplete} size="sm" />
                <span className="text-[9px] font-mono text-[#829188] mt-0.5 block">
                  {completedChildren} of {totalChildren} subtasks finished
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Badges & Action Toolbar */}
        <div className="flex items-center justify-between md:justify-end gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1A261E]">
          <div className="flex items-center gap-2 font-mono text-[10px]">
            {task.dueDate && (
              <span
                className={`flex items-center gap-1 px-1.5 py-0.5 border ${
                  taskOverdue
                    ? 'bg-[#2A0E13] text-[#FF4757] border-[#FF4757]/40'
                    : 'bg-[#050705] text-[#829188] border-[#1A261E]'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
              </span>
            )}

            {task.estimatedTime > 0 && (
              <span className="hidden sm:flex items-center gap-1 bg-[#050705] text-[#829188] border border-[#1A261E] px-1.5 py-0.5">
                <Clock className="w-3 h-3 text-[#0B5D3B]" />
                {task.estimatedTime}m
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Mobile Context Menu Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                if (onContextMenu) onContextMenu(rect.left, rect.bottom + 5, task);
              }}
              title="Task Actions"
              aria-label="Task context menu"
              className="p-1 text-[#829188] hover:text-[#19C37D] hover:bg-[#1A261E] clip-cut-tr"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleAddSubtaskClick}
              title="Add subtask"
              aria-label="Add subtask"
              className="p-1 text-[#829188] hover:text-[#19C37D] hover:bg-[#1A261E] clip-cut-tr transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleEditClick}
              title="Edit task"
              aria-label="Edit task"
              className="p-1 text-[#829188] hover:text-[#E8F0EA] hover:bg-[#1A261E] clip-cut-tr transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleDeleteClick}
              title="Delete task"
              aria-label="Delete task"
              className="p-1 text-[#829188] hover:text-[#FF4757] hover:bg-[#2A0E13] clip-cut-tr transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
