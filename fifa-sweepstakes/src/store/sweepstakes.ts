import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SweepstakesState, Participant, Match } from '../types';
import { TEAMS } from '../data/teams';

const DEFAULT_PAYOUT = {
  winner: 0.40,
  runnerUp: 0.20,
  thirdPlace: 0.10,
  fourthPlace: 0.05,
  quarterFinalist: 0.0125,
  lastSixteen: 0.00625,
  groupStage: 0,
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export const useSweepstakes = create<SweepstakesState>()(
  persist(
    (set, get) => ({
      participants: [],
      teams: TEAMS,
      matches: [],
      totalPot: 0,
      stakePerPerson: 10,
      payoutStructure: DEFAULT_PAYOUT,
      drawCompleted: false,
      tournamentStarted: false,

      addParticipant: (name: string) => {
        const { stakePerPerson } = get();
        const newParticipant: Participant = {
          id: generateId(),
          name,
          teamId: null,
          avatarId: null,
          paid: false,
          stake: stakePerPerson,
        };
        set((s) => ({
          participants: [...s.participants, newParticipant],
          totalPot: s.totalPot + stakePerPerson,
        }));
      },

      removeParticipant: (id: string) => {
        const { stakePerPerson } = get();
        set((s) => ({
          participants: s.participants.filter((p) => p.id !== id),
          totalPot: Math.max(0, s.totalPot - stakePerPerson),
        }));
      },

      updateParticipant: (id: string, updates: Partial<Participant>) => {
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      setStake: (amount: number) => {
        const { participants } = get();
        set({
          stakePerPerson: amount,
          totalPot: participants.length * amount,
          participants: participants.map((p) => ({ ...p, stake: amount })),
        });
      },

      performDraw: () => {
        const { participants, teams } = get();
        if (participants.length === 0) return;

        const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
        const assigned = participants.map((p, i) => ({
          ...p,
          teamId: shuffledTeams[i % shuffledTeams.length].id,
        }));

        set({ participants: assigned, drawCompleted: true });
      },

      setAvatar: (participantId: string, avatarId: string) => {
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId ? { ...p, avatarId } : p
          ),
        }));
      },

      updateMatch: (matchId: string, homeScore: number, awayScore: number) => {
        set((s) => ({
          matches: s.matches.map((m) =>
            m.id === matchId
              ? { ...m, homeScore, awayScore, played: true }
              : m
          ),
        }));
      },

      addMatch: (match: Omit<Match, 'id'>) => {
        const newMatch: Match = { ...match, id: generateId() };
        set((s) => ({ matches: [...s.matches, newMatch] }));
      },

      togglePaid: (participantId: string) => {
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId ? { ...p, paid: !p.paid } : p
          ),
        }));
      },

      resetDraw: () => {
        set((s) => ({
          participants: s.participants.map((p) => ({ ...p, teamId: null })),
          drawCompleted: false,
          matches: [],
          tournamentStarted: false,
        }));
      },
    }),
    { name: 'fifa-sweepstakes-v1' }
  )
);
