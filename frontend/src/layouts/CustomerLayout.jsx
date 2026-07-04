import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CustomerSidebar from "../components/dashboard/customer/CustomerSidebar";
import CustomerHeader from "../components/dashboard/customer/CustomerHeader";

const CustomerLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-cream">

      {/* Header */}
      <CustomerHeader setIsOpen={setIsOpen} />

      <div className="flex pt-16">

        {/* Sidebar */}
        <CustomerSidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 lg:ml-64">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default CustomerLayout;