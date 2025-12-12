import React from 'react';
import { Standing } from '../types';

interface StandingsTableProps {
  groupName: string;
  standings: Standing[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ groupName, standings }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
        <h2 className="text-white font-bold text-lg">Poule {groupName}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium w-full">Team</th>
              <th className="px-2 py-3 font-medium text-center">G</th>
              <th className="px-2 py-3 font-medium text-center">W</th>
              <th className="px-2 py-3 font-medium text-center">G</th>
              <th className="px-2 py-3 font-medium text-center">V</th>
              <th className="px-2 py-3 font-medium text-center">DS</th>
              <th className="px-4 py-3 font-bold text-center text-blue-700">Ptn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {standings.map((team, index) => (
              <tr key={team.teamId} className={`hover:bg-blue-50/30 transition-colors ${index < 2 ? 'bg-green-50/30' : ''}`}>
                <td className="px-4 py-3 font-medium text-gray-600">{index + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-900 truncate max-w-[150px]">
                  {team.teamName}
                </td>
                <td className="px-2 py-3 text-center text-gray-600">{team.played}</td>
                <td className="px-2 py-3 text-center text-green-600">{team.won}</td>
                <td className="px-2 py-3 text-center text-orange-500">{team.drawn}</td>
                <td className="px-2 py-3 text-center text-red-500">{team.lost}</td>
                <td className="px-2 py-3 text-center text-gray-600 font-mono text-xs">
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                </td>
                <td className="px-4 py-3 text-center font-bold text-lg text-blue-700">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 flex justify-between">
        <span>Veld 1.{groupName === 'A' ? '1' : groupName === 'B' ? '2' : groupName === 'C' ? '3' : '4'}</span>
        <span>W=3, G=1, V=0</span>
      </div>
    </div>
  );
};

export default StandingsTable;