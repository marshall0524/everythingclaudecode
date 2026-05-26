import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, Plus } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useStore } from '@/lib/store'
import { useTheme } from '@/lib/theme'
import { POLICY_TYPE_LABELS } from '@/constants/insurance'

export default function ReviewScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const policies = useStore((s) => s.policies)

  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(policies.map((p) => [p.id, true]))
  )

  const togglePolicy = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const selectedCount = Object.values(selected).filter(Boolean).length

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.heading, { color: theme.text }]}>
          Review found policies
        </Text>
        <Text style={[styles.subheading, { color: theme.muted }]}>
          We found these policies in your inbox. Confirm what to add.
        </Text>

        <View style={styles.policyList}>
          {policies.map((policy) => (
            <Card key={policy.id} style={styles.policyCard}>
              <View style={styles.policyRow}>
                {/* Provider initial avatar */}
                <View
                  style={[
                    styles.providerAvatar,
                    { backgroundColor: theme.primary + '25', borderColor: theme.primary + '50' },
                  ]}
                >
                  <Text style={[styles.providerInitial, { color: theme.primary }]}>
                    {policy.provider.charAt(0)}
                  </Text>
                </View>

                {/* Policy info */}
                <View style={styles.policyInfo}>
                  <Text style={[styles.policyName, { color: theme.text }]} numberOfLines={1}>
                    {policy.name}
                  </Text>
                  <View style={styles.policyMeta}>
                    <Badge
                      label={POLICY_TYPE_LABELS[policy.type] ?? policy.type}
                      variant="active"
                      small
                    />
                    <Text style={[styles.policyExpiry, { color: theme.muted }]}>
                      Exp: {policy.expiryDate}
                    </Text>
                  </View>
                  <Text style={[styles.providerName, { color: theme.muted }]}>
                    {policy.provider}
                  </Text>
                </View>

                {/* Toggle */}
                <Switch
                  value={selected[policy.id] ?? true}
                  onValueChange={() => togglePolicy(policy.id)}
                  trackColor={{ false: theme.faint, true: theme.primary + '80' }}
                  thumbColor={selected[policy.id] ? theme.primary : theme.muted}
                />
              </View>
            </Card>
          ))}
        </View>

        <TouchableOpacity style={styles.manualLink}>
          <Plus size={16} color={theme.primary} />
          <Text style={[styles.manualText, { color: theme.primary }]}>
            Add policy manually
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <Button
          title={`Add ${selectedCount} Selected ${selectedCount === 1 ? 'Policy' : 'Policies'}`}
          onPress={() => router.push('/onboarding/location')}
          variant="primary"
          fullWidth
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  backBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  content: {
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  subheading: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  policyList: {
    gap: 12,
    marginBottom: 24,
  },
  policyCard: {
    padding: 14,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  providerInitial: {
    fontSize: 18,
    fontWeight: '700',
  },
  policyInfo: {
    flex: 1,
    gap: 4,
  },
  policyName: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  policyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  policyExpiry: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  providerName: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  manualLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  manualText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
})
