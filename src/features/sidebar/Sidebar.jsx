import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  Folder,
  Zap,
  BarChart3,
  Settings,
  Plus,
  Terminal,
  X,
  List,
  Edit2,
} from 'lucide-react';
import { NavItem } from './NavItem';
import { Button } from '../../components/ui/Button';
import { useTaskContext } from '../../store/TaskContext';
import { isToday, isOverdue } from '../../utils/dateUtils';

export function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { tasks, lists, openAddModal, openListModal, activeListId, setActiveList } = useTaskContext();

  const todayCount = tasks.filter((t) => !t.completed && isToday(t.dueDate)).length;
  const overdueCount = tasks.filter((t) => !t.completed && isOverdue(t.dueDate, t.completed)).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const allActiveCount = tasks.filter((t) => !t.completed).length;

  const handleCategorySelect = (listId) => {
    setActiveList(listId);
    navigate('/tasks');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#050705]/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B100D] border-r border-[#1A261E] flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#1A261E] bg-[#101712]">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="ReTask Logo"
              className="w-8 h-8 rounded border border-[#19C37D]/50 clip-cut-tr shadow-[0_0_10px_rgba(25,195,125,0.4)] object-cover"
            />
            <div>
              <div className="font-mono text-sm font-extrabold tracking-widest text-[#E8F0EA] flex items-center gap-1.5">
                RETASK <span className="text-[10px] px-1 bg-[#0B5D3B] text-[#19C37D] border border-[#19C37D]/50">OS</span>
              </div>
              <p className="text-[9px] font-mono text-[#829188] uppercase tracking-tighter">
                FOCUS • PLAN • ACHIEVE
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1 text-[#829188] hover:text-[#E8F0EA] md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 border-b border-[#1A261E]">
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              openAddModal();
              if (onClose) onClose();
            }}
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </Button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {/* System Views */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-mono text-[#829188] uppercase tracking-widest mb-2 font-bold">
              System Views
            </p>
            <NavItem
              to="/landing"
              icon={Terminal}
              label="Overview Story"
              onClick={onClose}
            />
            <NavItem
              to="/today"
              icon={Calendar}
              label="Today"
              badgeCount={todayCount > 0 ? todayCount : undefined}
              onClick={onClose}
            />
            <NavItem
              to="/tasks"
              icon={CheckSquare}
              label="Task Hierarchy"
              badgeCount={allActiveCount}
              onClick={onClose}
            />
            <NavItem
              to="/overdue"
              icon={AlertTriangle}
              label="Overdue Ops"
              badgeCount={overdueCount > 0 ? overdueCount : undefined}
              badgeVariant={overdueCount > 0 ? 'urgent' : 'muted'}
              onClick={onClose}
            />
            <NavItem
              to="/completed"
              icon={CheckCircle2}
              label="Archive"
              badgeCount={completedCount}
              badgeVariant="muted"
              onClick={onClose}
            />
          </div>

          {/* Focus & Metrics */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-mono text-[#829188] uppercase tracking-widest mb-2 font-bold">
              Focus & Metrics
            </p>
            <NavItem to="/focus" icon={Zap} label="Focus Mode" onClick={onClose} />
            <NavItem to="/analytics" icon={BarChart3} label="Analytics" onClick={onClose} />
            <NavItem to="/lists" icon={Folder} label="Lists Manager" onClick={onClose} />
          </div>

          {/* Custom Lists Filter */}
          <div className="space-y-1 pt-2 border-t border-[#1A261E]">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-mono text-[#829188] uppercase tracking-widest font-bold">
                Lists
              </p>
              <button
                type="button"
                onClick={() => openListModal()}
                title="Create New List"
                aria-label="Create list"
                className="p-0.5 text-[#829188] hover:text-[#19C37D] focus:outline-none focus:text-[#19C37D]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              aria-label="Filter by All Categories"
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-all clip-cut-tr cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#19C37D] ${
                activeListId === 'all'
                  ? 'bg-[#101712] text-[#19C37D] font-bold border-l-2 border-[#19C37D] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                  : 'text-[#829188] hover:text-[#E8F0EA] hover:bg-[#101712]/60'
              }`}
            >
              <span className="flex items-center gap-2">
                <List className="w-3.5 h-3.5" /> All Categories
              </span>
              <span className="text-[10px]">{tasks.length}</span>
            </button>

            {lists.map((list) => {
              const listTaskCount = tasks.filter((t) => t.listId === list.id).length;
              return (
                <div key={list.id} className="group/item flex items-center">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(list.id)}
                    aria-label={`Filter by ${list.name}`}
                    className={`flex-1 flex items-center justify-between px-3 py-2 text-xs font-mono transition-all clip-cut-tr cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#19C37D] ${
                      activeListId === list.id
                        ? 'bg-[#101712] text-[#19C37D] font-bold border-l-2 border-[#19C37D] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-[#829188] hover:text-[#E8F0EA] hover:bg-[#101712]/60'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate pr-1">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: list.color }}
                      />
                      <span className="truncate">{list.name}</span>
                    </span>
                    <span className="text-[10px] opacity-70 flex-shrink-0">{listTaskCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openListModal(list);
                    }}
                    title={`Edit ${list.name}`}
                    aria-label={`Edit ${list.name}`}
                    className="p-1 opacity-0 group-hover/item:opacity-100 text-[#829188] hover:text-[#19C37D] focus:opacity-100"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1A261E] bg-[#101712] space-y-2">
          <NavItem to="/settings" icon={Settings} label="System Config" onClick={onClose} />
          <div className="px-3 pt-1 flex items-center justify-between text-[10px] font-mono text-[#829188]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19C37D] animate-ping" />
              ONLINE
            </span>
            <span>STORAGE: LOCAL</span>
          </div>
        </div>
      </aside>
    </>
  );
}
