import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserNavbar from './UserNavbar';

export default function DashboardLayout() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col w-full">
      <UserNavbar />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative scroll-smooth bg-background-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
