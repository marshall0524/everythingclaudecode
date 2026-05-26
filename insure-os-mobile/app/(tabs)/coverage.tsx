import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ChevronDown, ChevronRight, Check, X, ShoppingBag } from 'lucide-react-native'
import { useTheme } from '@/lib/theme'
import { useStore } from '@/lib/store'
import { CoverageRing } from '@/components/CoverageRing'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const CATEGORY_SCORES = [
  { label: 'Medical / Health', score: 85, color: '#10B981' },
  { label: 'Travel', score: 70, color: '#F59E0B' },
  { label: 'Vehicle', score: 90, color: '#10B981' },
  { label: 'Property', score: 0, color: '#EF4444' },
  { label: 'Life / Income', score: 10, color: '#EF4444' },
]

function CategoryBar({
  label,
  score,
  color,
  theme,
}: {
  label: string
  score: number
  color: string
  theme: any
}) {
  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryLabelRow}>
        <Text style={[styles.categoryLabel, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.categoryScore, { color }]}>{score}%</Text>
      </View>
      <View style={[styles.barTrack, { backgroundColor: theme.faint + '50' }]}>
        <View
          style={[
            styles.barFill,
            { width: `${score}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  )
}

function GapCard({ gap, theme, onGetCovered }: { gap: any; theme: any; onGetCovered: () => void }) {
  const severityVariant =
    gap.severity === 'high' ? 'high' : gap.severity === 'medium' ? 'medium' : 'low'
  const borderColor =
    gap.severity === 'high'
      ? theme.danger + '50'
      : gap.severity === 'medium'
      ? theme.warning + '50'
      : theme.primary + '50'

  return (
    <Card style={StyleSheet.flatten([styles.gapCard, { borderColor }])}>
      <View style={styles.gapHeader}>
        <Text style={[styles.gapCategory, { color: theme.text }]}>
          {gap.category}
        </Text>
        <Badge label={gap.severity.toUpperCase()} variant={severityVariant} small />
      </View>
      <Text style={[styles.gapDesc, { color: theme.muted }]} numberOfLines={3}>
        {gap.description}
      </Text>
      <Text style={[styles.gapRec, { color: theme.text }]} numberOfLines={2}>
        💡 {gap.recommendation}
      </Text>
      <TouchableOpacity
        style={[styles.getCoveredBtn, { borderColor: theme.primary }]}
        onPress={onGetCovered}
      >
        <ShoppingBag size={14} color={theme.primary} />
        <Text style={[styles.getCoveredText, { color: theme.primary }]}>
          Get covered →
        </Text>
      </TouchableOpacity>
    </Card>
  )
}

function PolicyAccordion({ policy, theme }: { policy: any; theme: any }) {
  const [expanded, setExpanded] = useState(false)

  const covered = policy.coverageItems.filter((c: any) => c.covered)
  const notCovered = policy.coverageItems.filter((c: any) => !c.covered)

  return (
    <View style={[styles.accordion, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setExpanded((e) => !e)}
        activeOpacity={0.7}
      >
        <View>
          <Text style={[styles.accordionTitle, { color: theme.text }]}>
            {policy.name}
          </Text>
          <Text style={[styles.accordionSub, { color: theme.muted }]}>
            {policy.provider} · {covered.length} covered, {notCovered.length} excluded
          </Text>
        </View>
        {expanded ? (
          <ChevronDown size={20} color={theme.muted} />
        ) : (
          <ChevronRight size={20} color={theme.muted} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.accordionBody, { borderTopColor: theme.border }]}>
          {covered.length > 0 && (
            <>
              <Text style={[styles.coverageGroupLabel, { color: theme.covered }]}>
                Covered
              </Text>
              {covered.map((item: any) => (
                <View key={item.category} style={styles.coverageItemRow}>
                  <Check size={14} color={theme.covered} />
                  <Text style={[styles.coverageItemText, { color: theme.text }]}>
                    {item.category}
                    {item.limit ? ` — up to $${item.limit.toLocaleString()}` : ''}
                  </Text>
                </View>
              ))}
            </>
          )}
          {notCovered.length > 0 && (
            <>
              <Text style={[styles.coverageGroupLabel, { color: theme.danger, marginTop: 12 }]}>
                Not Covered
              </Text>
              {notCovered.map((item: any) => (
                <View key={item.category} style={styles.coverageItemRow}>
                  <X size={14} color={theme.danger} />
                  <Text style={[styles.coverageItemText, { color: theme.muted }]}>
                    {item.category}
                    {item.notes ? ` — ${item.notes.replace('NOT covered — ', '')}` : ''}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </View>
  )
}

export default function CoverageScreen() {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const router = useRouter()
  const { policies, gaps, coverageScore } = useStore((s) => ({
    policies: s.policies,
    gaps: s.gaps,
    coverageScore: s.coverageScore,
  }))

  const sortedGaps = [...gaps].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Coverage Score */}
      <Text style={[styles.screenTitle, { color: theme.text }]}>
        Coverage Analysis
      </Text>

      <Card style={styles.scoreBigCard}>
        <View style={styles.scoreBigRow}>
          <CoverageRing score={coverageScore} size={120} strokeWidth={10} />
          <View style={styles.scoreBigInfo}>
            <Text style={[styles.scoreBigLabel, { color: theme.muted }]}>
              Your Coverage Score
            </Text>
            <Text style={[styles.scoreBigValue, { color: theme.text }]}>
              {coverageScore}/100
            </Text>
            <Text style={[styles.scoreBigDesc, { color: theme.muted }]}>
              Based on {policies.length} active policies and {gaps.length} identified gaps
            </Text>
          </View>
        </View>
      </Card>

      {/* Category bars */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        By Category
      </Text>
      <Card style={{ marginBottom: 24 }}>
        <View style={{ gap: 16 }}>
          {CATEGORY_SCORES.map((cat) => (
            <CategoryBar key={cat.label} {...cat} theme={theme} />
          ))}
        </View>
      </Card>

      {/* Gaps */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Coverage Gaps ({gaps.length})
      </Text>
      <View style={styles.gapsList}>
        {sortedGaps.map((gap) => (
          <GapCard
            key={gap.category}
            gap={gap}
            theme={theme}
            onGetCovered={() => router.push('/(tabs)/browse')}
          />
        ))}
      </View>

      {/* By Policy */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        By Policy
      </Text>
      <View style={{ gap: 8 }}>
        {policies.map((policy) => (
          <PolicyAccordion key={policy.id} policy={policy} theme={theme} />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  scoreBigCard: { marginBottom: 24 },
  scoreBigRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreBigInfo: { flex: 1 },
  scoreBigLabel: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  scoreBigValue: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  scoreBigDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  categoryRow: { gap: 6 },
  categoryLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  categoryScore: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  gapsList: { gap: 12, marginBottom: 24 },
  gapCard: { gap: 10 },
  gapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gapCategory: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  gapDesc: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  gapRec: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  getCoveredBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  getCoveredText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  accordion: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  accordionSub: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  accordionBody: {
    padding: 16,
    borderTopWidth: 1,
    gap: 6,
  },
  coverageGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  coverageItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  coverageItemText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
})
