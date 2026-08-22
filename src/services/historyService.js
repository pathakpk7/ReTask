/**
 * Daily History & Snapshot Logging Service
 */

import { storageService } from './storageService';

const HISTORY_KEY = 'retask_history_v1';

export const historyService = {
  getHistory() {
    return storageService.get(HISTORY_KEY, {});
  },

  saveHistory(history) {
    return storageService.set(HISTORY_KEY, history);
  },

  /**
   * Logs or updates snapshot metrics for a specific date (default: today).
   */
  logDailySnapshot(tasks, dateStr = new Date().toISOString().split('T')[0], focusMinutes = 0) {
    const history = this.getHistory();
    const existing = history[dateStr] || {
      date: dateStr,
      createdCount: 0,
      completedCount: 0,
      completionRate: 0,
      focusMinutes: 0,
      carryCount: 0,
      overdueCount: 0,
    };

    // Calculate real stats for this date
    const completedOnDate = tasks.filter(
      (t) => t.completed && t.completedAt && t.completedAt.split('T')[0] === dateStr
    ).length;

    const createdOnDate = tasks.filter(
      (t) => t.createdAt && t.createdAt.split('T')[0] === dateStr
    ).length;

    const totalForDate = completedOnDate + tasks.filter((t) => !t.completed && t.dueDate === dateStr).length;
    const completionRate = totalForDate > 0 ? Math.round((completedOnDate / totalForDate) * 100) : 0;

    const carryCount = tasks
      .filter((t) => t.lastCarriedForwardAt && t.lastCarriedForwardAt.split('T')[0] === dateStr)
      .reduce((sum, t) => sum + (t.carryForwardCount || 1), 0);

    history[dateStr] = {
      ...existing,
      date: dateStr,
      createdCount: Math.max(existing.createdCount, createdOnDate),
      completedCount: Math.max(existing.completedCount, completedOnDate),
      completionRate,
      focusMinutes: existing.focusMinutes + focusMinutes,
      carryCount,
      updatedAt: new Date().toISOString(),
    };

    this.saveHistory(history);
    return history[dateStr];
  },

  /**
   * Returns array of historical daily snapshots sorted by date.
   */
  getHistoryArray() {
    const history = this.getHistory();
    return Object.values(history).sort((a, b) => new Date(a.date) - new Date(b.date));
  },
};
