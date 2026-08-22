import { useState } from 'react';
import { getDescendantIds } from '../utils/taskTreeUtils';

/**
 * Drag & Drop Helper Hook for Hierarchical Tasks
 */
export function useTaskDragDrop(allTasks, onReorderTasks) {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [dropPosition, setDropPosition] = useState(null); // 'before' | 'inside' | 'after'

  /**
   * Validates whether dragging task A into target B is safe.
   * Disallows dropping task into itself or into its own descendant.
   */
  const isValidDropTarget = (dragId, targetId) => {
    if (!dragId || !targetId) return true;
    if (dragId === targetId) return false;

    const descendantIds = getDescendantIds(dragId, allTasks);
    if (descendantIds.includes(targetId)) return false;

    return true;
  };

  const handleDragStart = (e, taskId) => {
    e.stopPropagation();
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetTask) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTaskId || !isValidDropTarget(draggedTaskId, targetTask.id)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    e.dataTransfer.dropEffect = 'move';
    setDropTargetId(targetTask.id);

    // Calculate vertical drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const height = rect.height;

    if (offsetY < height * 0.25) {
      setDropPosition('before');
    } else if (offsetY > height * 0.75) {
      setDropPosition('after');
    } else {
      setDropPosition('inside');
    }
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    setDropTargetId(null);
    setDropPosition(null);
  };

  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTaskId || !isValidDropTarget(draggedTaskId, targetTask.id)) {
      setDraggedTaskId(null);
      setDropTargetId(null);
      setDropPosition(null);
      return;
    }

    let newParentId = targetTask.parentId;
    if (dropPosition === 'inside') {
      newParentId = targetTask.id;
    }

    onReorderTasks(draggedTaskId, targetTask.id, newParentId, dropPosition);

    setDraggedTaskId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  return {
    draggedTaskId,
    dropTargetId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isValidDropTarget,
  };
}
