import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Plus, Clock, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useTaskContext } from '../../store/TaskContext';

export function Header({ onMenuClick }) {
  const location = useLocation();
  const { searchQuery, setSearchQuery, openAddModal, tasks } = useTaskContext();
  const [timeStr, setTimeStr] = useState('');
  
  // 12-Hour vs 24-Hour Clock Toggle State (persisted in LocalStorage)
  const [is24Hour, setIs24Hour] = useState(() => {
    try {
      const saved = localStorage.getItem('retask_clock_format');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  const searchInputRef = useRef(null);

  const toggleClockFormat = () => {
    const nextMode = !is24Hour;
    setIs24Hour(nextMode);
    try {
      localStorage.setItem('retask_clock_format', JSON.stringify(nextMode));
    } catch (e) {
      // ignore
    }
  };

  // Global Keyboard Shortcut: Ctrl+K or '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && e.key === 'k') ||
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')
      ) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: !is24Hour,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [is24Hour]);

  const routeTitles = {
    '/': 'Today',
    '/today': 'Today',
    '/tasks': 'Tasks',
    '/completed': 'Archive',
    '/overdue': 'Overdue',
    '/lists': 'Lists',
    '/focus': 'Deep Focus',
    '/analytics': 'Analytics',
    '/settings': 'Settings',
  };

  const currentTitle = routeTitles[location.pathname] || 'Workspace';

  const matchingCount = searchQuery
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).length
    : 0;

  return (
    <header className="h-16 border-b border-white/[0.07] bg-[#0F1216]/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle mobile menu"
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h1 className="text-sm md:text-base font-semibold text-white tracking-normal font-sans">
              {currentTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Search, Clock & Add Task */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks... (⌘K)"
            className="w-full bg-[#161B22] border border-white/10 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 border border-white/10 rounded px-1 pointer-events-none">
              /
            </span>
          )}

          {searchQuery && (
            <div className="absolute right-0 top-full mt-1 bg-[#161B22] border border-emerald-500/40 text-emerald-400 text-xs px-2.5 py-1 rounded-md shadow-lg z-40">
              {matchingCount} matches
            </div>
          )}
        </div>

        {/* Clock Toggle Control */}
        <div className="hidden sm:flex items-center bg-[#161B22] border border-white/10 rounded-lg text-zinc-300 text-xs overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-xs text-zinc-200 min-w-[65px] text-center">{timeStr || '00:00:00'}</span>
          </div>
          <button
            type="button"
            onClick={toggleClockFormat}
            title={`Switch to ${is24Hour ? '12-hour' : '24-hour'} format`}
            aria-label={`Switch clock format to ${is24Hour ? '12-hour' : '24-hour'}`}
            className="px-2 py-1.5 bg-white/5 border-l border-white/10 text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors font-medium"
          >
            {is24Hour ? '24H' : '12H'}
          </button>
        </div>

        {/* Add Task Button */}
        <Button variant="primary" size="md" onClick={() => openAddModal()}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">New Task</span>
        </Button>
      </div>
    </header>
  );
}
