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
      return saved ? JSON.parse(saved) : false; // default 12-hour
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
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update real-time clock according to 12h / 24h preference
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
    '/': 'TODAY OPERATIONAL DASHBOARD',
    '/today': 'TODAY OPERATIONAL DASHBOARD',
    '/tasks': 'TASK ARCHITECTURE WORKSPACE',
    '/completed': 'COMPLETED TASKS ARCHIVE',
    '/overdue': 'OVERDUE TASK AUDIT',
    '/lists': 'CATEGORICAL LIST MANAGER',
    '/focus': 'FOCUS MODE ENGINE',
    '/analytics': 'PRODUCTIVITY ANALYTICS',
    '/settings': 'SYSTEM CONFIGURATION',
  };

  const currentTitle = routeTitles[location.pathname] || 'TASK WORKSPACE';

  // Count search results
  const matchingCount = searchQuery
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).length
    : 0;

  return (
    <header className="h-16 border-b border-[#1A261E] bg-[#0B100D] px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle mobile menu"
          className="p-2 text-[#829188] hover:text-[#E8F0EA] hover:bg-[#101712] border border-[#1A261E] clip-cut-tr md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#19C37D]" />
            <h1 className="font-mono text-xs md:text-sm font-bold uppercase tracking-wider text-[#E8F0EA]">
              {currentTitle}
            </h1>
          </div>
          <p className="text-[10px] font-mono text-[#829188] hidden sm:block">
            Active Session • Local Scope
          </p>
        </div>
      </div>

      {/* Right: Search, 12H/24H Clock & Quick Add Button */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#829188]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks... (Ctrl+K)"
            className="w-full bg-[#050705] border border-[#1A261E] pl-9 pr-8 py-1.5 text-xs font-mono text-[#E8F0EA] placeholder-[#4B5850] focus:outline-none focus:border-[#19C37D] clip-cut-tr transition-all"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#829188] hover:text-[#E8F0EA]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#4B5850] border border-[#1A261E] px-1 pointer-events-none">
              /
            </span>
          )}

          {searchQuery && (
            <div className="absolute right-0 top-full mt-1 bg-[#050705] border border-[#19C37D] text-[#19C37D] font-mono text-[10px] px-2 py-0.5 clip-cut-tr shadow-lg z-40">
              {matchingCount} matches
            </div>
          )}
        </div>

        {/* 12-Hour vs 24-Hour Clock Toggle Control */}
        <div className="hidden sm:flex items-center bg-[#050705] border border-[#1A261E] clip-cut-tr text-[#19C37D] font-mono text-xs overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-1">
            <Clock className="w-3.5 h-3.5 text-[#0B5D3B]" />
            <span className="font-bold min-w-[70px] text-center">{timeStr || '00:00:00'}</span>
          </div>
          <button
            type="button"
            onClick={toggleClockFormat}
            title={`Switch to ${is24Hour ? '12-Hour (AM/PM)' : '24-Hour'} format`}
            aria-label={`Switch clock format to ${is24Hour ? '12-hour' : '24-hour'}`}
            className="px-2 py-1 bg-[#101712] border-l border-[#1A261E] text-[10px] text-[#829188] hover:text-[#19C37D] hover:bg-[#152019] transition-all cursor-pointer font-bold uppercase"
          >
            {is24Hour ? '24H' : '12H'}
          </button>
        </div>

        {/* Add Task Button */}
        <Button variant="primary" size="md" onClick={() => openAddModal()}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>
    </header>
  );
}
