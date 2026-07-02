// 🔵 FRONTEND: src/components/dashboard/admin/LowStockProducts.jsx
import React from 'react';

const LowStockProducts = () => {
  const products = [
    { name: 'Kitchen King', stock: 5, status: 'Low' },
    { name: 'Kala Masala', stock: 3, status: 'Critical' },
    { name: 'Chicken Masala', stock: 8, status: 'Low' },
  ];

  const getStatusColor = (status) => {
    return status === 'Critical' ? 'text-red-500' : 'text-yellow-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">Low Stock Products</h3>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-background-cream rounded-xl">
            <span className="font-medium text-text-dark text-sm">{product.name}</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${getStatusColor(product.status)}`}>{product.stock}</span>
              <span className={`text-xs ${getStatusColor(product.status)}`}>●</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockProducts;