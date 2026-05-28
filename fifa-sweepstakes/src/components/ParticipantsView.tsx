import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, Check, X, ChevronRight, DollarSign } from 'lucide-react';
import { useSweepstakes } from '../store/sweepstakes';
import type { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

export function ParticipantsView({ onNavigate }: Props) {
  const { participants, addParticipant, removeParticipant, togglePaid, stakePerPerson, setStake, totalPot } = useSweepstakes();
  const [name, setName] = useState('');
  const [stakeInput, setStakeInput] = useState(String(stakePerPerson));
  const [editingStake, setEditingStake] = useState(false);

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    addParticipant(trimmed);
    setName('');
  }

  function handleStakeSave() {
    const v = parseFloat(stakeInput);
    if (!isNaN(v) && v > 0) setStake(v);
    setEditingStake(false);
  }

  const paidCount = participants.filter((p) => p.paid).length;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black mb-1" style={{ color: '#ffd700' }}>👥 Players</h2>
        <p className="text-gray-400 mb-6">Add everyone joining the sweepstakes</p>

        {/* Stake setting */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <DollarSign size={20} className="text-green-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400">Stake per person</div>
            {editingStake ? (
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={stakeInput}
                  onChange={(e) => setStakeInput(e.target.value)}
                  className="bg-white/10 rounded-lg px-3 py-1 w-24 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  min="1"
                  step="1"
                  autoFocus
                />
                <button onClick={handleStakeSave} className="text-green-400 hover:text-green-300"><Check size={16} /></button>
                <button onClick={() => setEditingStake(false)} className="text-red-400 hover:text-red-300"><X size={16} /></button>
              </div>
            ) : (
              <button
                onClick={() => setEditingStake(true)}
                className="text-white font-bold text-lg hover:text-yellow-400 transition-colors"
              >
                £{stakePerPerson} <span className="text-xs text-gray-500 font-normal">(click to edit)</span>
              </button>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Total pot</div>
            <div className="text-xl font-black text-yellow-400">£{totalPot}</div>
          </div>
        </div>

        {/* Add form */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Enter player name..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <motion.button
            onClick={handleAdd}
            disabled={!name.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 rounded-xl font-bold flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)', color: '#000' }}
          >
            <UserPlus size={18} /> Add
          </motion.button>
        </div>

        {/* Summary */}
        {participants.length > 0 && (
          <div className="flex gap-3 mb-4 text-sm">
            <span className="bg-blue-500/20 text-blue-300 rounded-full px-3 py-1">
              {participants.length} players
            </span>
            <span className="bg-green-500/20 text-green-300 rounded-full px-3 py-1">
              {paidCount} paid
            </span>
            <span className="bg-yellow-500/20 text-yellow-300 rounded-full px-3 py-1">
              {participants.length - paidCount} outstanding
            </span>
          </div>
        )}

        {/* List */}
        <AnimatePresence>
          {participants.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30, height: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-2"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              >
                {i + 1}
              </div>
              <span className="flex-1 text-white font-medium">{p.name}</span>
              <span className="text-sm text-gray-400">£{p.stake}</span>
              <button
                onClick={() => togglePaid(p.id)}
                className={`text-xs rounded-full px-3 py-1 font-medium cursor-pointer transition-all ${
                  p.paid
                    ? 'bg-green-500/30 text-green-300'
                    : 'bg-gray-500/20 text-gray-400 hover:bg-yellow-500/20 hover:text-yellow-300'
                }`}
              >
                {p.paid ? '✓ Paid' : 'Mark Paid'}
              </button>
              <button
                onClick={() => removeParticipant(p.id)}
                className="text-red-400 hover:text-red-300 transition-colors cursor-pointer p-1"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {participants.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">👥</div>
            <p>No players yet. Add some above!</p>
          </div>
        )}

        {participants.length > 0 && (
          <motion.button
            onClick={() => onNavigate('draw')}
            className="w-full mt-6 py-4 rounded-2xl font-black text-xl text-black flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Proceed to Team Draw <ChevronRight size={22} />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
