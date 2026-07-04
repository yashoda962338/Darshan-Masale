import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';

import AdminSidebar from '../components/dashboard/admin/AdminSidebar';
import AdminHeader from '../components/dashboard/admin/AdminHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-cream">

      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex pt-16">

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl lg:hidden">

              <div className="flex items-center justify-between p-4 border-b">

                <h2 className="font-heading text-xl font-bold text-primary-maroon">
                  Admin Panel
                </h2>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>

              </div>

              <AdminSidebar mobile onClose={() => setSidebarOpen(false)} />

            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;