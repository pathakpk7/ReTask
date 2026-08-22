import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../store/TaskContext';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const {
    tasks,
    selectedTaskId,
    selectedTask,
    selectTask,
    toggleComplete,
    openAddModal,
    openEditModal,
    openDeleteModal,
    openShortcutsHelp,
    closeShortcutsHelp,
    closeContextMenu,
    clearMultiSelect,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isListModalOpen,
    isShortcutsHelpOpen,
    contextMenu,
  } = useTaskContext();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Disarm shortcuts when typing into text inputs/textareas/selects
      const targetTag = e.target?.tagName?.toUpperCase();
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }

      // Escape key handler: Closes any active modal, menu or selection
      if (e.key === 'Escape') {
        if (contextMenu.isOpen) {
          closeContextMenu();
          return;
        }
        if (isShortcutsHelpOpen) {
          closeShortcutsHelp();
          return;
        }
        clearMultiSelect();
        return;
      }

      // Help Modal Toggle: '?' or 'Shift+/'
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        openShortcutsHelp();
        return;
      }

      // Any open modal prevents hotkey trigger
      if (
        isAddModalOpen ||
        isEditModalOpen ||
        isDeleteModalOpen ||
        isListModalOpen ||
        isShortcutsHelpOpen
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n': {
          e.preventDefault();
          openAddModal();
          break;
        }
        case 'e': {
          if (selectedTask) {
            e.preventDefault();
            openEditModal(selectedTask);
          }
          break;
        }
        case 'd': {
          if (selectedTask) {
            e.preventDefault();
            openDeleteModal(selectedTask);
          }
          break;
        }
        case ' ': {
          if (selectedTask) {
            e.preventDefault();
            toggleComplete(selectedTask.id);
          }
          break;
        }
        case 'f': {
          e.preventDefault();
          navigate('/focus');
          break;
        }
        case 'arrowdown': {
          e.preventDefault();
          if (tasks.length === 0) return;
          const currentIndex = tasks.findIndex((t) => t.id === selectedTaskId);
          const nextIndex = currentIndex < tasks.length - 1 ? currentIndex + 1 : 0;
          selectTask(tasks[nextIndex].id);
          break;
        }
        case 'arrowup': {
          e.preventDefault();
          if (tasks.length === 0) return;
          const currentIndex = tasks.findIndex((t) => t.id === selectedTaskId);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : tasks.length - 1;
          selectTask(tasks[prevIndex].id);
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    tasks,
    selectedTaskId,
    selectedTask,
    selectTask,
    toggleComplete,
    openAddModal,
    openEditModal,
    openDeleteModal,
    openShortcutsHelp,
    closeShortcutsHelp,
    closeContextMenu,
    clearMultiSelect,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isListModalOpen,
    isShortcutsHelpOpen,
    contextMenu,
    navigate,
  ]);
}
