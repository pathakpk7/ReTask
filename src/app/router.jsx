import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../features/sidebar/Sidebar';
import { Header } from '../components/common/Header';
import { TaskDetailPanel } from '../features/tasks/TaskDetailPanel';
import { AddTaskModal } from '../features/tasks/AddTaskModal';
import { EditTaskModal } from '../features/tasks/EditTaskModal';
import { DeleteTaskModal } from '../features/tasks/DeleteTaskModal';
import { ListManagerModal } from '../features/lists/ListManagerModal';
import { ContextMenu } from '../components/common/ContextMenu';
import { BulkActionToolbar } from '../components/common/BulkActionToolbar';
import { ShortcutsHelpModal } from '../components/common/ShortcutsHelpModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { TodayPage } from '../pages/TodayPage';
import { TasksPage } from '../pages/TasksPage';
import { CompletedPage } from '../pages/CompletedPage';
import { OverduePage } from '../pages/OverduePage';
import { ListsPage } from '../pages/ListsPage';
import { FocusPage } from '../pages/FocusPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Activate Phase 3 Keyboard Shortcuts Hook
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen bg-[#050705] text-[#E8F0EA] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content Area + Contextual Task Detail Panel */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          <main className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar relative">
            <Routes>
              <Route path="/today" element={<TodayPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/completed" element={<CompletedPage />} />
              <Route path="/overdue" element={<OverduePage />} />
              <Route path="/lists" element={<ListsPage />} />
              <Route path="/focus" element={<FocusPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/today" replace />} />
            </Routes>
          </main>

          {/* Task Detail Panel */}
          <TaskDetailPanel />
        </div>
      </div>

      {/* Global Context Menus & Toolbars */}
      <ContextMenu />
      <BulkActionToolbar />

      {/* Global Modals */}
      <AddTaskModal />
      <EditTaskModal />
      <DeleteTaskModal />
      <ListManagerModal />
      <ShortcutsHelpModal />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
