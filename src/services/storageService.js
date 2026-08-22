/**
 * Storage Service Abstraction Layer for ReTask
 */

import { INITIAL_TASKS, INITIAL_LISTS } from '../data/initialTasks';

const STORAGE_KEYS = {
  TASKS: 'retask_tasks_v2',
  LISTS: 'retask_lists_v2',
  SETTINGS: 'retask_settings_v2',
  LAST_CHECK_DATE: 'retask_last_check_date_v2',
};

const LEGACY_KEYS = [
  'retask_tasks_v1',
  'retask_lists_v1',
  'retask_settings_v1',
  'retask_last_check_date_v1',
];

const DEMO_TASK_IDS = [
  'task_project_os',
  'task_ui_kit',
  'task_cut_buttons',
  'task_task_tree',
  'task_subtask_progress',
  'task_storage_layer',
  'task_overdue_audit',
];

const DEMO_LIST_IDS = ['core-system', 'engineering', 'personal'];

const DEFAULT_SETTINGS = {
  theme: 'neo-dark',
  sidebarOpen: true,
  defaultView: 'today',
  compactView: false,
  soundEnabled: true,
};

export const storageService = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`[storageService] Error reading key "${key}":`, error);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[storageService] Error writing key "${key}":`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[storageService] Error removing key "${key}":`, error);
      return false;
    }
  },

  clearLegacyData() {
    try {
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      // ignore
    }
  },

  // Specialized Task API
  getTasks() {
    this.clearLegacyData();
    const tasks = this.get(STORAGE_KEYS.TASKS);
    if (!tasks || !Array.isArray(tasks)) {
      this.saveTasks([]);
      return [];
    }

    // Filter out any lingering legacy demo tasks
    const cleaned = tasks.filter((t) => !DEMO_TASK_IDS.includes(t.id));
    if (cleaned.length !== tasks.length) {
      this.saveTasks(cleaned);
    }
    return cleaned;
  },

  saveTasks(tasks) {
    return this.set(STORAGE_KEYS.TASKS, tasks);
  },

  // Specialized Lists API
  getLists() {
    this.clearLegacyData();
    const lists = this.get(STORAGE_KEYS.LISTS);
    if (!lists || !Array.isArray(lists) || lists.length === 0) {
      this.saveLists(INITIAL_LISTS);
      return INITIAL_LISTS;
    }

    // Filter out lingering legacy demo lists
    const cleaned = lists.filter((l) => !DEMO_LIST_IDS.includes(l.id));
    if (cleaned.length === 0) {
      this.saveLists(INITIAL_LISTS);
      return INITIAL_LISTS;
    }
    if (cleaned.length !== lists.length) {
      this.saveLists(cleaned);
    }
    return cleaned;
  },

  saveLists(lists) {
    return this.set(STORAGE_KEYS.LISTS, lists);
  },

  // Daily Check Date API
  getLastCheckDate() {
    return this.get(STORAGE_KEYS.LAST_CHECK_DATE, null);
  },

  saveLastCheckDate(dateStr) {
    return this.set(STORAGE_KEYS.LAST_CHECK_DATE, dateStr);
  },

  // Settings API
  getSettings() {
    const settings = this.get(STORAGE_KEYS.SETTINGS);
    return { ...DEFAULT_SETTINGS, ...(settings || {}) };
  },

  saveSettings(settings) {
    return this.set(STORAGE_KEYS.SETTINGS, settings);
  },

  // Reset to Clean State
  resetToDefault() {
    this.clearLegacyData();
    this.saveTasks([]);
    this.saveLists(INITIAL_LISTS);
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveLastCheckDate(new Date().toISOString().split('T')[0]);
    return { tasks: [], lists: INITIAL_LISTS, settings: DEFAULT_SETTINGS };
  },
};
