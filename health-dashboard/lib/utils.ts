import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBMICategory(bmi: number, asian = true): { label: string; color: string } {
  if (asian) {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 23) return { label: 'Normal', color: 'text-green-500' };
    if (bmi < 27.5) return { label: 'Overweight', color: 'text-amber-500' };
    return { label: 'Obese', color: 'text-red-500' };
  }
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-amber-500' };
  return { label: 'Obese', color: 'text-red-500' };
}

export function getVO2MaxCategory(vo2max: number, age: number): string {
  // Male 30-39 categories (mL/kg/min)
  if (age >= 30 && age < 40) {
    if (vo2max < 34) return 'Poor';
    if (vo2max < 40) return 'Fair';
    if (vo2max < 47) return 'Good';
    if (vo2max < 53) return 'Excellent';
    return 'Superior';
  }
  return 'Good';
}

export function getStressLevel(score: number): { label: string; color: string } {
  if (score < 25) return { label: 'Very Low', color: 'text-green-500' };
  if (score < 50) return { label: 'Low', color: 'text-green-400' };
  if (score < 65) return { label: 'Moderate', color: 'text-amber-500' };
  if (score < 80) return { label: 'High', color: 'text-orange-500' };
  return { label: 'Very High', color: 'text-red-500' };
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
}

export function formatRelativeTime(isoStr: string): string {
  const now = Date.now();
  const then = new Date(isoStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

export function avg(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function trend(arr: number[]): 'up' | 'down' | 'stable' {
  if (arr.length < 2) return 'stable';
  const delta = arr[arr.length - 1] - arr[arr.length - 4 < 0 ? 0 : arr.length - 4];
  if (Math.abs(delta) < 0.2) return 'stable';
  return delta > 0 ? 'up' : 'down';
}
