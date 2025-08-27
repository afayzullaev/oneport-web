import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';
import {
  Search,
  Package,
  Plus,
  Truck as TruckIcon,
} from 'lucide-react';

const MobileBottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocalization();

  const navigationItems = [
    {
      icon: Search,
      label: t.header.findCars,
      route: '/trucks',
      hoverColor: 'hover:text-blue-600',
      activeColor: 'text-blue-600',
      activeBg: 'bg-blue-50',
    },
    {
      icon: Package,
      label: t.header.findCargos,
      route: '/orders',
      hoverColor: 'hover:text-blue-600',
      activeColor: 'text-blue-600',
      activeBg: 'bg-blue-50',
    },
    {
      icon: Plus,
      label: t.header.postCar,
      route: '/post-truck',
      hoverColor: 'hover:text-green-600',
      activeColor: 'text-green-600',
      activeBg: 'bg-green-50',
    },
    {
      icon: TruckIcon,
      label: t.header.postCargo,
      route: '/post-cargo',
      hoverColor: 'hover:text-green-600',
      activeColor: 'text-green-600',
      activeBg: 'bg-green-50',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:hidden z-[9999]">
      <div className="flex justify-around items-center max-w-screen-sm mx-auto px-4 py-3">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.route;
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 flex-1 min-w-0 ${
                isActive
                  ? `${item.activeColor} ${item.activeBg} shadow-sm`
                  : `text-gray-600 ${item.hoverColor}`
              }`}
            >
              <IconComponent 
                size={20} 
                className={isActive ? 'drop-shadow-sm' : ''}
              />
              <span className={`text-xs text-center font-medium ${
                isActive ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;