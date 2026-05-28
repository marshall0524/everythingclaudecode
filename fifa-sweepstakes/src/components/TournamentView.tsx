import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import { useSweepstakes } from '../store/sweepstakes';
import type { AppView, Participant } from '../types';
import { AVATARS } from '../data/avatars';

interface Props {
  onNavigate: (view: AppView) => void;
}

function getStageLabel(stage: string) {
  switch (stage) {
    case 'final': return '🏆 Final';
    case 'semi_final': return '🥈 Semi-Final';
    case 'quarter_final': return '🥉 Quarter-Final';
    case 'round_of_16': return 'Round of 16';
    case 'round_of_32': return 'Round of 32';
    default: return 'Group Stage';
  }
}

export function TournamentView({ onNavigate }: Props) {
  const { participants, teams, matches, totalPot, payoutStructure } = useSweepstakes();

  function getTeam(teamId: string | null) {
    return teamId ? teams.find((t) => t.id === teamId) : null;
  }

  function getAvatar(avatarId: string | null) {
    return avatarId ? AVATARS.find((a) => a.id === avatarId) : null;
  }

  function getParticipantsByTeam(teamId: string): Participant[] {
    return participants.filter((p) => p.teamId === teamId);
  }

  const playedMatches = matches.filter((m) => m.played);

  const winnerTeamId = (() => {
    const final = matches.find((m) => m.stage === 'final' && m.played);
    if (!final) return null;
    if ((final.homeScore ?? 0) > (final.awayScore ?? 0)) return final.homeTeamId;
    if ((final.awayScore ?? 0) > (final.homeScore ?? 0)) return final.awayTeamId;
    return null;
  })();

  const winnerParticipants = winnerTeamId ? getParticipantsByTeam(winnerTeamId) : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black mb-1" style={{ color: '#ffd700' }}>🏆 Tournament</h2>
        <p className="text-gray-400 mb-6">Live standings & results</p>

        {/* Winner banner */}
        {winnerParticipants.length > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-6 mb-6 text-center"
            style={{ background: 'linear-gradient(135deg, #ffd70033, #ff8c0022)', border: '2px solid #ffd700' }}
          >
            <div className="text-6xl mb-2 trophy-pulse inline-block">🏆</div>
            <h3 className="text-2xl font-black text-yellow-400 mb-1">WORLD CHAMPIONS!</h3>
            <div className="text-4xl mb-2">{getTeam(winnerTeamId)?.flag}</div>
            <div className="text-xl font-bold text-white">{getTeam(winnerTeamId)?.name}</div>
            <div className="flex justify-center gap-3 mt-3 flex-wrap">
              {winnerParticipants.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-yellow-400/20 rounded-full px-4 py-2">
                  <span className="text-xl">{getAvatar(p.avatarId)?.emoji ?? '⚽'}</span>
                  <span className="font-bold text-yellow-300">{p.name}</span>
                  <span className="text-green-400 font-black">+£{Math.round(totalPot * payoutStructure.winner)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Participants grid */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
            <Medal size={18} /> All Participants
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {participants.map((p, i) => {
              const team = getTeam(p.teamId);
              const avatar = getAvatar(p.avatarId);
              const isWinner = winnerTeamId === p.teamId;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-xl p-4 border ${isWinner ? 'border-yellow-400' : 'border-white/10'}`}
                  style={{
                    background: isWinner
                      ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.08))'
                      : 'rgba(255,255,255,0.04)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ background: avatar ? `${avatar.color}33` : 'rgba(255,255,255,0.1)' }}
                    >
                      {avatar?.emoji ?? '⚽'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{p.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-lg">{team?.flag ?? '🏳️'}</span>
                        <span className="text-yellow-400 text-sm font-medium truncate">{team?.name}</span>
                      </div>
                    </div>
                    {isWinner && <div className="text-2xl">🏆</div>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent results */}
        {playedMatches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
              <Trophy size={18} /> Recent Results
            </h3>
            <div className="space-y-2">
              {playedMatches.slice(-6).reverse().map((m) => {
                const home = getTeam(m.homeTeamId);
                const away = getTeam(m.awayTeamId);
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10"
                  >
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-white font-medium text-sm truncate">{home?.name}</span>
                      <span className="text-xl">{home?.flag}</span>
                    </div>
                    <div className="bg-white/10 rounded-lg px-3 py-1 text-center min-w-[60px]">
                      <div className="font-black text-white text-lg leading-none">
                        {m.homeScore} - {m.awayScore}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{getStageLabel(m.stage)}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{away?.flag}</span>
                      <span className="text-white font-medium text-sm truncate">{away?.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <motion.button
            onClick={() => onNavigate('results')}
            className="flex-1 py-3 rounded-xl font-bold text-black cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)' }}
            whileHover={{ scale: 1.02 }}
          >
            ⚽ Enter Results
          </motion.button>
          <motion.button
            onClick={() => onNavigate('payouts')}
            className="flex-1 py-3 rounded-xl font-bold cursor-pointer border border-green-500/50 text-green-400 hover:bg-green-500/10"
            whileHover={{ scale: 1.02 }}
          >
            💰 View Payouts
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
