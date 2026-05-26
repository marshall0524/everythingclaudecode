import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Search, ExternalLink, Star } from 'lucide-react-native'
import { useTheme } from '@/lib/theme'
import { useStore } from '@/lib/store'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MARKETPLACE_PRODUCTS } from '@/constants/insurance'

const FILTER_TABS = ['All', 'Health', 'Travel', 'Auto', 'Home', 'Life', 'Income']

function ProductCard({
  product,
  theme,
}: {
  product: (typeof MARKETPLACE_PRODUCTS)[number]
  theme: any
}) {
  const handleGetQuote = () => {
    Linking.openURL(product.quoteUrl)
  }

  return (
    <Card style={styles.productCard}>
      <View style={styles.productHeader}>
        {/* Provider avatar */}
        <View
          style={[
            styles.providerAvatar,
            { backgroundColor: theme.primary + '20', borderColor: theme.primary + '40' },
          ]}
        >
          <Text style={[styles.providerInitial, { color: theme.primary }]}>
            {product.provider.charAt(0)}
          </Text>
        </View>

        <View style={styles.productHeaderText}>
          <Text style={[styles.productProvider, { color: theme.muted }]}>
            {product.provider}
          </Text>
          <Text style={[styles.productName, { color: theme.text }]}>
            {product.name}
          </Text>
        </View>

        {product.recommended && (
          <Badge label="RECOMMENDED" variant="recommended" small />
        )}
      </View>

      {/* Price */}
      <View style={styles.priceRow}>
        <Text style={[styles.priceFrom, { color: theme.muted }]}>From </Text>
        <Text style={[styles.priceAmount, { color: theme.text }]}>
          ${product.priceFrom}
        </Text>
        <Text style={[styles.priceUnit, { color: theme.muted }]}>
          /{product.priceUnit}
        </Text>
      </View>

      {/* Match score if recommended */}
      {product.recommended && (
        <View style={styles.matchRow}>
          <Star size={13} color={theme.warning} fill={theme.warning} />
          <Text style={[styles.matchText, { color: theme.warning }]}>
            {product.matchScore}% match for your gap
          </Text>
        </View>
      )}

      {/* Benefits */}
      <View style={styles.benefitsList}>
        {product.benefits.slice(0, 3).map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <View style={[styles.benefitDot, { backgroundColor: theme.covered }]} />
            <Text style={[styles.benefitText, { color: theme.muted }]}>{benefit}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.quoteBtn, { backgroundColor: theme.primary }]}
        onPress={handleGetQuote}
        activeOpacity={0.8}
      >
        <Text style={styles.quoteBtnText}>Get Quote</Text>
        <ExternalLink size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </Card>
  )
}

export default function BrowseScreen() {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const gaps = useStore((s) => s.gaps)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const highGapCategories = gaps
    .filter((g) => g.severity === 'high')
    .map((g) => g.category)

  const filteredProducts = MARKETPLACE_PRODUCTS.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      activeFilter === 'All' ||
      p.type.toLowerCase() === activeFilter.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const recommendedProducts = filteredProducts.filter((p) => p.recommended)
  const otherProducts = filteredProducts.filter((p) => !p.recommended)

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.screenTitle, { color: theme.text }]}>
        Find Insurance
      </Text>

      {/* Search */}
      <View
        style={[
          styles.searchWrapper,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Search size={18} color={theme.muted} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search providers, products..."
          placeholderTextColor={theme.muted}
        />
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  activeFilter === tab ? theme.primary : theme.card,
                borderColor:
                  activeFilter === tab ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    activeFilter === tab ? '#FFFFFF' : theme.muted,
                  fontWeight: activeFilter === tab ? '600' : '400',
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recommended section */}
      {recommendedProducts.length > 0 && (
        <>
          <View style={styles.recommendedHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recommended for You
            </Text>
            <Text style={[styles.recommendedLabel, { color: theme.muted }]}>
              Based on your gap analysis
            </Text>
          </View>
          <View style={styles.productsList}>
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} theme={theme} />
            ))}
          </View>
        </>
      )}

      {/* All products */}
      {otherProducts.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            All Products
          </Text>
          <View style={styles.productsList}>
            {otherProducts.map((product) => (
              <ProductCard key={product.id} product={product} theme={theme} />
            ))}
          </View>
        </>
      )}

      {/* Compare placeholder */}
      <Card
        style={[styles.compareCard, { borderColor: theme.primary + '40' }]}
      >
        <Text style={[styles.compareTitle, { color: theme.text }]}>
          Compare Products
        </Text>
        <Text style={[styles.compareDesc, { color: theme.muted }]}>
          Side-by-side comparison coming soon
        </Text>
      </Card>
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  recommendedHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  recommendedLabel: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  productsList: {
    gap: 12,
    marginBottom: 24,
  },
  productCard: { gap: 12 },
  productHeader: {
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
  productHeaderText: { flex: 1 },
  productProvider: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceFrom: {
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  benefitsList: { gap: 6 },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  benefitText: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  quoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 12,
  },
  quoteBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  compareCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  compareTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  compareDesc: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
})
