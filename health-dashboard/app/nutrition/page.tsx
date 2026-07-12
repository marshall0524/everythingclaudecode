'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Loader2, ChevronDown, ChevronUp, Flame, Beef, Wheat, Droplet, AlertTriangle } from 'lucide-react';
import { LoggedMeal } from '@/lib/types';
import { NutritionTargets, DailyTotals } from '@/lib/nutrition';

const mealTypeLabel: Record<LoggedMeal['mealType'], string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
};

function ProgressBar({ value, target, color }: { value: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}88` }} />
    </div>
  );
}

export default function NutritionPage() {
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [totals, setTotals] = useState<DailyTotals | null>(null);
  const [remaining, setRemaining] = useState<{ protein: number; calories: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await fetch('/api/nutrition');
    const d = await res.json();
    setMeals(d.meals || []);
    setTargets(d.targets);
    setTotals(d.totals);
    setRemaining(d.remaining);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleFile = async (file: File) => {
    setError(null);
    setAnalyzing(true);
    const fd = new FormData();
    fd.append('file', file);
    if (caption.trim()) fd.append('caption', caption.trim());
    try {
      const res = await fetch('/api/nutrition', { method: 'POST', body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Analysis failed');
      setMeals(prev => [...prev, d.meal]);
      setTargets(d.targets);
      setTodaysFromRemaining(d);
      setCaption('');
      setExpanded(d.meal.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const setTodaysFromRemaining = (d: { todaysTotals: DailyTotals; remaining: { protein: number; calories: number } }) => {
    setTotals(d.todaysTotals);
    setRemaining(d.remaining);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--nutrition)' }} />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4 animate-fade">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Nutrition</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Snap a photo, get the breakdown</p>
      </div>

      {/* Remaining today */}
      {targets && totals && remaining && (
        <div className="card p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--text-faint)' }}>Left today</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-end gap-1.5 mb-1">
                <Beef size={16} style={{ color: 'var(--nutrition)' }} />
                <span className="text-2xl font-black" style={{ color: 'var(--nutrition)' }}>{remaining.protein}</span>
                <span className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>g protein</span>
              </div>
              <ProgressBar value={totals.protein} target={targets.proteinG} color="var(--nutrition)" />
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-faint)' }}>{totals.protein}g of {targets.proteinG}g target</p>
            </div>
            <div>
              <div className="flex items-end gap-1.5 mb-1">
                <Flame size={16} style={{ color: 'var(--strain)' }} />
                <span className="text-2xl font-black" style={{ color: 'var(--strain)' }}>{remaining.calories}</span>
                <span className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>kcal</span>
              </div>
              <ProgressBar value={totals.calories} target={targets.calorieTarget} color="var(--strain)" />
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-faint)' }}>{totals.calories} of {targets.calorieTarget} kcal target</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <p>Carbs: <span className="font-bold" style={{ color: 'var(--text)' }}>{totals.carbs}g</span></p>
            <p>Fat: <span className="font-bold" style={{ color: 'var(--text)' }}>{totals.fat}g</span></p>
          </div>
          <p className="text-[10px] mt-3" style={{ color: 'var(--text-faint)' }}>
            Protein target: {targets.proteinG}g (1.8g/kg × {targets.weightUsedKg}kg, Morton et al. 2018). Calorie target: {targets.calorieTarget} kcal (~20% below your estimated {targets.maintenanceCalories} kcal maintenance, Mifflin-St Jeor 1990 + Helms et al. 2014).
          </p>
        </div>
      )}

      {/* Upload */}
      <div className="card p-4">
        <input
          type="text"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Add a note (optional) — e.g. 'ate half the rice'"
          className="w-full text-sm rounded-xl px-3 py-2 mb-3 outline-none"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text)', border: '1px solid var(--border)' }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={analyzing}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-black transition-all active:scale-95 disabled:opacity-50"
          style={{ background: 'var(--nutrition)' }}
        >
          {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
          {analyzing ? 'Analysing your meal…' : 'Log a Meal Photo'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {error && (
          <div className="mt-3 flex items-start gap-2 p-2.5 rounded-xl" style={{ background: 'color-mix(in srgb, var(--danger) 12%, var(--bg-card))' }}>
            <AlertTriangle size={13} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
            <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
          </div>
        )}
      </div>

      {/* Meal list */}
      {meals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
          <Wheat size={28} style={{ color: 'var(--text-faint)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No meals logged today</p>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Snap a photo of your next meal to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...meals].reverse().map(meal => {
            const isExpanded = expanded === meal.id;
            return (
              <div key={meal.id} className="card overflow-hidden">
                <button className="w-full flex items-center gap-3 p-3.5 text-left" onClick={() => setExpanded(isExpanded ? null : meal.id)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={meal.imagePath} alt={meal.mealType} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{ background: 'var(--bg-elevated)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{mealTypeLabel[meal.mealType]}</p>
                      {meal.confidence === 'low' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--warning) 15%, transparent)', color: 'var(--warning)' }}>rough estimate</span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{meal.totalCalories} kcal · {meal.totalProtein}g protein</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--text-faint)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-faint)' }} />}
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 animate-up">
                    <div style={{ borderTop: '1px solid var(--border-subtle)' }} className="pt-3">
                      <div className="grid grid-cols-4 gap-2 mb-3 text-center">
                        {[
                          { label: 'Protein', val: meal.totalProtein, unit: 'g', color: 'var(--nutrition)' },
                          { label: 'Carbs', val: meal.totalCarbs, unit: 'g', color: 'var(--strain)' },
                          { label: 'Fat', val: meal.totalFat, unit: 'g', color: 'var(--sleep)' },
                          { label: 'Fibre', val: meal.totalFiber, unit: 'g', color: 'var(--recovery)' },
                        ].map(m => (
                          <div key={m.label} className="rounded-xl p-2" style={{ background: 'var(--bg-elevated)' }}>
                            <p className="text-sm font-black" style={{ color: m.color }}>{m.val}{m.unit}</p>
                            <p className="text-[9px] font-bold" style={{ color: 'var(--text-faint)' }}>{m.label}</p>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-faint)' }}>Items</p>
                      <div className="space-y-1.5 mb-3">
                        {meal.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span style={{ color: 'var(--text)' }}>{item.name} <span style={{ color: 'var(--text-faint)' }}>({item.quantity})</span></span>
                            <span style={{ color: 'var(--text-muted)' }}>{item.calories} kcal</span>
                          </div>
                        ))}
                      </div>

                      {meal.tips && (
                        <div className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: 'color-mix(in srgb, var(--nutrition) 10%, var(--bg-card))' }}>
                          <Droplet size={12} style={{ color: 'var(--nutrition)', flexShrink: 0, marginTop: 2 }} />
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{meal.tips}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}
