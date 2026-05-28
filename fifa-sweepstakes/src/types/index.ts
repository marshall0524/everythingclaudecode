export interface Team {
  id: string;
  name: string;
  flag: string;
  group?: string;
  confederation: string;
}

export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  color: string;
}

export interface Participant {
  id: string;
  name: string;
  teamId: string | null;
  avatarId: string | null;
  paid: boolean;
  stake: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  stage: MatchStage;
  group?: string;
  matchDate?: string;
  played: boolean;
}

export type MatchStage =
  | 'group'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'third_place'
  | 'final';

export type AppView =
  | 'home'
  | 'participants'
  | 'draw'
  | 'avatars'
  | 'tournament'
  | 'results'
  | 'payouts';

export interface PayoutStructure {
  winner: number;
  runnerUp: number;
  thirdPlace: number;
  fourthPlace: number;
  quarterFinalist: number;
  lastSixteen: number;
  groupStage: number;
}

export interface SweepstakesState {
  participants: Participant[];
  teams: Team[];
  matches: Match[];
  totalPot: number;
  stakePerPerson: number;
  payoutStructure: PayoutStructure;
  drawCompleted: boolean;
  tournamentStarted: boolean;

  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  setStake: (amount: number) => void;
  performDraw: () => void;
  setAvatar: (participantId: string, avatarId: string) => void;
  updateMatch: (matchId: string, homeScore: number, awayScore: number) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  togglePaid: (participantId: string) => void;
  resetDraw: () => void;
}
