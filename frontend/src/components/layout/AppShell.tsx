import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { NotificationContainer } from '../NotificationToast';

export const AppShell: React.FC = () => {
  return (
    <div className="flex bg-surface min-h-screen text-on-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <TopHeader />
        <main className="flex-1 pb-12">
          <Outlet />
        </main>
      </div>
      <NotificationContainer />
    </div>
  );
};
