import React, { useEffect, useRef } from 'react';
import { useTaskContext } from '../../store/TaskContext';
import {
  CheckCircle2,
  Edit2,
  Plus,
  Copy,
  Trash2,
  RotateCcw,
} from 'lucide-react';

export function ContextMenu() {
  const {
    contextMenu,
    closeContextMenu,
    toggleComplete,
    openEditModal,
    openAddModal,
    duplicateTask,
    openDeleteModal,
    updateTask,
  } = useTaskContext();

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeContextMenu();
      }
    };
    if (contextMenu.isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!contextMenu.isOpen || !contextMenu.task) return null;

  const { x, y, task } = contextMenu;

  return (
    <div
      ref={menuRef}
      style={{ top: `${y}px`, left: `${x}px` }}
      className="fixed z-50 w-56 bg-[#0F1216]/95 backdrop-blur-xl border border-white/[0.12] shadow-elevated rounded-xl py-1.5 text-xs text-white"
    >
      <div className="px-3 py-1.5 text-xs text-zinc-400 font-medium border-b border-white/[0.06] mb-1 truncate">
        {task.title}
      </div>

      {/* Complete / Reopen */}
      <button
        type="button"
        onClick={() => {
          toggleComplete(task.id);
          closeContextMenu();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-white/5 hover:text-emerald-400 flex items-center gap-2 transition-colors cursor-pointer"
      >
        {task.completed ? (
          <>
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> Reopen task
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mark complete
          </>
        )}
      </button>

      {/* Edit */}
      <button
        type="button"
        onClick={() => {
          openEditModal(task);
          closeContextMenu();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Edit2 className="w-3.5 h-3.5 text-zinc-400" /> Edit details
      </button>

      {/* Add Subtask */}
      <button
        type="button"
        onClick={() => {
          openAddModal(task.id);
          closeContextMenu();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-zinc-400" /> Add subtask
      </button>

      {/* Duplicate */}
      <button
        type="button"
        onClick={() => {
          duplicateTask(task.id);
          closeContextMenu();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Copy className="w-3.5 h-3.5 text-zinc-400" /> Duplicate
      </button>

      <div className="my-1 border-t border-white/[0.06]" />

      {/* Priority Quick Picker */}
      <div className="px-3 py-1 text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Priority</div>
      <div className="grid grid-cols-4 gap-1 px-2 pb-1">
        {[
          { key: 'urgent', label: 'U' },
          { key: 'high', label: 'H' },
          { key: 'medium', label: 'M' },
          { key: 'low', label: 'L' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              updateTask(task.id, { priority: key });
              closeContextMenu();
            }}
            className={`py-1 text-xs rounded border text-center transition-colors cursor-pointer ${
              task.priority === key
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold'
                : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="my-1 border-t border-white/[0.06]" />

      {/* Delete Task */}
      <button
        type="button"
        onClick={() => {
          openDeleteModal(task);
          closeContextMenu();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-2 text-red-400 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete task
      </button>
    </div>
  );
}
