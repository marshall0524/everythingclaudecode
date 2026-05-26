import { Redirect } from 'expo-router'
import { useStore } from '@/lib/store'

export default function Index() {
  const done = useStore((s) => s.hasCompletedOnboarding)
  return <Redirect href={done ? '/(tabs)' : '/onboarding/welcome'} />
}
