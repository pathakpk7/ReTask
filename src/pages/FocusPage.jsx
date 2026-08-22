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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#0B100D] border border-[#1A261E] clip-cut-tr">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-[#19C37D] animate-pulse" />
          <div>
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#E8F0EA]">
              Pomodoro Focus Engine
            </h2>
            <span className="text-[10px] font-mono text-[#829188]">
              Session #{focusTimer.sessionCount} • Persistent State
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
            5m Short Rest
          </Button>
          <Button
            variant={focusTimer.mode === 'longBreak' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleModeSwitch('longBreak')}
          >
            15m Long Rest
          </Button>
          <Button
            variant={focusTimer.mode === 'custom' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setIsCustomModalOpen(true)}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Length</span>
          </Button>
        </div>
      </div>

      {/* Main Timer Display Card */}
      <Card className="p-8 text-center space-y-6 relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#829188] uppercase tracking-widest block font-bold">
            {focusTimer.mode === 'focus'
              ? 'OPERATIONAL FOCUS INTERVAL (25m)'
              : focusTimer.mode === 'shortBreak'
              ? 'SHORT SYSTEM RECOVERY (5m)'
              : focusTimer.mode === 'longBreak'
              ? 'EXTENDED COOL DOWN (15m)'
              : `CUSTOM FOCUS INTERVAL (${Math.ceil(focusTimer.secondsLeft / 60)}m)`}
          </span>
          <div className="font-mono text-6xl md:text-8xl font-extrabold text-[#19C37D] tracking-tighter drop-shadow-[0_0_25px_rgba(25,195,125,0.4)]">
            {formattedTime}
          </div>
        </div>

        {/* Timer Control Toolbar */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button
            variant="primary"
            size="lg"
            onClick={toggleTimer}
            className="w-36"
          >
            {focusTimer.isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> Start
              </>
            )}
          </Button>

          <Button variant="secondary" size="lg" onClick={handleSkip}>
            <FastForward className="w-5 h-5 text-[#19C37D]" /> Skip
          </Button>

          <Button variant="secondary" size="lg" onClick={resetFocusTimer}>
            <RotateCcw className="w-5 h-5" /> Reset
          </Button>
        </div>
      </Card>

      {/* Target Task Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1A261E] pb-3">
          <h3 className="font-mono text-xs font-bold text-[#829188] uppercase tracking-wider">
            Active Target Task
          </h3>
          {activeTasks.length > 0 && (
            <div className="w-64">
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
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-sans text-lg font-bold text-[#E8F0EA]">
                    {currentFocusTask.title}
                  </h4>
                  <PriorityBadge priority={currentFocusTask.priority} />
                </div>
                <p className="text-xs font-sans text-[#829188] mt-1">
                  {currentFocusTask.description || 'No description provided.'}
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => toggleComplete(currentFocusTask.id)}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Complete</span>
              </Button>
            </div>

            {childSubtasks.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-[#1A261E]">
                <span className="text-[10px] font-mono text-[#829188] uppercase block">
                  Execution Steps ({childSubtasks.filter((s) => s.completed).length}/{childSubtasks.length})
                </span>
                <div className="space-y-1.5">
                  {childSubtasks.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => toggleComplete(sub.id)}
                      className="flex items-center justify-between p-2.5 bg-[#050705] border border-[#1A261E] hover:border-[#19C37D] cursor-pointer clip-cut-tr text-xs"
                    >
                      <span className={sub.completed ? 'line-through text-[#829188]' : 'text-[#E8F0EA]'}>
                        {sub.title}
                      </span>
                      <div
                        className={`w-4 h-4 border flex items-center justify-center clip-cut-tr ${
                          sub.completed ? 'bg-[#0B5D3B] border-[#19C37D] text-[#E8F0EA]' : 'border-[#1A261E]'
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
          <p className="text-xs font-mono text-[#829188] text-center py-4">
            No active tasks available for focus execution.
          </p>
        )}
      </Card>

      {/* Custom Duration Selector Modal */}
      <Modal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        title="Custom Focus Duration Selector"
      >
        <div className="space-y-5">
          <p className="text-xs font-sans text-[#829188]">
            Select a custom focus interval duration or enter custom minutes below:
          </p>

          {/* Quick Custom Preset Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 font-mono text-xs">
            {[10, 15, 30, 45, 50, 60, 90, 120].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => {
                  setCustomMinutesInput(mins);
                  handleApplyCustomMinutes(mins);
                }}
                className={`p-2.5 border text-center transition-all clip-cut-tr cursor-pointer ${
                  customMinutesInput === mins
                    ? 'bg-[#19C37D] text-[#050705] font-bold border-[#19C37D]'
                    : 'bg-[#050705] text-[#829188] hover:text-[#E8F0EA] border-[#1A261E] hover:border-[#19C37D]'
                }`}
              >
                {mins} Minutes
              </button>
            ))}
          </div>

          {/* Manual Minute Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApplyCustomMinutes(customMinutesInput);
            }}
            className="space-y-4 pt-2 border-t border-[#1A261E]"
          >
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#829188] uppercase font-bold block">
                Manual Duration (1 to 480 Minutes)
              </label>
              <Input
                type="number"
                min={1}
                max={480}
                value={customMinutesInput}
                onChange={(e) => setCustomMinutesInput(e.target.value)}
                placeholder="Enter custom minutes..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" size="md" type="button" onClick={() => setIsCustomModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Apply Focus Duration
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
