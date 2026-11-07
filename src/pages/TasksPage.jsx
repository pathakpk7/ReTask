import React from 'react';
import { useTaskContext } from '../store/TaskContext';
import { useTaskFilter } from '../hooks/useTaskFilter';
import { buildTaskTree } from '../utils/taskTreeUtils';
import { TaskTree } from '../features/tasks/TaskTree';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/FormControls';
import { Plus, Filter, ArrowUpDown, X, SlidersHorizontal } from 'lucide-react';

export function TasksPage() {
  const {
    tasks,
    lists,
    searchQuery,
    activeListId,
    setActiveList,
    selectTask,
    toggleComplete,
    toggleCollapse,
    openAddModal,
    openEditModal,
    openDeleteModal,
  } = useTaskContext();

  const {
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
    sortedTasks,
    filteredCount,
    totalCount,
    hasActiveFilters,
    clearFilters,
  } = useTaskFilter(tasks, lists, searchQuery, activeListId, setActiveList);

  const treeData = sortBy === 'default' ? buildTaskTree(sortedTasks) : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search, Filter & Sort Control Toolbar */}
      <div className="p-4 rounded-xl bg-[#0F1216] border border-white/[0.07] space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Filters Bar */}
          <div className="flex items-center gap-2.5 flex-wrap flex-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filters:
            </div>

            {/* Status Filter */}
            <div className="w-28">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Done</option>
              </Select>
            </div>

            {/* Timeframe Filter */}
            <div className="w-32">
              <Select
                value={timeframeFilter}
                onChange={(e) => setTimeframeFilter(e.target.value)}
              >
                <option value="all">Time: All</option>
                <option value="today">Due Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="overdue">Overdue</option>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="w-32">
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">Priority: All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>

            {/* List Filter */}
            <div className="w-32">
              <Select
                value={listFilter}
                onChange={(e) => setListFilter(e.target.value)}
              >
                <option value="all">List: All</option>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Sort Selector */}
            <div className="w-40 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400 hidden sm:inline" />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort: Hierarchy</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="createdAt">Created Date</option>
                <option value="completedAt">Completed Date</option>
                <option value="difficulty">Difficulty</option>
                <option value="estimatedTime">Estimated Time</option>
                <option value="alphabetical">Alphabetical</option>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            )}
          </div>

          <Button variant="primary" size="md" onClick={() => openAddModal()}>
            <Plus className="w-4 h-4 mr-1" />
            <span>New Task</span>
          </Button>
        </div>

        {/* Filter Stats Bar */}
        <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-white/[0.06] pt-3">
          <span>
            Showing <strong className="text-white font-medium">{filteredCount}</strong> of {totalCount} tasks
          </span>
          <span className="text-zinc-500">
            {sortBy === 'default' ? 'Hierarchy view' : `Sorted by ${sortBy}`}
          </span>
        </div>
      </div>

      {/* Task List / Tree Renderer */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="p-10 text-center bg-[#0F1216] border border-white/[0.07] rounded-xl space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-zinc-500 mx-auto" />
            <h3 className="text-base font-semibold text-white">
              No matching tasks found
            </h3>
            <p className="text-xs text-zinc-400">
              No tasks matched your current search and filter selections.
            </p>
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : sortBy === 'default' ? (
          <TaskTree
            tasks={treeData}
            allTasks={tasks}
            onSelect={selectTask}
            onToggleComplete={toggleComplete}
            onToggleCollapse={toggleCollapse}
            onAddSubtask={(parentId) => openAddModal(parentId)}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ) : (
          <div className="space-y-1.5">
            {sortedTasks.map((task) => (
              <TaskTree
                key={task.id}
                tasks={[{ ...task, children: [] }]}
                allTasks={tasks}
                onSelect={selectTask}
                onToggleComplete={toggleComplete}
                onToggleCollapse={toggleCollapse}
                onAddSubtask={(parentId) => openAddModal(parentId)}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
