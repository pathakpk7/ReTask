import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { useTaskContext } from '../../store/TaskContext';
import { generateId } from '../../utils/idUtils';
import { getIsoDateToday } from '../../utils/dateUtils';
import { Repeat } from 'lucide-react';

export function AddTaskModal() {
  const {
    isAddModalOpen,
    closeAddModal,
    modalParentId,
    addTask,
    tasks,
    lists,
    activeListId,
  } = useTaskContext();

  const titleInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: getIsoDateToday(),
    estimatedTime: 30,
    difficulty: 'medium',
    parentId: '',
    listId: 'inbox',
    isRecurring: false,
    recurrenceFrequency: 'daily',
    recurrenceCustomDays: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAddModalOpen) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: getIsoDateToday(),
        estimatedTime: 30,
        difficulty: 'medium',
        parentId: modalParentId || '',
        listId: activeListId && activeListId !== 'all' ? activeListId : 'inbox',
        isRecurring: false,
        recurrenceFrequency: 'daily',
        recurrenceCustomDays: 1,
      });
      setErrors({});

      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 50);
    }
  }, [isAddModalOpen, modalParentId, activeListId]);

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

    const newTask = {
      id: generateId('task'),
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
    };

    addTask(newTask);
    closeAddModal();
  };

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={closeAddModal}
      title={modalParentId ? 'Add Subtask' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          ref={titleInputRef}
          label="Task Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Design modular architecture and review API tokens"
          error={errors.title}
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Implementation notes, context, or sub-deliverables..."
          rows={2}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Priority Level"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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
            label="Parent Task (Hierarchy)"
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
          >
            <option value="">None (Root Task)</option>
            {tasks.map((t) => (
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

        {/* Recurrence Options */}
        <div className="p-3.5 rounded-xl bg-[#161B22] border border-white/[0.05] space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="accent-emerald-500 w-4 h-4 rounded"
            />
            <span className="text-xs font-medium text-white flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-emerald-400" /> Enable recurrence
            </span>
          </label>

          {formData.isRecurring && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Select
                label="Frequency"
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
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button variant="ghost" onClick={closeAddModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
