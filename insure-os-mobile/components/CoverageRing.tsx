import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { useTheme } from '@/lib/theme'

interface CoverageRingProps {
  score: number
  size?: number
  strokeWidth?: number
  color?: string
  showLabel?: boolean
}

export function CoverageRing({
  score,
  size = 80,
  strokeWidth = 8,
  color,
  showLabel = true,
}: CoverageRingProps) {
  const theme = useTheme()
  const animatedScore = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 1200,
      useNativeDriver: false,
    }).start()
  }, [score])

  const ringColor =
    color ??
    (score >= 75 ? theme.covered : score >= 50 ? theme.warning : theme.danger)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const dashoffset = circumference - progress

  const cx = size / 2
  const cy = size / 2

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={theme.border}
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}`}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.scoreText, { color: ringColor, fontSize: size * 0.22 }]}>
            {score}%
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontWeight: '700',
  },
})
