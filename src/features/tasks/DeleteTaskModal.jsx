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

  const [deleteMode, setDeleteMode] = useState('descendants');

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
      title="Delete Task"
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-red-300">
              Confirm deletion
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-white">"{taskToDelete.title}"</strong>?
            </p>
          </div>
        </div>

        {/* Options for Tasks with Subtasks */}
        {hasDescendants && (
          <div className="p-4 rounded-xl bg-[#161B22] border border-white/[0.05] space-y-3">
            <p className="text-xs text-zinc-300 font-medium">
              This task contains {descendants.length} subtask(s). How should they be handled?
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0F1216] border border-white/[0.06] hover:border-white/10 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="deleteMode"
                  value="descendants"
                  checked={deleteMode === 'descendants'}
                  onChange={(e) => setDeleteMode(e.target.value)}
                  className="accent-red-500"
                />
                <div>
                  <div className="text-xs font-medium text-white">
                    Delete task and all subtasks
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Recursively remove this task and its entire subtask tree.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0F1216] border border-white/[0.06] hover:border-white/10 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="deleteMode"
                  value="only"
                  checked={deleteMode === 'only'}
                  onChange={(e) => setDeleteMode(e.target.value)}
                  className="accent-emerald-500"
                />
                <div>
                  <div className="text-xs font-medium text-white">
                    Delete task only (promote subtasks)
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Reassign subtasks upward to the parent level.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button variant="ghost" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            <Trash2 className="w-4 h-4 mr-1.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
