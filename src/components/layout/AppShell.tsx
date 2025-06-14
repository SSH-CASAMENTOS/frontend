import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom';

export const AppShell: React.FC = () => {
  const { isNavOpen } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className={cn(
            'flex-1 overflow-auto transition-all duration-300 ease-in-out p-4 md:p-6',
            isNavOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-16'
          )}
        >
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
