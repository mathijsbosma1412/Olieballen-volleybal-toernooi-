import React from 'react';
import { Tab } from '../types';
import { Trophy, Calendar, Users, Activity, WifiOff, Save } from 'lucide-react';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isOffline: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isOffline }) => {
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
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">Oliebollen Toernooi</h1>
            <div className="flex items-center gap-1.5 text-xs font-medium mt-0.5">
                {isOffline ? (
                    <>
                        <WifiOff size={12} className="text-orange-500" />
                        <span className="text-orange-600">Offline • Lokaal opgeslagen</span>
                    </>
                ) : (
                    <>
                        <Save size={12} className="text-green-600" />
                        <span className="text-green-600">Automatisch opgeslagen</span>
                    </>
                )}
            </div>
          </div>
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
      
      {/* Mobile Top Status Bar */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-1.5 rounded-full">
                <Trophy className="text-orange-600" size={16} />
            </div>
            <span className="font-bold text-gray-800">Oliebollen Toernooi</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium">
            {isOffline ? (
                <WifiOff size={14} className="text-orange-500" />
            ) : (
                <Save size={14} className="text-green-500" />
            )}
        </div>
      </div>
    </>
  );
};

export default Navigation;