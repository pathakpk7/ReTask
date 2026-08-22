import { useState, useMemo } from 'react';
import { isToday, isOverdue } from '../utils/dateUtils';

export function useTaskFilter(
  tasks,
  lists,
  externalSearchQuery = '',
  activeListId = 'all',
  setActiveList = null
) {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [timeframeFilter, setTimeframeFilter] = useState('all'); // 'all' | 'today' | 'upcoming' | 'overdue'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'urgent' | 'high' | 'medium' | 'low'
  const [localListFilter, setLocalListFilter] = useState(activeListId || 'all');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'dueDate' | 'priority' | 'createdAt' | 'completedAt' | 'difficulty' | 'estimatedTime' | 'alphabetical'

  const effectiveSearch = externalSearchQuery !== undefined ? externalSearchQuery : searchQuery;

  // Sync list filter with activeListId if provided
  const listFilter = activeListId !== undefined ? activeListId : localListFilter;
  const setListFilter = (newListId) => {
    setLocalListFilter(newListId);
    if (setActiveList) {
      setActiveList(newListId);
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (effectiveSearch && effectiveSearch.trim()) {
        const query = effectiveSearch.toLowerCase().trim();
        const listName = lists.find((l) => l.id === task.listId)?.name.toLowerCase() || '';
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesPriority = task.priority?.toLowerCase().includes(query);
        const matchesList = listName.includes(query);
        const matchesStatus = (task.completed ? 'completed' : 'active').includes(query);

        if (!matchesTitle && !matchesDesc && !matchesPriority && !matchesList && !matchesStatus) {
          return false;
        }
      }

      // Status
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      // Timeframe
      if (timeframeFilter === 'today') {
        if (task.completed || !isToday(task.dueDate)) return false;
      } else if (timeframeFilter === 'overdue') {
        if (task.completed || !isOverdue(task.dueDate, task.completed)) return false;
      } else if (timeframeFilter === 'upcoming') {
        if (task.completed || !task.dueDate || isToday(task.dueDate) || isOverdue(task.dueDate, task.completed)) {
          return false;
        }
      }

      // Priority
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      // List
      if (listFilter !== 'all' && task.listId !== listFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, lists, effectiveSearch, statusFilter, timeframeFilter, priorityFilter, listFilter]);

  // Non-destructive sort
  const sortedTasks = useMemo(() => {
    if (sortBy === 'default') return filteredTasks;

    const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
    const difficultyWeights = { extreme: 4, hard: 3, medium: 2, easy: 1 };

    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        case 'priority': {
          const weightA = priorityWeights[a.priority] || 0;
          const weightB = priorityWeights[b.priority] || 0;
          return weightB - weightA;
        }
        case 'createdAt': {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        case 'completedAt': {
          if (!a.completedAt) return 1;
          if (!b.completedAt) return -1;
          return new Date(b.completedAt) - new Date(a.completedAt);
        }
        case 'difficulty': {
          const weightA = difficultyWeights[a.difficulty] || 0;
          const weightB = difficultyWeights[b.difficulty] || 0;
          return weightB - weightA;
        }
        case 'estimatedTime': {
          return (b.estimatedTime || 0) - (a.estimatedTime || 0);
        }
        case 'alphabetical': {
          return a.title.localeCompare(b.title);
        }
        default:
          return 0;
      }
    });
  }, [filteredTasks, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTimeframeFilter('all');
    setPriorityFilter('all');
    setListFilter('all');
    setSortBy('default');
  };

  const hasActiveFilters =
    Boolean(effectiveSearch) ||
    statusFilter !== 'all' ||
    timeframeFilter !== 'all' ||
    priorityFilter !== 'all' ||
    listFilter !== 'all' ||
    sortBy !== 'default';

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    timeframeFilter,
    setTimeframeFilter,
    priorityFilter,
    setPriorityFilter,
    listFilter,
    setListFilter,
    sortBy,
    setSortBy,
    filteredTasks,
    sortedTasks,
    totalCount: tasks.length,
    filteredCount: sortedTasks.length,
    hasActiveFilters,
    clearFilters,
  };
}
