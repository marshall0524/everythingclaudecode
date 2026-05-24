import { getHealthData } from '@/lib/store';
import { last, avg, trend, getBMICategory, getStressLevel, getVO2MaxCategory, formatRelativeTime } from '@/lib/utils';
import MetricCard from '@/components/MetricCard';
import WeightChart from '@/components/WeightChart';
import SleepChart from '@/components/SleepChart';
import ExerciseChart from '@/components/ExerciseChart';
import StressChart from '@/components/StressChart';
import VO2MaxChart from '@/components/VO2MaxChart';
import BMIGauge from '@/components/BMIGauge';
import { Scale, Bed, Dumbbell, Wind, Zap, FileText, ChevronRight, TrendingDown } from 'lucide-react';

export const revalidate = 60;

export default async function DashboardPage() {
  const data = await getHealthData();
  const { weight, sleep, exercise, stress, vo2max, profile, pathology, lastSync } = data;

  const latestWeight = last(weight);
  const latestStress = last(stress);
  const latestVO2 = last(vo2max);
  const latestSleep = last(sleep);

  const avgSleep7d = avg(sleep.slice(-7).map((s) => s.totalHours));
  const avgStress7d = avg(stress.slice(-7).map((s) => s.score));
  const stressLevel = getStressLevel(avgStress7d);
  const bmiCat = latestWeight ? getBMICategory(latestWeight.bmi) : { label: '', color: '' };

  const weightTrend = trend(weight.map((w) => w.weight));
  const sleepTrend = trend(sleep.slice(-7).map((s) => s.totalHours));
  const stressTrend = trend(stress.slice(-7).map((s) => s.score));

  const recentExercise = exercise.slice(-7);
  const weeklyActiveMin = recentExercise.reduce((s, e) => s + e.duration, 0);
  const weeklyActiveCalories = recentExercise.reduce((s, e) => s + e.activeCalories, 0);
  const weightChange30d = weight.length >= 2
    ? (last(weight)!.weight - weight[weight.length >= 8 ? weight.length - 8 : 0].weight).toFixed(1)
    : '0';

  const lastAppleSync = lastSync.apple_health ? formatRelativeTime(lastSync.apple_health) : 'Never';

  return (
    <div className="px-4 py-4 space-y-6 animate-fade-in">
      {/* Header greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Good morning</h1>
          <p className="text-sm text-gray-400">Shanghai · {new Date().toLocaleDateString('en-AU', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Last sync</p>
          <p className="text-xs text-green-400">{lastAppleSync}</p>
        </div>
      </div>

      {/* Weight + BMI */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Weight & Body</h2>
          <a href="/sync" className="text-xs text-primary-400 flex items-center gap-0.5">Sync <ChevronRight size={12} /></a>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <MetricCard
            title="Weight"
            value={latestWeight?.weight ?? '--'}
            unit="kg"
            subtitle={`Goal: ${profile.targetWeight} kg`}
            trend={weightTrend}
            trendPositive={false}
            trendValue={`${weightChange30d}kg`}
            color="blue"
            icon={<Scale size={16} />}
            badge={bmiCat.label}
            badgeColor={`${bmiCat.color.replace('text-', 'text-')} bg-gray-800`}
          />
          <MetricCard
            title="Body Fat"
            value={latestWeight?.bodyFat ?? '--'}
            unit="%"
            subtitle={`Muscle: ${latestWeight?.muscleMass ?? '--'} kg`}
            color="amber"
            icon={<TrendingDown size={16} />}
            badge={`Visceral ${latestWeight?.visceralFat ?? '--'}`}
            badgeColor="text-gray-300 bg-gray-800"
          />
        </div>

        {/* BMI Gauge */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">BMI</span>
            <span className={`text-xs font-semibold ${bmiCat.color}`}>{bmiCat.label} (Asian scale)</span>
          </div>
          <div className="flex items-center justify-around">
            <BMIGauge bmi={latestWeight?.bmi ?? 27.6} asian />
            <div className="space-y-2 text-xs">
              <div><span className="text-blue-400">◉</span> <span className="text-gray-400">Under &lt;18.5</span></div>
              <div><span className="text-green-400">◉</span> <span className="text-gray-400">Normal 18.5–23</span></div>
              <div><span className="text-amber-400">◉</span> <span className="text-gray-400">Over 23–27.5</span></div>
              <div><span className="text-red-400">◉</span> <span className="text-gray-400">Obese &gt;27.5</span></div>
            </div>
          </div>
        </div>

        {/* Weight chart */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 mt-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">30-Day Trend</p>
          <WeightChart data={weight} targetWeight={profile.targetWeight} />
        </div>
      </section>

      {/* Sleep */}
      <section>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Sleep</h2>
        <MetricCard
          title="Last night"
          value={latestSleep?.totalHours.toFixed(1) ?? '--'}
          unit="hrs"
          subtitle={`7-day avg: ${avgSleep7d.toFixed(1)} hrs · ${latestSleep?.quality ?? ''}`}
          trend={sleepTrend}
          trendPositive={true}
          color="purple"
          icon={<Bed size={16} />}
          badge={latestSleep?.quality ?? ''}
          badgeColor={
            latestSleep?.quality === 'excellent' ? 'bg-blue-900/50 text-blue-300' :
            latestSleep?.quality === 'good' ? 'bg-green-900/50 text-green-300' :
            latestSleep?.quality === 'fair' ? 'bg-amber-900/50 text-amber-300' :
            'bg-red-900/50 text-red-300'
          }
        >
          <div className="flex gap-3 mt-2">
            <div className="text-xs"><span className="text-blue-400 font-semibold">{latestSleep?.deepSleep.toFixed(1)}h</span> <span className="text-gray-500">Deep</span></div>
            <div className="text-xs"><span className="text-purple-400 font-semibold">{latestSleep?.remSleep.toFixed(1)}h</span> <span className="text-gray-500">REM</span></div>
            <div className="text-xs"><span className="text-gray-400 font-semibold">{latestSleep?.lightSleep.toFixed(1)}h</span> <span className="text-gray-500">Light</span></div>
          </div>
        </MetricCard>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 mt-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">14-Day Sleep</p>
          <SleepChart data={sleep} />
        </div>
      </section>

      {/* Exercise */}
      <section>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Exercise</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <MetricCard
            title="This Week"
            value={weeklyActiveMin}
            unit="min"
            subtitle={`${weeklyActiveCalories} kcal burned`}
            color="green"
            icon={<Dumbbell size={16} />}
            badge={recentExercise.length > 0 ? `${recentExercise.length} sessions` : 'No data'}
            badgeColor="bg-green-900/50 text-green-300"
          />
          <MetricCard
            title="VO2 Max"
            value={latestVO2?.value ?? '--'}
            unit="mL/kg/min"
            subtitle={getVO2MaxCategory(latestVO2?.value ?? 44, profile.age)}
            color="blue"
            icon={<Wind size={16} />}
            badge={latestVO2?.category}
            badgeColor="bg-blue-900/50 text-blue-300"
          />
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Activity (14 days)</p>
          <ExerciseChart data={exercise} />
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 mt-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">VO2 Max Progress</p>
          <VO2MaxChart data={vo2max} />
        </div>
      </section>

      {/* Stress + HRV */}
      <section>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Stress & Recovery</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <MetricCard
            title="Stress"
            value={latestStress?.score ?? '--'}
            unit="/100"
            subtitle={stressLevel.label}
            trend={stressTrend}
            trendPositive={false}
            color={avgStress7d < 50 ? 'green' : avgStress7d < 65 ? 'amber' : 'red'}
            icon={<Zap size={16} />}
          />
          <MetricCard
            title="HRV"
            value={latestStress?.hrv ?? '--'}
            unit="ms"
            subtitle={`RHR: ${latestStress?.restingHeartRate ?? '--'} bpm`}
            color="purple"
            icon={<Zap size={16} />}
            badge={latestStress?.recoveryScore ? `Recovery ${latestStress.recoveryScore}%` : undefined}
            badgeColor="bg-purple-900/50 text-purple-300"
          />
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Stress & HRV (14 days)</p>
          <StressChart data={stress} />
        </div>
      </section>

      {/* Pathology quick access */}
      {pathology.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Recent Documents</h2>
            <a href="/pathology" className="text-xs text-primary-400 flex items-center gap-0.5">All <ChevronRight size={12} /></a>
          </div>
          <div className="space-y-2">
            {pathology.slice(0, 2).map((doc) => (
              <a key={doc.id} href="/pathology" className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/60 p-3 hover:bg-gray-800/60 transition-colors">
                <FileText size={18} className="text-primary-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{doc.filename}</p>
                  <p className="text-xs text-gray-500">{doc.uploadDate} · {doc.type.replace(/_/g, ' ')}</p>
                </div>
                <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="h-4" />
    </div>
  );
}
