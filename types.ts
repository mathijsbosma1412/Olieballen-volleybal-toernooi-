export interface Team {
  id: string;
  name: string;
  group: string; // "A", "B", "C", or "D"
}

export interface Match {
  id: string;
  round: number;
  group: string;
  teamAId: string;
  teamBId: string;
  scoreA: number | null;
  scoreB: number | null;
  isPlayed: boolean;
  field: string;
  time?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  location: string;
  description?: string;
  type: 'match' | 'break' | 'event';
  roundId?: number;
}

export interface Standing {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export enum Tab {
  STANDINGS = 'stand',
  MATCHES = 'wedstrijden',
  TEAMS = 'teams',
  SCHEDULE = 'schema'
}