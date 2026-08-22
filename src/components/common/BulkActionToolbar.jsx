import React from 'react';
import { useTaskContext } from '../../store/TaskContext';
import { Button } from '../ui/Button';
import { Select } from '../ui/FormControls';
import { CheckCircle2, RotateCcw, Trash2, X, Tag, Folder } from 'lucide-react';

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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0B100D] border border-[#19C37D] shadow-[0_0_30px_rgba(25,195,125,0.35)] clip-cut-tr-lg px-4 py-3 flex items-center gap-3 flex-wrap text-xs font-mono text-[#E8F0EA] animate-bounce-in max-w-[95vw]">
      <div className="flex items-center gap-2 font-bold text-[#19C37D] border-r border-[#1A261E] pr-3">
        <span className="w-2 h-2 rounded-full bg-[#19C37D] animate-ping" />
        <span>{selectedTaskIds.length} SELECTED</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="secondary" size="sm" onClick={bulkComplete}>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#19C37D]" /> Complete
        </Button>

        <Button variant="secondary" size="sm" onClick={bulkReopen}>
          <RotateCcw className="w-3.5 h-3.5 text-[#19C37D]" /> Reopen
        </Button>

        {/* Priority Picker */}
        <div className="w-32">
          <Select
            value=""
            onChange={(e) => {
              if (e.target.value) bulkChangePriority(e.target.value);
            }}
          >
            <option value="">Priority...</option>
            <option value="urgent">P0 Urgent</option>
            <option value="high">P1 High</option>
            <option value="medium">P2 Medium</option>
            <option value="low">P3 Low</option>
          </Select>
        </div>

        {/* List Picker */}
        <div className="w-32">
          <Select
            value=""
            onChange={(e) => {
              if (e.target.value) bulkChangeList(e.target.value);
            }}
          >
            <option value="">Move List...</option>
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </div>

        <Button variant="danger" size="sm" onClick={handleBulkDelete}>
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </Button>
      </div>

      <button
        type="button"
        onClick={clearMultiSelect}
        title="Deselect All"
        aria-label="Clear selection"
        className="p-1 text-[#829188] hover:text-[#E8F0EA] hover:bg-[#1A261E] clip-cut-tr transition-colors ml-auto"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
