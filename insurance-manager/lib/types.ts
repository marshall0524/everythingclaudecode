export interface Policy {
  id: string
  name: string
  type: 'health' | 'travel' | 'auto' | 'home' | 'life' | 'other'
  provider: string
  policyNumber: string
  premium: number
  premiumFrequency: 'monthly' | 'annually'
  expiryDate: string
  coverageAmount: number
  status: 'active' | 'expired' | 'pending'
  coverageItems: CoverageItem[]
  documents: Document[]
  contacts: ContactInfo[]
}

export interface CoverageItem {
  category: string
  covered: boolean
  limit?: number
  deductible?: number
  notes?: string
}

export interface Document {
  id: string
  name: string
  type: string
  uploadedAt: string
  size: number
  extractedData?: Record<string, string>
  policyId?: string
}

export interface ContactInfo {
  type: string
  name: string
  phone?: string
  email?: string
  website?: string
  hours?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sourceDocuments?: string[]
}

export interface CoverageGap {
  category: string
  severity: 'low' | 'medium' | 'high'
  description: string
  recommendation: string
}

export interface Claim {
  id: string
  policyId: string
  type: string
  date: string
  description: string
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'denied'
  amount?: number
}
