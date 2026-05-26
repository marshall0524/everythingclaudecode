import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'
import { useTheme } from '@/lib/theme'
import { REGIONS } from '@/constants/insurance'

export default function LocationScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const setLocation = useStore((s) => s.setLocation)

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)

  const handleRegionTap = (region: (typeof REGIONS)[number]) => {
    if (region.subOptions.length > 0) {
      setExpandedRegion(expandedRegion === region.value ? null : region.value)
      setSelectedRegion(region.value)
      setSelectedSub(null)
    } else {
      setSelectedRegion(region.value)
      setExpandedRegion(null)
      setSelectedSub(null)
    }
  }

  const handleContinue = () => {
    const loc = selectedSub
      ? `${selectedSub}, ${selectedRegion}`
      : selectedRegion
    if (loc) {
      setLocation(loc)
      router.push('/onboarding/complete')
    }
  }

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
          Where are you based?
        </Text>
        <Text style={[styles.subheading, { color: theme.muted }]}>
          So we can give you jurisdiction-specific advice
        </Text>

        <View style={styles.regionList}>
          {REGIONS.map((region) => {
            const isSelected =
              selectedRegion === region.value
            const isExpanded = expandedRegion === region.value

            return (
              <View key={region.value}>
                <TouchableOpacity
                  style={[
                    styles.regionRow,
                    {
                      backgroundColor: isSelected ? theme.primary + '15' : theme.card,
                      borderColor: isSelected ? theme.primary + '60' : theme.border,
                    },
                  ]}
                  onPress={() => handleRegionTap(region)}
                  activeOpacity={0.75}
                >
                  <View style={styles.regionLeft}>
                    {isSelected && !selectedSub && !isExpanded ? (
                      <CheckCircle size={20} color={theme.primary} />
                    ) : (
                      <View
                        style={[
                          styles.radioCircle,
                          {
                            borderColor: isSelected ? theme.primary : theme.faint,
                          },
                        ]}
                      >
                        {isSelected && !isExpanded && (
                          <View
                            style={[styles.radioDot, { backgroundColor: theme.primary }]}
                          />
                        )}
                      </View>
                    )}
                    <Text
                      style={[
                        styles.regionLabel,
                        {
                          color: isSelected ? theme.primary : theme.text,
                          fontWeight: isSelected ? '600' : '400',
                        },
                      ]}
                    >
                      {region.label}
                    </Text>
                  </View>
                  {region.subOptions.length > 0 && (
                    <ChevronRight
                      size={18}
                      color={theme.muted}
                      style={{
                        transform: [{ rotate: isExpanded ? '90deg' : '0deg' }],
                      }}
                    />
                  )}
                </TouchableOpacity>

                {/* Sub-options */}
                {isExpanded && region.subOptions.length > 0 && (
                  <View
                    style={[
                      styles.subOptions,
                      { backgroundColor: theme.surface, borderColor: theme.border },
                    ]}
                  >
                    {region.subOptions.map((sub) => (
                      <TouchableOpacity
                        key={sub}
                        style={[
                          styles.subRow,
                          {
                            backgroundColor:
                              selectedSub === sub
                                ? theme.primary + '15'
                                : 'transparent',
                          },
                        ]}
                        onPress={() => setSelectedSub(sub)}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            {
                              borderColor:
                                selectedSub === sub ? theme.primary : theme.faint,
                            },
                          ]}
                        >
                          {selectedSub === sub && (
                            <View
                              style={[
                                styles.radioDot,
                                { backgroundColor: theme.primary },
                              ]}
                            />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.subLabel,
                            {
                              color:
                                selectedSub === sub ? theme.primary : theme.text,
                            },
                          ]}
                        >
                          {sub}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )
          })}
        </View>
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
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          disabled={!selectedRegion}
          fullWidth
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 8 },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  content: { paddingHorizontal: 24 },
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
  regionList: { gap: 8 },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  regionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  regionLabel: {
    fontSize: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  subOptions: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingVertical: 4,
    marginTop: -8,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  subLabel: {
    fontSize: 15,
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
