import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/lib/theme'

const SCAN_MESSAGES = [
  'Connecting to Gmail...',
  'Searching for policy emails...',
  'Found 3 insurance documents...',
  'Extracting policy details...',
  'Analysis complete!',
]

export default function ScanningScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  const [messageIndex, setMessageIndex] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [progressWidth, setProgressWidth] = useState(0)

  const pulseAnim = useRef(new Animated.Value(1)).current
  const progressAnim = useRef(new Animated.Value(0)).current
  const containerWidth = useRef(0)

  // Pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    )
    pulse.start()
    return () => pulse.stop()
  }, [])

  // Progress animation + message cycling
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start()

    const messageTimer = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, SCAN_MESSAGES.length - 1))
    }, 900)

    const countTimer = setInterval(() => {
      setFoundCount((c) => {
        if (c < 3) return c + 1
        return c
      })
    }, 1400)

    const doneTimer = setTimeout(() => {
      router.push('/onboarding/review')
    }, 4200)

    return () => {
      clearInterval(messageTimer)
      clearInterval(countTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  const progressInterp = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 40,
        },
      ]}
    >
      {/* Pulsing circle */}
      <View style={styles.pulseArea}>
        <Animated.View
          style={[
            styles.outerRing,
            {
              borderColor: theme.primary + '40',
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <View style={[styles.innerCircle, { backgroundColor: theme.primary + '20', borderColor: theme.primary + '60' }]}>
          <View style={[styles.dotCenter, { backgroundColor: theme.primary }]} />
        </View>
      </View>

      <Text style={[styles.heading, { color: theme.text }]}>
        Scanning your inbox
      </Text>

      <Text style={[styles.message, { color: theme.primary }]}>
        {SCAN_MESSAGES[messageIndex]}
      </Text>

      {foundCount > 0 && (
        <Text style={[styles.foundText, { color: theme.covered }]}>
          {foundCount} document{foundCount !== 1 ? 's' : ''} found
        </Text>
      )}

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: theme.primary,
              width: progressInterp,
            },
          ]}
        />
      </View>

      <Text style={[styles.subtext, { color: theme.muted }]}>
        This only takes a few seconds
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  pulseArea: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  outerRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCenter: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  foundText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 32,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  subtext: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
})
