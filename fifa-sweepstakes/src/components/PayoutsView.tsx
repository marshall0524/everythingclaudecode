import { motion } from 'framer-motion';
import { Trophy, Award, TrendingUp, DollarSign } from 'lucide-react';
import { useSweepstakes } from '../store/sweepstakes';
import { AVATARS } from '../data/avatars';
import type { Match } from '../types';

type Placement = 'winner' | 'runner_up' | 'third' | 'fourth' | 'quarter' | 'last16' | 'group_exit';

interface ParticipantPayout {
  participantName: string;
  teamName: string;
  teamFlag: string;
  avatarEmoji: string;
  placement: Placement;
  placementLabel: string;
  payout: number;
  paid: boolean;
}

function getPlacement(teamId: string, matches: Match[]): Placement {
  const final = matches.find((m) => m.stage === 'final' && m.played);
  if (final) {
    const homeWon = (final.homeScore ?? 0) > (final.awayScore ?? 0);
    const winnerId = homeWon ? final.homeTeamId : final.awayTeamId;
    const loserId = homeWon ? final.awayTeamId : final.homeTeamId;
    if (teamId === winnerId) return 'winner';
    if (teamId === loserId) return 'runner_up';
  }

  const thirdPlace = matches.find((m) => m.stage === 'third_place' && m.played);
  if (thirdPlace) {
    const homeWon = (thirdPlace.homeScore ?? 0) > (thirdPlace.awayScore ?? 0);
    const thirdId = homeWon ? thirdPlace.homeTeamId : thirdPlace.awayTeamId;
    const fourthId = homeWon ? thirdPlace.awayTeamId : thirdPlace.homeTeamId;
    if (teamId === thirdId) return 'third';
    if (teamId === fourthId) return 'fourth';
  }

  const semiFinals = matches.filter((m) => m.stage === 'semi_final' && m.played);
  if (semiFinals.some((m) => m.homeTeamId === teamId || m.awayTeamId === teamId)) return 'quarter';

  const qfs = matches.filter((m) => m.stage === 'quarter_final' && m.played);
  if (qfs.some((m) => m.homeTeamId === teamId || m.awayTeamId === teamId)) return 'last16';

  return 'group_exit';
}

const PLACEMENT_INFO: Record<Placement, { label: string; icon: string; color: string; tier: number }> = {
  winner: { label: '🥇 Champion', icon: '🏆', color: '#ffd700', tier: 1 },
  runner_up: { label: '🥈 Runner-Up', icon: '🥈', color: '#c0c0c0', tier: 2 },
  third: { label: '🥉 3rd Place', icon: '🥉', color: '#cd7f32', tier: 3 },
  fourth: { label: '4th Place', icon: '4️⃣', color: '#a0aec0', tier: 4 },
  quarter: { label: 'Semi-Final', icon: '🎯', color: '#48bb78', tier: 5 },
  last16: { label: 'Quarter-Final', icon: '🎪', color: '#63b3ed', tier: 6 },
  group_exit: { label: 'Group Stage', icon: '⚽', color: '#718096', tier: 7 },
};

export function PayoutsView() {
  const { participants, teams, matches, totalPot, payoutStructure, stakePerPerson } = useSweepstakes();

  function getTeam(id: string | null) {
    return id ? teams.find((t) => t.id === id) : null;
  }
  function getAvatar(id: string | null) {
    return id ? AVATARS.find((a) => a.id === id) : null;
  }

  const playedMatches = matches.filter((m) => m.played);

  const paidTotal = participants.filter((p) => p.paid).length * stakePerPerson;
  const unpaidCount = participants.filter((p) => !p.paid).length;

  const payoutMap: Record<Placement, number> = {
    winner: totalPot * payoutStructure.winner,
    runner_up: totalPot * payoutStructure.runnerUp,
    third: totalPot * payoutStructure.thirdPlace,
    fourth: totalPot * payoutStructure.fourthPlace,
    quarter: totalPot * payoutStructure.quarterFinalist,
    last16: totalPot * payoutStructure.lastSixteen,
    group_exit: 0,
  };

  const rows: ParticipantPayout[] = participants.map((p) => {
    const team = getTeam(p.teamId);
    const avatar = getAvatar(p.avatarId);
    const placement = p.teamId && playedMatches.length > 0
      ? getPlacement(p.teamId, matches)
      : 'group_exit';
    const info = PLACEMENT_INFO[placement];
    return {
      participantName: p.name,
      teamName: team?.name ?? '—',
      teamFlag: team?.flag ?? '🏳️',
      avatarEmoji: avatar?.emoji ?? '⚽',
      placement,
      placementLabel: info.label,
      payout: payoutMap[placement] ?? 0,
      paid: p.paid,
    };
  });

  const sortedRows = [...rows].sort(
    (a, b) => PLACEMENT_INFO[a.placement].tier - PLACEMENT_INFO[b.placement].tier
  );

  const totalDistributed = rows.reduce((sum, r) => sum + r.payout, 0);

  const structure = [
    { label: 'Champion', pct: payoutStructure.winner * 100, amount: totalPot * payoutStructure.winner, icon: '🏆', color: '#ffd700' },
    { label: 'Runner-Up', pct: payoutStructure.runnerUp * 100, amount: totalPot * payoutStructure.runnerUp, icon: '🥈', color: '#c0c0c0' },
    { label: '3rd Place', pct: payoutStructure.thirdPlace * 100, amount: totalPot * payoutStructure.thirdPlace, icon: '🥉', color: '#cd7f32' },
    { label: '4th Place', pct: payoutStructure.fourthPlace * 100, amount: totalPot * payoutStructure.fourthPlace, icon: '4️⃣', color: '#a0aec0' },
    { label: 'Semi-Finalist', pct: payoutStructure.quarterFinalist * 100, amount: totalPot * payoutStructure.quarterFinalist, icon: '🎯', color: '#48bb78' },
    { label: 'QF Exit', pct: payoutStructure.lastSixteen * 100, amount: totalPot * payoutStructure.lastSixteen, icon: '🎪', color: '#63b3ed' },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black mb-1" style={{ color: '#ffd700' }}>💰 Payouts</h2>
        <p className="text-gray-400 mb-6">Prize distribution tracker</p>

        {/* Pot summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Pot', value: `£${totalPot}`, icon: DollarSign, color: '#ffd700' },
            { label: 'Collected', value: `£${paidTotal}`, icon: TrendingUp, color: '#2ecc71' },
            { label: 'Outstanding', value: `£${totalPot - paidTotal}`, icon: Award, color: '#e74c3c' },
            { label: 'Unpaid', value: `${unpaidCount} players`, icon: Trophy, color: '#e67e22' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 border border-white/10"
              style={{ background: `${stat.color}11` }}
            >
              <stat.icon size={18} style={{ color: stat.color }} className="mb-2" />
              <div className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Prize structure */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400" /> Prize Structure
          </h3>
          <div className="space-y-2">
            {structure.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-lg w-6">{s.icon}</span>
                <span className="text-sm text-gray-300 w-28">{s.label}</span>
                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(s.pct / 40) * 100}%`, backgroundColor: s.color }}
                  />
                </div>
                <span className="text-sm font-bold w-10 text-right" style={{ color: s.color }}>{s.pct}%</span>
                <span className="text-sm font-bold text-white w-16 text-right">£{Math.round(s.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Participants table */}
        <div>
          <h3 className="font-bold text-white mb-3">Player Payouts</h3>
          <div className="space-y-2">
            {sortedRows.map((row, i) => {
              const info = PLACEMENT_INFO[row.placement];
              return (
                <motion.div
                  key={row.participantName + i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-xl p-3 border"
                  style={{
                    background: row.payout > 0 ? `${info.color}11` : 'rgba(255,255,255,0.03)',
                    borderColor: row.payout > 0 ? `${info.color}33` : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-2xl">{row.avatarEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{row.participantName}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span>{row.teamFlag}</span>
                      <span className="text-xs text-gray-400 truncate">{row.teamName}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium" style={{ color: info.color }}>
                      {info.icon} {info.label}
                    </div>
                  </div>
                  <div className="text-right">
                    {row.payout > 0 ? (
                      <div className="text-lg font-black text-green-400">+£{Math.round(row.payout)}</div>
                    ) : (
                      <div className="text-sm text-gray-600">—</div>
                    )}
                    <div className={`text-xs ${row.paid ? 'text-green-400' : 'text-red-400'}`}>
                      {row.paid ? '✓ paid in' : '✗ owes £' + stakePerPerson}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {totalDistributed > 0 && (
          <div className="mt-4 text-right text-sm text-gray-400">
            Total distributed: <span className="text-green-400 font-bold">£{Math.round(totalDistributed)}</span>
            {' / '}£{totalPot}
          </div>
        )}

        {participants.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">💰</div>
            <p>Add participants to see payout calculations</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
