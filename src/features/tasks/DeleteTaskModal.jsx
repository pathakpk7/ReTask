import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useTaskContext } from '../../store/TaskContext';
import { getDescendants } from '../../utils/taskTreeUtils';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function DeleteTaskModal() {
  const {
    isDeleteModalOpen,
    closeDeleteModal,
    taskToDelete,
    deleteTask,
    tasks,
  } = useTaskContext();

  const [deleteMode, setDeleteMode] = useState('descendants'); // 'only' | 'descendants'

  if (!taskToDelete) return null;

  const descendants = getDescendants(taskToDelete.id, tasks);
  const hasDescendants = descendants.length > 0;

  const handleConfirmDelete = () => {
    deleteTask(taskToDelete.id, deleteMode === 'descendants');
    closeDeleteModal();
  };

  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      title="// CONFIRM TASK TERMINATION"
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-3 bg-[#2A0E13] border border-[#FF4757]/40 clip-cut-tr">
          <AlertTriangle className="w-5 h-5 text-[#FF4757] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-mono text-xs font-bold text-[#FF4757] uppercase">
              Permanent Destruction Warning
            </h4>
            <p className="text-xs font-sans text-[#E8F0EA]">
              Are you sure you want to delete task:{' '}
              <span className="font-mono text-[#19C37D] font-bold">"{taskToDelete.title}"</span>?
            </p>
          </div>
        </div>

        {/* Options for Tasks with Subtasks */}
        {hasDescendants && (
          <div className="p-4 bg-[#050705] border border-[#1A261E] space-y-3 clip-cut-tr">
            <p className="text-xs font-mono text-[#829188] uppercase tracking-wider">
              This task contains <span className="text-[#19C37D]">{descendants.length} subtask(s)</span>. Select termination mode:
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2.5 bg-[#101712] border border-[#1A261E] hover:border-[#0B5D3B] cursor-pointer clip-cut-tr">
                <input
                  type="radio"
                  name="deleteMode"
                  value="descendants"
                  checked={deleteMode === 'descendants'}
                  onChange={(e) => setDeleteMode(e.target.value)}
                  className="accent-[#FF4757]"
                />
                <div>
                  <div className="text-xs font-mono font-bold text-[#E8F0EA]">
                    Delete Task & All Descendants
                  </div>
                  <div className="text-[11px] font-sans text-[#829188]">
                    Recursively remove this task and all child subtasks.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 bg-[#101712] border border-[#1A261E] hover:border-[#0B5D3B] cursor-pointer clip-cut-tr">
                <input
                  type="radio"
                  name="deleteMode"
                  value="only"
                  checked={deleteMode === 'only'}
                  onChange={(e) => setDeleteMode(e.target.value)}
                  className="accent-[#19C37D]"
                />
                <div>
                  <div className="text-xs font-mono font-bold text-[#E8F0EA]">
                    Delete Task Only (Promote Subtasks)
                  </div>
                  <div className="text-[11px] font-sans text-[#829188]">
                    Delete this task and reassign its subtasks up to parent level.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1A261E]">
          <Button variant="ghost" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            <Trash2 className="w-4 h-4" />
            <span>Terminate Task</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
