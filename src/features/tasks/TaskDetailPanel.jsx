import React from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Folder,
  Check,
  Zap,
  Repeat,
  CornerDownRight,
} from 'lucide-react';
import { PriorityBadge, DifficultyBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/FormControls';
import { useTaskContext } from '../../store/TaskContext';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import {
  calculateSubtaskMetrics,
  getTaskAncestors,
} from '../../utils/taskTreeUtils';

export function TaskDetailPanel() {
  const {
    selectedTask,
    selectTask,
    tasks,
    lists,
    toggleComplete,
    reassignParent,
    openAddModal,
    openEditModal,
    openDeleteModal,
  } = useTaskContext();

  if (!selectedTask) return null;

  const ancestors = getTaskAncestors(selectedTask.id, tasks);
  const directChildren = tasks.filter((t) => t.parentId === selectedTask.id);
  const { totalChildren, completedChildren, percentComplete } = calculateSubtaskMetrics(
    selectedTask.id,
    tasks
  );
  const listInfo = lists.find((l) => l.id === selectedTask.listId);
  const taskOverdue = isOverdue(selectedTask.dueDate, selectedTask.completed);

  const availableParents = tasks.filter((t) => t.id !== selectedTask.id);

  return (
    <aside className="w-full lg:w-96 bg-[#0B0E12] border-t lg:border-t-0 lg:border-l border-white/[0.07] flex flex-col h-full overflow-hidden shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Task Details
          </h3>
        </div>
        <button
          type="button"
          onClick={() => selectTask(null)}
          aria-label="Close detail panel"
          className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-5">
        {/* Lineage / Breadcrumbs */}
        {ancestors.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-zinc-400 bg-white/[0.03] p-2.5 rounded-lg border border-white/[0.05]">
            <span className="text-zinc-500">Root</span>
            {ancestors.map((ancestor) => (
              <React.Fragment key={ancestor.id}>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                <button
                  type="button"
                  onClick={() => selectTask(ancestor.id)}
                  className="hover:text-emerald-400 truncate max-w-[120px]"
                >
                  {ancestor.title}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Task Title & Complete Button */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h2
              className={`text-base font-semibold tracking-tight ${
                selectedTask.completed ? 'line-through text-zinc-500' : 'text-white'
              }`}
            >
              {selectedTask.title}
            </h2>
            <button
              type="button"
              onClick={() => toggleComplete(selectedTask.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 flex-shrink-0 ${
                selectedTask.completed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:border-emerald-400 hover:text-emerald-400'
              }`}
            >
              {selectedTask.completed ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Reopen
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                </>
              )}
            </button>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={selectedTask.priority} />
            {selectedTask.difficulty && <DifficultyBadge difficulty={selectedTask.difficulty} />}
            {listInfo && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: listInfo.color }} />
                {listInfo.name}
              </span>
            )}
          </div>
        </div>

        {/* Carry Forward & Recurrence Metrics Box */}
        {(selectedTask.carryForwardCount > 0 || selectedTask.recurrence?.enabled) && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
            {selectedTask.carryForwardCount > 0 && (
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Rollover count:
                </span>
                <span className="font-semibold">{selectedTask.carryForwardCount}x</span>
              </div>
            )}

            {selectedTask.originalDueDate && selectedTask.carryForwardCount > 0 && (
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span>Originally scheduled:</span>
                <span>{formatDate(selectedTask.originalDueDate)}</span>
              </div>
            )}

            {selectedTask.recurrence?.enabled && (
              <div className="flex items-center justify-between text-emerald-400 pt-1.5 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5" /> Repeats:
                </span>
                <span className="capitalize">{selectedTask.recurrence.frequency}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-zinc-400">
            Description
          </h4>
          <div className="p-3.5 rounded-xl bg-[#161B22] border border-white/[0.05] min-h-[60px]">
            <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {selectedTask.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Parent Selector */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-zinc-400 flex items-center gap-1">
            <CornerDownRight className="w-3 h-3 text-emerald-400" /> Parent Task
          </h4>
          <Select
            value={selectedTask.parentId || ''}
            onChange={(e) => reassignParent(selectedTask.id, e.target.value || null)}
          >
            <option value="">None (Root Task)</option>
            {availableParents.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </Select>
        </div>

        {/* Timeline Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#161B22] border border-white/[0.05]">
            <span className="text-[11px] text-zinc-400 block">Due Date</span>
            <span
              className={`flex items-center gap-1 font-medium mt-1 ${
                taskOverdue ? 'text-red-400' : 'text-zinc-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {formatDate(selectedTask.dueDate)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#161B22] border border-white/[0.05]">
            <span className="text-[11px] text-zinc-400 block">Estimated Time</span>
            <span className="flex items-center gap-1 font-medium mt-1 text-zinc-200">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {selectedTask.estimatedTime || 0}m
            </span>
          </div>
        </div>

        {/* Subtasks Progress */}
        {totalChildren > 0 && (
          <div className="space-y-3 p-4 rounded-xl bg-[#161B22] border border-white/[0.05]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Subtask Progress</span>
              <span className="text-emerald-400 font-mono">
                {completedChildren}/{totalChildren} ({percentComplete}%)
              </span>
            </div>
            <ProgressBar percent={percentComplete} size="md" showLabel={false} />

            <div className="space-y-1.5 pt-1">
              {directChildren.map((child) => (
                <div
                  key={child.id}
                  onClick={() => selectTask(child.id)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F1216] border border-white/[0.04] hover:border-white/10 cursor-pointer text-xs"
                >
                  <span
                    className={`truncate ${
                      child.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                    }`}
                  >
                    {child.title}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(child.id);
                    }}
                    className="text-emerald-400 hover:text-white"
                  >
                    {child.completed ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded border border-white/20" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-white/[0.07] bg-[#0E1116] flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openAddModal(selectedTask.id)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Subtask</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openEditModal(selectedTask)}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" />
            <span>Edit</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => openDeleteModal(selectedTask)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
