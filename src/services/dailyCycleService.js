/**
 * Daily Lifecycle & Recurring Task Execution Service
 */

import { generateId } from '../utils/idUtils';
import { isOverdue } from '../utils/dateUtils';

/**
 * Calculates the next due date based on recurrence configuration.
 */
export function calculateNextDueDate(currentDueDateStr, recurrence) {
  const baseDate = currentDueDateStr ? new Date(currentDueDateStr) : new Date();
  if (isNaN(baseDate.getTime())) return new Date().toISOString().split('T')[0];

  const nextDate = new Date(baseDate);

  switch (recurrence?.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'custom':
      const days = parseInt(recurrence.customDays, 10) || 1;
      nextDate.setDate(nextDate.getDate() + days);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate.toISOString().split('T')[0];
}

/**
 * Spawns the next occurrence task object for a completed recurring task.
 */
export function createNextRecurringTask(completedTask) {
  if (!completedTask.recurrence || !completedTask.recurrence.enabled) {
    return null;
  }

  const nextDueDate = calculateNextDueDate(
    completedTask.dueDate,
    completedTask.recurrence
  );

  return {
    ...completedTask,
    id: generateId('task'),
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: nextDueDate,
    originalDueDate: nextDueDate,
    carryForwardCount: 0,
    lastCarriedForwardAt: null,
    collapsed: false,
  };
}

/**
 * Evaluates tasks for daily rollover & carry-forward processing.
 * Advances overdue incomplete tasks to today's date and increments carryForwardCount.
 */
export function processDailyRollover(tasks, lastCheckDateStr) {
  const todayStr = new Date().toISOString().split('T')[0];
  if (lastCheckDateStr === todayStr) {
    return { tasks, carriedCount: 0, updated: false };
  }

  let carriedCount = 0;

  const updatedTasks = tasks.map((task) => {
    // If task is incomplete and overdue (dueDate before today)
    if (!task.completed && task.dueDate && isOverdue(task.dueDate, false)) {
      carriedCount++;
      return {
        ...task,
        originalDueDate: task.originalDueDate || task.dueDate,
        dueDate: todayStr,
        carryForwardCount: (task.carryForwardCount || 0) + 1,
        lastCarriedForwardAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return task;
  });

  return {
    tasks: updatedTasks,
    carriedCount,
    updated: true,
    newCheckDate: todayStr,
  };
}
