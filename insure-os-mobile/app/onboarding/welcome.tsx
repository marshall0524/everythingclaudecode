import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Shield } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'

export default function WelcomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(40)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <LinearGradient
      colors={['#08091A', '#1A1F45', '#0D1530']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
    >
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.shieldBg}>
            <Shield size={56} color="#4F6EF7" fill="rgba(79,110,247,0.2)" />
          </View>

          <Text style={styles.title}>InsureOS</Text>
          <Text style={styles.subtitle}>
            Your personal insurance advisor.{'\n'}All your policies. One place.
          </Text>
        </View>

        {/* Feature bullets */}
        <View style={styles.features}>
          {[
            { icon: '🛡️', text: 'Auto-sync all your policies' },
            { icon: '🤖', text: 'AI advisor powered by Claude' },
            { icon: '📊', text: 'Coverage gap analysis' },
            { icon: '⚡', text: 'File claims in seconds' },
          ].map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={styles.buttonArea}>
          <Button
            title="Get Started"
            onPress={() => router.push('/onboarding/connect-gmail')}
            variant="primary"
            fullWidth
          />
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => router.push('/onboarding/location')}
          >
            <Text style={styles.skipText}>I'll do this later</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldBg: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(79,110,247,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(79,110,247,0.3)',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#F0F4FF',
    letterSpacing: -1,
    marginBottom: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  subtitle: {
    fontSize: 17,
    color: '#8896BB',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  features: {
    gap: 14,
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#B8C4E0',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  buttonArea: {
    gap: 12,
    paddingBottom: 8,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    color: '#8896BB',
    fontSize: 15,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
})
