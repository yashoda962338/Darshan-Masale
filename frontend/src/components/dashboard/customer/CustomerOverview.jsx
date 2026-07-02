// 🔵 FRONTEND: src/components/dashboard/customer/CustomerOverview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, MapPin, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const CustomerOverview = () => {
  const { user } = useAuth();

  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: '12', color: 'bg-blue-500/10 text-blue-500' },
    { icon: Heart, label: 'Wishlist', value: '5', color: 'bg-red-500/10 text-red-500' },
    { icon: MapPin, label: 'Addresses', value: '2', color: 'bg-green-500/10 text-green-500' },
    { icon: User, label: 'Profile', value: '100%', color: 'bg-purple-500/10 text-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-primary-maroon">{stat.value}</p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerOverview;