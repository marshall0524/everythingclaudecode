import { motion } from 'framer-motion';
import { Users, Shuffle, Star, TrendingUp, DollarSign } from 'lucide-react';
import type { AppView } from '../types';
import { useSweepstakes } from '../store/sweepstakes';

interface Props {
  onNavigate: (view: AppView) => void;
}

const steps = [
  { icon: Users, label: 'Add Players', desc: 'Enter all participants', view: 'participants' as AppView, color: '#3498db' },
  { icon: Shuffle, label: 'Draw Teams', desc: 'Equal chance for all', view: 'draw' as AppView, color: '#9b59b6' },
  { icon: Star, label: 'Pick Avatar', desc: 'Choose your football persona', view: 'avatars' as AppView, color: '#f39c12' },
  { icon: TrendingUp, label: 'Track Results', desc: 'Live match updates', view: 'results' as AppView, color: '#2ecc71' },
  { icon: DollarSign, label: 'Payouts', desc: 'Track the prize money', view: 'payouts' as AppView, color: '#e74c3c' },
];

export function HomeView({ onNavigate }: Props) {
  const { participants, drawCompleted, totalPot, stakePerPerson } = useSweepstakes();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10 mt-4"
      >
        <div className="text-8xl mb-4 trophy-pulse inline-block">🏆</div>
        <h1
          className="text-5xl md:text-7xl font-black mb-2 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #ffd700, #ff8c00, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Impact, Arial Black, sans-serif',
            textShadow: 'none',
          }}
        >
          FIFA 2026
        </h1>
        <h2
          className="text-2xl md:text-4xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #ffffff, #a0c4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          WORLD CUP SWEEPSTAKES
        </h2>
        <p className="text-gray-400 text-lg">The ultimate football sweepstakes experience</p>
      </motion.div>

      {/* Stats bar */}
      {participants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-6 mb-8 flex-wrap justify-center"
        >
          {[
            { label: 'Players', value: participants.length, emoji: '👥' },
            { label: 'Prize Pot', value: `£${totalPot}`, emoji: '💰' },
            { label: 'Stake Each', value: `£${stakePerPerson}`, emoji: '🎯' },
            { label: 'Draw', value: drawCompleted ? 'Done ✅' : 'Pending', emoji: '🎲' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center"
            >
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-5xl mb-8">
        {steps.map((step, i) => (
          <motion.button
            key={step.view}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onNavigate(step.view)}
            className="card-hover relative overflow-hidden rounded-2xl p-5 text-left cursor-pointer border border-white/10"
            style={{ background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${step.color}33` }}
            >
              <step.icon size={24} style={{ color: step.color }} />
            </div>
            <div className="font-bold text-white text-sm mb-1">{step.label}</div>
            <div className="text-gray-400 text-xs">{step.desc}</div>
            <div
              className="absolute top-3 right-3 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
              style={{ backgroundColor: `${step.color}44`, color: step.color }}
            >
              {i + 1}
            </div>
          </motion.button>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => onNavigate('participants')}
        className="glow-gold px-10 py-4 rounded-2xl font-black text-xl text-black cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⚽ {participants.length === 0 ? 'START YOUR SWEEPSTAKES' : 'CONTINUE'}
      </motion.button>

      <p className="text-gray-600 text-sm mt-6">
        USA 🇺🇸 · Canada 🇨🇦 · Mexico 🇲🇽 · 48 Teams · June 2026
      </p>
    </div>
  );
}
