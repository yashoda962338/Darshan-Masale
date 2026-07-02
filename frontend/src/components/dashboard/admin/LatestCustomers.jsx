// 🔵 FRONTEND: src/components/dashboard/admin/LatestCustomers.jsx
import React from 'react';

const LatestCustomers = () => {
  const customers = [
    { name: 'Priya Sharma', email: 'priya@example.com', date: 'Today' },
    { name: 'Mahesh Patil', email: 'mahesh@example.com', date: 'Yesterday' },
    { name: 'Sneha Joshi', email: 'sneha@example.com', date: '2 days ago' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">Latest Customers</h3>
      <div className="space-y-3">
        {customers.map((customer, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-background-cream rounded-xl">
            <div>
              <p className="font-medium text-text-dark text-sm">{customer.name}</p>
              <p className="text-xs text-text-muted">{customer.email}</p>
            </div>
            <span className="text-xs text-text-muted">{customer.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestCustomers;