import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { Shield } from 'lucide-react-native'
import { useTheme } from '@/lib/theme'

interface AdvisorAvatarProps {
  size?: number
  active?: boolean
  typing?: boolean
}

export function AdvisorAvatar({
  size = 44,
  active = true,
  typing = false,
}: AdvisorAvatarProps) {
  const theme = useTheme()
  const pulseAnim = useRef(new Animated.Value(1)).current
  const pulseOpacity = useRef(new Animated.Value(0.6)).current

  useEffect(() => {
    if (active || typing) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.35,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      )
      pulse.start()
      return () => pulse.stop()
    }
  }, [active, typing])

  const iconSize = size * 0.45

  return (
    <View
      style={[
        styles.container,
        { width: size * 1.5, height: size * 1.5, alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      {/* Pulse ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: theme.primary,
            transform: [{ scale: pulseAnim }],
            opacity: pulseOpacity,
          },
        ]}
      />

      {/* Main circle */}
      <View
        style={[
          styles.main,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.primary,
          },
        ]}
      >
        <Shield size={iconSize} color="#FFFFFF" fill="rgba(255,255,255,0.2)" />
      </View>

      {/* Status dot */}
      {active && (
        <View
          style={[
            styles.statusDot,
            {
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: size * 0.11,
              bottom: size * 0.05,
              right: size * 0.05,
            },
          ]}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#08091A',
  },
})
