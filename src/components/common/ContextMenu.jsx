import React, { useEffect, useRef } from 'react';
import { useTaskContext } from '../../store/TaskContext';
import {
  CheckCircle2,
  Edit2,
  Plus,
  Copy,
  Trash2,
  Folder,
  Tag,
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
    lists,
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
      className="fixed z-50 w-56 bg-[#0B100D] border border-[#19C37D] shadow-[0_0_25px_rgba(25,195,125,0.3)] clip-cut-tr-lg py-1.5 font-mono text-xs text-[#E8F0EA] animate-fade-in"
    >
      <div className="px-3 py-1 text-[10px] text-[#829188] uppercase border-b border-[#1A261E] mb-1 font-bold truncate">
        // {task.title}
      </div>

      {/* Complete / Reopen */}
      <button
        type="button"
        onClick={() => {
          toggleComplete(task.id);
          closeContextMenu();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-[#101712] hover:text-[#19C37D] flex items-center gap-2 transition-colors"
      >
        {task.completed ? (
          <>
            <RotateCcw className="w-3.5 h-3.5 text-[#19C37D]" /> Reopen Task
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#19C37D]" /> Mark Complete
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
        className="w-full text-left px-3 py-1.5 hover:bg-[#101712] hover:text-[#19C37D] flex items-center gap-2 transition-colors"
      >
        <Edit2 className="w-3.5 h-3.5" /> Edit Parameters
      </button>

      {/* Add Subtask */}
      <button
        type="button"
        onClick={() => {
          openAddModal(task.id);
          closeContextMenu();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-[#101712] hover:text-[#19C37D] flex items-center gap-2 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add Subtask
      </button>

      {/* Duplicate */}
      <button
        type="button"
        onClick={() => {
          duplicateTask(task.id);
          closeContextMenu();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-[#101712] hover:text-[#19C37D] flex items-center gap-2 transition-colors"
      >
        <Copy className="w-3.5 h-3.5" /> Duplicate Task
      </button>

      <div className="my-1 border-t border-[#1A261E]" />

      {/* Priority Quick Picker */}
      <div className="px-3 py-1 text-[10px] text-[#829188] uppercase">Set Priority</div>
      <div className="grid grid-cols-4 gap-1 px-2 pb-1">
        {['urgent', 'high', 'medium', 'low'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              updateTask(task.id, { priority: p });
              closeContextMenu();
            }}
            className={`py-0.5 text-[9px] uppercase border text-center transition-colors ${
              task.priority === p
                ? 'bg-[#0B5D3B] text-[#19C37D] border-[#19C37D]'
                : 'bg-[#050705] text-[#829188] border-[#1A261E] hover:text-[#E8F0EA]'
            }`}
          >
            {p[0].toUpperCase()}
          </button>
        ))}
      </div>

      <div className="my-1 border-t border-[#1A261E]" />

      {/* Delete Task */}
      <button
        type="button"
        onClick={() => {
          openDeleteModal(task);
          closeContextMenu();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-[#2A0E13] hover:text-[#FF4757] flex items-center gap-2 text-[#FF4757] transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" /> Terminate Task
      </button>
    </div>
  );
}
