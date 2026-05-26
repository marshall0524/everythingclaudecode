import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/lib/theme'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  style?: ViewStyle
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const theme = useTheme()

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      height: 52,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      gap: 8,
    }
    if (fullWidth) base.width = '100%'

    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: disabled ? theme.faint : theme.primary }
      case 'secondary':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.primary,
        }
      case 'ghost':
        return { ...base, backgroundColor: 'transparent' }
      case 'danger':
        return { ...base, backgroundColor: disabled ? theme.faint : theme.danger }
      default:
        return { ...base, backgroundColor: theme.primary }
    }
  }

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.3,
    }
    switch (variant) {
      case 'primary':
        return { ...base, color: '#FFFFFF' }
      case 'secondary':
        return { ...base, color: theme.primary }
      case 'ghost':
        return { ...base, color: theme.muted }
      case 'danger':
        return { ...base, color: '#FFFFFF' }
      default:
        return { ...base, color: '#FFFFFF' }
    }
  }

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'ghost' ? theme.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})
