import React from 'react';
import { useTaskContext } from '../../store/TaskContext';
import { Button } from '../ui/Button';
import { Select } from '../ui/FormControls';
import { CheckCircle2, RotateCcw, Trash2, X } from 'lucide-react';

export function BulkActionToolbar() {
  const {
    selectedTaskIds,
    clearMultiSelect,
    bulkComplete,
    bulkReopen,
    bulkDelete,
    bulkChangePriority,
    bulkChangeList,
    lists,
  } = useTaskContext();

  if (!selectedTaskIds || selectedTaskIds.length === 0) return null;

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedTaskIds.length} selected task(s)?`
      )
    ) {
      bulkDelete();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0F1216]/95 backdrop-blur-xl border border-white/[0.12] shadow-elevated rounded-2xl px-5 py-3 flex items-center gap-3.5 flex-wrap text-xs text-white max-w-[95vw]">
      <div className="flex items-center gap-2 font-medium text-emerald-400 border-r border-white/10 pr-3.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>{selectedTaskIds.length} selected</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="secondary" size="sm" onClick={bulkComplete}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" /> Done
        </Button>

        <Button variant="secondary" size="sm" onClick={bulkReopen}>
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reopen
        </Button>

        {/* Priority Picker */}
        <div className="w-28">
          <Select
            value=""
            onChange={(e) => {
              if (e.target.value) bulkChangePriority(e.target.value);
            }}
          >
            <option value="">Priority...</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>

        {/* List Picker */}
        <div className="w-28">
          <Select
            value=""
            onChange={(e) => {
              if (e.target.value) bulkChangeList(e.target.value);
            }}
          >
            <option value="">Move...</option>
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </div>

        <Button variant="danger" size="sm" onClick={handleBulkDelete}>
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
        </Button>
      </div>

      <button
        type="button"
        onClick={clearMultiSelect}
        title="Deselect All"
        aria-label="Clear selection"
        className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors ml-auto"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
