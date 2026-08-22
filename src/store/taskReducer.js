import { storageService } from '../services/storageService';
import { getDescendantIds } from '../utils/taskTreeUtils';
import { createNextRecurringTask, processDailyRollover } from '../services/dailyCycleService';
import { generateId } from '../utils/idUtils';

export const INITIAL_STATE = {
  tasks: [],
  lists: [],
  selectedTaskId: null,
  selectedTaskIds: [], // Multi-select task ID list
  searchQuery: '',
  activeListId: 'all',
  settings: {},
  carriedForwardCount: 0,

  // Modals & Panels State
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isListModalOpen: false,
  isShortcutsHelpOpen: false,

  modalParentId: null,
  modalTaskToEdit: null,
  taskToDelete: null,
  modalListToEdit: null,

  // Context Menu State
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    task: null,
  },

  // Persistent Pomodoro Timer State
  focusTimer: {
    secondsLeft: 1500, // 25 minutes default
    isRunning: false,
    mode: 'focus', // 'focus' | 'shortBreak' | 'longBreak'
    sessionCount: 1,
  },
};

export function taskReducer(state, action) {
  let updatedTasks;
  let updatedLists;

  switch (action.type) {
    case 'INIT_DATA': {
      const { tasks, lists, settings } = action.payload;
      const lastCheck = storageService.getLastCheckDate();
      
      const rolloverResult = processDailyRollover(tasks, lastCheck);
      if (rolloverResult.updated) {
        storageService.saveTasks(rolloverResult.tasks);
        storageService.saveLastCheckDate(rolloverResult.newCheckDate);
      }

      return {
        ...state,
        tasks: rolloverResult.tasks,
        lists,
        settings,
        carriedForwardCount: rolloverResult.carriedCount || 0,
      };
    }

    case 'ADD_TASK': {
      const newTask = {
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed: false,
        completedAt: null,
        collapsed: false,
        originalDueDate: action.payload.dueDate || null,
        carryForwardCount: 0,
        lastCarriedForwardAt: null,
      };
      updatedTasks = [newTask, ...state.tasks];
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
        selectedTaskId: newTask.id,
      };
    }

    case 'UPDATE_TASK': {
      const { id, updates } = action.payload;
      updatedTasks = state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
      };
    }

    case 'TOGGLE_COMPLETE': {
      const { id } = action.payload;
      const targetTask = state.tasks.find((t) => t.id === id);
      if (!targetTask) return state;

      const nextCompleted = !targetTask.completed;
      const nowIso = nextCompleted ? new Date().toISOString() : null;

      let newTasks = state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: nextCompleted,
              completedAt: nowIso,
              updatedAt: new Date().toISOString(),
            }
          : task
      );

      if (nextCompleted && targetTask.recurrence && targetTask.recurrence.enabled) {
        const nextOccurrence = createNextRecurringTask(targetTask);
        if (nextOccurrence) {
          newTasks = [nextOccurrence, ...newTasks];
        }
      }

      storageService.saveTasks(newTasks);
      return {
        ...state,
        tasks: newTasks,
      };
    }

    case 'TOGGLE_COLLAPSE': {
      const { id } = action.payload;
      updatedTasks = state.tasks.map((task) =>
        task.id === id ? { ...task, collapsed: !task.collapsed } : task
      );
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
      };
    }

    case 'DELETE_TASK': {
      const { id, deleteDescendants = false } = action.payload;
      let idsToDelete = [id];

      if (deleteDescendants) {
        idsToDelete = idsToDelete.concat(getDescendantIds(id, state.tasks));
      } else {
        const targetTask = state.tasks.find((t) => t.id === id);
        const newParentId = targetTask ? targetTask.parentId : null;
        
        updatedTasks = state.tasks
          .filter((t) => t.id !== id)
          .map((t) => (t.parentId === id ? { ...t, parentId: newParentId } : t));
        
        storageService.saveTasks(updatedTasks);
        return {
          ...state,
          tasks: updatedTasks,
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
          selectedTaskIds: state.selectedTaskIds.filter((tId) => tId !== id),
        };
      }

      updatedTasks = state.tasks.filter((t) => !idsToDelete.includes(t.id));
      storageService.saveTasks(updatedTasks);

      return {
        ...state,
        tasks: updatedTasks,
        selectedTaskId: idsToDelete.includes(state.selectedTaskId) ? null : state.selectedTaskId,
        selectedTaskIds: state.selectedTaskIds.filter((tId) => !idsToDelete.includes(tId)),
      };
    }

    case 'DUPLICATE_TASK': {
      const taskToDuplicate = state.tasks.find((t) => t.id === action.payload);
      if (!taskToDuplicate) return state;

      const duplicatedTask = {
        ...taskToDuplicate,
        id: generateId('task'),
        title: `${taskToDuplicate.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed: false,
        completedAt: null,
      };

      updatedTasks = [duplicatedTask, ...state.tasks];
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
        selectedTaskId: duplicatedTask.id,
      };
    }

    case 'REASSIGN_PARENT': {
      const { taskId, newParentId } = action.payload;
      updatedTasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, parentId: newParentId, updatedAt: new Date().toISOString() } : t
      );
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
      };
    }

    case 'REORDER_TASKS': {
      const { dragId, targetId, newParentId, position } = action.payload;
      const draggedTask = state.tasks.find((t) => t.id === dragId);
      if (!draggedTask) return state;

      const filtered = state.tasks.filter((t) => t.id !== dragId);
      const updatedDragged = { ...draggedTask, parentId: newParentId, updatedAt: new Date().toISOString() };

      const targetIndex = filtered.findIndex((t) => t.id === targetId);
      if (targetIndex === -1) {
        updatedTasks = [updatedDragged, ...filtered];
      } else {
        const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
        filtered.splice(insertIndex, 0, updatedDragged);
        updatedTasks = filtered;
      }

      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
      };
    }

    // MULTI-SELECT & BULK ACTIONS
    case 'TOGGLE_MULTI_SELECT': {
      const taskId = action.payload;
      const exists = state.selectedTaskIds.includes(taskId);
      const newSelected = exists
        ? state.selectedTaskIds.filter((id) => id !== taskId)
        : [...state.selectedTaskIds, taskId];
      return {
        ...state,
        selectedTaskIds: newSelected,
      };
    }

    case 'CLEAR_MULTI_SELECT': {
      return {
        ...state,
        selectedTaskIds: [],
      };
    }

    case 'BULK_COMPLETE': {
      const nowIso = new Date().toISOString();
      updatedTasks = state.tasks.map((t) =>
        state.selectedTaskIds.includes(t.id)
          ? { ...t, completed: true, completedAt: nowIso, updatedAt: nowIso }
          : t
      );
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
        selectedTaskIds: [],
      };
    }

    case 'BULK_REOPEN': {
      const nowIso = new Date().toISOString();
      updatedTasks = state.tasks.map((t) =>
        state.selectedTaskIds.includes(t.id)
          ? { ...t, completed: false, completedAt: null, updatedAt: nowIso }
          : t
      );
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
        selectedTaskIds: [],
      };
    }

    case 'BULK_DELETE': {
      updatedTasks = state.tasks.filter((t) => !state.selectedTaskIds.includes(t.id));
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
        selectedTaskIds: [],
        selectedTaskId: state.selectedTaskIds.includes(state.selectedTaskId) ? null : state.selectedTaskId,
      };
    }

    case 'BULK_CHANGE_PRIORITY': {
      const { priority } = action.payload;
      const nowIso = new Date().toISOString();
      updatedTasks = state.tasks.map((t) =>
        state.selectedTaskIds.includes(t.id) ? { ...t, priority, updatedAt: nowIso } : t
      );
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
        selectedTaskIds: [],
      };
    }

    case 'BULK_CHANGE_LIST': {
      const { listId } = action.payload;
      const nowIso = new Date().toISOString();
      updatedTasks = state.tasks.map((t) =>
        state.selectedTaskIds.includes(t.id) ? { ...t, listId, updatedAt: nowIso } : t
      );
      storageService.saveTasks(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks,
        selectedTaskIds: [],
      };
    }

    // LIST SYSTEM ACTIONS
    case 'ADD_LIST': {
      updatedLists = [...state.lists, action.payload];
      storageService.saveLists(updatedLists);
      return {
        ...state,
        lists: updatedLists,
      };
    }

    case 'UPDATE_LIST': {
      const { id, updates } = action.payload;
      updatedLists = state.lists.map((l) => (l.id === id ? { ...l, ...updates } : l));
      storageService.saveLists(updatedLists);
      return {
        ...state,
        lists: updatedLists,
      };
    }

    case 'DELETE_LIST': {
      const { listId } = action.payload;
      updatedTasks = state.tasks.map((t) => (t.listId === listId ? { ...t, listId: 'inbox' } : t));
      updatedLists = state.lists.filter((l) => l.id !== listId);

      storageService.saveTasks(updatedTasks);
      storageService.saveLists(updatedLists);

      return {
        ...state,
        tasks: updatedTasks,
        lists: updatedLists,
        activeListId: state.activeListId === listId ? 'all' : state.activeListId,
      };
    }

    // CONTEXT MENU & SHORTCUTS HELP MODALS
    case 'OPEN_CONTEXT_MENU': {
      const { x, y, task } = action.payload;
      return {
        ...state,
        contextMenu: { isOpen: true, x, y, task },
      };
    }

    case 'CLOSE_CONTEXT_MENU': {
      return {
        ...state,
        contextMenu: { isOpen: false, x: 0, y: 0, task: null },
      };
    }

    case 'OPEN_SHORTCUTS_HELP': {
      return { ...state, isShortcutsHelpOpen: true };
    }

    case 'CLOSE_SHORTCUTS_HELP': {
      return { ...state, isShortcutsHelpOpen: false };
    }

    // PERSISTENT FOCUS TIMER
    case 'SET_FOCUS_TIMER_RUNNING': {
      return {
        ...state,
        focusTimer: { ...state.focusTimer, isRunning: action.payload },
      };
    }

    case 'SET_FOCUS_TIMER_MODE': {
      const { mode, secondsLeft } = action.payload;
      return {
        ...state,
        focusTimer: { ...state.focusTimer, mode, secondsLeft, isRunning: false },
      };
    }

    case 'TICK_FOCUS_TIMER': {
      if (state.focusTimer.secondsLeft <= 1) {
        return {
          ...state,
          focusTimer: {
            ...state.focusTimer,
            secondsLeft: 0,
            isRunning: false,
            sessionCount: state.focusTimer.mode === 'focus' ? state.focusTimer.sessionCount + 1 : state.focusTimer.sessionCount,
          },
        };
      }
      return {
        ...state,
        focusTimer: { ...state.focusTimer, secondsLeft: state.focusTimer.secondsLeft - 1 },
      };
    }

    case 'RESET_FOCUS_TIMER': {
      const defaultSeconds = state.focusTimer.mode === 'focus' ? 1500 : 300;
      return {
        ...state,
        focusTimer: { ...state.focusTimer, secondsLeft: defaultSeconds, isRunning: false },
      };
    }

    case 'SELECT_TASK': {
      return { ...state, selectedTaskId: action.payload };
    }

    case 'SET_SEARCH_QUERY': {
      return { ...state, searchQuery: action.payload };
    }

    case 'SET_ACTIVE_LIST': {
      return { ...state, activeListId: action.payload };
    }

    case 'OPEN_ADD_MODAL': {
      return { ...state, isAddModalOpen: true, modalParentId: action.payload?.parentId || null };
    }

    case 'CLOSE_ADD_MODAL': {
      return { ...state, isAddModalOpen: false, modalParentId: null };
    }

    case 'OPEN_EDIT_MODAL': {
      return { ...state, isEditModalOpen: true, modalTaskToEdit: action.payload };
    }

    case 'CLOSE_EDIT_MODAL': {
      return { ...state, isEditModalOpen: false, modalTaskToEdit: null };
    }

    case 'OPEN_DELETE_MODAL': {
      return { ...state, isDeleteModalOpen: true, taskToDelete: action.payload };
    }

    case 'CLOSE_DELETE_MODAL': {
      return { ...state, isDeleteModalOpen: false, taskToDelete: null };
    }

    case 'OPEN_LIST_MODAL': {
      return { ...state, isListModalOpen: true, modalListToEdit: action.payload || null };
    }

    case 'CLOSE_LIST_MODAL': {
      return { ...state, isListModalOpen: false, modalListToEdit: null };
    }

    case 'RESET_SEED_DATA': {
      const reset = storageService.resetToDefault();
      return {
        ...state,
        tasks: reset.tasks,
        lists: reset.lists,
        settings: reset.settings,
        selectedTaskId: null,
        selectedTaskIds: [],
        carriedForwardCount: 0,
      };
    }

    default:
      return state;
  }
}
