import React from 'react';
import { SCHEDULE_DATA } from '../constants';
import { Clock, MapPin, PlayCircle, Info } from 'lucide-react';

const ScheduleList: React.FC = () => {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {SCHEDULE_DATA.map((item, index) => {
        let Icon = Info;
        let colorClass = "bg-gray-100 text-gray-600";
        
        if (item.type === 'match') {
          Icon = PlayCircle;
          colorClass = "bg-blue-100 text-blue-600";
        } else if (item.type === 'event') {
          Icon = Info;
          colorClass = "bg-orange-100 text-orange-600";
        } else {
            Icon = Clock;
            colorClass = "bg-slate-200 text-slate-600";
        }

        return (
          <div key={index} className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className={`w-20 md:w-24 flex-shrink-0 flex flex-col items-center justify-center p-2 text-xs md:text-sm font-bold border-r border-gray-100 ${item.type === 'break' ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700'}`}>
              <span className="text-center">{item.time.split('-')[0]}</span>
              <span className="text-gray-300 transform rotate-90 my-1">-</span>
              <span className="text-center">{item.time.split('-')[1]}</span>
            </div>
            
            <div className={`flex-1 p-4 flex items-center justify-between ${item.type === 'break' ? 'bg-gray-50/50' : ''}`}>
              <div className="flex items-start gap-4">
                 <div className={`p-2 rounded-full flex-shrink-0 ${colorClass}`}>
                    <Icon size={20} />
                 </div>
                 <div>
                    <h3 className={`font-semibold ${item.type === 'break' ? 'text-gray-500 italic' : 'text-gray-900'}`}>{item.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                        <MapPin size={12} />
                        <span>{item.location}</span>
                    </div>
                    {item.description && (
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    )}
                 </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleList;