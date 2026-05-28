import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useSweepstakes } from '../store/sweepstakes';
import type { AppView } from '../types';
import { AVATARS } from '../data/avatars';

interface Props {
  onNavigate: (view: AppView) => void;
}

export function AvatarsView({ onNavigate }: Props) {
  const { participants, teams, setAvatar } = useSweepstakes();
  const [currentIdx, setCurrentIdx] = useState(0);

  const current = participants[currentIdx];
  const team = current ? teams.find((t) => t.id === current.teamId) : null;
  const allDone = participants.every((p) => p.avatarId);

  if (participants.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-16">
        <div className="text-5xl mb-3">⚽</div>
        <p className="text-gray-400">Add participants first!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black mb-1" style={{ color: '#ffd700' }}>⭐ Choose Avatars</h2>
        <p className="text-gray-400 mb-6">
          Player {currentIdx + 1} of {participants.length}
        </p>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {participants.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrentIdx(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                i === currentIdx
                  ? 'bg-yellow-500 text-black'
                  : p.avatarId
                  ? 'bg-green-500/30 text-green-300'
                  : 'bg-white/10 text-gray-400'
              }`}
            >
              {p.avatarId ? AVATARS.find((a) => a.id === p.avatarId)?.emoji : '?'}
              {p.name.split(' ')[0]}
              {p.avatarId && <Check size={10} />}
            </button>
          ))}
        </div>

        {/* Current player card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="rounded-2xl border border-white/20 p-6 mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))' }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="text-4xl">{team?.flag ?? '🏳️'}</div>
              <div>
                <div className="text-xl font-black text-white">{current.name}</div>
                <div className="text-yellow-400 font-semibold">{team?.name ?? 'No team assigned'}</div>
              </div>
              {current.avatarId && (
                <div className="ml-auto text-5xl">
                  {AVATARS.find((a) => a.id === current.avatarId)?.emoji}
                </div>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-4 font-medium">Choose your football persona:</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {AVATARS.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  onClick={() => setAvatar(current.id, avatar.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex flex-col items-center gap-1 p-2 rounded-xl cursor-pointer transition-all border ${
                    current.avatarId === avatar.id
                      ? 'border-yellow-400 bg-yellow-400/20'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <span className="text-2xl">{avatar.emoji}</span>
                  <span className="text-xs text-gray-400 leading-tight text-center line-clamp-1">
                    {avatar.name.replace('The ', '')}
                  </span>
                  {current.avatarId === avatar.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-black" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          {currentIdx < participants.length - 1 ? (
            <motion.button
              onClick={() => setCurrentIdx(currentIdx + 1)}
              disabled={!current.avatarId}
              whileHover={{ scale: 1.02 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-black cursor-pointer disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)' }}
            >
              Next Player <ChevronRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              onClick={() => onNavigate('tournament')}
              disabled={!allDone}
              whileHover={{ scale: 1.02 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-black cursor-pointer disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
            >
              View Tournament 🏆 <ChevronRight size={18} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
