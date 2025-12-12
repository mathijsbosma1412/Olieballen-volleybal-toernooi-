import { ScheduleItem, Team, Match } from './types';

export const GROUPS = ['A', 'B', 'C', 'D'];
export const FIELDS = ['1.1', '1.2', '1.3', '1.4'];

export const PLACEHOLDER_TEAMS: Record<string, string> = {
  'TBD_A': '1e Poule A',
  'TBD_B': '1e Poule B',
  'TBD_C': '1e Poule C',
  'TBD_D': '1e Poule D',
  'TBD_SF1': 'Winnaar HF 1',
  'TBD_SF2': 'Winnaar HF 2'
};

export const SCHEDULE_DATA: ScheduleItem[] = [
  { time: "8:15-8:30", title: "Inloop + omkleden", location: "Sportzaal 1.1-1.4", type: "break" },
  { time: "8:30-8:40", title: "Opening evenement", location: "Centraal", description: "Door Mathijs", type: "event" },
  { time: "8:40-8:52", title: "Ronde 1", location: "Alle velden", type: "match", roundId: 1 },
  { time: "8:53-9:05", title: "Ronde 2", location: "Alle velden", type: "match", roundId: 2 },
  { time: "9:06-9:17", title: "Ronde 3", location: "Alle velden", type: "match", roundId: 3 },
  { time: "9:18-9:30", title: "Ronde 4", location: "Alle velden", type: "match", roundId: 4 },
  { time: "9:31-9:43", title: "Ronde 5", location: "Alle velden", type: "match", roundId: 5 },
  { time: "9:44-9:56", title: "Ronde 6", location: "Alle velden", type: "match", roundId: 6 },
  { time: "9:57-10:09", title: "Ronde 7", location: "Alle velden", type: "match", roundId: 7 },
  { time: "10:10-10:22", title: "Ronde 8", location: "Alle velden", type: "match", roundId: 8 },
  { time: "10:23-10:35", title: "Ronde 9", location: "Alle velden", type: "match", roundId: 9 },
  { time: "10:36-10:48", title: "Ronde 10", location: "Alle velden", type: "match", roundId: 10 },
  { time: "10:49-11:01", title: "Halve finale", location: "Kruisfinales", type: "match", roundId: 11 },
  { time: "11:02-11:14", title: "Finale", location: "Centraal", type: "match", roundId: 12 },
  { time: "11:15-11:30", title: "Afsluiting + prijsuitreiking", location: "Centraal", type: "event" },
  { time: "11:10-11:30", title: "Omkleden", location: "Kleedkamers", type: "break" },
];

// Fisher-Yates shuffle helper
const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Generate teams based on specific list and constraints
export const generateInitialTeams = (): Team[] => {
  // Raw list of teams provided
  const rawTeams = [
    'sb1a1', 'sb1a2', 'sb1a3', 'sb1a4', // 4th char 'a'
    'sb1b1', 'sb1b2', 'sb1b3',          // 4th char 'b'
    'sb1c1', 'sb1c2', 'sb1c3',          // 4th char 'c'
    'sb1d1', 'sb1d2', 'sb1d3', 'sb1d4', // 4th char 'd'
    'sb1e1', 'sb1e2', 'sb1e3',          // 4th char 'e'
    'sb1f1', 'sb1f2', 'sb1f3'           // 4th char 'f' (assumed 'f' based on list provided, prompt said 'g' but list has 'f')
  ];

  // Group teams by their 4th character (the constraint identifier)
  const buckets: Record<string, string[]> = {};
  rawTeams.forEach(t => {
    const key = t.charAt(3); // 0-based index 3 is the 4th char
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(t);
  });

  // Shuffle each bucket to ensure random assignment within constraints
  Object.keys(buckets).forEach(key => {
    buckets[key] = shuffle(buckets[key]);
  });

  // Prepare groups
  const groups: Record<string, string[]> = {
    'A': [], 'B': [], 'C': [], 'D': []
  };

  // Distribution strategy to ensure no bucket has >1 team in a group
  // We distribute buckets one by one into A, B, C, D in a rotating fashion
  
  // Strategy:
  // Bucket 'a' (4 items) -> A, B, C, D
  // Bucket 'd' (4 items) -> A, B, C, D
  // Bucket 'b' (3 items) -> A, B, C
  // Bucket 'c' (3 items) -> D, A, B (rotate start)
  // Bucket 'e' (3 items) -> C, D, A (rotate start)
  // Bucket 'f' (3 items) -> B, C, D (rotate start)
  
  // Helper to push to group if available
  const addToGroup = (groupName: string, team: string) => {
    groups[groupName].push(team);
  };

  // Execute Distribution
  // Note: We use the shuffled buckets
  
  // 4 items
  if (buckets['a']) {
     addToGroup('A', buckets['a'][0]);
     addToGroup('B', buckets['a'][1]);
     addToGroup('C', buckets['a'][2]);
     addToGroup('D', buckets['a'][3]);
  }
  if (buckets['d']) {
     addToGroup('A', buckets['d'][0]);
     addToGroup('B', buckets['d'][1]);
     addToGroup('C', buckets['d'][2]);
     addToGroup('D', buckets['d'][3]);
  }

  // 3 items
  if (buckets['b']) {
     addToGroup('A', buckets['b'][0]);
     addToGroup('B', buckets['b'][1]);
     addToGroup('C', buckets['b'][2]);
  }
  
  if (buckets['c']) {
     addToGroup('D', buckets['c'][0]);
     addToGroup('A', buckets['c'][1]);
     addToGroup('B', buckets['c'][2]);
  }

  if (buckets['e']) {
     addToGroup('C', buckets['e'][0]);
     addToGroup('D', buckets['e'][1]);
     addToGroup('A', buckets['e'][2]);
  }

  if (buckets['f']) { // Using 'f' based on input list
     addToGroup('B', buckets['f'][0]);
     addToGroup('C', buckets['f'][1]);
     addToGroup('D', buckets['f'][2]);
  }

  // Convert to Team objects
  const finalTeams: Team[] = [];
  ['A', 'B', 'C', 'D'].forEach(g => {
    groups[g].forEach(teamId => {
      finalTeams.push({
        id: teamId,
        name: teamId.toUpperCase(), // Display as uppercase
        group: g
      });
    });
  });

  return finalTeams;
};

// Generate a Single Round Robin schedule for 5 teams per group
// Spread over 10 rounds to allow 1 match per group per round (4 fields total)
export const generateInitialMatches = (teams: Team[]): Match[] => {
  const matches: Match[] = [];
  
  // Single Round Robin pairings for 5 teams (0-4)
  // Total 10 matches needed.
  // We sequence them to run 1 match per round for 10 rounds.
  const matchSequence = [
    [0, 1], // Round 1
    [2, 3], // Round 2
    [4, 0], // Round 3
    [1, 2], // Round 4
    [3, 4], // Round 5
    [0, 2], // Round 6
    [1, 3], // Round 7
    [2, 4], // Round 8
    [0, 3], // Round 9
    [1, 4]  // Round 10
  ];

  // 1. Generate Group Matches
  GROUPS.forEach((group, groupIdx) => {
    const groupTeams = teams.filter(t => t.group === group);
    // Ensure we have exactly 5 teams, otherwise logic might break
    if (groupTeams.length !== 5) {
        console.warn(`Group ${group} has ${groupTeams.length} teams instead of 5. Schedule might be incomplete.`);
    }

    const field = FIELDS[groupIdx];

    matchSequence.forEach((pair, roundIdx) => {
        // Safety check if we have enough teams
        if (groupTeams[pair[0]] && groupTeams[pair[1]]) {
            const roundNum = roundIdx + 1;
            const teamA = groupTeams[pair[0]];
            const teamB = groupTeams[pair[1]];
            
            matches.push({
                id: `m-${group}-${roundNum}`,
                round: roundNum,
                group: group,
                teamAId: teamA.id,
                teamBId: teamB.id,
                scoreA: null,
                scoreB: null,
                isPlayed: false,
                field: field,
            });
        }
    });
  });

  // 2. Generate Semi Finals (Round 11)
  // SF1: Winner A vs Winner B
  matches.push({
    id: 'sf-1',
    round: 11,
    group: 'SF',
    teamAId: 'TBD_A',
    teamBId: 'TBD_B',
    scoreA: null,
    scoreB: null,
    isPlayed: false,
    field: '1.2'
  });

  // SF2: Winner C vs Winner D
  matches.push({
    id: 'sf-2',
    round: 11,
    group: 'SF',
    teamAId: 'TBD_C',
    teamBId: 'TBD_D',
    scoreA: null,
    scoreB: null,
    isPlayed: false,
    field: '1.3'
  });

  // 3. Generate Final (Round 12)
  // Winner SF1 vs Winner SF2
  matches.push({
    id: 'final',
    round: 12,
    group: 'Final',
    teamAId: 'TBD_SF1',
    teamBId: 'TBD_SF2',
    scoreA: null,
    scoreB: null,
    isPlayed: false,
    field: 'Centraal'
  });

  return matches;
};