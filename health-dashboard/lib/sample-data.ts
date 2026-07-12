import { HealthData } from './types';

// This is the starting state before any real sync has happened — no fabricated
// history. Weight/sleep/exercise/stress/vo2max stay empty until Apple Health,
// Strava, or RENPHO actually sync data in via the /api endpoints. Never seed
// these arrays with invented numbers — the coach and UI both key off
// `isSampleData` to warn when advice would otherwise be ungrounded.
export const sampleHealthData: HealthData = {
  profile: {
    name: 'Marshall',
    dob: '1996-05-24',
    age: 30,
    gender: 'male',
    ethnicity: 'Chinese (Shanghainese)',
    height: 167,
    targetWeight: 70,
    targetBodyFatPercent: '15-18',
    location: 'London, UK',
    timezone: 'Europe/London',
    goals: [
      'Reach a healthy BMI / weight range (~70kg)',
      'Get lean — 15-18% body fat',
      'Longevity — long-term healthspan, not just aesthetics',
    ],
    knownConditions: [
      'Fatty liver (NAFLD) — flagged on prior imaging/bloodwork; follow-up panel (fasting glucose, lipids, iron studies, hepatitis serology, thyroid function) pending as of the 12 May 2026 blood draw',
    ],
    stravaConnected: false,
    appleHealthConnected: false,
    renphoConnected: false,
  },
  weight: [],
  sleep: [],
  exercise: [],
  stress: [],
  vo2max: [],
  pathology: [
    {
      id: 'doc-001',
      filename: 'Full_Blood_Count_2026-05-12.pdf',
      uploadDate: '2026-05-12',
      type: 'blood_test',
      summary: 'Full Blood Count, 12 May 2026 (Medical Centre Healthpac, Dr George Tang). Clinical notes: fatty liver, post Hep A/B vaccine. All FBC parameters normal. Follow-up tests pending: fasting blood sugar (BSL), chem/liver panel (CHEM), lipids (FATS), iron studies (FE), hepatitis serology (HEPS), thyroid function (TFT).',
      keyValues: {
        'Haemoglobin': '139 g/L (ref 130-180)',
        'RBC': '4.5 x10^12/L (ref 4.3-6.5)',
        'HCT': '0.41 (ref 0.40-0.54)',
        'MCV': '91.9 fL (ref 80-100)',
        'MCH': '31 pg (ref 27-34)',
        'MCHC': '339 g/L (ref 300-360)',
        'RDW': '12.2% (ref 10-15)',
        'WCC': '7.2 x10^9/L (ref 4-11)',
        'Neutrophils': '3.3 x10^9/L (ref 2-8)',
        'Lymphocytes': '3.3 x10^9/L (ref 1-4)',
        'Monocytes': '0.5 x10^9/L (ref 0.1-1.1)',
        'Platelets': '216 x10^9/L (ref 150-450)',
        'MPV': '9.9 fL (ref 6.5-15)',
      },
      filePath: '',
    },
  ],
  coachNotes: [],
  lastSync: {},
  isSampleData: true,
};
