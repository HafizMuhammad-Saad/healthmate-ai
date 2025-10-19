import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import FloatingAIChat from '../../pages/Insights/FloatingAiChat';

const DashboardLayout = () => {
    return (
       <div className="min-h-screen flex flex-col bg-gray-50">
  {/* ✅ Fixed Navbar */}
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
    <Navbar />
  </header>

  {/* ✅ Main Layout */}
  <div className="flex flex-1 pt-16">
    {/* Sidebar */}
    <aside className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-gray-200 overflow-y-scroll overflow-x-hidden">
      <Sidebar />
    </aside>

    {/* Main Content */}
    <main className="flex-1 lg:ml-72 py-8 px-6 lg:px-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <Outlet />
      </div>
    </main>
  </div>
        <FloatingAIChat />

</div>


    );
};

export default DashboardLayout
