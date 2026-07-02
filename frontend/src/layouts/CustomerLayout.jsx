// 🔵 FRONTEND: src/layouts/CustomerLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../components/dashboard/customer/CustomerSidebar';
import CustomerHeader from '../components/dashboard/customer/CustomerHeader';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-background-cream">
      <CustomerHeader />
      <div className="flex pt-16">
        <CustomerSidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-10 ml-0 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;