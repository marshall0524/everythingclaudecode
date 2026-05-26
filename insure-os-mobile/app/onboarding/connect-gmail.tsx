import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, Mail, Check } from 'lucide-react-native'
import * as AuthSession from 'expo-auth-session'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'
import { signInWithGoogle } from '@/lib/gmail'
import { useTheme } from '@/lib/theme'

export default function ConnectGmailScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const setGmailToken = useStore((s) => s.setGmailToken)
  const [loading, setLoading] = useState(false)

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'insure-os' })

  const handleConnect = async () => {
    setLoading(true)
    try {
      const token = await signInWithGoogle(redirectUri)
      if (token) {
        setGmailToken(token)
        router.push('/onboarding/scanning')
      }
    } catch (err) {
      console.error('Gmail auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  const privacyPoints = [
    'Read-only access — we never modify your email',
    'Only insurance-related emails are processed',
    'Disconnect anytime from Profile',
  ]

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color={theme.text} />
      </TouchableOpacity>

      {/* Gmail icon */}
      <View style={[styles.iconBg, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Mail size={40} color={theme.primary} />
      </View>

      <Text style={[styles.heading, { color: theme.text }]}>
        Sync your Gmail
      </Text>
      <Text style={[styles.subheading, { color: theme.muted }]}>
        We scan your inbox for insurance policy emails and PDFs — nothing is
        stored on our servers.
      </Text>

      {/* Privacy points */}
      <View style={[styles.privacyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {privacyPoints.map((point) => (
          <View key={point} style={styles.privacyRow}>
            <View style={[styles.checkCircle, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <Check size={14} color="#10B981" />
            </View>
            <Text style={[styles.privacyText, { color: theme.text }]}>{point}</Text>
          </View>
        ))}
      </View>

      <View style={styles.spacer} />

      <View style={styles.buttonArea}>
        <Button
          title="Connect Gmail"
          onPress={handleConnect}
          loading={loading}
          icon={<Mail size={18} color="#FFFFFF" />}
          fullWidth
        />
        <Button
          title="Skip for now"
          onPress={() => router.push('/onboarding/review')}
          variant="ghost"
          fullWidth
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: 4,
    marginBottom: 32,
  },
  iconBg: {
    width: 88,
    height: 88,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  privacyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    width: '100%',
    gap: 12,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  privacyText: {
    fontSize: 14,
    flex: 1,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  buttonArea: {
    width: '100%',
    gap: 8,
  },
})
