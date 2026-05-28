import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, RefreshCw, ChevronRight } from 'lucide-react';
import { useSweepstakes } from '../store/sweepstakes';
import type { AppView } from '../types';
import { Confetti } from './Confetti';

interface Props {
  onNavigate: (view: AppView) => void;
}

export function DrawView({ onNavigate }: Props) {
  const { participants, teams, drawCompleted, performDraw, resetDraw } = useSweepstakes();
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  async function handleDraw() {
    if (participants.length === 0) return;
    setIsDrawing(true);
    setRevealedCount(0);

    await new Promise((r) => setTimeout(r, 600));
    performDraw();

    for (let i = 0; i <= participants.length; i++) {
      await new Promise((r) => setTimeout(r, 180));
      setRevealedCount(i);
    }

    setIsDrawing(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }

  function handleReset() {
    resetDraw();
    setRevealedCount(0);
    setShowConfetti(false);
  }

  const getTeam = (teamId: string | null) =>
    teamId ? teams.find((t) => t.id === teamId) : null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Confetti active={showConfetti} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black mb-1" style={{ color: '#ffd700' }}>🎲 Team Draw</h2>
        <p className="text-gray-400 mb-6">
          Equal chance for everyone — {teams.length} teams, {participants.length} players
        </p>

        {participants.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">👥</div>
            <p>Add players first before doing the draw</p>
          </div>
        )}

        {participants.length > 0 && !drawCompleted && (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">🎰</div>
            <p className="text-gray-300 mb-8 text-lg">
              Ready to assign {participants.length} team{participants.length > 1 ? 's' : ''} randomly!
            </p>
            <motion.button
              onClick={handleDraw}
              disabled={isDrawing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 rounded-2xl font-black text-2xl text-black flex items-center gap-3 mx-auto cursor-pointer disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)' }}
            >
              {isDrawing ? (
                <><RefreshCw size={26} className="animate-spin" /> Drawing...</>
              ) : (
                <><Shuffle size={26} /> DRAW TEAMS</>
              )}
            </motion.button>
          </div>
        )}

        {drawCompleted && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <AnimatePresence>
                {participants.slice(0, revealedCount).map((p, i) => {
                  const team = getTeam(p.teamId);
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="relative overflow-hidden rounded-2xl border border-white/20 p-4 flex items-center gap-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                      }}
                    >
                      <div className="text-4xl">{team?.flag ?? '🏳️'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-white truncate">{p.name}</div>
                        <div className="text-yellow-400 font-bold text-sm">{team?.name ?? '—'}</div>
                        <div className="text-xs text-gray-500">{team?.confederation}</div>
                      </div>
                      <div
                        className="absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl"
                        style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700' }}
                      >
                        #{i + 1}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all cursor-pointer"
              >
                <RefreshCw size={16} /> Redraw
              </button>
              {revealedCount >= participants.length && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onNavigate('avatars')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-black cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)' }}
                >
                  Pick Avatars <ChevronRight size={18} />
                </motion.button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
