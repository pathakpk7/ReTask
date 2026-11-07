import React, { useState } from 'react';
import { useTaskContext } from '../store/TaskContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select, Input } from '../components/ui/FormControls';
import { Modal } from '../components/ui/Modal';
import { PriorityBadge } from '../components/ui/Badge';
import { Play, Pause, RotateCcw, Zap, CheckCircle2, Check, FastForward, Sliders } from 'lucide-react';

export function FocusPage() {
  const {
    tasks,
    toggleComplete,
    focusTimer,
    setFocusTimerRunning,
    setFocusTimerMode,
    resetFocusTimer,
  } = useTaskContext();

  const activeTasks = tasks.filter((t) => !t.completed);
  const [selectedFocusTaskId, setSelectedFocusTaskId] = useState(
    activeTasks.length > 0 ? activeTasks[0].id : ''
  );

  // Custom Focus Length Modal & State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState(30);

  const currentFocusTask = tasks.find((t) => t.id === selectedFocusTaskId) || activeTasks[0] || null;

  const toggleTimer = () => setFocusTimerRunning(!focusTimer.isRunning);

  const handleModeSwitch = (mode, customSeconds = null) => {
    let seconds = 1500; // 25m Focus
    if (mode === 'shortBreak') seconds = 300; // 5m Short Break
    if (mode === 'longBreak') seconds = 900; // 15m Long Break
    if (mode === 'custom' && customSeconds) seconds = customSeconds;
    
    setFocusTimerMode(mode, seconds);
  };

  const handleApplyCustomMinutes = (mins) => {
    const validMins = Math.max(1, Math.min(480, parseInt(mins, 10) || 25));
    handleModeSwitch('custom', validMins * 60);
    setIsCustomModalOpen(false);
  };

  const handleSkip = () => {
    if (focusTimer.mode === 'focus' || focusTimer.mode === 'custom') {
      handleModeSwitch('shortBreak');
    } else {
      handleModeSwitch('focus');
    }
  };

  const minutes = Math.floor(focusTimer.secondsLeft / 60);
  const seconds = focusTimer.secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const childSubtasks = currentFocusTask ? tasks.filter((t) => t.parentId === currentFocusTask.id) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode & Session Cycle Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0F1216] border border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Deep Focus
            </h2>
            <span className="text-xs text-zinc-400">
              Session {focusTimer.sessionCount} • Active timer
            </span>
          </div>
        </div>

        {/* Focus Mode & Custom Duration Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={focusTimer.mode === 'focus' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleModeSwitch('focus')}
          >
            25m Focus
          </Button>
          <Button
            variant={focusTimer.mode === 'shortBreak' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleModeSwitch('shortBreak')}
          >
            5m Break
          </Button>
          <Button
            variant={focusTimer.mode === 'longBreak' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleModeSwitch('longBreak')}
          >
            15m Rest
          </Button>
          <Button
            variant={focusTimer.mode === 'custom' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setIsCustomModalOpen(true)}
          >
            <Sliders className="w-3.5 h-3.5 mr-1" />
            <span>Custom</span>
          </Button>
        </div>
      </div>

      {/* Main Timer Display Card */}
      <Card className="p-10 text-center space-y-6 relative overflow-hidden">
        <div className="space-y-3">
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
            {focusTimer.mode === 'focus'
              ? 'Focus Interval (25 min)'
              : focusTimer.mode === 'shortBreak'
              ? 'Short Break (5 min)'
              : focusTimer.mode === 'longBreak'
              ? 'Extended Rest (15 min)'
              : `Custom Duration (${Math.ceil(focusTimer.secondsLeft / 60)} min)`}
          </span>
          <div className="font-mono text-6xl md:text-8xl font-bold text-white tracking-tight my-4">
            {formattedTime}
          </div>
        </div>

        {/* Timer Control Toolbar */}
        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={toggleTimer}
            className="w-36"
          >
            {focusTimer.isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-1.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1.5" /> Start
              </>
            )}
          </Button>

          <Button variant="secondary" size="lg" onClick={handleSkip}>
            <FastForward className="w-4 h-4 mr-1.5 text-zinc-400" /> Skip
          </Button>

          <Button variant="secondary" size="lg" onClick={resetFocusTimer}>
            <RotateCcw className="w-4 h-4 mr-1.5 text-zinc-400" /> Reset
          </Button>
        </div>
      </Card>

      {/* Target Task Section */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Current Target Task
          </h3>
          {activeTasks.length > 0 && (
            <div className="w-full sm:w-64">
              <Select
                value={selectedFocusTaskId}
                onChange={(e) => setSelectedFocusTaskId(e.target.value)}
              >
                {activeTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        {currentFocusTask ? (
          <div className="space-y-4 pt-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-base font-semibold text-white">
                    {currentFocusTask.title}
                  </h4>
                  <PriorityBadge priority={currentFocusTask.priority} />
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {currentFocusTask.description || 'No description provided.'}
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => toggleComplete(currentFocusTask.id)}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Mark Done</span>
              </Button>
            </div>

            {childSubtasks.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                <span className="text-xs text-zinc-400 block font-medium">
                  Subtasks ({childSubtasks.filter((s) => s.completed).length}/{childSubtasks.length})
                </span>
                <div className="space-y-2">
                  {childSubtasks.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => toggleComplete(sub.id)}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#161B22] border border-white/[0.05] hover:border-white/[0.12] cursor-pointer text-xs transition-colors"
                    >
                      <span className={sub.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}>
                        {sub.title}
                      </span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center ${
                          sub.completed ? 'bg-emerald-500 text-[#08090A]' : 'border border-white/20'
                        }`}
                      >
                        {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 text-center py-4">
            No active tasks available for focus execution.
          </p>
        )}
      </Card>

      {/* Custom Duration Selector Modal */}
      <Modal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        title="Custom Focus Duration"
      >
        <div className="space-y-5">
          <p className="text-xs text-zinc-400">
            Choose a quick preset or enter custom minutes below:
          </p>

          {/* Quick Custom Preset Buttons */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => {
                  setCustomMinutesInput(mins);
                  handleApplyCustomMinutes(mins);
                }}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  customMinutesInput === mins
                    ? 'bg-emerald-500 text-[#08090A] font-semibold border-emerald-500'
                    : 'bg-[#161B22] text-zinc-300 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Manual Minute Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApplyCustomMinutes(customMinutesInput);
            }}
            className="space-y-4 pt-2 border-t border-white/[0.06]"
          >
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 block font-medium">
                Duration (1 to 480 minutes)
              </label>
              <Input
                type="number"
                min={1}
                max={480}
                value={customMinutesInput}
                onChange={(e) => setCustomMinutesInput(e.target.value)}
                placeholder="Minutes..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="md" type="button" onClick={() => setIsCustomModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Apply
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
