import React, { useState, useMemo } from 'react';
import { Match, Team } from '../types';
import { SCHEDULE_DATA, PLACEHOLDER_TEAMS } from '../constants';
import { Save, Filter, Clock } from 'lucide-react';

interface MatchListProps {
  matches: Match[];
  teams: Team[];
  onUpdateScore: (matchId: string, scoreA: number, scoreB: number) => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, teams, onUpdateScore }) => {
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  const getTeamName = (id: string) => {
    // Check real teams
    const team = teams.find(t => t.id === id);
    if (team) return team.name;

    // Check placeholders
    if (PLACEHOLDER_TEAMS[id]) return PLACEHOLDER_TEAMS[id];

    return id;
  };

  const rounds = Array.from(new Set(matches.map(m => m.round))).sort((a: number, b: number) => a - b);
  const groups = ['A', 'B', 'C', 'D', 'SF', 'Final'];

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (m.round !== selectedRound) return false;
      if (selectedGroup !== 'ALL' && m.group !== selectedGroup) return false;
      return true;
    });
  }, [matches, selectedRound, selectedGroup]);

  const currentRoundSchedule = useMemo(() => {
    return SCHEDULE_DATA.find(s => s.roundId === selectedRound);
  }, [selectedRound]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-[72px] md:top-24 z-40">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 no-scrollbar">
              <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Ronde:</span>
              {rounds.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRound(r)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedRound === r 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={16} className="text-gray-400" />
              <select 
                value={selectedGroup} 
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              >
                <option value="ALL">Alle Poules</option>
                {groups.map(g => <option key={g} value={g}>Poule {g}</option>)}
              </select>
            </div>
          </div>

          {currentRoundSchedule && (
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
              <Clock size={16} className="text-blue-500" />
              <span className="font-semibold">{currentRoundSchedule.time}</span>
              <span className="text-blue-300">|</span>
              <span className="text-blue-600">{currentRoundSchedule.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredMatches.map(match => (
          <MatchCard 
            key={match.id} 
            match={match} 
            teamAName={getTeamName(match.teamAId)} 
            teamBName={getTeamName(match.teamBId)} 
            onSave={onUpdateScore} 
          />
        ))}
        {filteredMatches.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Geen wedstrijden gevonden voor deze selectie.
          </div>
        )}
      </div>
    </div>
  );
};

interface MatchCardProps {
  match: Match;
  teamAName: string;
  teamBName: string;
  onSave: (id: string, sa: number, sb: number) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, teamAName, teamBName, onSave }) => {
  const [sA, setSA] = useState<string>(match.scoreA?.toString() ?? '');
  const [sB, setSB] = useState<string>(match.scoreB?.toString() ?? '');
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    if (sA !== '' && sB !== '') {
      onSave(match.id, parseInt(sA), parseInt(sB));
      setIsDirty(false);
    }
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, val: string) => {
    setter(val);
    setIsDirty(true);
  }

  const isPlayed = match.isPlayed && !isDirty;

  return (
    <div className={`bg-white rounded-lg border shadow-sm p-4 transition-all ${isPlayed ? 'border-green-200 bg-green-50/10' : 'border-gray-200'}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {match.group === 'SF' ? 'Halve Finale' : match.group === 'Final' ? 'Finale' : `Poule ${match.group}`} • Veld {match.field}
        </span>
        {isPlayed && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Voltooid</span>}
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <p className="font-semibold text-gray-800 leading-tight">{teamAName}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <input 
            type="number" 
            min="0"
            className="w-10 h-10 text-center text-lg font-bold bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            value={sA}
            onChange={(e) => handleChange(setSA, e.target.value)}
          />
          <span className="text-gray-400 font-bold">-</span>
          <input 
            type="number" 
            min="0"
            className="w-10 h-10 text-center text-lg font-bold bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            value={sB}
            onChange={(e) => handleChange(setSB, e.target.value)}
          />
        </div>

        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-800 leading-tight">{teamBName}</p>
        </div>
      </div>

      {isDirty && (
        <button 
          onClick={handleSave}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Save size={16} /> Opslaan
        </button>
      )}
    </div>
  );
};

export default MatchList;