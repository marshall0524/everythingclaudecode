import Link from 'next/link';
import { getHealthData } from '@/lib/store';
import { last } from '@/lib/utils';
import RangeBar, { type RangeSegment } from '@/components/RangeBar';
import { ChevronLeft, CheckCircle2, AlertTriangle, XCircle, FileText, Calendar } from 'lucide-react';

export const revalidate = 60;

// ─── palette (always light/clinical regardless of theme) ──────────────────
const C = {
  bg:       '#F7F8FB',
  card:     '#FFFFFF',
  border:   '#E8EDF5',
  text:     '#0F172A',
  muted:    '#64748B',
  faint:    '#94A3B8',
  optimal:  { bg: '#ECFDF5', fg: '#059669' },
  borderline:{ bg: '#FFF7ED', fg: '#D97706' },
  abnormal: { bg: '#FEF2F2', fg: '#DC2626' },
};

// ─── segment sets for each marker ─────────────────────────────────────────
const SEGMENTS = {
  totalChol: [
    { min: 100, max: 200, color: '#10B981' },
    { min: 200, max: 240, color: '#F59E0B' },
    { min: 240, max: 300, color: '#EF4444' },
  ] as RangeSegment[],
  ldl: [
    { min: 40,  max: 100, color: '#10B981' },
    { min: 100, max: 130, color: '#84CC16' },
    { min: 130, max: 160, color: '#F59E0B' },
    { min: 160, max: 200, color: '#EF4444' },
  ] as RangeSegment[],
  hdl: [
    { min: 20, max: 40, color: '#EF4444' },
    { min: 40, max: 60, color: '#F59E0B' },
    { min: 60, max: 80, color: '#10B981' },
  ] as RangeSegment[],
  trig: [
    { min: 50,  max: 150, color: '#10B981' },
    { min: 150, max: 200, color: '#F59E0B' },
    { min: 200, max: 300, color: '#EF4444' },
  ] as RangeSegment[],
  glucose: [
    { min: 60,  max: 100, color: '#10B981' },
    { min: 100, max: 126, color: '#F59E0B' },
    { min: 126, max: 145, color: '#EF4444' },
  ] as RangeSegment[],
  hba1c: [
    { min: 4.0, max: 5.7, color: '#10B981' },
    { min: 5.7, max: 6.5, color: '#F59E0B' },
    { min: 6.5, max: 8.5, color: '#EF4444' },
  ] as RangeSegment[],
  vitD: [
    { min: 0,  max: 20, color: '#EF4444' },
    { min: 20, max: 30, color: '#F59E0B' },
    { min: 30, max: 60, color: '#10B981' },
    { min: 60, max: 80, color: '#F59E0B' },
  ] as RangeSegment[],
  ferritin: [
    { min: 0,   max: 30,  color: '#F59E0B' },
    { min: 30,  max: 300, color: '#10B981' },
    { min: 300, max: 400, color: '#F59E0B' },
  ] as RangeSegment[],
  tsh: [
    { min: 0.0, max: 0.4, color: '#EF4444' },
    { min: 0.4, max: 4.0, color: '#10B981' },
    { min: 4.0, max: 6.5, color: '#F59E0B' },
  ] as RangeSegment[],
};

function parseVal(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

type StatusType = 'optimal' | 'borderline' | 'abnormal';

function getStatus(marker: string, val: number | null): StatusType {
  if (val === null) return 'borderline';
  switch (marker) {
    case 'tc':    return val < 200 ? 'optimal' : val < 240 ? 'borderline' : 'abnormal';
    case 'ldl':   return val < 100 ? 'optimal' : val < 160 ? 'borderline' : 'abnormal';
    case 'hdl':   return val >= 60 ? 'optimal' : val >= 40 ? 'borderline' : 'abnormal';
    case 'trig':  return val < 150 ? 'optimal' : val < 200 ? 'borderline' : 'abnormal';
    case 'glucose': return val < 100 ? 'optimal' : val < 126 ? 'borderline' : 'abnormal';
    case 'hba1c': return val < 5.7 ? 'optimal' : val < 6.5 ? 'borderline' : 'abnormal';
    case 'vitD':  return val >= 30 ? 'optimal' : val >= 20 ? 'borderline' : 'abnormal';
    case 'ferritin': return val >= 30 && val <= 300 ? 'optimal' : 'borderline';
    case 'tsh':   return val >= 0.4 && val <= 4.0 ? 'optimal' : val > 4.0 ? 'borderline' : 'abnormal';
    default:      return 'borderline';
  }
}

function StatusBadge({ status, label }: { status: StatusType; label: string }) {
  const p = status === 'optimal' ? C.optimal : status === 'borderline' ? C.borderline : C.abnormal;
  return (
    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: p.bg, color: p.fg }}>
      {label}
    </span>
  );
}

function StatusIcon({ status }: { status: StatusType }) {
  if (status === 'optimal')    return <CheckCircle2 size={16} color={C.optimal.fg} />;
  if (status === 'borderline') return <AlertTriangle size={16} color={C.borderline.fg} />;
  return <XCircle size={16} color={C.abnormal.fg} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: C.faint }}>
      {children}
    </p>
  );
}

function MarkerCard({
  name, value, unit, statusKey, statusLabel, segments, displayMin, displayMax, reference,
}: {
  name: string; value: number | null; unit: string; statusKey: string;
  statusLabel: string; segments: RangeSegment[]; displayMin: number; displayMax: number;
  reference: string;
}) {
  const st = getStatus(statusKey, value);
  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: '16px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{name}</p>
        <StatusBadge status={st} label={statusLabel} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: C.text, lineHeight: 1 }}>
          {value !== null ? value : '–'}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>{unit}</span>
      </div>
      {value !== null && (
        <RangeBar value={value} displayMin={displayMin} displayMax={displayMax} segments={segments} />
      )}
      <p style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{reference}</p>
    </div>
  );
}

function MiniMetric({ label, value, unit, status }: { label: string; value: string; unit?: string; status?: StatusType }) {
  const p = !status ? undefined : status === 'optimal' ? C.optimal : status === 'borderline' ? C.borderline : C.abnormal;
  return (
    <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 12px', flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: p ? p.fg : C.text, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>{unit}</span>}
      </div>
    </div>
  );
}

interface Rec {
  priority: 'high' | 'medium' | 'low';
  title: string;
  body: string;
  icon: string;
}

export default async function GPPage() {
  const data = await getHealthData();
  const { profile, pathology, weight, stress, vo2max } = data;

  const lw = last(weight);
  const ls = last(stress);
  const lv = last(vo2max);

  const bloodDoc = pathology.find(d => d.type === 'blood_test');
  const kv = bloodDoc?.keyValues ?? {};

  const tc      = parseVal(kv['Total Cholesterol']);
  const ldl     = parseVal(kv['LDL']);
  const hdl     = parseVal(kv['HDL']);
  const trig    = parseVal(kv['Triglycerides']);
  const glucose = parseVal(kv['Fasting Glucose']);
  const hba1c   = parseVal(kv['HbA1c']);
  const vitD    = parseVal(kv['Vitamin D']);
  const ferritin = parseVal(kv['Ferritin']);
  const tsh     = parseVal(kv['TSH']);

  // Sports physical
  const sportsDoc = pathology.find(d => d.type === 'report');
  const bp = sportsDoc?.keyValues?.['BP'] ?? '–';

  // Overall statuses
  const statuses = [
    getStatus('tc', tc), getStatus('ldl', ldl), getStatus('hdl', hdl),
    getStatus('trig', trig), getStatus('glucose', glucose), getStatus('hba1c', hba1c),
    getStatus('vitD', vitD), getStatus('ferritin', ferritin), getStatus('tsh', tsh),
  ];
  const abnormalCount   = statuses.filter(s => s === 'abnormal').length;
  const borderlineCount = statuses.filter(s => s === 'borderline').length;
  const optimalCount    = statuses.filter(s => s === 'optimal').length;

  const overallStatus: StatusType = abnormalCount > 0 ? 'abnormal' : borderlineCount > 2 ? 'borderline' : 'optimal';

  // BMI
  const bmi = lw?.bmi ?? 0;
  const bmiStatus: StatusType = bmi >= 27.5 ? 'abnormal' : bmi >= 23 ? 'borderline' : 'optimal';
  const bmiLabel = bmi >= 27.5 ? 'Obese (Asian)' : bmi >= 23 ? 'Overweight' : bmi >= 18.5 ? 'Normal' : 'Underweight';

  // GP recommendations
  const recs: Rec[] = [];
  if (vitD !== null && vitD < 30) recs.push({
    priority: 'high',
    title: 'Vitamin D Insufficiency',
    body: `Your level (${vitD} ng/mL) is below the 30 ng/mL threshold. Take 2,000 IU vitamin D3 daily with a fatty meal. Re-test in 3 months. Sun exposure 15–20 min/day before 10am also helps.`,
    icon: '☀️',
  });
  if (ldl !== null && ldl >= 100) recs.push({
    priority: ldl >= 130 ? 'high' : 'medium',
    title: `LDL ${ldl >= 130 ? 'Borderline High' : 'Near-Optimal'} (${ldl} mg/dL)`,
    body: `Target <100 mg/dL. Reduce saturated fat (red meat, full-fat dairy), increase soluble fibre (oats, beans), and add omega-3s. If LDL exceeds 130 mg/dL after 3 months of dietary change, discuss statin therapy with your GP.`,
    icon: '🫀',
  });
  if (bmi >= 23) recs.push({
    priority: bmi >= 27.5 ? 'high' : 'medium',
    title: `BMI ${bmi.toFixed(1)} — ${bmiLabel}`,
    body: `At ${lw?.weight ?? profile.targetWeight} kg, you are ${Math.abs((lw?.weight ?? 78) - profile.targetWeight).toFixed(1)} kg above your ${profile.targetWeight} kg goal. A 500 kcal/day deficit (~0.5 kg/week) through reduced ultra-processed food + 150+ min/week Zone 2 exercise is the safest evidence-based approach.`,
    icon: '⚖️',
  });
  if (trig !== null && trig >= 150) recs.push({
    priority: 'medium',
    title: `Triglycerides Borderline (${trig} mg/dL)`,
    body: `Elevated triglycerides respond well to: reducing refined carbs/sugar, limiting alcohol, increasing aerobic exercise. Fish oil (2–4g EPA+DHA daily) can lower triglycerides by 20–30%.`,
    icon: '🐟',
  });
  if (glucose !== null && glucose >= 100) recs.push({
    priority: 'high',
    title: `Fasting Glucose Pre-Diabetes Range (${glucose} mg/dL)`,
    body: `At 94–99 mg/dL, early lifestyle intervention is critical. Aim for 150 min/week brisk walking, reduce refined carbs, and focus on fibre-rich whole foods. Monitor annually.`,
    icon: '🩸',
  });
  if (recs.length < 3) recs.push({
    priority: 'low',
    title: 'Maintain Aerobic Fitness',
    body: `VO2 Max of ${lv?.value ?? '–'} mL/kg/min is in the good range for your age. Continue Zone 2 training 3–4×/week to further improve cardiovascular health and insulin sensitivity.`,
    icon: '🏃',
  });

  const priorityColor = (p: Rec['priority']) =>
    p === 'high' ? C.abnormal : p === 'medium' ? C.borderline : C.optimal;

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'rgba(247,248,251,0.92)', backdropFilter: 'blur(12px)', position: 'sticky', top: 56, zIndex: 30, borderBottom: `1px solid ${C.border}`, padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 480, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, background: C.card, border: `1px solid ${C.border}` }}>
            <ChevronLeft size={18} color={C.muted} />
          </Link>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.18em' }}>Health Records</p>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: C.text, lineHeight: 1.2 }}>Patient Dashboard</h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 100px' }}>

        {/* Patient profile card */}
        <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, padding: '20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                👤
              </div>
              <div>
                <p style={{ fontSize: 17, fontWeight: 800, color: C.text }}>{profile.name || 'Patient'}</p>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{profile.age}yo · {profile.gender} · {profile.ethnicity}</p>
                <p style={{ fontSize: 12, color: C.faint, marginTop: 1 }}>{profile.location}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{profile.height} cm</p>
              <p style={{ fontSize: 12, color: C.muted }}>{lw?.weight ?? '–'} kg</p>
            </div>
          </div>

          <div style={{ height: 1, background: C.border, margin: '14px 0' }} />

          {/* Overall health status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Overall Blood Health</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <StatusIcon status={overallStatus} />
                <span style={{ fontSize: 14, fontWeight: 700, color: overallStatus === 'optimal' ? C.optimal.fg : overallStatus === 'borderline' ? C.borderline.fg : C.abnormal.fg }}>
                  {overallStatus === 'optimal' ? 'All markers in range' : `${borderlineCount + abnormalCount} markers need attention`}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ textAlign: 'center', background: C.optimal.bg, borderRadius: 10, padding: '6px 10px' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: C.optimal.fg }}>{optimalCount}</p>
                <p style={{ fontSize: 9, fontWeight: 600, color: C.optimal.fg, textTransform: 'uppercase' }}>Good</p>
              </div>
              <div style={{ textAlign: 'center', background: C.borderline.bg, borderRadius: 10, padding: '6px 10px' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: C.borderline.fg }}>{borderlineCount}</p>
                <p style={{ fontSize: 9, fontWeight: 600, color: C.borderline.fg, textTransform: 'uppercase' }}>Watch</p>
              </div>
              {abnormalCount > 0 && (
                <div style={{ textAlign: 'center', background: C.abnormal.bg, borderRadius: 10, padding: '6px 10px' }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: C.abnormal.fg }}>{abnormalCount}</p>
                  <p style={{ fontSize: 9, fontWeight: 600, color: C.abnormal.fg, textTransform: 'uppercase' }}>Act</p>
                </div>
              )}
            </div>
          </div>

          {bloodDoc && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '8px 10px', background: C.bg, borderRadius: 10 }}>
              <Calendar size={12} color={C.faint} />
              <p style={{ fontSize: 11, color: C.faint }}>Blood panel: <span style={{ fontWeight: 600, color: C.muted }}>{bloodDoc.summary}</span></p>
            </div>
          )}
        </div>

        {/* ── Lipid Panel ─────────────────────────────────────── */}
        <SectionLabel>Lipid Panel</SectionLabel>

        <MarkerCard
          name="Total Cholesterol"
          value={tc}
          unit="mg/dL"
          statusKey="tc"
          statusLabel={tc !== null ? (tc < 200 ? 'Optimal' : tc < 240 ? 'Borderline' : 'High') : '–'}
          segments={SEGMENTS.totalChol}
          displayMin={100} displayMax={300}
          reference="Target <200 mg/dL · ACC/AHA 2019"
        />
        <MarkerCard
          name="LDL Cholesterol"
          value={ldl}
          unit="mg/dL"
          statusKey="ldl"
          statusLabel={ldl !== null ? (ldl < 100 ? 'Optimal' : ldl < 130 ? 'Near Optimal' : ldl < 160 ? 'Borderline' : 'High') : '–'}
          segments={SEGMENTS.ldl}
          displayMin={40} displayMax={200}
          reference="Target <100 mg/dL optimal, <130 acceptable · ACC/AHA 2019"
        />
        <MarkerCard
          name="HDL Cholesterol"
          value={hdl}
          unit="mg/dL"
          statusKey="hdl"
          statusLabel={hdl !== null ? (hdl >= 60 ? 'Optimal' : hdl >= 40 ? 'Borderline' : 'Low') : '–'}
          segments={SEGMENTS.hdl}
          displayMin={20} displayMax={80}
          reference="Target >60 mg/dL protective · higher is better"
        />
        <MarkerCard
          name="Triglycerides"
          value={trig}
          unit="mg/dL"
          statusKey="trig"
          statusLabel={trig !== null ? (trig < 150 ? 'Normal' : trig < 200 ? 'Borderline' : 'High') : '–'}
          segments={SEGMENTS.trig}
          displayMin={50} displayMax={300}
          reference="Target <150 mg/dL · ACC/AHA 2019"
        />

        {/* ── Metabolic Panel ──────────────────────────────────── */}
        <div style={{ marginTop: 24 }} />
        <SectionLabel>Metabolic Panel</SectionLabel>

        <MarkerCard
          name="Fasting Glucose"
          value={glucose}
          unit="mg/dL"
          statusKey="glucose"
          statusLabel={glucose !== null ? (glucose < 100 ? 'Normal' : glucose < 126 ? 'Pre-Diabetes' : 'Diabetes Range') : '–'}
          segments={SEGMENTS.glucose}
          displayMin={60} displayMax={145}
          reference="Normal <100 mg/dL · Pre-diabetes 100–125 · ADA 2024"
        />
        <MarkerCard
          name="HbA1c (3-month avg glucose)"
          value={hba1c}
          unit="%"
          statusKey="hba1c"
          statusLabel={hba1c !== null ? (hba1c < 5.7 ? 'Normal' : hba1c < 6.5 ? 'Pre-Diabetes' : 'Diabetes') : '–'}
          segments={SEGMENTS.hba1c}
          displayMin={4.0} displayMax={8.5}
          reference="Normal <5.7% · Pre-diabetes 5.7–6.4% · ADA 2024"
        />

        {/* ── Micronutrients ───────────────────────────────────── */}
        <div style={{ marginTop: 24 }} />
        <SectionLabel>Micronutrients</SectionLabel>

        <MarkerCard
          name="Vitamin D (25-OH)"
          value={vitD}
          unit="ng/mL"
          statusKey="vitD"
          statusLabel={vitD !== null ? (vitD < 20 ? 'Deficient' : vitD < 30 ? 'Insufficient' : 'Sufficient') : '–'}
          segments={SEGMENTS.vitD}
          displayMin={0} displayMax={80}
          reference="Optimal 30–60 ng/mL · Endocrine Society 2011"
        />
        <MarkerCard
          name="Ferritin (iron stores)"
          value={ferritin}
          unit="ng/mL"
          statusKey="ferritin"
          statusLabel={ferritin !== null ? (ferritin < 30 ? 'Low' : ferritin <= 300 ? 'Normal' : 'High') : '–'}
          segments={SEGMENTS.ferritin}
          displayMin={0} displayMax={300}
          reference="Normal range 30–400 ng/mL (males)"
        />

        {/* ── Thyroid ──────────────────────────────────────────── */}
        <div style={{ marginTop: 24 }} />
        <SectionLabel>Thyroid</SectionLabel>

        <MarkerCard
          name="TSH (Thyroid Stimulating Hormone)"
          value={tsh}
          unit="mIU/L"
          statusKey="tsh"
          statusLabel={tsh !== null ? (tsh < 0.4 ? 'Low (Hyper)' : tsh <= 4.0 ? 'Normal' : 'Elevated (Hypo)') : '–'}
          segments={SEGMENTS.tsh}
          displayMin={0.0} displayMax={6.5}
          reference="Normal 0.4–4.0 mIU/L · ATA 2012"
        />

        {/* ── Body Composition ─────────────────────────────────── */}
        <div style={{ marginTop: 24 }} />
        <SectionLabel>Body Composition</SectionLabel>

        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <MiniMetric label="BMI (Asian)" value={bmi.toFixed(1)} status={bmiStatus} />
          <MiniMetric label="Body Fat" value={lw?.bodyFat ? `${lw.bodyFat}%` : '–'} status={lw?.bodyFat ? (lw.bodyFat < 18 ? 'optimal' : lw.bodyFat < 25 ? 'borderline' : 'abnormal') : undefined} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <MiniMetric label="Visceral Fat" value={lw?.visceralFat ? String(lw.visceralFat) : '–'} status={lw?.visceralFat ? (lw.visceralFat <= 9 ? 'optimal' : lw.visceralFat <= 14 ? 'borderline' : 'abnormal') : undefined} />
          <MiniMetric label="Muscle Mass" value={lw?.muscleMass ? `${lw.muscleMass}kg` : '–'} status="optimal" />
        </div>
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: '10px 14px', marginBottom: 4 }}>
          <p style={{ fontSize: 11, color: C.faint }}>
            Asian BMI thresholds: Overweight ≥23, Obese ≥27.5 (vs. WHO ≥25/30).
            Visceral fat score ≤9 recommended for cardiometabolic health.{' '}
            <span style={{ fontStyle: 'italic' }}>WHO Expert Consultation, 2004</span>
          </p>
        </div>

        {/* ── Vitals ───────────────────────────────────────────── */}
        <div style={{ marginTop: 24 }} />
        <SectionLabel>Vitals</SectionLabel>

        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <MiniMetric label="Resting HR" value={ls?.restingHeartRate ? `${ls.restingHeartRate}` : '–'} unit="bpm" status={ls?.restingHeartRate ? (ls.restingHeartRate < 60 ? 'optimal' : ls.restingHeartRate < 70 ? 'borderline' : 'abnormal') : undefined} />
          <MiniMetric label="Blood Pressure" value={bp} status="optimal" />
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <MiniMetric label="VO2 Max" value={lv?.value ? String(lv.value) : '–'} unit="mL/kg/min" status={lv?.value ? (lv.value >= 47 ? 'optimal' : lv.value >= 40 ? 'borderline' : 'abnormal') : undefined} />
          <MiniMetric label="HRV" value={ls?.hrv ? `${ls.hrv}` : '–'} unit="ms" status={ls?.hrv ? (ls.hrv >= 50 ? 'optimal' : ls.hrv >= 35 ? 'borderline' : 'abnormal') : undefined} />
        </div>

        {/* ── GP Recommendations ───────────────────────────────── */}
        <div style={{ marginTop: 24 }} />
        <SectionLabel>GP Recommendations</SectionLabel>

        {recs.map((rec, i) => {
          const p = priorityColor(rec.priority);
          return (
            <div key={i} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: '16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {rec.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: p.fg, background: p.bg, padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{rec.title}</p>
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{rec.body}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── All Documents ────────────────────────────────────── */}
        <div style={{ marginTop: 24 }} />
        <SectionLabel>Health Documents</SectionLabel>

        {pathology.map(doc => (
          <div key={doc.id} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={18} color="#3B82F6" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.filename}</p>
              <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{doc.summary}</p>
            </div>
            <div style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: '#EFF6FF', color: '#3B82F6', textTransform: 'capitalize' }}>
              {doc.type.replace('_', ' ')}
            </div>
          </div>
        ))}

        {/* Disclaimer */}
        <div style={{ marginTop: 20, padding: '12px 14px', background: '#F8FAFC', borderRadius: 12, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 10, color: C.faint, lineHeight: 1.6 }}>
            <strong>Medical Disclaimer:</strong> This dashboard is for personal health tracking only. Reference ranges are based on ACC/AHA, ADA, and Endocrine Society guidelines. Consult your GP before making any changes to medication, diet, or exercise based on these results.
          </p>
        </div>

      </div>
    </div>
  );
}
