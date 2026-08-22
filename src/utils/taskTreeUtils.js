/**
 * Task Tree & Hierarchy Utility Functions
 */

/**
 * Builds a hierarchical tree structure from a flat array of tasks.
 */
export function buildTaskTree(tasks, parentId = null) {
  if (!Array.isArray(tasks)) return [];
  
  return tasks
    .filter((task) => (task.parentId || null) === parentId)
    .map((task) => {
      const children = buildTaskTree(tasks, task.id);
      return {
        ...task,
        children,
      };
    });
}

/**
 * Gets all descendant IDs (children, grandchildren, etc.) of a given task.
 */
export function getDescendantIds(taskId, tasks) {
  const directChildren = tasks.filter((t) => t.parentId === taskId);
  let ids = [];
  
  for (const child of directChildren) {
    ids.push(child.id);
    ids = ids.concat(getDescendantIds(child.id, tasks));
  }
  
  return ids;
}

/**
 * Calculates subtask progress metrics for a given task.
 * Returns { totalChildren, completedChildren, percentComplete }
 */
export function calculateSubtaskMetrics(taskId, tasks) {
  const descendants = getDescendants(taskId, tasks);
  if (descendants.length === 0) {
    return { totalChildren: 0, completedChildren: 0, percentComplete: 0 };
  }
  
  const completedChildren = descendants.filter((t) => t.completed).length;
  const percentComplete = Math.round((completedChildren / descendants.length) * 100);
  
  return {
    totalChildren: descendants.length,
    completedChildren,
    percentComplete,
  };
}

/**
 * Returns all direct and indirect descendant task objects.
 */
export function getDescendants(taskId, tasks) {
  const directChildren = tasks.filter((t) => t.parentId === taskId);
  let list = [...directChildren];
  
  for (const child of directChildren) {
    list = list.concat(getDescendants(child.id, tasks));
  }
  
  return list;
}

/**
 * Gets the breadcrumb lineage (ancestors) for a given task up to root.
 * Returns array of parent tasks [rootParent, middleParent, directParent]
 */
export function getTaskAncestors(taskId, tasks) {
  const ancestors = [];
  let current = tasks.find((t) => t.id === taskId);
  
  while (current && current.parentId) {
    const parent = tasks.find((t) => t.id === current.parentId);
    if (parent) {
      ancestors.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }
  
  return ancestors;
}
