import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { useTheme } from '@/lib/theme'

interface SpinnerProps {
  size?: 'small' | 'large'
  color?: string
  centered?: boolean
}

export function Spinner({ size = 'small', color, centered = false }: SpinnerProps) {
  const theme = useTheme()

  if (centered) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={size} color={color ?? theme.primary} />
      </View>
    )
  }

  return <ActivityIndicator size={size} color={color ?? theme.primary} />
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
