import { Match, Standing, Team } from "../types";

export const calculateStandings = (teams: Team[], matches: Match[]): Record<string, Standing[]> => {
  // Initialize standings map
  const standingsMap: Record<string, Standing> = {};

  teams.forEach(team => {
    standingsMap[team.id] = {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    };
  });

  // Process matches - ONLY Group matches (A, B, C, D)
  matches.forEach(match => {
    // Skip if not a group match or not played
    if (!['A', 'B', 'C', 'D'].includes(match.group)) return;
    if (!match.isPlayed || match.scoreA === null || match.scoreB === null) return;

    const statsA = standingsMap[match.teamAId];
    const statsB = standingsMap[match.teamBId];

    if (!statsA || !statsB) return; // Safety check

    statsA.played += 1;
    statsB.played += 1;

    statsA.goalsFor += match.scoreA;
    statsA.goalsAgainst += match.scoreB;
    statsA.goalDifference = statsA.goalsFor - statsA.goalsAgainst;

    statsB.goalsFor += match.scoreB;
    statsB.goalsAgainst += match.scoreA;
    statsB.goalDifference = statsB.goalsFor - statsB.goalsAgainst;

    if (match.scoreA > match.scoreB) {
      statsA.won += 1;
      statsA.points += 3;
      statsB.lost += 1;
    } else if (match.scoreB > match.scoreA) {
      statsB.won += 1;
      statsB.points += 3;
      statsA.lost += 1;
    } else {
      statsA.drawn += 1;
      statsA.points += 1;
      statsB.drawn += 1;
      statsB.points += 1;
    }
  });

  // Group by Poule and Sort
  const groupedStandings: Record<string, Standing[]> = {
    A: [], B: [], C: [], D: []
  };

  Object.values(standingsMap).forEach(standing => {
    const team = teams.find(t => t.id === standing.teamId);
    if (team && groupedStandings[team.group]) {
      groupedStandings[team.group].push(standing);
    }
  });

  // Sort each group: Points -> Goal Diff -> Goals For
  Object.keys(groupedStandings).forEach(group => {
    groupedStandings[group].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  });

  return groupedStandings;
};