import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Mail,
  MapPin,
  Moon,
  Bell,
  FileText,
  Shield,
  Info,
  LogOut,
  ChevronRight,
  Plus,
} from 'lucide-react-native'
import { useTheme } from '@/lib/theme'
import { useStore } from '@/lib/store'
import { Card } from '@/components/ui/Card'

function SettingRow({
  icon,
  label,
  value,
  onPress,
  isSwitch,
  switchValue,
  onSwitchChange,
  danger,
  theme,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  onPress?: () => void
  isSwitch?: boolean
  switchValue?: boolean
  onSwitchChange?: (val: boolean) => void
  danger?: boolean
  theme: any
}) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={isSwitch ? 1 : 0.7}
      disabled={isSwitch && !onPress}
    >
      <View
        style={[
          styles.settingIconBg,
          { backgroundColor: danger ? theme.danger + '15' : theme.primary + '15' },
        ]}
      >
        {icon}
      </View>
      <Text
        style={[
          styles.settingLabel,
          { color: danger ? theme.danger : theme.text },
        ]}
      >
        {label}
      </Text>
      <View style={styles.settingRight}>
        {value && (
          <Text style={[styles.settingValue, { color: theme.muted }]}>{value}</Text>
        )}
        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: theme.faint, true: theme.primary + '80' }}
            thumbColor={switchValue ? theme.primary : theme.muted}
          />
        ) : (
          <ChevronRight size={18} color={theme.faint} />
        )}
      </View>
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const {
    darkMode,
    setDarkMode,
    gmailToken,
    setGmailToken,
    userLocation,
    hasCompletedOnboarding,
    completeOnboarding,
  } = useStore((s) => ({
    darkMode: s.darkMode,
    setDarkMode: s.setDarkMode,
    gmailToken: s.gmailToken,
    setGmailToken: s.setGmailToken,
    userLocation: s.userLocation,
    hasCompletedOnboarding: s.hasCompletedOnboarding,
    completeOnboarding: s.completeOnboarding,
  }))

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(false)

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.screenTitle, { color: theme.text }]}>Profile</Text>

      {/* User avatar */}
      <View style={styles.avatarArea}>
        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: theme.primary },
          ]}
        >
          <Text style={styles.avatarInitial}>A</Text>
        </View>
        <View>
          <Text style={[styles.userName, { color: theme.text }]}>Alex</Text>
          <Text style={[styles.userEmail, { color: theme.muted }]}>
            alex@example.com
          </Text>
        </View>
      </View>

      {/* Connected Accounts */}
      <Text style={[styles.sectionTitle, { color: theme.muted }]}>
        CONNECTED ACCOUNTS
      </Text>
      <Card style={styles.settingCard} padding={0}>
        <SettingRow
          icon={<Mail size={16} color={gmailToken ? '#10B981' : theme.muted} />}
          label="Gmail"
          value={gmailToken ? 'Connected' : 'Not connected'}
          onPress={() => {
            if (gmailToken) setGmailToken(null)
          }}
          theme={theme}
        />
        <SettingRow
          icon={<Plus size={16} color={theme.primary} />}
          label="Add Account"
          onPress={() => {}}
          theme={theme}
        />
      </Card>

      {/* Preferences */}
      <Text style={[styles.sectionTitle, { color: theme.muted }]}>
        PREFERENCES
      </Text>
      <Card style={styles.settingCard} padding={0}>
        <SettingRow
          icon={<MapPin size={16} color={theme.primary} />}
          label="My Location"
          value={userLocation ?? 'Not set'}
          onPress={() => {}}
          theme={theme}
        />
        <SettingRow
          icon={<Moon size={16} color={theme.primary} />}
          label="Dark Mode"
          isSwitch
          switchValue={darkMode}
          onSwitchChange={setDarkMode}
          theme={theme}
        />
        <SettingRow
          icon={<Bell size={16} color={theme.primary} />}
          label="Notifications"
          isSwitch
          switchValue={notificationsEnabled}
          onSwitchChange={setNotificationsEnabled}
          theme={theme}
        />
      </Card>

      {/* Data */}
      <Text style={[styles.sectionTitle, { color: theme.muted }]}>
        DATA
      </Text>
      <Card style={styles.settingCard} padding={0}>
        <SettingRow
          icon={<FileText size={16} color={theme.primary} />}
          label="My Documents"
          value="0 files"
          onPress={() => {}}
          theme={theme}
        />
      </Card>

      {/* Security */}
      <Text style={[styles.sectionTitle, { color: theme.muted }]}>
        SECURITY
      </Text>
      <Card style={styles.settingCard} padding={0}>
        <SettingRow
          icon={<Shield size={16} color={theme.primary} />}
          label="Biometric Auth"
          isSwitch
          switchValue={biometricEnabled}
          onSwitchChange={setBiometricEnabled}
          theme={theme}
        />
      </Card>

      {/* About */}
      <Text style={[styles.sectionTitle, { color: theme.muted }]}>
        ABOUT
      </Text>
      <Card style={styles.settingCard} padding={0}>
        <SettingRow
          icon={<Info size={16} color={theme.primary} />}
          label="Version"
          value="1.0.0"
          theme={theme}
        />
        <SettingRow
          icon={<FileText size={16} color={theme.primary} />}
          label="Privacy Policy"
          onPress={() => Linking.openURL('https://insureos.app/privacy')}
          theme={theme}
        />
        <SettingRow
          icon={<FileText size={16} color={theme.primary} />}
          label="Terms of Service"
          onPress={() => Linking.openURL('https://insureos.app/terms')}
          theme={theme}
        />
        <SettingRow
          icon={<Info size={16} color={theme.primary} />}
          label="Help & Support"
          onPress={() => Linking.openURL('https://insureos.app/help')}
          theme={theme}
        />
      </Card>

      {/* Sign out */}
      <Card style={styles.settingCard} padding={0}>
        <SettingRow
          icon={<LogOut size={16} color={theme.danger} />}
          label="Sign Out"
          onPress={() => {}}
          danger
          theme={theme}
        />
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
    marginBottom: 20,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  avatarArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  settingCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
})
