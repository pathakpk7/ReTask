import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  CornerDownRight,
  Flame,
  Layers,
  Menu,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  const navigate = useNavigate();

  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll progress for subtle top indicator
  const [scrollProgress, setScrollProgress] = useState(0);

  // Interactive Product Showcase Tab State
  const [activeTab, setActiveTab] = useState('tree');

  // Interactive Focus Chamber state
  const [focusTime, setFocusTime] = useState(1500);
  const [isFocusActive, setIsFocusActive] = useState(false);

  // Interactive Live Sandbox state
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxPriority, setSandboxPriority] = useState('High');
  const [sandboxTasks, setSandboxTasks] = useState([
    { id: '1', title: 'Synthesize product roadmap', priority: 'Urgent', completed: true },
    { id: '2', title: 'Break architecture into 4 sub-deliverables', priority: 'High', completed: false },
    { id: '3', title: 'Schedule deep work Pomodoro chamber', priority: 'Medium', completed: false },
  ]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isFocusActive && focusTime > 0) {
      interval = setInterval(() => setFocusTime((t) => t - 1), 1000);
    } else if (focusTime === 0) {
      setIsFocusActive(false);
    }
    return () => clearInterval(interval);
  }, [isFocusActive, focusTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleSandbox = (id) => {
    setSandboxTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) {
            confetti({
              particleCount: 28,
              spread: 55,
              origin: { y: 0.7 },
              colors: ['#10B981', '#34D399', '#6EE7B7'],
            });
          }
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const handleAddSandboxTask = (e) => {
    e.preventDefault();
    if (!sandboxInput.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: sandboxInput.trim(),
      priority: sandboxPriority,
      completed: false,
    };
    setSandboxTasks([newTask, ...sandboxTasks]);
    setSandboxInput('');
  };

  const scrollTo = (id) => {
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Easing curves
  const easeTransition = [0.16, 1, 0.3, 1];

  return (
    <div className="min-h-screen bg-[#08090A] text-[#F3F4F6] font-sans selection:bg-[#10B981] selection:text-[#08090A] relative overflow-hidden">
      {/* Refined scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent">
        <div
          className="h-full bg-emerald-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Atmospheric lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-emerald-500/[0.07] blur-[140px] rounded-full" />
        <div className="absolute top-[45%] -right-40 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[160px] rounded-full" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#08090A]/85 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="ReTask"
              className="w-9 h-9 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-white font-sans">
                ReTask
              </span>
              <span className="text-xs text-zinc-400">
                Workflow Environment
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300 font-medium">
            <button
              type="button"
              onClick={() => scrollTo('#experience')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Methodology
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#showcase')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Interactive Tour
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#sandbox')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Live Demo
            </button>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/today')}
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-zinc-400 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-white/[0.08] bg-[#0C0F13] px-6 py-6 space-y-4"
            >
              <button
                type="button"
                onClick={() => scrollTo('#experience')}
                className="block w-full text-left text-sm text-zinc-300 hover:text-white py-1"
              >
                Methodology
              </button>
              <button
                type="button"
                onClick={() => scrollTo('#showcase')}
                className="block w-full text-left text-sm text-zinc-300 hover:text-white py-1"
              >
                Interactive Tour
              </button>
              <button
                type="button"
                onClick={() => scrollTo('#sandbox')}
                className="block w-full text-left text-sm text-zinc-300 hover:text-white py-1"
              >
                Live Demo
              </button>
              <div className="pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/today')}
                >
                  <span>Launch App</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeTransition }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Redesigned for calm, deliberate progress</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1] font-display">
            Turn complex objectives into tangible daily momentum
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-body">
            ReTask replaces flat, guilt-inducing lists with infinite hierarchical task trees,
            automated daily carry-forward, and an integrated focus environment.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/today')}
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollTo('#showcase')}
            >
              <span>Explore Interactive Tour</span>
            </Button>
          </div>
        </motion.div>

        {/* Hero Interactive App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: easeTransition }}
          className="mt-16 text-left max-w-4xl mx-auto rounded-2xl bg-[#0F1216] border border-white/[0.08] shadow-elevated overflow-hidden"
        >
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-[#13171E]/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white/10" />
              <span className="w-3 h-3 rounded-full bg-white/10" />
              <span className="w-3 h-3 rounded-full bg-white/10" />
              <span className="ml-3 text-xs text-zinc-400 font-medium">ReTask / Today</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active Focus Session
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
              <div>
                <h3 className="text-xl font-semibold text-white">Deliver enterprise application release</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Hierarchical breakdown with automatic parent progress aggregation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded">
                  75% Complete
                </span>
              </div>
            </div>

            {/* Tree Items */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-[#161B22] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-emerald-500 text-[#08090A] flex items-center justify-center text-xs font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm text-zinc-300 line-through">Security audit and credential sanitization</span>
                </div>
                <span className="text-xs text-zinc-500">Completed</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#161B22] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-emerald-500 text-[#08090A] flex items-center justify-center text-xs font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm text-zinc-300 line-through">Refactor core interaction state handlers</span>
                </div>
                <span className="text-xs text-zinc-500">Completed</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#161B22] border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border border-emerald-400/50 flex items-center justify-center" />
                  <span className="text-sm text-white font-medium">Verify cross-device animation performance</span>
                </div>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Methodology Section */}
      <section id="experience" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Designed for how humans actually accomplish work
          </h2>
          <p className="text-zinc-400 mt-4 leading-relaxed font-body">
            Traditional todo apps treat complex undertakings identically to trivial chores.
            ReTask creates structure, context, and intelligent feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-[#0F1216] border border-white/[0.07] space-y-4 hover:border-white/[0.14] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Hierarchical task trees</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Nest complex tasks infinitely. Child task completions automatically propagate upward,
              giving you a clear, honest representation of overall progress.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F1216] border border-white/[0.07] space-y-4 hover:border-white/[0.14] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Zero-guilt daily rollover</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Unfinished tasks cleanly advance into your next day without punitive red markers.
              Original creation schedules are preserved for historical clarity.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F1216] border border-white/[0.07] space-y-4 hover:border-white/[0.14] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Avoidance intelligence</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              When a difficult item is postponed repeatedly, ReTask gently flags it and provides
              actionable recommendations to break the scope down into bite-sized actions.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Showcase Tour */}
      <section id="showcase" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Explore the ReTask ecosystem
          </h2>
          <p className="text-zinc-400 font-body">
            Switch between core workflows to see how each tool connects into a single flow.
          </p>

          {/* Tab selector */}
          <div className="inline-flex p-1 bg-[#161B22] border border-white/[0.08] rounded-xl mt-4">
            <button
              type="button"
              onClick={() => setActiveTab('tree')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'tree'
                  ? 'bg-emerald-500 text-[#08090A] shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Task Tree
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('focus')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'focus'
                  ? 'bg-emerald-500 text-[#08090A] shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Focus Chamber
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500 text-[#08090A] shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Insights
            </button>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#0F1216] border border-white/[0.08] p-8 shadow-card">
          {activeTab === 'tree' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-semibold text-white">Hierarchical breakdown</h4>
                  <p className="text-xs text-zinc-400">Subtasks roll up automatically to parent status</p>
                </div>
                <span className="text-xs text-emerald-400 font-medium">Interactive Demo</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-4 rounded-xl bg-[#161B22] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Q4 Platform Evolution
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">66%</span>
                  </div>

                  <div className="pl-6 space-y-2 border-l border-white/10 ml-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="line-through flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Complete user research synthesis
                      </span>
                      <span className="text-emerald-400">Done</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="line-through flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Design modular UI tokens
                      </span>
                      <span className="text-emerald-400">Done</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-zinc-500" /> Deploy production release
                      </span>
                      <span className="text-amber-400">Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'focus' && (
            <div className="text-center py-6 space-y-6">
              <div>
                <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">
                  Deep Work Pomodoro
                </span>
                <div className="text-5xl sm:text-6xl font-bold tracking-tight text-white font-mono my-4">
                  {formatTime(focusTime)}
                </div>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Timer state persists across routes. Switch freely without breaking flow.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsFocusActive(!isFocusActive)}
                >
                  {isFocusActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isFocusActive ? 'Pause Session' : 'Start Focus'}</span>
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setIsFocusActive(false);
                    setFocusTime(1500);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-semibold text-white">Objective productivity metrics</h4>
                <p className="text-xs text-zinc-400">No inflated vanity stats — only actionable behavioral clarity</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#161B22] border border-white/[0.06] space-y-1">
                  <span className="text-xs text-zinc-400">Completion Velocity</span>
                  <div className="text-2xl font-bold text-emerald-400">92.4%</div>
                  <span className="text-[11px] text-zinc-500">Consistent week-over-week</span>
                </div>

                <div className="p-4 rounded-xl bg-[#161B22] border border-white/[0.06] space-y-1">
                  <span className="text-xs text-zinc-400">Active Streak</span>
                  <div className="text-2xl font-bold text-white">14 Days</div>
                  <span className="text-[11px] text-zinc-500">Unbroken focus cycle</span>
                </div>

                <div className="p-4 rounded-xl bg-[#161B22] border border-white/[0.06] space-y-1">
                  <span className="text-xs text-zinc-400">Avoidance Score</span>
                  <div className="text-2xl font-bold text-emerald-400">Healthy</div>
                  <span className="text-[11px] text-zinc-500">0 overdue bottlenecks</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Live Interactive Sandbox */}
      <section id="sandbox" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Try the workflow right here
          </h2>
          <p className="text-zinc-400 font-body text-sm">
            Add a task and complete items to experience the tactile micro-interactions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto rounded-2xl bg-[#0F1216] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-card">
          <form onSubmit={handleAddSandboxTask} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              placeholder="Add an actionable goal..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#161B22] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
            />
            <select
              value={sandboxPriority}
              onChange={(e) => setSandboxPriority(e.target.value)}
              aria-label="Task priority"
              className="px-3 py-2.5 rounded-lg bg-[#161B22] border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/60"
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <Button variant="primary" size="md" type="submit">
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </Button>
          </form>

          {/* Sandbox Task List */}
          <div className="space-y-2.5">
            {sandboxTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleSandbox(task.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  task.completed
                    ? 'bg-[#12161D]/50 border-white/[0.04] text-zinc-500'
                    : 'bg-[#161B22] border-white/[0.07] text-zinc-200 hover:border-white/[0.14]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 text-[#08090A]'
                        : 'border border-white/20 hover:border-emerald-400'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-sm ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {task.title}
                  </span>
                </div>

                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    task.priority === 'Urgent'
                      ? 'bg-red-500/10 text-red-400'
                      : task.priority === 'High'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
            Start accomplishing with clarity
          </h2>

          <p className="text-base text-zinc-400 font-body">
            No signup forms. No cloud latency. 100% private local browser storage.
          </p>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/today')}
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Refined Minimalist Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ReTask" className="w-6 h-6 rounded" />
            <span className="font-medium text-zinc-400">ReTask</span>
            <span>—</span>
            <span>Focus, Plan, Achieve</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate('/today')}
              className="hover:text-zinc-300 transition-colors"
            >
              Workspace
            </button>
            <button
              type="button"
              onClick={() => navigate('/focus')}
              className="hover:text-zinc-300 transition-colors"
            >
              Deep Focus
            </button>
            <button
              type="button"
              onClick={() => navigate('/analytics')}
              className="hover:text-zinc-300 transition-colors"
            >
              Analytics
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="hover:text-zinc-300 transition-colors"
            >
              Settings
            </button>
          </div>

          <p>© 2026 ReTask. Crafted for focused execution.</p>
        </div>
      </footer>
    </div>
  );
}
