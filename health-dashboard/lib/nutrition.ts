import { HealthData, LoggedMeal } from './types';
import { last } from './utils';

// Protein: 1.8g/kg sits in the middle of the evidence-backed 1.6-2.2g/kg range
// for a lean individual in a calorie deficit (Morton et al., 2018).
const PROTEIN_G_PER_KG = 1.8;

// Moderate deficit — preserves lean mass better than aggressive cuts
// (Helms, Zinn, Rowlands & Aragon, 2014).
const DEFICIT_PERCENT = 0.20;

export function currentWeightKg(data: HealthData): number {
  const lw = last(data.weight);
  return lw?.weight ?? data.profile.targetWeight;
}

export function bmrMifflinStJeor(weightKg: number, heightCm: number, age: number, gender: string): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

function activityFactor(weeklyExerciseMinutes: number): number {
  if (weeklyExerciseMinutes >= 300) return 1.55;
  if (weeklyExerciseMinutes >= 150) return 1.45;
  if (weeklyExerciseMinutes >= 60) return 1.375;
  return 1.2;
}

export interface NutritionTargets {
  proteinG: number;
  maintenanceCalories: number;
  calorieTarget: number;
  weightUsedKg: number;
  weeklyExerciseMinutes: number;
}

export function computeTargets(data: HealthData): NutritionTargets {
  const { profile, exercise } = data;
  const weightUsedKg = currentWeightKg(data);
  const weeklyExerciseMinutes = exercise.slice(-7).reduce((s, e) => s + e.duration, 0);
  const bmr = bmrMifflinStJeor(weightUsedKg, profile.height, profile.age, profile.gender);
  const maintenanceCalories = Math.round(bmr * activityFactor(weeklyExerciseMinutes));
  const calorieTarget = Math.round(maintenanceCalories * (1 - DEFICIT_PERCENT));
  const proteinG = Math.round(weightUsedKg * PROTEIN_G_PER_KG);
  return { proteinG, maintenanceCalories, calorieTarget, weightUsedKg, weeklyExerciseMinutes };
}

export function mealsForDate(meals: LoggedMeal[], date: string): LoggedMeal[] {
  return meals.filter(m => m.date === date);
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  addedSugar: number;
}

export function sumMeals(meals: LoggedMeal[]): DailyTotals {
  return meals.reduce((acc, m) => ({
    calories: acc.calories + m.totalCalories,
    protein: acc.protein + m.totalProtein,
    carbs: acc.carbs + m.totalCarbs,
    fat: acc.fat + m.totalFat,
    fiber: acc.fiber + m.totalFiber,
    addedSugar: acc.addedSugar + m.totalAddedSugar,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, addedSugar: 0 });
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
