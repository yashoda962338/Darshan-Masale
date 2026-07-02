// 🔵 FRONTEND: src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/dashboard/admin/AdminSidebar';
import AdminHeader from '../components/dashboard/admin/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background-cream">
      <AdminHeader />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-10 ml-0 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;