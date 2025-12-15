import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import StandingsTable from './components/StandingsTable';
import MatchList from './components/MatchList';
import TeamSettings from './components/TeamSettings';
import ScheduleList from './components/ScheduleList';
import { Tab, Team, Match, Standing } from './types';
import { generateInitialMatches, generateInitialTeams, GROUPS } from './constants';
import { calculateStandings } from './services/logic';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STANDINGS);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Record<string, Standing[]>>({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor Online/Offline Status
  useEffect(() => {
    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // Initialize Data
  useEffect(() => {
    const storedTeams = localStorage.getItem('oliebollen_teams_v4');
    const storedMatches = localStorage.getItem('oliebollen_matches_v4');

    if (storedTeams && storedMatches) {
      try {
        setTeams(JSON.parse(storedTeams));
        setMatches(JSON.parse(storedMatches));
      } catch (error) {
        console.error("Error loading stored data, resetting:", error);
        const initialTeams = generateInitialTeams();
        const initialMatches = generateInitialMatches(initialTeams);
        setTeams(initialTeams);
        setMatches(initialMatches);
      }
    } else {
      const initialTeams = generateInitialTeams();
      const initialMatches = generateInitialMatches(initialTeams);
      setTeams(initialTeams);
      setMatches(initialMatches);
    }
  }, []);

  // Update Standings and Knockout Progression
  useEffect(() => {
    if (teams.length > 0) {
      const calculatedStandings = calculateStandings(teams, matches);
      setStandings(calculatedStandings);
      
      // Update Knockout Matches based on new standings/results
      // We pass matches to avoid stale closure, but we must use the 'matches' from state for reading
      const updatedMatches = updateKnockoutMatches(matches, calculatedStandings);
      
      if (updatedMatches) {
        setMatches(updatedMatches);
      }
    }
  }, [teams, matches]);

  // Persistence
  useEffect(() => {
    if (teams.length > 0) localStorage.setItem('oliebollen_teams_v4', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    if (matches.length > 0) localStorage.setItem('oliebollen_matches_v4', JSON.stringify(matches));
  }, [matches]);

  // Handlers
  const handleUpdateScore = (matchId: string, scoreA: number, scoreB: number) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return { ...m, scoreA, scoreB, isPlayed: true };
      }
      return m;
    }));
  };

  const handleUpdateTeamName = (teamId: string, newName: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, name: newName } : t));
  };

  const handleReset = () => {
    if (window.confirm("WEET JE HET ZEKER?\n\nHiermee verwijder je alle scores en wordt de toernooi-indeling opnieuw gehusseld.\nDit kan niet ongedaan worden gemaakt.")) {
      const newTeams = generateInitialTeams();
      const newMatches = generateInitialMatches(newTeams);
      setTeams(newTeams);
      setMatches(newMatches);
      
      // We don't strictly need to clear localStorage manually here because the 
      // useEffect hooks for persistence will fire immediately after setTeams/setMatches
      // and overwrite the stored data with the new clean data.
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} isOffline={isOffline} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        
        {/* Header Content per Tab */}
        <div className="mb-6">
            {activeTab === Tab.STANDINGS && (
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">Actuele Stand</h2>
                   <p className="text-gray-500">Real-time overzicht per poule.</p>
                </div>
            )}
            {activeTab === Tab.MATCHES && (
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">Wedstrijden</h2>
                   <p className="text-gray-500">Voer uitslagen in of bekijk de planning.</p>
                </div>
            )}
             {activeTab === Tab.SCHEDULE && (
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">Tijdschema</h2>
                   <p className="text-gray-500">Het verloop van de dag.</p>
                </div>
            )}
            {activeTab === Tab.TEAMS && (
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">Team Beheer</h2>
                   <p className="text-gray-500">Wijzig teamnamen of reset het toernooi.</p>
                </div>
            )}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === Tab.STANDINGS && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {GROUPS.map(group => (
                <StandingsTable 
                  key={group} 
                  groupName={group} 
                  standings={standings[group] || []} 
                />
              ))}
            </div>
          )}

          {activeTab === Tab.MATCHES && (
            <MatchList 
              matches={matches} 
              teams={teams} 
              onUpdateScore={handleUpdateScore} 
            />
          )}

          {activeTab === Tab.TEAMS && (
            <TeamSettings 
              teams={teams} 
              onUpdateTeamName={handleUpdateTeamName} 
              onReset={handleReset}
            />
          )}

          {activeTab === Tab.SCHEDULE && (
            <ScheduleList />
          )}
        </div>
      </main>
    </div>
  );
};

// Helper function to update knockout participants
const updateKnockoutMatches = (currentMatches: Match[], currentStandings: Record<string, Standing[]>): Match[] | null => {
    let hasChanges = false;
    const newMatches = [...currentMatches];

    // Helper: Get winner ID or placeholder
    const getWinnerId = (group: string) => {
        const groupStandings = currentStandings[group];
        if (groupStandings && groupStandings.length > 0) {
            return groupStandings[0].teamId;
        }
        return `TBD_${group}`;
    };

    // Helper: Get match winner ID
    const getMatchWinner = (matchId: string, defaultId: string) => {
        const match = newMatches.find(m => m.id === matchId);
        if (match && match.isPlayed && match.scoreA !== null && match.scoreB !== null) {
            if (match.scoreA > match.scoreB) return match.teamAId;
            if (match.scoreB > match.scoreA) return match.teamBId;
            return match.teamAId; // In case of draw, take A (should be sudden death ideally)
        }
        return defaultId;
    };

    // 1. Update SF1 (A vs B)
    const winnerA = getWinnerId('A');
    const winnerB = getWinnerId('B');
    const sf1Index = newMatches.findIndex(m => m.id === 'sf-1');
    if (sf1Index !== -1) {
        const match = newMatches[sf1Index];
        if (match.teamAId !== winnerA || match.teamBId !== winnerB) {
            newMatches[sf1Index] = { ...match, teamAId: winnerA, teamBId: winnerB };
            hasChanges = true;
        }
    }

    // 2. Update SF2 (C vs D)
    const winnerC = getWinnerId('C');
    const winnerD = getWinnerId('D');
    const sf2Index = newMatches.findIndex(m => m.id === 'sf-2');
    if (sf2Index !== -1) {
        const match = newMatches[sf2Index];
        if (match.teamAId !== winnerC || match.teamBId !== winnerD) {
            newMatches[sf2Index] = { ...match, teamAId: winnerC, teamBId: winnerD };
            hasChanges = true;
        }
    }

    // 3. Update Final (Winner SF1 vs Winner SF2)
    const winnerSF1 = getMatchWinner('sf-1', 'TBD_SF1');
    const winnerSF2 = getMatchWinner('sf-2', 'TBD_SF2');
    const finalIndex = newMatches.findIndex(m => m.id === 'final');
    if (finalIndex !== -1) {
        const match = newMatches[finalIndex];
        if (match.teamAId !== winnerSF1 || match.teamBId !== winnerSF2) {
            newMatches[finalIndex] = { ...match, teamAId: winnerSF1, teamBId: winnerSF2 };
            hasChanges = true;
        }
    }

    return hasChanges ? newMatches : null;
};

export default App;