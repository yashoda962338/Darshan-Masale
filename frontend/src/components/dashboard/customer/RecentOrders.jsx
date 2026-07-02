// 🔵 FRONTEND: src/components/dashboard/customer/RecentOrders.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RecentOrders = () => {
  const orders = [
    { id: 'ORD-001', date: '2024-01-15', total: 450, status: 'Delivered' },
    { id: 'ORD-002', date: '2024-01-10', total: 280, status: 'Processing' },
    { id: 'ORD-003', date: '2024-01-05', total: 150, status: 'Shipped' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-primary-maroon">Recent Orders</h3>
        <Link to="/customer/orders" className="flex items-center gap-1 text-sm text-secondary-gold hover:text-primary-maroon transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-background-cream rounded-xl">
            <div>
              <p className="font-medium text-text-dark text-sm">{order.id}</p>
              <p className="text-xs text-text-muted">{order.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-primary-maroon">₹{order.total}</p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-button font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;