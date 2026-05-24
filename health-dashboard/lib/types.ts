export interface WeightEntry {
  date: string;
  weight: number;
  bmi: number;
  bodyFat?: number;
  muscleMass?: number;
  boneMass?: number;
  visceralFat?: number;
  waterPercent?: number;
  metabolicAge?: number;
  source: 'apple_health' | 'renpho' | 'manual';
}

export interface SleepEntry {
  date: string;
  totalHours: number;
  deepSleep: number;
  remSleep: number;
  lightSleep: number;
  awake: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  heartRateDip: number;
  source: 'apple_health' | 'manual';
}

export interface ExerciseEntry {
  date: string;
  type: string;
  duration: number;
  calories: number;
  heartRateAvg?: number;
  heartRateMax?: number;
  distance?: number;
  elevationGain?: number;
  vo2max?: number;
  pace?: number;
  steps?: number;
  activeCalories: number;
  source: 'apple_health' | 'strava' | 'manual';
  stravaId?: string;
}

export interface StressEntry {
  date: string;
  score: number;
  hrv: number;
  restingHeartRate: number;
  recoveryScore?: number;
  source: 'apple_health' | 'manual';
}

export interface PathologyDocument {
  id: string;
  filename: string;
  uploadDate: string;
  type: 'blood_test' | 'imaging' | 'report' | 'prescription' | 'other';
  summary?: string;
  keyValues?: Record<string, string>;
  filePath: string;
}

export interface VO2MaxEntry {
  date: string;
  value: number;
  category: string;
  source: 'apple_health' | 'strava' | 'manual';
}

export interface HealthData {
  profile: UserProfile;
  weight: WeightEntry[];
  sleep: SleepEntry[];
  exercise: ExerciseEntry[];
  stress: StressEntry[];
  vo2max: VO2MaxEntry[];
  pathology: PathologyDocument[];
  lastSync: Record<string, string>;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  ethnicity: string;
  height: number;
  targetWeight: number;
  location: string;
  stravaConnected: boolean;
  appleHealthConnected: boolean;
  renphoConnected: boolean;
}

export interface CoachRecommendation {
  id: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  nutrients?: NutrientGoal[];
}

export interface NutrientGoal {
  name: string;
  target: string;
  current?: string;
  unit: string;
  reason: string;
}

export interface DailyPlan {
  date: string;
  meals: MealSuggestion[];
  workout?: WorkoutSuggestion;
  recoveryTips: string[];
  sleepTarget: number;
}

export interface MealSuggestion {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
}

export interface WorkoutSuggestion {
  type: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  description: string;
  exercises: string[];
}
