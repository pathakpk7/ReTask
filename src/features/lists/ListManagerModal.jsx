import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { useTaskContext } from '../../store/TaskContext';
import { generateId } from '../../utils/idUtils';
import { Trash2 } from 'lucide-react';

const PRESET_COLORS = [
  '#19C37D', // Primary Green
  '#0B5D3B', // Dark Green
  '#1E90FF', // Blue
  '#FFA502', // Orange
  '#FF4757', // Red
  '#9B59B6', // Purple
  '#2ED573', // Lime
  '#747D8C', // Slate
];

export function ListManagerModal() {
  const {
    isListModalOpen,
    closeListModal,
    modalListToEdit,
    addList,
    updateList,
    deleteList,
  } = useTaskContext();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#19C37D');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isListModalOpen) {
      if (modalListToEdit) {
        setName(modalListToEdit.name || '');
        setColor(modalListToEdit.color || '#19C37D');
      } else {
        setName('');
        setColor('#19C37D');
      }
      setError('');
    }
  }, [isListModalOpen, modalListToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('List name is required');
      return;
    }

    if (modalListToEdit) {
      updateList(modalListToEdit.id, {
        name: name.trim(),
        color,
      });
    } else {
      const newList = {
        id: generateId('list'),
        name: name.trim(),
        color,
        icon: 'Folder',
      };
      addList(newList);
    }

    closeListModal();
  };

  const handleDelete = () => {
    if (!modalListToEdit) return;
    if (modalListToEdit.id === 'inbox') {
      alert('The Inbox list cannot be deleted.');
      return;
    }

    if (
      window.confirm(
        `Delete list "${modalListToEdit.name}"? Tasks in this list will be safely reassigned to Inbox.`
      )
    ) {
      deleteList(modalListToEdit.id);
      closeListModal();
    }
  };

  return (
    <Modal
      isOpen={isListModalOpen}
      onClose={closeListModal}
      title={modalListToEdit ? '// EDIT CATEGORICAL LIST' : '// CREATE NEW LIST'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="List Name *"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. System Engineering, Personal, Q4 Roadmap"
          error={error}
        />

        {/* Color Palette Selector */}
        <div className="space-y-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#829188]">
            Color Indicator
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-none border-2 transition-transform clip-cut-tr ${
                  color === c
                    ? 'border-[#E8F0EA] scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1A261E]">
          {modalListToEdit && modalListToEdit.id !== 'inbox' ? (
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 className="w-3.5 h-3.5" /> Delete List
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={closeListModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {modalListToEdit ? 'Save Changes' : 'Create List'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
