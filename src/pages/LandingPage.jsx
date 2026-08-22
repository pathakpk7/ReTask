import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  Zap,
  CheckSquare,
  Layers,
  Flame,
  ShieldAlert,
  Clock,
  ArrowRight,
  ChevronDown,
  Play,
  Pause,
  Plus,
  Sparkles,
  Command,
  Sliders,
  BarChart3,
  CheckCircle2,
  Calendar,
  Folder,
  Repeat,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function LandingPage() {
  const navigate = useNavigate();

  // Scroll Progress Percentage State
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sandbox State for Live Demo
  const [sandboxTaskTitle, setSandboxTaskTitle] = useState('');
  const [sandboxPriority, setSandboxPriority] = useState('urgent');
  const [sandboxTasks, setSandboxTasks] = useState([
    { id: '1', title: 'Initialize ReTask Core Engine', completed: true, priority: 'urgent' },
    { id: '2', title: 'Execute High-Velocity Operational Tasks', completed: false, priority: 'high' },
    { id: '3', title: 'Run Persistent Focus Pomodoro Chamber', completed: false, priority: 'medium' },
  ]);
  const [activeTab, setActiveTab] = useState('hierarchy');

  // Interactive Focus Timer Mock in Sandbox
  const [focusSeconds, setFocusSeconds] = useState(1500);
  const [isFocusRunning, setIsFocusRunning] = useState(false);

  // Track page scroll progress for top progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isFocusRunning && focusSeconds > 0) {
      interval = setInterval(() => setFocusSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusRunning, focusSeconds]);

  const handleAddSandboxTask = (e) => {
    e.preventDefault();
    if (!sandboxTaskTitle.trim()) return;
    setSandboxTasks([
      { id: Date.now().toString(), title: sandboxTaskTitle, completed: false, priority: sandboxPriority },
      ...sandboxTasks,
    ]);
    setSandboxTaskTitle('');
  };

  const toggleSandboxTask = (id) => {
    setSandboxTasks(
      sandboxTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050705] text-[#E8F0EA] font-sans selection:bg-[#19C37D] selection:text-[#050705] relative">
      {/* Scroll Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#101712]">
        <div
          className="h-full bg-gradient-to-r from-[#0B5D3B] via-[#19C37D] to-[#22E595] shadow-[0_0_10px_#19C37D] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Dynamic Background Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1A261E_1px,transparent_1px),linear-gradient(to_bottom,#1A261E_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Sticky Neo-Skeuomorphic Navbar */}
      <header className="sticky top-1 z-40 bg-[#0B100D]/90 backdrop-blur-md border-b border-[#1A261E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/today')}>
            <img
              src="/logo.png"
              alt="ReTask Logo"
              className="w-9 h-9 rounded border border-[#19C37D]/50 clip-cut-tr shadow-[0_0_12px_rgba(25,195,125,0.4)] object-cover"
            />
            <div>
              <div className="font-mono text-base font-extrabold tracking-widest text-[#E8F0EA] flex items-center gap-2">
                RETASK <span className="text-[10px] px-1.5 py-0.5 bg-[#0B5D3B] text-[#19C37D] border border-[#19C37D]/50 clip-cut-tr">OS</span>
              </div>
              <p className="text-[9px] font-mono text-[#829188] uppercase tracking-tighter">
                FOCUS • PLAN • ACHIEVE
              </p>
            </div>
          </div>

          {/* Quick Nav Links with Smooth Scroll */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-[#829188]">
            <button type="button" onClick={() => scrollToSection('#narrative')} className="hover:text-[#19C37D] transition-colors cursor-pointer">
              NARRATIVE
            </button>
            <button type="button" onClick={() => scrollToSection('#architecture')} className="hover:text-[#19C37D] transition-colors cursor-pointer">
              SYSTEM ENGINE
            </button>
            <button type="button" onClick={() => scrollToSection('#intelligence')} className="hover:text-[#19C37D] transition-colors cursor-pointer">
              INTELLIGENCE
            </button>
            <button type="button" onClick={() => scrollToSection('#sandbox')} className="hover:text-[#19C37D] transition-colors cursor-pointer">
              LIVE SANDBOX
            </button>
          </nav>

          <Button variant="primary" size="md" onClick={() => navigate('/today')}>
            <Zap className="w-4 h-4" />
            <span>ENTER RETASK OS</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#101712] border border-[#19C37D]/40 clip-cut-tr font-mono text-xs text-[#19C37D]">
            <span className="w-2 h-2 rounded-full bg-[#19C37D] animate-ping" />
            <span>PERSONAL PRODUCTIVITY OPERATING SYSTEM</span>
          </div>

          <h1 className="font-mono text-4xl sm:text-6xl font-black tracking-tight text-[#E8F0EA] uppercase leading-tight">
            DECONSTRUCT THE CHAOS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#19C37D] via-[#10B981] to-[#0B5D3B]">
              OPERATE WITH PRECISION.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#829188] max-w-2xl mx-auto font-sans leading-relaxed">
            The world doesn't need another basic todo list. ReTask is a productivity OS built with deep hierarchical task trees, smart daily carry-forward, persistent focus chambers, and behavioral avoidance intelligence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button variant="primary" size="lg" onClick={() => navigate('/today')}>
              <Zap className="w-5 h-5" />
              <span>LAUNCH OPERATING SYSTEM</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => scrollToSection('#sandbox')}>
              <Play className="w-4 h-4 text-[#19C37D]" />
              <span>TRY LIVE SANDBOX</span>
            </Button>
          </div>

          {/* Interactive Floating Scroll Cue */}
          <div
            onClick={() => scrollToSection('#narrative')}
            className="pt-8 cursor-pointer group flex flex-col items-center gap-2 text-[#829188] hover:text-[#19C37D] transition-colors"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
              SCROLL TO EXPLORE
            </span>
            <div className="p-2 border border-[#1A261E] group-hover:border-[#19C37D] clip-cut-tr animate-float bg-[#050705]">
              <ChevronDown className="w-4 h-4 text-[#19C37D]" />
            </div>
          </div>
        </div>

        {/* Live System Operational Ticker Bar */}
        <div className="p-3 bg-[#0B100D] border border-[#1A261E] clip-cut-tr font-mono text-xs text-[#829188] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#19C37D] font-bold">[REAL-TIME METRICS]</span>
            <span>HIERARCHY: UNLIMITED TREE DEEP</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#FFA502] font-bold">[SMART ROLLOVER]</span>
            <span>ZERO-GUILT CARRY-FORWARD</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#1E90FF] font-bold">[FOCUS ENGINE]</span>
            <span>PERSISTENT 25m POMODORO</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#19C37D] font-bold">[PRIVACY]</span>
            <span>100% LOCAL STORAGE PERSISTENCE</span>
          </div>
        </div>

        {/* Interactive Hero System Preview Card */}
        <div id="architecture" className="relative p-1 bg-gradient-to-b from-[#1A261E] via-[#0B100D] to-[#1A261E] clip-cut-tr-lg shadow-[0_0_50px_rgba(25,195,125,0.15)]">
          <div className="bg-[#0B100D] border border-[#1A261E] p-6 space-y-6">
            {/* Interactive Preview Tabs */}
            <div className="flex items-center justify-between border-b border-[#1A261E] pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-3 h-3 bg-[#19C37D] clip-cut-tr" />
                <span className="text-[#E8F0EA] font-bold uppercase">SYSTEM WORKSPACE PREVIEW</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('hierarchy')}
                  className={`px-3 py-1.5 clip-cut-tr transition-all cursor-pointer ${
                    activeTab === 'hierarchy'
                      ? 'bg-[#19C37D] text-[#050705] font-bold'
                      : 'bg-[#050705] text-[#829188] hover:text-[#E8F0EA] border border-[#1A261E]'
                  }`}
                >
                  TASK TREE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('focus')}
                  className={`px-3 py-1.5 clip-cut-tr transition-all cursor-pointer ${
                    activeTab === 'focus'
                      ? 'bg-[#19C37D] text-[#050705] font-bold'
                      : 'bg-[#050705] text-[#829188] hover:text-[#E8F0EA] border border-[#1A261E]'
                  }`}
                >
                  FOCUS CHAMBER
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('intelligence')}
                  className={`px-3 py-1.5 clip-cut-tr transition-all cursor-pointer ${
                    activeTab === 'intelligence'
                      ? 'bg-[#19C37D] text-[#050705] font-bold'
                      : 'bg-[#050705] text-[#829188] hover:text-[#E8F0EA] border border-[#1A261E]'
                  }`}
                >
                  INTELLIGENCE
                </button>
              </div>
            </div>

            {/* Preview Tab Content */}
            {activeTab === 'hierarchy' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 bg-[#050705] border border-[#1A261E] clip-cut-tr space-y-2">
                  <div className="flex items-center justify-between text-[#E8F0EA] font-bold">
                    <span className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[#19C37D]" />
                      Deploy ReTask OS Core Platform
                    </span>
                    <span className="px-2 py-0.5 bg-[#2A0E13] text-[#FF4757] border border-[#FF4757]/40">P0 URGENT</span>
                  </div>
                  <p className="text-[11px] text-[#829188]">
                    Architecture setup for Geometric Neo-Skeuomorphism engine, state managers, and data persistence.
                  </p>
                  <div className="pl-6 space-y-1 text-[11px] border-l border-[#1A261E] mt-2">
                    <div className="flex items-center justify-between text-[#19C37D]">
                      <span>✓ Design Geometric UI Primitives</span>
                      <span>100% COMPLETE</span>
                    </div>
                    <div className="flex items-center justify-between text-[#829188]">
                      <span>└─ Implement Tactile Cut Buttons</span>
                      <span>45m EST</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'focus' && (
              <div className="p-8 bg-[#050705] border border-[#1A261E] clip-cut-tr text-center space-y-4">
                <span className="font-mono text-xs text-[#19C37D] uppercase font-bold tracking-widest block">
                  DEEP WORK FOCUS ENGINE
                </span>
                <div className="font-mono text-5xl font-black text-[#E8F0EA] tracking-tighter">
                  {formatTimer(focusSeconds)}
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant={isFocusRunning ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => setIsFocusRunning(!isFocusRunning)}
                  >
                    {isFocusRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isFocusRunning ? 'PAUSE TIMER' : 'START FOCUS'}</span>
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'intelligence' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#050705] border border-[#1A261E] clip-cut-tr space-y-1">
                  <span className="text-[10px] text-[#829188] uppercase block">Completion Velocity</span>
                  <span className="font-bold text-2xl text-[#19C37D]">94.2%</span>
                </div>
                <div className="p-4 bg-[#050705] border border-[#1A261E] clip-cut-tr space-y-1">
                  <span className="text-[10px] text-[#829188] uppercase block">Current Streak</span>
                  <span className="font-bold text-2xl text-[#FFA502] flex items-center gap-1">
                    12 <span className="text-xs text-[#829188]">DAYS</span>
                  </span>
                </div>
                <div className="p-4 bg-[#050705] border border-[#1A261E] clip-cut-tr space-y-1">
                  <span className="text-[10px] text-[#829188] uppercase block">Avoidance Risk</span>
                  <span className="font-bold text-2xl text-[#1E90FF]">LOW (0)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Chapter 01: Why Todo Lists Fail (The Story) */}
      <section id="narrative" className="py-20 border-t border-[#1A261E] bg-[#0B100D]/50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-[#19C37D] font-bold uppercase tracking-widest">
            CHAPTER 01 • THE ARCHITECTURAL PARADIGM
          </span>
          <h2 className="font-mono text-3xl sm:text-4xl font-extrabold text-[#E8F0EA] uppercase">
            WHY CONVENTIONAL TODO LISTS FAIL YOU
          </h2>
          <p className="text-sm sm:text-base text-[#829188]">
            Flat lists collapse under real-world complexity. They treat a 10-minute micro-task the same as a 3-month engineering overhaul, breeding guilt and task avoidance.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Todo Apps */}
          <div className="p-6 bg-[#050705] border border-[#FF4757]/30 clip-cut-tr space-y-4">
            <div className="flex items-center justify-between border-b border-[#FF4757]/20 pb-3">
              <h3 className="font-mono text-sm font-bold text-[#FF4757] uppercase">
                ✕ CONVENTIONAL TODO LISTS
              </h3>
              <span className="text-[10px] font-mono text-[#829188]">FLAT & CHAOTIC</span>
            </div>
            <ul className="space-y-3 font-sans text-xs text-[#829188]">
              <li className="flex items-start gap-2">
                <span className="text-[#FF4757] font-bold">✕</span>
                <span><strong>Linear Overload:</strong> Hundreds of flat tasks mixed together with no hierarchy or context.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4757] font-bold">✕</span>
                <span><strong>Guilt-Driven Rollover:</strong> Red overdue badges that punish you for postponing tasks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4757] font-bold">✕</span>
                <span><strong>Context Switching:</strong> Timer apps separated from your actual task workspace.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF4757] font-bold">✕</span>
                <span><strong>Zero Intelligence:</strong> No detection when you repeatedly avoid or postpone difficult tasks.</span>
              </li>
            </ul>
          </div>

          {/* ReTask OS */}
          <div className="p-6 bg-[#0B100D] border border-[#19C37D] clip-cut-tr space-y-4 shadow-[0_0_20px_rgba(25,195,125,0.1)]">
            <div className="flex items-center justify-between border-b border-[#19C37D]/30 pb-3">
              <h3 className="font-mono text-sm font-bold text-[#19C37D] uppercase">
                ✓ RETASK OPERATING SYSTEM
              </h3>
              <span className="text-[10px] font-mono text-[#19C37D]">INDUSTRIAL PRECISION</span>
            </div>
            <ul className="space-y-3 font-sans text-xs text-[#E8F0EA]">
              <li className="flex items-start gap-2">
                <span className="text-[#19C37D] font-bold">✓</span>
                <span><strong>Infinite Tree Hierarchy:</strong> Nest subtasks infinitely with parent-child metrics & deep collapse logic.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#19C37D] font-bold">✓</span>
                <span><strong>Smart Daily Carry-Forward:</strong> Automated zero-guilt rollover that preserves original schedule history.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#19C37D] font-bold">✓</span>
                <span><strong>Persistent Focus Chamber:</strong> Built-in 25m Focus / 5m Rest Pomodoro timer state across routes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#19C37D] font-bold">✓</span>
                <span><strong>Behavioral Avoidance Detection:</strong> Machine intelligence flags tasks postponed 3+ times with breakdown advice.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Chapter 02: Core Feature Engine Showcase */}
      <section id="intelligence" className="py-20 border-t border-[#1A261E] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-[#19C37D] font-bold uppercase tracking-widest">
            CHAPTER 02 • SYSTEM ENGINES
          </span>
          <h2 className="font-mono text-3xl sm:text-4xl font-extrabold text-[#E8F0EA] uppercase">
            ENGINEERED FOR UNRIVALED EFFICIENCY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="p-6 space-y-4 hover:border-[#19C37D] transition-all">
            <div className="p-3 bg-[#050705] border border-[#19C37D] w-fit clip-cut-tr text-[#19C37D]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-mono text-base font-bold text-[#E8F0EA] uppercase">
              01. DEEP HIERARCHICAL TASK TREES
            </h3>
            <p className="text-xs text-[#829188] leading-relaxed">
              Deconstruct complex goals into manageable sub-operations. Dynamic completion bars automatically calculate percentage progress up the parent chain.
            </p>
          </Card>

          {/* Card 2 */}
          <Card className="p-6 space-y-4 hover:border-[#19C37D] transition-all">
            <div className="p-3 bg-[#050705] border border-[#FFA502] w-fit clip-cut-tr text-[#FFA502]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-mono text-base font-bold text-[#E8F0EA] uppercase">
              02. SMART DAILY ROLLOVER
            </h3>
            <p className="text-xs text-[#829188] leading-relaxed">
              When a day ends, incomplete tasks automatically roll forward to Today while preserving original creation dates and tracking carry-forward velocity.
            </p>
          </Card>

          {/* Card 3 */}
          <Card className="p-6 space-y-4 hover:border-[#19C37D] transition-all">
            <div className="p-3 bg-[#050705] border border-[#1E90FF] w-fit clip-cut-tr text-[#1E90FF]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-mono text-base font-bold text-[#E8F0EA] uppercase">
              03. AVOIDANCE INTELLIGENCE
            </h3>
            <p className="text-xs text-[#829188] leading-relaxed">
              Behavioral task analytics detect tasks carried forward 3+ times, flagging high-risk tasks and suggesting scope adjustments before burnout occurs.
            </p>
          </Card>
        </div>
      </section>

      {/* Chapter 03: Live Interactive Sandbox */}
      <section id="sandbox" className="py-20 border-t border-[#1A261E] bg-[#0B100D] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-[#19C37D] font-bold uppercase tracking-widest">
            CHAPTER 03 • LIVE INTERACTIVE SANDBOX
          </span>
          <h2 className="font-mono text-3xl sm:text-4xl font-extrabold text-[#E8F0EA] uppercase">
            EXPERIENCE RETASK IN REAL TIME
          </h2>
          <p className="text-xs sm:text-sm text-[#829188]">
            Test-drive the task creation and priority engine directly below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-[#050705] border border-[#1A261E] p-6 clip-cut-tr space-y-6">
          {/* Add Task Form inside Sandbox */}
          <form onSubmit={handleAddSandboxTask} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={sandboxTaskTitle}
              onChange={(e) => setSandboxTaskTitle(e.target.value)}
              placeholder="Type a new operation (e.g., Audit System Security)..."
              className="flex-1 px-4 py-2 bg-[#0B100D] border border-[#1A261E] text-xs font-mono text-[#E8F0EA] focus:outline-none focus:border-[#19C37D]"
            />
            <select
              value={sandboxPriority}
              onChange={(e) => setSandboxPriority(e.target.value)}
              className="px-3 py-2 bg-[#0B100D] border border-[#1A261E] text-xs font-mono text-[#E8F0EA] focus:outline-none focus:border-[#19C37D]"
            >
              <option value="urgent">P0 URGENT</option>
              <option value="high">P1 HIGH</option>
              <option value="medium">P2 MEDIUM</option>
              <option value="low">P3 LOW</option>
            </select>
            <Button variant="primary" size="md" type="submit">
              <Plus className="w-4 h-4" />
              <span>ADD TASK</span>
            </Button>
          </form>

          {/* Sandbox Task List */}
          <div className="space-y-2">
            {sandboxTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleSandboxTask(t.id)}
                className={`p-3 border clip-cut-tr cursor-pointer transition-all flex items-center justify-between ${
                  t.completed
                    ? 'bg-[#0B100D]/40 border-[#1A261E] text-[#829188] line-through'
                    : 'bg-[#0B100D] border-[#1A261E] text-[#E8F0EA] hover:border-[#19C37D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-4 h-4 border flex items-center justify-center font-mono text-[10px] ${
                      t.completed ? 'bg-[#19C37D] border-[#19C37D] text-[#050705]' : 'border-[#19C37D]'
                    }`}
                  >
                    {t.completed && '✓'}
                  </span>
                  <span className="font-mono text-xs font-bold">{t.title}</span>
                </div>

                <span
                  className={`font-mono text-[9px] px-2 py-0.5 border ${
                    t.priority === 'urgent'
                      ? 'bg-[#2A0E13] text-[#FF4757] border-[#FF4757]/40'
                      : 'bg-[#0B5D3B]/40 text-[#19C37D] border-[#19C37D]/30'
                  }`}
                >
                  {t.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 04: Dual Infinite Scroll Marquee Streams */}
      <section className="py-16 border-t border-[#1A261E] overflow-hidden space-y-6">
        <div className="text-center">
          <span className="font-mono text-xs text-[#829188] uppercase tracking-widest font-bold">
            PRODUCTIVITY INTELLIGENCE FEED
          </span>
        </div>

        {/* Marquee Row 1 (Forward Infinite Loop) */}
        <div className="flex overflow-hidden relative">
          <div className="flex gap-6 animate-marquee whitespace-nowrap">
            <div className="px-4 py-2 bg-[#0B100D] border border-[#1A261E] clip-cut-tr text-[#19C37D] font-mono text-xs">
              ⚡ "Task tree nesting completely transformed how I break down complex engineering roadmaps."
            </div>
            <div className="px-4 py-2 bg-[#0B100D] border border-[#1A261E] clip-cut-tr text-[#E8F0EA] font-mono text-xs">
              🎯 "Zero fake statistics. Pure behavioral intelligence and honest empty states."
            </div>
            <div className="px-4 py-2 bg-[#0B100D] border border-[#1A261E] clip-cut-tr text-[#FFA502] font-mono text-xs">
              ⏱️ "Persistent Pomodoro focus timers that don't reset when switching routes."
            </div>
            <div className="px-4 py-2 bg-[#0B100D] border border-[#1A261E] clip-cut-tr text-[#1E90FF] font-mono text-xs">
              📊 "GitHub-style 30-day productivity heatmap with historical day inspectors."
            </div>
            {/* Duplicated items for smooth seamless CSS infinite marquee loop */}
            <div className="px-4 py-2 bg-[#0B100D] border border-[#1A261E] clip-cut-tr text-[#19C37D] font-mono text-xs">
              ⚡ "Task tree nesting completely transformed how I break down complex engineering roadmaps."
            </div>
            <div className="px-4 py-2 bg-[#0B100D] border border-[#1A261E] clip-cut-tr text-[#E8F0EA] font-mono text-xs">
              🎯 "Zero fake statistics. Pure behavioral intelligence and honest empty states."
            </div>
            <div className="px-4 py-2 bg-[#0B100D] border border-[#1A261E] clip-cut-tr text-[#FFA502] font-mono text-xs">
              ⏱️ "Persistent Pomodoro focus timers that don't reset when switching routes."
            </div>
            <div className="px-4 py-2 bg-[#0B100D] border border-[#1A261E] clip-cut-tr text-[#1E90FF] font-mono text-xs">
              📊 "GitHub-style 30-day productivity heatmap with historical day inspectors."
            </div>
          </div>
        </div>

        {/* Marquee Row 2 (Reverse Infinite Loop) */}
        <div className="flex overflow-hidden relative">
          <div className="flex gap-6 animate-marquee-reverse whitespace-nowrap">
            <div className="px-4 py-2 bg-[#050705] border border-[#1A261E] clip-cut-tr text-[#829188] font-mono text-xs">
              [SPEC] HTML5 DRAG & DROP WITH CIRCULAR DEPENDENCY BLOCKING
            </div>
            <div className="px-4 py-2 bg-[#050705] border border-[#1A261E] clip-cut-tr text-[#19C37D] font-mono text-xs">
              [SYSTEM] 100% LOCAL STORAGE PERSISTENCE • ZERO CLOUD LATENCY
            </div>
            <div className="px-4 py-2 bg-[#050705] border border-[#1A261E] clip-cut-tr text-[#FFA502] font-mono text-xs">
              [HOTKEYS] GLOBAL SHORTCUT ENGINE (N, E, D, SPACE, ENTER, /, F, ?)
            </div>
            <div className="px-4 py-2 bg-[#050705] border border-[#1A261E] clip-cut-tr text-[#1E90FF] font-mono text-xs">
              [DESIGN] GEOMETRIC NEO-SKEUOMORPHISM VISUAL IDENTITY
            </div>
            {/* Duplicated items for reverse loop */}
            <div className="px-4 py-2 bg-[#050705] border border-[#1A261E] clip-cut-tr text-[#829188] font-mono text-xs">
              [SPEC] HTML5 DRAG & DROP WITH CIRCULAR DEPENDENCY BLOCKING
            </div>
            <div className="px-4 py-2 bg-[#050705] border border-[#1A261E] clip-cut-tr text-[#19C37D] font-mono text-xs">
              [SYSTEM] 100% LOCAL STORAGE PERSISTENCE • ZERO CLOUD LATENCY
            </div>
            <div className="px-4 py-2 bg-[#050705] border border-[#1A261E] clip-cut-tr text-[#FFA502] font-mono text-xs">
              [HOTKEYS] GLOBAL SHORTCUT ENGINE (N, E, D, SPACE, ENTER, /, F, ?)
            </div>
            <div className="px-4 py-2 bg-[#050705] border border-[#1A261E] clip-cut-tr text-[#1E90FF] font-mono text-xs">
              [DESIGN] GEOMETRIC NEO-SKEUOMORPHISM VISUAL IDENTITY
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Chamber */}
      <section className="py-24 border-t border-[#1A261E] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="p-12 bg-gradient-to-b from-[#0B100D] to-[#050705] border border-[#19C37D]/50 clip-cut-tr-lg space-y-6 shadow-[0_0_60px_rgba(25,195,125,0.2)] max-w-4xl mx-auto">
          <img
            src="/logo.png"
            alt="ReTask Logo"
            className="w-16 h-16 rounded border border-[#19C37D]/50 mx-auto clip-cut-tr shadow-[0_0_20px_rgba(25,195,125,0.4)] object-cover"
          />

          <h2 className="font-mono text-3xl sm:text-5xl font-black text-[#E8F0EA] uppercase tracking-tight">
            READY TO UPGRADE YOUR PRODUCTIVITY OPERATING SYSTEM?
          </h2>

          <p className="text-sm sm:text-base text-[#829188] max-w-xl mx-auto font-sans">
            No registration required. 100% client-side privacy. Zero cloud latency.
          </p>

          <div className="pt-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/today')}>
              <Zap className="w-5 h-5" />
              <span>LAUNCH RETASK NOW</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Clean Footer */}
      <footer className="border-t border-[#1A261E] py-8 bg-[#0B100D] text-center font-sans text-xs text-[#829188] space-y-2">
        <div className="flex items-center justify-center gap-2 font-mono text-sm font-bold text-[#E8F0EA]">
          <img src="/logo.png" alt="ReTask" className="w-5 h-5 rounded" />
          <span>ReTask</span>
        </div>
        <p>© 2026 ReTask • Focus • Plan • Achieve. All rights reserved.</p>
      </footer>
    </div>
  );
}
