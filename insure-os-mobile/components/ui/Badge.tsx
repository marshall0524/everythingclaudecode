import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from '@/lib/theme'

type BadgeVariant =
  | 'active'
  | 'expired'
  | 'pending'
  | 'covered'
  | 'gap'
  | 'warning'
  | 'high'
  | 'medium'
  | 'low'
  | 'recommended'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  style?: ViewStyle
  small?: boolean
}

const VARIANT_COLORS: Record<
  BadgeVariant,
  { bg: string; text: string; border: string }
> = {
  active: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', border: 'rgba(16,185,129,0.3)' },
  expired: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  pending: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  covered: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', border: 'rgba(16,185,129,0.3)' },
  gap: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  warning: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  high: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  low: { bg: 'rgba(79,110,247,0.15)', text: '#4F6EF7', border: 'rgba(79,110,247,0.3)' },
  recommended: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', border: 'rgba(16,185,129,0.3)' },
}

export function Badge({ label, variant = 'active', style, small = false }: BadgeProps) {
  const colors = VARIANT_COLORS[variant]

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingHorizontal: small ? 6 : 8,
          paddingVertical: small ? 2 : 4,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text, fontSize: small ? 10 : 12 },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
})
