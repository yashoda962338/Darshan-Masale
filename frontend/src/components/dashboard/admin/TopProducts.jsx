// 🔵 FRONTEND: src/components/dashboard/admin/TopProducts.jsx
import React from 'react';

const TopProducts = () => {
  const products = [
    { name: 'Turmeric Powder', sales: 145, revenue: 14355 },
    { name: 'Garam Masala', sales: 89, revenue: 14151 },
    { name: 'Cumin Seeds', sales: 76, revenue: 5700 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">Top Products</h3>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-background-cream rounded-xl">
            <div>
              <p className="font-medium text-text-dark text-sm">{product.name}</p>
              <p className="text-xs text-text-muted">{product.sales} sales</p>
            </div>
            <p className="font-bold text-primary-maroon">₹{product.revenue}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;