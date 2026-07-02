// 🔵 FRONTEND: src/components/dashboard/customer/WishlistPreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

const WishlistPreview = () => {
  const items = [
    { id: 1, name: 'Premium Turmeric Powder', price: 99 },
    { id: 2, name: 'Royal Cumin Seeds', price: 75 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-primary-maroon">Wishlist</h3>
        <Link to="/customer/wishlist" className="flex items-center gap-1 text-sm text-secondary-gold hover:text-primary-maroon transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-background-cream rounded-xl">
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-medium text-text-dark text-sm">{item.name}</span>
            </div>
            <p className="font-bold text-primary-maroon text-sm">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPreview;