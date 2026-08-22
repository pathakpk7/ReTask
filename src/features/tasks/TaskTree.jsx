import React from 'react';
import { TaskItem } from './TaskItem';
import { useTaskContext } from '../../store/TaskContext';
import { useTaskDragDrop } from '../../hooks/useTaskDragDrop';

export function TaskTree({
  tasks,
  allTasks,
  depth = 0,
  onSelect,
  onToggleComplete,
  onToggleCollapse,
  onAddSubtask,
  onEdit,
  onDelete,
}) {
  const {
    lists,
    selectedTaskId,
    selectedTaskIds,
    toggleMultiSelect,
    openContextMenu,
    reorderTasks,
  } = useTaskContext();

  const {
    dropTargetId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useTaskDragDrop(allTasks, reorderTasks);

  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="space-y-1">
      {tasks.map((task) => {
        const isSelected = selectedTaskId === task.id;
        const isMultiSelected = selectedTaskIds.includes(task.id);
        const hasChildren = task.children && task.children.length > 0;
        const isCollapsed = task.collapsed;

        return (
          <React.Fragment key={task.id}>
            <TaskItem
              task={task}
              allTasks={allTasks}
              lists={lists}
              depth={depth}
              selected={isSelected}
              multiSelected={isMultiSelected}
              onSelect={onSelect}
              onToggleMultiSelect={toggleMultiSelect}
              onToggleComplete={onToggleComplete}
              onToggleCollapse={onToggleCollapse}
              onAddSubtask={onAddSubtask}
              onEdit={onEdit}
              onDelete={onDelete}
              onContextMenu={openContextMenu}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              isDropTarget={dropTargetId === task.id}
              dropPosition={dropTargetId === task.id ? dropPosition : null}
            />

            {hasChildren && !isCollapsed && (
              <TaskTree
                tasks={task.children}
                allTasks={allTasks}
                depth={depth + 1}
                onSelect={onSelect}
                onToggleComplete={onToggleComplete}
                onToggleCollapse={onToggleCollapse}
                onAddSubtask={onAddSubtask}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
