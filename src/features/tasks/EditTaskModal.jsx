import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { useTaskContext } from '../../store/TaskContext';
import { Repeat } from 'lucide-react';

export function EditTaskModal() {
  const {
    isEditModalOpen,
    closeEditModal,
    modalTaskToEdit,
    updateTask,
    tasks,
    lists,
  } = useTaskContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    estimatedTime: 0,
    difficulty: 'medium',
    parentId: '',
    listId: 'inbox',
    isRecurring: false,
    recurrenceFrequency: 'daily',
    recurrenceCustomDays: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditModalOpen && modalTaskToEdit) {
      const rec = modalTaskToEdit.recurrence;
      setFormData({
        title: modalTaskToEdit.title || '',
        description: modalTaskToEdit.description || '',
        priority: modalTaskToEdit.priority || 'medium',
        dueDate: modalTaskToEdit.dueDate || '',
        estimatedTime: modalTaskToEdit.estimatedTime || 0,
        difficulty: modalTaskToEdit.difficulty || 'medium',
        parentId: modalTaskToEdit.parentId || '',
        listId: modalTaskToEdit.listId || 'inbox',
        isRecurring: Boolean(rec && rec.enabled),
        recurrenceFrequency: rec?.frequency || 'daily',
        recurrenceCustomDays: rec?.customDays || 1,
      });
      setErrors({});
    }
  }, [isEditModalOpen, modalTaskToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    if (modalTaskToEdit) {
      updateTask(modalTaskToEdit.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        estimatedTime: parseInt(formData.estimatedTime, 10) || 0,
        difficulty: formData.difficulty,
        parentId: formData.parentId || null,
        listId: formData.listId || 'inbox',
        recurrence: formData.isRecurring
          ? {
              enabled: true,
              frequency: formData.recurrenceFrequency,
              customDays: parseInt(formData.recurrenceCustomDays, 10) || 1,
            }
          : null,
      });
    }

    closeEditModal();
  };

  const availableParents = tasks.filter(
    (t) => modalTaskToEdit && t.id !== modalTaskToEdit.id
  );

  return (
    <Modal
      isOpen={isEditModalOpen}
      onClose={closeEditModal}
      title="// EDIT TASK PARAMETERS"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Priority Level"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="urgent">Urgent [P0]</option>
            <option value="high">High [P1]</option>
            <option value="medium">Medium [P2]</option>
            <option value="low">Low [P3]</option>
          </Select>

          <Select
            label="Difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="extreme">Extreme</option>
          </Select>

          <Input
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />

          <Input
            label="Estimated Time (Minutes)"
            type="number"
            name="estimatedTime"
            min="0"
            step="5"
            value={formData.estimatedTime}
            onChange={handleChange}
          />

          <Select
            label="Parent Task (Reassign Hierarchy)"
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
          >
            <option value="">None [Root Level Task]</option>
            {availableParents.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </Select>

          <Select
            label="Categorical List"
            name="listId"
            value={formData.listId}
            onChange={handleChange}
          >
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Recurrence Settings */}
        <div className="p-[#050705] p-3 border border-[#1A261E] clip-cut-tr space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="accent-[#19C37D] w-4 h-4"
            />
            <span className="font-mono text-xs font-bold text-[#E8F0EA] flex items-center gap-1.5 uppercase">
              <Repeat className="w-3.5 h-3.5 text-[#19C37D]" /> Enable Task Recurrence
            </span>
          </label>

          {formData.isRecurring && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Select
                label="Recurrence Frequency"
                name="recurrenceFrequency"
                value={formData.recurrenceFrequency}
                onChange={handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom Interval</option>
              </Select>

              {formData.recurrenceFrequency === 'custom' && (
                <Input
                  label="Every X Days"
                  type="number"
                  name="recurrenceCustomDays"
                  min="1"
                  value={formData.recurrenceCustomDays}
                  onChange={handleChange}
                />
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1A261E]">
          <Button variant="ghost" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
