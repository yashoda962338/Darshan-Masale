// 🔵 FRONTEND: src/components/dashboard/admin/DashboardCards.jsx
import React from 'react';
import { TrendingUp, ShoppingBag, Users, Package, ArrowUp, ArrowDown } from 'lucide-react';

const DashboardCards = () => {
  const cards = [
    { 
      label: 'Today\'s Sales', 
      value: '₹12,450', 
      change: '+12.5%', 
      icon: TrendingUp, 
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      label: 'Total Orders', 
      value: '156', 
      change: '+8.2%', 
      icon: ShoppingBag, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Customers', 
      value: '1,234', 
      change: '+5.1%', 
      icon: Users, 
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Products', 
      value: '342', 
      change: '+2.3%', 
      icon: Package, 
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change.startsWith('+');
        return (
          <div key={index} className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {card.change}
                {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              </span>
            </div>
            <p className="text-2xl font-heading font-bold text-primary-maroon">{card.value}</p>
            <p className="text-sm text-text-muted">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;