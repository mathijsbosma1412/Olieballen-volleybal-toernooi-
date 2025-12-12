import React from 'react';
import { Tab } from '../types';
import { Trophy, Calendar, Users, Activity } from 'lucide-react';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: Tab.STANDINGS, label: 'Stand', icon: Trophy },
    { id: Tab.MATCHES, label: 'Wedstrijden', icon: Activity },
    { id: Tab.SCHEDULE, label: 'Schema', icon: Calendar },
    { id: Tab.TEAMS, label: 'Teams', icon: Users },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon size={20} className={isActive ? 'stroke-2' : 'stroke-1'} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Top Nav */}
      <div className="hidden md:flex bg-white shadow-sm sticky top-0 z-50 px-8 py-4 justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <Trophy className="text-orange-600" size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Oliebollen Toernooi</h1>
        </div>
        <div className="flex space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;