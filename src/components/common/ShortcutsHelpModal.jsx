import React from 'react';
import { Modal } from '../ui/Modal';
import { useTaskContext } from '../../store/TaskContext';
import { Keyboard } from 'lucide-react';

export function ShortcutsHelpModal() {
  const { isShortcutsHelpOpen, closeShortcutsHelp } = useTaskContext();

  const shortcutList = [
    { key: 'N', label: 'Create new task' },
    { key: 'E', label: 'Edit selected task' },
    { key: 'D', label: 'Delete selected task' },
    { key: 'Space', label: 'Toggle completed state' },
    { key: 'Enter', label: 'Open task detail panel' },
    { key: 'Escape', label: 'Close modals / Deselect' },
    { key: '/', label: 'Focus search input' },
    { key: 'F', label: 'Open Deep Focus timer' },
    { key: '↑ / ↓', label: 'Navigate tasks' },
    { key: '?', label: 'Open this shortcuts guide' },
  ];

  return (
    <Modal
      isOpen={isShortcutsHelpOpen}
      onClose={closeShortcutsHelp}
      title="Keyboard Shortcuts"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <Keyboard className="w-4 h-4 flex-shrink-0" />
          <span>Press these keys anytime while not editing a text input for quick actions.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {shortcutList.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#161B22] border border-white/[0.05]"
            >
              <span className="text-zinc-300">{sc.label}</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-emerald-400 font-mono font-medium border border-white/10 text-[11px]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
