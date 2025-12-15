import React, { useState } from 'react';
import { Team } from '../types';
import { Edit2, Check, Users, AlertTriangle, RotateCcw } from 'lucide-react';

interface TeamSettingsProps {
  teams: Team[];
  onUpdateTeamName: (id: string, name: string) => void;
  onReset: () => void;
}

const TeamSettings: React.FC<TeamSettingsProps> = ({ teams, onUpdateTeamName, onReset }) => {
  return (
    <div className="space-y-8">
      
      {/* Team Names Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-full text-purple-600">
              <Users size={24} />
          </div>
          <div>
              <h2 className="text-lg font-bold text-gray-900">Team Namen</h2>
              <p className="text-sm text-gray-500">Pas hier de namen van de deelnemende teams aan.</p>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {['A', 'B', 'C', 'D'].map(group => (
            <div key={group} className="p-4">
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">Poule {group}</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.filter(t => t.group === group).map(team => (
                    <TeamInput key={team.id} team={team} onSave={onUpdateTeamName} />
                  ))}
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone / Reset Section */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
             <div className="bg-red-50 p-3 rounded-full text-red-500 shrink-0">
                <AlertTriangle size={24} />
             </div>
             <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Toernooi Resetten</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Hiermee worden alle uitslagen gewist en worden de teams opnieuw willekeurig ingedeeld over de poules. 
                  <span className="font-semibold text-red-600 block mt-1">Let op: Dit kan niet ongedaan worden gemaakt!</span>
                </p>
             </div>
             <button 
                onClick={onReset}
                className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
             >
                <RotateCcw size={18} />
                <span>Reset Data</span>
             </button>
          </div>
        </div>
      </div>

    </div>
  );
};

interface TeamInputProps {
  team: Team;
  onSave: (id: string, name: string) => void;
}

const TeamInput: React.FC<TeamInputProps> = ({ team, onSave }) => {
  const [name, setName] = useState(team.name);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(team.id, name);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
        <input 
          autoFocus
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-white border border-blue-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSave}
          className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Check size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group transition-colors">
      <span className="text-sm font-medium text-gray-700 ml-2">{team.name}</span>
      <button 
        onClick={() => setIsEditing(true)}
        className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
      >
        <Edit2 size={14} />
      </button>
    </div>
  );
};

export default TeamSettings;