import { useStore } from './store'

export const darkColors = {
  bg: '#08091A',
  surface: '#0F1228',
  card: '#161D35',
  border: '#252F50',
  text: '#F0F4FF',
  muted: '#8896BB',
  faint: '#3D4A70',
  primary: '#4F6EF7',
  covered: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  tabBar: '#0F1228',
  tabIconInactive: '#3D4A70',
  tabIconActive: '#4F6EF7',
}

export const lightColors = {
  bg: '#F0F4FF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#DDE3F0',
  text: '#0A0E1A',
  muted: '#5B6480',
  faint: '#A0AABB',
  primary: '#4F6EF7',
  covered: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  tabBar: '#FFFFFF',
  tabIconInactive: '#A0AABB',
  tabIconActive: '#4F6EF7',
}

export type ThemeColors = typeof darkColors

export function useTheme(): ThemeColors {
  const darkMode = useStore(s => s.darkMode)
  return darkMode ? darkColors : lightColors
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
}

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
}
