import React from 'react';
import { Modal } from '../ui/Modal';
import { useTaskContext } from '../../store/TaskContext';
import { Keyboard } from 'lucide-react';

export function ShortcutsHelpModal() {
  const { isShortcutsHelpOpen, closeShortcutsHelp } = useTaskContext();

  const shortcutList = [
    { key: 'N', label: 'Create New Task' },
    { key: 'E', label: 'Edit Selected Task' },
    { key: 'D', label: 'Delete Selected Task' },
    { key: 'Space', label: 'Toggle Complete / Reopen' },
    { key: 'Enter', label: 'Select / Open Detail Panel' },
    { key: 'Escape', label: 'Close Modals / Menus / Deselect' },
    { key: '/', label: 'Focus Global Search' },
    { key: 'F', label: 'Navigate to Focus Engine' },
    { key: '↑ / ↓', label: 'Navigate Task Selection Up / Down' },
    { key: '?', label: 'Open Keyboard Shortcuts Guide' },
  ];

  return (
    <Modal
      isOpen={isShortcutsHelpOpen}
      onClose={closeShortcutsHelp}
      title="// SYSTEM KEYBOARD SHORTCUTS CHEAT SHEET"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-[#050705] border border-[#19C37D] text-[#19C37D] font-mono text-xs clip-cut-tr">
          <Keyboard className="w-4 h-4" />
          <span>Press any hotkey while workspace text inputs are disarmed to trigger instant ops.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {shortcutList.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2.5 bg-[#050705] border border-[#1A261E] clip-cut-tr"
            >
              <span className="text-[#829188]">{sc.label}</span>
              <kbd className="px-2 py-0.5 bg-[#101712] text-[#19C37D] border border-[#0B5D3B] font-bold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
