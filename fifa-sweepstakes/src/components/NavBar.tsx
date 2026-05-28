import { motion } from 'framer-motion';
import { Home, Users, Shuffle, Star, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';
import type { AppView } from '../types';
import { useSweepstakes } from '../store/sweepstakes';

interface Props {
  current: AppView;
  onNavigate: (view: AppView) => void;
}

const NAV_ITEMS: { view: AppView; icon: typeof Home; label: string }[] = [
  { view: 'home', icon: Home, label: 'Home' },
  { view: 'participants', icon: Users, label: 'Players' },
  { view: 'draw', icon: Shuffle, label: 'Draw' },
  { view: 'avatars', icon: Star, label: 'Avatars' },
  { view: 'tournament', icon: BarChart2, label: 'Teams' },
  { view: 'results', icon: TrendingUp, label: 'Results' },
  { view: 'payouts', icon: DollarSign, label: 'Payouts' },
];

export function NavBar({ current, onNavigate }: Props) {
  const { participants, drawCompleted } = useSweepstakes();

  return (
    <nav
      className="sticky top-0 z-40 border-b border-white/10"
      style={{
        background: 'rgba(15, 25, 35, 0.95)',
        backdropFilter: 'blur(16px)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto">
        <div className="flex items-center gap-1.5 mr-4 shrink-0">
          <span className="text-xl">🏆</span>
          <span className="font-black text-sm" style={{ color: '#ffd700' }}>FIFA 2026</span>
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = current === item.view;
          const disabled =
            (item.view === 'draw' && participants.length === 0) ||
            (item.view === 'avatars' && !drawCompleted) ||
            (item.view === 'tournament' && !drawCompleted) ||
            (item.view === 'results' && !drawCompleted) ||
            (item.view === 'payouts' && participants.length === 0);

          return (
            <motion.button
              key={item.view}
              onClick={() => !disabled && onNavigate(item.view)}
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.05 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                disabled
                  ? 'opacity-30 cursor-not-allowed'
                  : isActive
                  ? 'text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, #ffd700, #ff8c00)' } : {}}
            >
              <item.icon size={14} />
              <span className="hidden sm:inline">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-lg -z-10"
                  style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
