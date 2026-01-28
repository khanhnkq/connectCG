import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
        <Outlet />
      </main>
    </div>
  );
}
