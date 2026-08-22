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
    <aside className="w-full lg:w-96 bg-[#0B100D] border-t lg:border-t-0 lg:border-l border-[#1A261E] flex flex-col h-full overflow-hidden shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1A261E] bg-[#101712]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#19C37D]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E8F0EA]">
            Task Details & Metrics
          </h3>
        </div>
        <button
          type="button"
          onClick={() => selectTask(null)}
          aria-label="Close detail panel"
          className="p-1 text-[#829188] hover:text-[#E8F0EA] hover:bg-[#1A261E] clip-cut-tr transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-6">
        {/* Lineage / Breadcrumbs */}
        {ancestors.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px] text-[#829188] bg-[#050705] p-2 border border-[#1A261E] clip-cut-tr">
            <span>Root</span>
            {ancestors.map((ancestor) => (
              <React.Fragment key={ancestor.id}>
                <ChevronRight className="w-3 h-3 text-[#19C37D]" />
                <button
                  type="button"
                  onClick={() => selectTask(ancestor.id)}
                  className="hover:text-[#19C37D] truncate max-w-[100px]"
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
              className={`font-sans text-base font-bold tracking-tight ${
                selectedTask.completed ? 'line-through text-[#829188]' : 'text-[#E8F0EA]'
              }`}
            >
              {selectedTask.title}
            </h2>
            <button
              type="button"
              onClick={() => toggleComplete(selectedTask.id)}
              className={`px-3 py-1.5 font-mono text-xs font-bold border transition-all clip-cut-tr flex items-center gap-1.5 flex-shrink-0 ${
                selectedTask.completed
                  ? 'bg-[#0B5D3B] text-[#E8F0EA] border-[#19C37D]'
                  : 'bg-[#050705] text-[#829188] border-[#1A261E] hover:border-[#19C37D] hover:text-[#19C37D]'
              }`}
            >
              {selectedTask.completed ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Reopen
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </>
              )}
            </button>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={selectedTask.priority} />
            {selectedTask.difficulty && <DifficultyBadge difficulty={selectedTask.difficulty} />}
            {listInfo && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#829188] bg-[#050705] border border-[#1A261E] px-2 py-0.5 clip-cut-tr">
                <Folder className="w-2.5 h-2.5" style={{ color: listInfo.color }} />
                {listInfo.name}
              </span>
            )}
          </div>
        </div>

        {/* Carry Forward & Recurrence Metrics Box */}
        {(selectedTask.carryForwardCount > 0 || selectedTask.recurrence?.enabled) && (
          <div className="p-3 bg-[#050705] border border-[#1A261E] clip-cut-tr space-y-2 font-mono text-xs">
            {selectedTask.carryForwardCount > 0 && (
              <div className="flex items-center justify-between text-[#FFA502]">
                <span className="flex items-center gap-1 text-[11px]">
                  <Zap className="w-3.5 h-3.5 fill-current" /> Carry-Forward Count:
                </span>
                <span className="font-bold">{selectedTask.carryForwardCount}x</span>
              </div>
            )}

            {selectedTask.originalDueDate && selectedTask.carryForwardCount > 0 && (
              <div className="flex items-center justify-between text-[#829188] text-[10px]">
                <span>Original Scheduled:</span>
                <span>{formatDate(selectedTask.originalDueDate)}</span>
              </div>
            )}

            {selectedTask.recurrence?.enabled && (
              <div className="flex items-center justify-between text-[#19C37D] pt-1 border-t border-[#1A261E]">
                <span className="flex items-center gap-1 text-[11px]">
                  <Repeat className="w-3.5 h-3.5" /> Recurrence:
                </span>
                <span className="font-bold uppercase">{selectedTask.recurrence.frequency}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono text-[#829188] uppercase tracking-widest font-bold">
            Description
          </h4>
          <div className="p-3 bg-[#050705] border border-[#1A261E] clip-cut-tr min-h-[60px]">
            <p className="text-xs font-sans text-[#E8F0EA] whitespace-pre-wrap leading-relaxed">
              {selectedTask.description || 'No detailed description provided.'}
            </p>
          </div>
        </div>

        {/* Hierarchy Parent Re-assignment */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono text-[#829188] uppercase tracking-widest font-bold flex items-center gap-1">
            <CornerDownRight className="w-3 h-3 text-[#19C37D]" /> Parent Hierarchy Location
          </h4>
          <Select
            value={selectedTask.parentId || ''}
            onChange={(e) => reassignParent(selectedTask.id, e.target.value || null)}
          >
            <option value="">None [Root Level Task]</option>
            {availableParents.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </Select>
        </div>

        {/* Timeline Metrics */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 bg-[#050705] border border-[#1A261E] clip-cut-tr">
            <span className="text-[10px] text-[#829188] block uppercase">Current Due</span>
            <span
              className={`flex items-center gap-1 font-bold mt-1 ${
                taskOverdue ? 'text-[#FF4757]' : 'text-[#E8F0EA]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#19C37D]" />
              {formatDate(selectedTask.dueDate)}
            </span>
          </div>

          <div className="p-3 bg-[#050705] border border-[#1A261E] clip-cut-tr">
            <span className="text-[10px] text-[#829188] block uppercase">Estimate</span>
            <span className="flex items-center gap-1 font-bold mt-1 text-[#E8F0EA]">
              <Clock className="w-3.5 h-3.5 text-[#19C37D]" />
              {selectedTask.estimatedTime || 0}m
            </span>
          </div>
        </div>

        {/* Subtasks Progress */}
        {totalChildren > 0 && (
          <div className="space-y-3 p-4 bg-[#050705] border border-[#1A261E] clip-cut-tr">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#829188] uppercase">Subtask Progress</span>
              <span className="text-[#19C37D] font-bold">
                {completedChildren}/{totalChildren} ({percentComplete}%)
              </span>
            </div>
            <ProgressBar percent={percentComplete} size="md" showLabel={false} />

            <div className="space-y-1.5 pt-2">
              {directChildren.map((child) => (
                <div
                  key={child.id}
                  onClick={() => selectTask(child.id)}
                  className="flex items-center justify-between p-2 bg-[#101712] border border-[#1A261E] hover:border-[#0B5D3B] cursor-pointer clip-cut-tr text-xs"
                >
                  <span
                    className={`truncate ${
                      child.completed ? 'line-through text-[#829188]' : 'text-[#E8F0EA]'
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
                    className="text-[#19C37D] hover:text-[#E8F0EA]"
                  >
                    {child.completed ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 border border-[#1A261E]" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-[#1A261E] bg-[#101712] flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openAddModal(selectedTask.id)}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Subtask</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openEditModal(selectedTask)}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => openDeleteModal(selectedTask)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
