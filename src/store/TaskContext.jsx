import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { taskReducer, INITIAL_STATE } from './taskReducer';
import { storageService } from '../services/storageService';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, INITIAL_STATE);

  // Load storage data on mount & execute daily rollover
  useEffect(() => {
    const tasks = storageService.getTasks();
    const lists = storageService.getLists();
    const settings = storageService.getSettings();

    dispatch({
      type: 'INIT_DATA',
      payload: { tasks, lists, settings },
    });
  }, []);

  // Persistent Global Focus Timer Tick Effect
  useEffect(() => {
    let timer = null;
    if (state.focusTimer.isRunning && state.focusTimer.secondsLeft > 0) {
      timer = setInterval(() => {
        dispatch({ type: 'TICK_FOCUS_TIMER' });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.focusTimer.isRunning, state.focusTimer.secondsLeft]);

  const selectedTask = state.tasks.find((t) => t.id === state.selectedTaskId) || null;

  // Task Action Dispatchers
  const addTask = (taskData) => dispatch({ type: 'ADD_TASK', payload: taskData });
  const updateTask = (id, updates) => dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  const toggleComplete = (id) => dispatch({ type: 'TOGGLE_COMPLETE', payload: { id } });
  const toggleCollapse = (id) => dispatch({ type: 'TOGGLE_COLLAPSE', payload: { id } });
  const deleteTask = (id, deleteDescendants = false) =>
    dispatch({ type: 'DELETE_TASK', payload: { id, deleteDescendants } });
  const duplicateTask = (id) => dispatch({ type: 'DUPLICATE_TASK', payload: id });
  const reassignParent = (taskId, newParentId) =>
    dispatch({ type: 'REASSIGN_PARENT', payload: { taskId, newParentId } });
  const reorderTasks = (dragId, targetId, newParentId, position) =>
    dispatch({ type: 'REORDER_TASKS', payload: { dragId, targetId, newParentId, position } });
  
  const selectTask = (id) => dispatch({ type: 'SELECT_TASK', payload: id });
  const setSearchQuery = (query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  const setActiveList = (listId) => dispatch({ type: 'SET_ACTIVE_LIST', payload: listId });

  // Multi-Select Dispatchers
  const toggleMultiSelect = (id) => dispatch({ type: 'TOGGLE_MULTI_SELECT', payload: id });
  const clearMultiSelect = () => dispatch({ type: 'CLEAR_MULTI_SELECT' });
  const bulkComplete = () => dispatch({ type: 'BULK_COMPLETE' });
  const bulkReopen = () => dispatch({ type: 'BULK_REOPEN' });
  const bulkDelete = () => dispatch({ type: 'BULK_DELETE' });
  const bulkChangePriority = (priority) => dispatch({ type: 'BULK_CHANGE_PRIORITY', payload: { priority } });
  const bulkChangeList = (listId) => dispatch({ type: 'BULK_CHANGE_LIST', payload: { listId } });

  // List Management Dispatchers
  const addList = (listData) => dispatch({ type: 'ADD_LIST', payload: listData });
  const updateList = (id, updates) => dispatch({ type: 'UPDATE_LIST', payload: { id, updates } });
  const deleteList = (listId) => dispatch({ type: 'DELETE_LIST', payload: { listId } });

  // Context Menu & Modals Dispatchers
  const openContextMenu = (x, y, task) => dispatch({ type: 'OPEN_CONTEXT_MENU', payload: { x, y, task } });
  const closeContextMenu = () => dispatch({ type: 'CLOSE_CONTEXT_MENU' });

  const openShortcutsHelp = () => dispatch({ type: 'OPEN_SHORTCUTS_HELP' });
  const closeShortcutsHelp = () => dispatch({ type: 'CLOSE_SHORTCUTS_HELP' });

  const openAddModal = (parentId = null) => dispatch({ type: 'OPEN_ADD_MODAL', payload: { parentId } });
  const closeAddModal = () => dispatch({ type: 'CLOSE_ADD_MODAL' });

  const openEditModal = (task) => dispatch({ type: 'OPEN_EDIT_MODAL', payload: task });
  const closeEditModal = () => dispatch({ type: 'CLOSE_EDIT_MODAL' });

  const openDeleteModal = (task) => dispatch({ type: 'OPEN_DELETE_MODAL', payload: task });
  const closeDeleteModal = () => dispatch({ type: 'CLOSE_DELETE_MODAL' });

  const openListModal = (list = null) => dispatch({ type: 'OPEN_LIST_MODAL', payload: list });
  const closeListModal = () => dispatch({ type: 'CLOSE_LIST_MODAL' });

  // Focus Timer Dispatchers
  const setFocusTimerRunning = (isRunning) => dispatch({ type: 'SET_FOCUS_TIMER_RUNNING', payload: isRunning });
  const setFocusTimerMode = (mode, secondsLeft) => dispatch({ type: 'SET_FOCUS_TIMER_MODE', payload: { mode, secondsLeft } });
  const resetFocusTimer = () => dispatch({ type: 'RESET_FOCUS_TIMER' });

  const resetSeedData = () => dispatch({ type: 'RESET_SEED_DATA' });

  const value = {
    ...state,
    selectedTask,
    addTask,
    updateTask,
    toggleComplete,
    toggleCollapse,
    deleteTask,
    duplicateTask,
    reassignParent,
    reorderTasks,
    selectTask,
    setSearchQuery,
    setActiveList,

    toggleMultiSelect,
    clearMultiSelect,
    bulkComplete,
    bulkReopen,
    bulkDelete,
    bulkChangePriority,
    bulkChangeList,

    addList,
    updateList,
    deleteList,

    openContextMenu,
    closeContextMenu,
    openShortcutsHelp,
    closeShortcutsHelp,

    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openListModal,
    closeListModal,

    setFocusTimerRunning,
    setFocusTimerMode,
    resetFocusTimer,

    resetSeedData,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
