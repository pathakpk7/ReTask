import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { useTaskContext } from '../../store/TaskContext';
import { generateId } from '../../utils/idUtils';
import { Trash2 } from 'lucide-react';

const PRESET_COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#6B7280', // Gray
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
  const [color, setColor] = useState('#10B981');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isListModalOpen) {
      if (modalListToEdit) {
        setName(modalListToEdit.name || '');
        setColor(modalListToEdit.color || '#10B981');
      } else {
        setName('');
        setColor('#10B981');
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
        `Delete list "${modalListToEdit.name}"? Tasks in this list will be reassigned to Inbox.`
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
      title={modalListToEdit ? 'Edit List' : 'Create New List'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="List Name *"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. Work, Engineering, Personal..."
          error={error}
        />

        {/* Color Palette Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-300">
            List Color
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
                className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                  color === c
                    ? 'border-white scale-110 shadow-md ring-2 ring-emerald-500/40'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          {modalListToEdit && modalListToEdit.id !== 'inbox' ? (
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete List
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
