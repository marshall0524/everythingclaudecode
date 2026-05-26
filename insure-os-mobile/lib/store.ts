import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { mockPolicies, mockGaps } from './mock-data'
import type { AppState, ChatMessage, Policy, Document, CoverageGap } from './types'

interface Store extends AppState {
  setDarkMode: (val: boolean) => void
  setGmailToken: (token: string | null) => void
  completeOnboarding: () => void
  setLocation: (location: string) => void
  addPolicy: (policy: Policy) => void
  addDocument: (doc: Document) => void
  addChatMessage: (msg: ChatMessage) => void
  clearChat: () => void
  setAdvisorTyping: (val: boolean) => void
  setPolicies: (policies: Policy[]) => void
  setGaps: (gaps: CoverageGap[]) => void
  setCoverageScore: (score: number) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      darkMode: true,
      hasCompletedOnboarding: false,
      userLocation: null,
      gmailToken: null,
      policies: mockPolicies,
      documents: [],
      chatMessages: [],
      isAdvisorTyping: false,
      coverageScore: 72,
      gaps: mockGaps,
      setDarkMode: (val) => set({ darkMode: val }),
      setGmailToken: (token) => set({ gmailToken: token }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setLocation: (location) => set({ userLocation: location }),
      addPolicy: (policy) => set((s) => ({ policies: [...s.policies, policy] })),
      addDocument: (doc) => set((s) => ({ documents: [...s.documents, doc] })),
      addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
      clearChat: () => set({ chatMessages: [] }),
      setAdvisorTyping: (val) => set({ isAdvisorTyping: val }),
      setPolicies: (policies) => set({ policies }),
      setGaps: (gaps) => set({ gaps }),
      setCoverageScore: (score) => set({ coverageScore: score }),
    }),
    {
      name: 'insure-os-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        darkMode: s.darkMode,
        hasCompletedOnboarding: s.hasCompletedOnboarding,
        userLocation: s.userLocation,
        gmailToken: s.gmailToken,
        policies: s.policies,
        documents: s.documents,
        chatMessages: s.chatMessages,
        coverageScore: s.coverageScore,
        gaps: s.gaps,
      }),
    }
  )
)
