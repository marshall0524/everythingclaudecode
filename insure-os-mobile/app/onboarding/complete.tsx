import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/lib/theme'

export default function CompleteScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const { completeOnboarding, policies, gaps, coverageScore } = useStore((s) => ({
    completeOnboarding: s.completeOnboarding,
    policies: s.policies,
    gaps: s.gaps,
    coverageScore: s.coverageScore,
  }))

  const scaleAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Then pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start()
    })
  }, [])

  const handleGoToDashboard = () => {
    completeOnboarding()
    router.replace('/(tabs)')
  }

  return (
    <LinearGradient
      colors={['#08091A', '#0F1A30']}
      style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}
    >
      {/* Success icon */}
      <Animated.View
        style={[
          styles.iconArea,
          { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
        ]}
      >
        <Animated.View
          style={[
            styles.outerRing,
            { transform: [{ scale: pulseAnim }] },
          ]}
        />
        <View style={styles.checkCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.textArea, { opacity: fadeAnim }]}>
        <Text style={[styles.heading, { color: '#F0F4FF' }]}>
          You're all set!
        </Text>
        <Text style={[styles.subheading, { color: '#8896BB' }]}>
          InsureOS is ready to be your insurance advisor.{'\n'}Ask anything.
        </Text>
      </Animated.View>

      {/* Stats */}
      <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
        <View style={[styles.statCard, { backgroundColor: 'rgba(79,110,247,0.12)', borderColor: 'rgba(79,110,247,0.25)' }]}>
          <Text style={styles.statNumber}>{policies.length}</Text>
          <Text style={[styles.statLabel, { color: '#8896BB' }]}>Policies Synced</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.25)' }]}>
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{gaps.length}</Text>
          <Text style={[styles.statLabel, { color: '#8896BB' }]}>Gaps Found</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.25)' }]}>
          <Text style={[styles.statNumber, { color: '#10B981' }]}>{coverageScore}%</Text>
          <Text style={[styles.statLabel, { color: '#8896BB' }]}>Coverage</Text>
        </View>
      </Animated.View>

      <View style={styles.spacer} />

      <Animated.View style={[{ width: '100%', opacity: fadeAnim }]}>
        <Button
          title="Go to Dashboard"
          onPress={handleGoToDashboard}
          variant="primary"
          fullWidth
        />
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  iconArea: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  outerRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  textArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4F6EF7',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  spacer: { flex: 1 },
})
