import { Policy, CoverageGap, Claim } from './types'

export const mockPolicies: Policy[] = [
  {
    id: 'pol-travel-001',
    name: 'Global Travel Shield',
    type: 'travel',
    provider: 'Allianz Travel',
    policyNumber: 'ATZ-2024-887634',
    premium: 42,
    premiumFrequency: 'monthly',
    expiryDate: '2025-08-15',
    coverageAmount: 250000,
    status: 'active',
    coverageItems: [
      { category: 'Emergency Medical', covered: true, limit: 250000, deductible: 100, notes: 'Covers hospitalization worldwide' },
      { category: 'Flight Cancellation', covered: true, limit: 5000, deductible: 0, notes: 'Covered if cancelled by airline or weather event' },
      { category: 'Flight Delay', covered: true, limit: 500, deductible: 0, notes: 'Eligible after 3-hour delay, $100/day' },
      { category: 'Lost Luggage', covered: true, limit: 2500, deductible: 50, notes: 'Covers replacement of essential items' },
      { category: 'Stolen Luggage', covered: true, limit: 2000, deductible: 100, notes: 'Police report required within 24 hours' },
      { category: 'Trip Interruption', covered: true, limit: 8000, deductible: 0, notes: 'Covered for family emergency or illness' },
      { category: 'Rental Car Damage', covered: true, limit: 35000, deductible: 500, notes: 'Collision and theft coverage' },
      { category: 'Mental Health Abroad', covered: false, notes: 'NOT covered — psychiatric treatment excluded' },
      { category: 'Adventure Sports', covered: false, notes: 'NOT covered — extreme sports exclusion applies' },
      { category: 'Pre-existing Conditions', covered: false, notes: 'NOT covered without separate waiver add-on' },
    ],
    documents: [
      { id: 'doc-t-001', name: 'Allianz Travel Policy Certificate.pdf', type: 'policy', uploadedAt: '2024-09-01T10:00:00Z', size: 245760, policyId: 'pol-travel-001', extractedData: { 'Policy Number': 'ATZ-2024-887634', 'Coverage Start': '2024-09-01', 'Coverage End': '2025-08-15', 'Medical Limit': '$250,000', 'Excess': '$100' } },
      { id: 'doc-t-002', name: 'Allianz Product Disclosure Statement.pdf', type: 'pds', uploadedAt: '2024-09-01T10:05:00Z', size: 1024000, policyId: 'pol-travel-001' },
    ],
    contacts: [
      { type: 'Claims', name: 'Allianz Claims Centre', phone: '+1-800-284-8300', email: 'claims@allianz.com', website: 'https://www.allianztravelinsurance.com/claims', hours: '24/7' },
      { type: 'Emergency', name: 'Global Emergency Assistance', phone: '+1-800-654-1908', hours: '24/7 worldwide' },
      { type: 'Customer Service', name: 'Allianz Support', phone: '+1-866-884-3556', hours: 'Mon–Fri 8am–8pm ET' },
    ],
  },
  {
    id: 'pol-health-002',
    name: 'Premium Health Cover',
    type: 'health',
    provider: 'BlueCross BlueShield',
    policyNumber: 'BCBS-IL-4421988',
    premium: 285,
    premiumFrequency: 'monthly',
    expiryDate: '2025-12-31',
    coverageAmount: 1000000,
    status: 'active',
    coverageItems: [
      { category: 'Hospitalisation', covered: true, limit: 1000000, deductible: 1500, notes: 'In-network hospitals fully covered after deductible' },
      { category: 'Specialist Visits', covered: true, limit: 5000, deductible: 0, notes: '$45 copay per visit, referral required for some specialties' },
      { category: 'Emergency Room', covered: true, limit: 50000, deductible: 250, notes: '$250 ER copay waived if admitted' },
      { category: 'Prescription Drugs', covered: true, limit: 10000, deductible: 0, notes: 'Tier 1: $10, Tier 2: $35, Tier 3: $70 copay' },
      { category: 'Preventive Care', covered: true, limit: 2000, deductible: 0, notes: 'Annual wellness exams, vaccinations 100% covered' },
      { category: 'Mental Health', covered: true, limit: 5000, deductible: 0, notes: '$30 copay per session, 30 sessions/year' },
      { category: 'Physiotherapy', covered: true, limit: 3000, deductible: 0, notes: '20 sessions per year, $35 copay each' },
      { category: 'Dental', covered: false, notes: 'NOT covered — dental plan required separately' },
      { category: 'Optical/Vision', covered: false, notes: 'NOT covered — vision plan required separately' },
      { category: 'Cosmetic Procedures', covered: false, notes: 'NOT covered — elective cosmetic excluded' },
      { category: 'Alternative Medicine', covered: false, notes: 'NOT covered — acupuncture, chiropractic excluded' },
    ],
    documents: [
      { id: 'doc-h-001', name: 'BCBS Member Certificate 2025.pdf', type: 'policy', uploadedAt: '2025-01-03T09:00:00Z', size: 389120, policyId: 'pol-health-002', extractedData: { 'Member ID': 'BCBS-IL-4421988', 'Group Number': 'GRP-78834', 'Deductible': '$1,500', 'Out-of-Pocket Max': '$5,000', 'Network': 'PPO Blue' } },
      { id: 'doc-h-002', name: 'BCBS Summary of Benefits.pdf', type: 'sob', uploadedAt: '2025-01-03T09:10:00Z', size: 512000, policyId: 'pol-health-002' },
      { id: 'doc-h-003', name: 'Explanation of Benefits - March.pdf', type: 'eob', uploadedAt: '2025-03-28T14:00:00Z', size: 128000, policyId: 'pol-health-002', extractedData: { 'Claim Date': '2025-03-15', 'Service': 'Specialist Consultation', 'Provider': 'Dr. Sarah Kim', 'Amount Billed': '$320', 'Plan Paid': '$275', 'Your Responsibility': '$45' } },
    ],
    contacts: [
      { type: 'Claims', name: 'BCBS Member Services', phone: '1-800-892-2803', website: 'https://member.bcbsil.com', hours: 'Mon–Fri 7am–7pm CT' },
      { type: 'Emergency', name: 'Nurse Helpline', phone: '1-800-892-2803 ext 1', hours: '24/7' },
      { type: 'Pre-authorisation', name: 'BCBS Pre-Auth Team', phone: '1-800-892-2803 ext 3', hours: 'Mon–Fri 8am–5pm CT' },
    ],
  },
  {
    id: 'pol-auto-003',
    name: 'Comprehensive Auto',
    type: 'auto',
    provider: 'State Farm',
    policyNumber: 'SF-IL-9928847733',
    premium: 128,
    premiumFrequency: 'monthly',
    expiryDate: '2025-09-30',
    coverageAmount: 500000,
    status: 'active',
    coverageItems: [
      { category: 'Collision', covered: true, limit: 500000, deductible: 1000, notes: 'Covers damage to your vehicle in an accident' },
      { category: 'Comprehensive', covered: true, limit: 500000, deductible: 500, notes: 'Covers theft, weather, vandalism, and fire' },
      { category: 'Third Party Liability', covered: true, limit: 300000, deductible: 0, notes: 'Bodily injury and property damage to others' },
      { category: 'Uninsured Motorist', covered: true, limit: 100000, deductible: 0, notes: 'Protection if struck by uninsured driver' },
      { category: 'Roadside Assistance', covered: true, limit: 500, deductible: 0, notes: 'Towing, battery jump, lockout service' },
      { category: 'Rental Car', covered: true, limit: 900, deductible: 0, notes: '$45/day for up to 20 days while vehicle repaired' },
    ],
    documents: [
      { id: 'doc-a-001', name: 'State Farm Auto Policy.pdf', type: 'policy', uploadedAt: '2024-10-01T08:00:00Z', size: 204800, policyId: 'pol-auto-003', extractedData: { 'Policy Number': 'SF-IL-9928847733', 'Vehicle': '2021 Toyota Camry', 'VIN': '4T1B11HK3MU558234', 'Liability Limit': '$300,000', 'Collision Deductible': '$1,000', 'Comprehensive Deductible': '$500' } },
    ],
    contacts: [
      { type: 'Claims', name: 'State Farm Claims', phone: '1-800-732-5246', website: 'https://www.statefarm.com/claims', hours: '24/7' },
      { type: 'Agent', name: 'David Chen - State Farm Agent', phone: '(312) 555-0183', email: 'david.chen.xyz12@statefarm.com', hours: 'Mon–Fri 9am–5pm' },
    ],
  },
]

export const mockCoverageGaps: CoverageGap[] = [
  {
    category: 'Dental',
    severity: 'high',
    description: 'No dental coverage across any of your policies. Annual dental costs average $800–$2,000 without insurance.',
    recommendation: 'Consider adding a standalone dental plan. Delta Dental or Guardian Dental offer individual plans from $25/month.',
  },
  {
    category: 'Vision / Optical',
    severity: 'medium',
    description: 'No optical coverage. Eye exams and glasses/contacts are fully out-of-pocket.',
    recommendation: 'VSP Individual Vision plan costs ~$13/month and covers annual exam plus $150 toward frames.',
  },
  {
    category: 'Travel Mental Health',
    severity: 'medium',
    description: 'Your travel policy excludes psychiatric treatment abroad. If travelling with anxiety or depression, you have no overseas mental health cover.',
    recommendation: 'Upgrade to Allianz Annual Multi-Trip Plus which includes $10,000 mental health coverage.',
  },
  {
    category: 'Life Insurance',
    severity: 'high',
    description: 'No life insurance policy detected. This is a significant financial protection gap.',
    recommendation: 'A $500,000 20-year term policy costs approximately $25–$40/month for a healthy adult under 35.',
  },
  {
    category: 'Travel Adventure Sports',
    severity: 'low',
    description: 'Adventure and extreme sports are excluded from your travel policy. Skiing, scuba, and similar activities are uncovered.',
    recommendation: 'Add the Allianz Adventure Sports Rider for $8/month to cover common adventure activities.',
  },
]

export const mockClaims: Claim[] = [
  {
    id: 'claim-001',
    policyId: 'pol-travel-001',
    type: 'Flight Delay',
    date: '2025-02-14',
    description: 'Flight ORD to LHR delayed 4 hours due to mechanical issue. Claimed $150 for meals and transport.',
    status: 'approved',
    amount: 150,
  },
  {
    id: 'claim-002',
    policyId: 'pol-health-002',
    type: 'Specialist Visit',
    date: '2025-03-15',
    description: 'Consultation with Dr. Sarah Kim, Dermatologist. Copay applied.',
    status: 'approved',
    amount: 45,
  },
  {
    id: 'claim-003',
    policyId: 'pol-health-002',
    type: 'Prescription',
    date: '2025-04-02',
    description: 'Monthly prescription refill — Tier 2 medication.',
    status: 'processing',
    amount: 35,
  },
]

export const USER_NAME = 'Alex'
export const USER_LOCATION = 'Chicago, IL'
