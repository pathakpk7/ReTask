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
  Compass,
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B0E12] border-r border-white/[0.07] flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.07]">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <img
              src="/logo.png"
              alt="ReTask Logo"
              className="w-8 h-8 rounded-lg object-cover transition-transform group-hover:scale-105"
            />
            <div>
              <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                ReTask
              </div>
              <p className="text-[11px] text-zinc-500 font-normal">
                Focus & Workflow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1 text-zinc-400 hover:text-white rounded-md md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3 border-b border-white/[0.07]">
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
          {/* Main Views */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Views
            </p>
            <NavItem
              to="/landing"
              icon={Compass}
              label="Product Tour"
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
              label="All Tasks"
              badgeCount={allActiveCount}
              onClick={onClose}
            />
            <NavItem
              to="/overdue"
              icon={AlertTriangle}
              label="Overdue"
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

          {/* Deep Focus & Insights */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Focus & Insights
            </p>
            <NavItem to="/focus" icon={Zap} label="Deep Focus" onClick={onClose} />
            <NavItem to="/analytics" icon={BarChart3} label="Productivity Analytics" onClick={onClose} />
            <NavItem to="/lists" icon={Folder} label="Manage Lists" onClick={onClose} />
          </div>

          {/* Custom Lists Filter */}
          <div className="space-y-1 pt-3 border-t border-white/[0.07]">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                Lists
              </p>
              <button
                type="button"
                onClick={() => openListModal()}
                title="Create New List"
                aria-label="Create list"
                className="p-1 text-zinc-400 hover:text-emerald-400 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              aria-label="Filter by All Lists"
              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeListId === 'all'
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <List className="w-3.5 h-3.5" /> All Lists
              </span>
              <span className="text-[11px] font-mono opacity-80">{tasks.length}</span>
            </button>

            {lists.map((list) => {
              const listTaskCount = tasks.filter((t) => t.listId === list.id).length;
              return (
                <div key={list.id} className="group/item flex items-center">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(list.id)}
                    aria-label={`Filter by ${list.name}`}
                    className={`flex-1 flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      activeListId === list.id
                        ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate pr-1">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: list.color }}
                      />
                      <span className="truncate">{list.name}</span>
                    </span>
                    <span className="text-[11px] font-mono opacity-80 flex-shrink-0">{listTaskCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openListModal(list);
                    }}
                    title={`Edit ${list.name}`}
                    aria-label={`Edit ${list.name}`}
                    className="p-1 opacity-0 group-hover/item:opacity-100 text-zinc-400 hover:text-white rounded"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.07] space-y-1">
          <NavItem to="/settings" icon={Settings} label="Settings" onClick={onClose} />
        </div>
      </aside>
    </>
  );
}
