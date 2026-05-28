import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppView } from './types';
import { NavBar } from './components/NavBar';
import { HomeView } from './components/HomeView';
import { ParticipantsView } from './components/ParticipantsView';
import { DrawView } from './components/DrawView';
import { AvatarsView } from './components/AvatarsView';
import { TournamentView } from './components/TournamentView';
import { ResultsView } from './components/ResultsView';
import { PayoutsView } from './components/PayoutsView';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function App() {
  const [view, setView] = useState<AppView>('home');

  function navigate(next: AppView) {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a2a3a 50%, #0f1923 100%)' }}>
      <NavBar current={view} onNavigate={navigate} />
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25 }}
        >
          {view === 'home' && <HomeView onNavigate={navigate} />}
          {view === 'participants' && <ParticipantsView onNavigate={navigate} />}
          {view === 'draw' && <DrawView onNavigate={navigate} />}
          {view === 'avatars' && <AvatarsView onNavigate={navigate} />}
          {view === 'tournament' && <TournamentView onNavigate={navigate} />}
          {view === 'results' && <ResultsView onNavigate={navigate} />}
          {view === 'payouts' && <PayoutsView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
