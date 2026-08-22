import React from 'react';
import { TaskProvider } from './store/TaskContext';
import { AppRouter } from './app/router';

export default function App() {
  return (
    <TaskProvider>
      <AppRouter />
    </TaskProvider>
  );
}
