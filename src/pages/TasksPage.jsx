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
    <div className="space-y-6">
      {/* Unified Search, Multi-Faceted Filter & Sort Control Toolbar */}
      <div className="p-4 bg-[#0B100D] border border-[#1A261E] clip-cut-tr space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Filters Bar */}
          <div className="flex items-center gap-2.5 flex-wrap flex-1">
            <div className="flex items-center gap-1 font-mono text-xs text-[#19C37D] font-bold mr-1">
              <Filter className="w-4 h-4 text-[#0B5D3B]" /> CONTROLS:
            </div>

            {/* Status Filter */}
            <div className="w-28">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Status: All</option>
                <option value="active">Active Only</option>
                <option value="completed">Completed Only</option>
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
                <option value="urgent">P0 Urgent</option>
                <option value="high">P1 High</option>
                <option value="medium">P2 Medium</option>
                <option value="low">P3 Low</option>
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
              <ArrowUpDown className="w-3.5 h-3.5 text-[#19C37D] hidden sm:inline" />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort: Hierarchy Tree</option>
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
                <X className="w-3.5 h-3.5" /> Reset Filters
              </Button>
            )}
          </div>

          <Button variant="primary" size="md" onClick={() => openAddModal()}>
            <Plus className="w-4 h-4" />
            <span>New Root Task</span>
          </Button>
        </div>

        {/* Filter Stats Bar */}
        <div className="flex items-center justify-between font-mono text-[10px] text-[#829188] border-t border-[#1A261E] pt-2">
          <span>
            SHOWING <strong className="text-[#19C37D]">{filteredCount}</strong> OF {totalCount} TASKS
          </span>
          <span>
            VIEW MODE: {sortBy === 'default' ? 'HIERARCHICAL TREE' : `FLAT SORTED BY ${sortBy.toUpperCase()}`}
          </span>
        </div>
      </div>

      {/* Task List / Tree Renderer */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center bg-[#0B100D] border border-[#1A261E] clip-cut-tr space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-[#829188] mx-auto" />
            <h3 className="font-mono text-sm font-bold text-[#E8F0EA] uppercase">
              No Matching Tasks Found
            </h3>
            <p className="text-xs font-sans text-[#829188]">
              No tasks matched your active search query and filter parameters.
            </p>
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear All Filters
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
          /* Render flat sorted list when non-tree sorting is active */
          <div className="space-y-1">
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
