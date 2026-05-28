import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';
import { useSweepstakes } from '../store/sweepstakes';
import type { AppView, Match, MatchStage } from '../types';
import { Confetti } from './Confetti';

interface Props {
  onNavigate: (view: AppView) => void;
}

const STAGES: { value: MatchStage; label: string }[] = [
  { value: 'group', label: 'Group Stage' },
  { value: 'round_of_32', label: 'Round of 32' },
  { value: 'round_of_16', label: 'Round of 16' },
  { value: 'quarter_final', label: 'Quarter-Final' },
  { value: 'semi_final', label: 'Semi-Final' },
  { value: 'third_place', label: '3rd Place' },
  { value: 'final', label: 'FINAL 🏆' },
];

interface ScoreEntry {
  matchId: string;
  homeScore: string;
  awayScore: string;
}

export function ResultsView({ onNavigate: _onNavigate }: Props) {
  const { teams, matches, updateMatch, addMatch } = useSweepstakes();
  const [scoreEntries, setScoreEntries] = useState<Record<string, ScoreEntry>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMatch, setNewMatch] = useState({
    homeTeamId: '',
    awayTeamId: '',
    stage: 'group' as MatchStage,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  function getTeam(id: string) {
    return teams.find((t) => t.id === id);
  }

  function handleScoreChange(matchId: string, field: 'homeScore' | 'awayScore', value: string) {
    setScoreEntries((prev) => ({
      ...prev,
      [matchId]: { ...{ matchId, homeScore: '', awayScore: '' }, ...prev[matchId], [field]: value },
    }));
  }

  function handleSubmitScore(match: Match) {
    const entry = scoreEntries[match.id];
    const home = parseInt(entry?.homeScore ?? '');
    const away = parseInt(entry?.awayScore ?? '');
    if (isNaN(home) || isNaN(away)) return;
    updateMatch(match.id, home, away);
    setScoreEntries((prev) => { const n = { ...prev }; delete n[match.id]; return n; });
    if (match.stage === 'final') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }

  function handleAddMatch() {
    if (!newMatch.homeTeamId || !newMatch.awayTeamId || newMatch.homeTeamId === newMatch.awayTeamId) return;
    addMatch({
      homeTeamId: newMatch.homeTeamId,
      awayTeamId: newMatch.awayTeamId,
      stage: newMatch.stage,
      homeScore: null,
      awayScore: null,
      played: false,
    });
    setNewMatch({ homeTeamId: '', awayTeamId: '', stage: 'group' });
    setShowAddForm(false);
  }

  const pendingMatches = matches.filter((m) => !m.played);
  const completedMatches = matches.filter((m) => m.played);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Confetti active={showConfetti} />
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-3xl font-black" style={{ color: '#ffd700' }}>⚽ Match Results</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium"
            style={{ background: showAddForm ? 'rgba(255,255,255,0.1)' : 'rgba(255,215,0,0.2)', color: '#ffd700' }}
          >
            {showAddForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Match</>}
          </button>
        </div>
        <p className="text-gray-400 mb-6">Enter scores to update standings</p>

        {/* Add match form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white/5 border border-white/20 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-4">Add New Match</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Home Team</label>
                    <select
                      value={newMatch.homeTeamId}
                      onChange={(e) => setNewMatch((p) => ({ ...p, homeTeamId: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="" className="bg-gray-900">Select team...</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id} className="bg-gray-900">
                          {t.flag} {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Away Team</label>
                    <select
                      value={newMatch.awayTeamId}
                      onChange={(e) => setNewMatch((p) => ({ ...p, awayTeamId: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="" className="bg-gray-900">Select team...</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id} className="bg-gray-900">
                          {t.flag} {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Stage</label>
                    <select
                      value={newMatch.stage}
                      onChange={(e) => setNewMatch((p) => ({ ...p, stage: e.target.value as MatchStage }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {STAGES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-gray-900">{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddMatch}
                  disabled={!newMatch.homeTeamId || !newMatch.awayTeamId || newMatch.homeTeamId === newMatch.awayTeamId}
                  className="px-5 py-2.5 rounded-xl font-bold text-black cursor-pointer disabled:opacity-40 text-sm"
                  style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)' }}
                >
                  + Add Match
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pending matches */}
        {pendingMatches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Pending Results ({pendingMatches.length})
            </h3>
            <div className="space-y-2">
              {pendingMatches.map((match) => {
                const home = getTeam(match.homeTeamId);
                const away = getTeam(match.awayTeamId);
                const entry = scoreEntries[match.id];
                const stageLabel = STAGES.find((s) => s.value === match.stage)?.label ?? match.stage;
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium">
                        {stageLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-white font-medium text-sm hidden sm:block truncate">{home?.name}</span>
                        <span className="text-2xl">{home?.flag ?? '🏳️'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          placeholder="0"
                          value={entry?.homeScore ?? ''}
                          onChange={(e) => handleScoreChange(match.id, 'homeScore', e.target.value)}
                          className="w-12 text-center bg-white/10 border border-white/20 rounded-lg py-2 text-white font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                        />
                        <span className="text-gray-500 font-bold">-</span>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          placeholder="0"
                          value={entry?.awayScore ?? ''}
                          onChange={(e) => handleScoreChange(match.id, 'awayScore', e.target.value)}
                          className="w-12 text-center bg-white/10 border border-white/20 rounded-lg py-2 text-white font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                        />
                        <button
                          onClick={() => handleSubmitScore(match)}
                          disabled={!entry?.homeScore || !entry?.awayScore}
                          className="ml-1 w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center cursor-pointer disabled:opacity-30 hover:bg-green-400 transition-colors"
                        >
                          <Check size={16} className="text-white" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-2xl">{away?.flag ?? '🏳️'}</span>
                        <span className="text-white font-medium text-sm hidden sm:block truncate">{away?.name}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed */}
        {completedMatches.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Completed ({completedMatches.length})
            </h3>
            <div className="space-y-2">
              {completedMatches.slice().reverse().map((match) => {
                const home = getTeam(match.homeTeamId);
                const away = getTeam(match.awayTeamId);
                const homeWon = (match.homeScore ?? 0) > (match.awayScore ?? 0);
                const awayWon = (match.awayScore ?? 0) > (match.homeScore ?? 0);
                const stageLabel = STAGES.find((s) => s.value === match.stage)?.label ?? match.stage;
                return (
                  <div
                    key={match.id}
                    className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl p-3 opacity-70"
                  >
                    <div className={`flex items-center gap-2 flex-1 justify-end ${homeWon ? 'opacity-100' : 'opacity-50'}`}>
                      <span className="text-white text-sm truncate hidden sm:block">{home?.name}</span>
                      <span className="text-xl">{home?.flag ?? '🏳️'}</span>
                    </div>
                    <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center min-w-[70px]">
                      <div className="font-black text-white">
                        {match.homeScore} - {match.awayScore}
                      </div>
                      <div className="text-xs text-gray-500">{stageLabel}</div>
                    </div>
                    <div className={`flex items-center gap-2 flex-1 ${awayWon ? 'opacity-100' : 'opacity-50'}`}>
                      <span className="text-xl">{away?.flag ?? '🏳️'}</span>
                      <span className="text-white text-sm truncate hidden sm:block">{away?.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {matches.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">📋</div>
            <p>No matches yet. Click "Add Match" to get started!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
