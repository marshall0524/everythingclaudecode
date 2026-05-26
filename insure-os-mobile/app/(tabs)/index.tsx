import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  Settings,
  FileUp,
  MessageCircle,
  FileWarning,
  ShoppingBag,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react-native'
import { useTheme } from '@/lib/theme'
import { useStore } from '@/lib/store'
import { CoverageRing } from '@/components/CoverageRing'
import { PolicyCard } from '@/components/PolicyCard'
import { Card } from '@/components/ui/Card'
import { USER_NAME } from '@/lib/mock-data'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getTodayStr() {
  return new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const router = useRouter()
  const { policies, gaps, coverageScore, chatMessages } = useStore((s) => ({
    policies: s.policies,
    gaps: s.gaps,
    coverageScore: s.coverageScore,
    chatMessages: s.chatMessages,
  }))

  const highGaps = gaps.filter((g) => g.severity === 'high')
  const mediumGaps = gaps.filter((g) => g.severity === 'medium')

  const alerts = [
    ...highGaps.map((g) => ({ ...g, color: theme.danger, icon: 'high' })),
    ...mediumGaps.map((g) => ({ ...g, color: theme.warning, icon: 'medium' })),
  ]

  const quickActions = [
    { icon: <FileUp size={22} color={theme.primary} />, label: 'Upload\nDocument', onPress: () => {} },
    { icon: <MessageCircle size={22} color={theme.primary} />, label: 'Ask\nAdvisor', onPress: () => router.push('/(tabs)/chat') },
    { icon: <FileWarning size={22} color={theme.primary} />, label: 'File\nClaim', onPress: () => {} },
    { icon: <ShoppingBag size={22} color={theme.primary} />, label: 'Browse\nInsurance', onPress: () => router.push('/(tabs)/browse') },
  ]

  const lastMsg = [...chatMessages].reverse().find((m) => m.role === 'assistant')

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              {getGreeting()}, {USER_NAME}
            </Text>
            <Text style={[styles.date, { color: theme.muted }]}>{getTodayStr()}</Text>
          </View>
          <TouchableOpacity
            style={[styles.settingsBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Settings size={20} color={theme.muted} />
          </TouchableOpacity>
        </View>

        {/* Coverage Score Card */}
        <Card style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <CoverageRing score={coverageScore} size={90} />
            <View style={styles.scoreInfo}>
              <Text style={[styles.scoreLabel, { color: theme.muted }]}>
                Coverage Score
              </Text>
              <Text style={[styles.scoreValue, { color: theme.text }]}>
                {coverageScore}/100
              </Text>
              <Text style={[styles.gapsWarning, { color: theme.warning }]}>
                ⚠ {gaps.length} gaps found
              </Text>
              <Text style={[styles.scoreDesc, { color: theme.muted }]}>
                Tap Coverage tab to see details
              </Text>
            </View>
          </View>
        </Card>

        {/* Alert banners */}
        {alerts.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Alerts
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.alertsScroll}
            >
              {alerts.slice(0, 5).map((alert) => (
                <TouchableOpacity
                  key={alert.category}
                  style={[
                    styles.alertBanner,
                    {
                      backgroundColor: alert.color + '15',
                      borderColor: alert.color + '40',
                    },
                  ]}
                  onPress={() => router.push('/(tabs)/coverage')}
                >
                  {alert.icon === 'high' ? (
                    <AlertCircle size={16} color={alert.color} />
                  ) : (
                    <AlertTriangle size={16} color={alert.color} />
                  )}
                  <Text style={[styles.alertText, { color: alert.color }]} numberOfLines={2}>
                    {alert.category} — {alert.severity === 'high' ? 'High' : 'Medium'} priority
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* My Policies */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          My Policies ({policies.length})
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.policiesScroll}
        >
          {policies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[
                styles.actionCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={action.onPress}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.actionIconBg,
                  { backgroundColor: theme.primary + '15' },
                ]}
              >
                {action.icon}
              </View>
              <Text style={[styles.actionLabel, { color: theme.text }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Advice */}
        {lastMsg && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Advice
            </Text>
            <Card onPress={() => router.push('/(tabs)/chat')}>
              <Text
                style={[styles.recentAdviceText, { color: theme.muted }]}
                numberOfLines={3}
              >
                {lastMsg.content}
              </Text>
              <Text style={[styles.continueLink, { color: theme.primary }]}>
                Continue conversation →
              </Text>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  date: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCard: {
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreInfo: { flex: 1 },
  scoreLabel: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 2,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  gapsWarning: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  scoreDesc: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  alertsScroll: {
    paddingBottom: 20,
    gap: 10,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: 220,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  policiesScroll: {
    paddingBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  actionCard: {
    width: '47%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  recentAdviceText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  continueLink: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
})
