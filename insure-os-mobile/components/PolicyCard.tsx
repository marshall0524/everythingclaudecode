import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
  Plane,
  Heart,
  Car,
  Home,
  Shield,
  HelpCircle,
} from 'lucide-react-native'
import { Policy } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { POLICY_TYPE_GRADIENTS } from '@/constants/insurance'

interface PolicyCardProps {
  policy: Policy
  onPress?: () => void
}

const POLICY_ICONS: Record<string, React.ReactNode> = {
  travel: <Plane size={18} color="rgba(255,255,255,0.9)" />,
  health: <Heart size={18} color="rgba(255,255,255,0.9)" />,
  auto: <Car size={18} color="rgba(255,255,255,0.9)" />,
  home: <Home size={18} color="rgba(255,255,255,0.9)" />,
  life: <Shield size={18} color="rgba(255,255,255,0.9)" />,
  other: <HelpCircle size={18} color="rgba(255,255,255,0.9)" />,
}

function formatExpiry(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export function PolicyCard({ policy, onPress }: PolicyCardProps) {
  const gradientColors = POLICY_TYPE_GRADIENTS[policy.type] ?? ['#1A1A2E', '#16213E']
  const icon = POLICY_ICONS[policy.type] ?? POLICY_ICONS.other

  const statusVariant =
    policy.status === 'active'
      ? 'active'
      : policy.status === 'expired'
      ? 'expired'
      : 'pending'

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.wrapper}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.iconBg}>{icon}</View>
          <Badge
            label={policy.status.toUpperCase()}
            variant={statusVariant}
            small
          />
        </View>

        <Text style={styles.provider} numberOfLines={1}>
          {policy.provider}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {policy.name}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.expiry}>Exp: {formatExpiry(policy.expiryDate)}</Text>
          <Text style={styles.premium}>
            ${policy.premium}/{policy.premiumFrequency === 'monthly' ? 'mo' : 'yr'}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 12,
  },
  card: {
    width: 200,
    height: 130,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  provider: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiry: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
  },
  premium: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
})
