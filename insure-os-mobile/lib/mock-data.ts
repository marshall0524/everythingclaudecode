import { Policy, CoverageGap, Claim } from './types'

// Dates relative to ~May 2026
export const mockPolicies: Policy[] = [
  {
    id: 'pol-travel-001',
    name: 'Travel Gold',
    type: 'travel',
    provider: 'Allianz Travel',
    policyNumber: 'ATZ-2026-887634',
    premium: 42,
    premiumFrequency: 'monthly',
    expiryDate: '2026-08-15',
    coverageAmount: 250000,
    status: 'active',
    coverageItems: [
      { category: 'Emergency Medical', covered: true, limit: 250000, deductible: 100, notes: 'Unlimited hospitalisation worldwide' },
      { category: 'Trip Cancellation', covered: true, limit: 10000, deductible: 0, notes: 'Covered if cancelled by airline or weather event' },
      { category: 'Flight Delay', covered: true, limit: 1600, deductible: 0, notes: 'Eligible after 4-hour delay, $200/day max 8 days' },
      { category: 'Denied Boarding', covered: true, limit: 500, deductible: 0, notes: 'Involuntary denied boarding compensation up to $500' },
      { category: 'Luggage', covered: true, limit: 3000, deductible: 50, notes: 'Lost, stolen or damaged luggage' },
      { category: 'Personal Liability', covered: true, limit: 1000000, deductible: 0, notes: 'Third party liability worldwide' },
      { category: 'Rental Car Damage', covered: true, limit: 35000, deductible: 500, notes: 'Collision and theft coverage' },
      { category: 'Mental Health Abroad', covered: false, notes: 'NOT covered — psychiatric treatment excluded' },
      { category: 'Adventure Sports', covered: false, notes: 'NOT covered — extreme sports exclusion applies' },
      { category: 'Pre-existing Conditions', covered: false, notes: 'NOT covered without separate waiver add-on' },
      { category: 'Pregnancy after 28 weeks', covered: false, notes: 'NOT covered — pregnancy complications after 28 weeks excluded' },
    ],
    documents: [
      { id: 'doc-t-001', name: 'Allianz Travel Gold Policy Certificate.pdf', type: 'policy', uploadedAt: '2025-09-01T10:00:00Z', size: 245760, policyId: 'pol-travel-001', extractedData: { 'Policy Number': 'ATZ-2026-887634', 'Coverage Start': '2025-09-01', 'Coverage End': '2026-08-15', 'Medical Limit': '$250,000', 'Excess': '$100', 'Flight Delay Threshold': '4 hours', 'Delay Daily Limit': '$200' } },
    ],
    contacts: [
      { type: 'Claims', name: 'Allianz Claims Centre', phone: '1300-555-123', email: 'claims@allianz.com.au', website: 'https://www.allianz.com.au/travel/claims', hours: '24/7' },
      { type: 'Emergency', name: 'Global Emergency Assistance', phone: '+61-2-9292-9292', hours: '24/7 worldwide' },
      { type: 'Customer Service', name: 'Allianz Support', phone: '1300-555-100', hours: 'Mon–Fri 8am–8pm AEST' },
    ],
  },
  {
    id: 'pol-health-002',
    name: 'Gold Hospital Cover',
    type: 'health',
    provider: 'Medibank Private',
    policyNumber: 'MBK-4421988',
    premium: 285,
    premiumFrequency: 'monthly',
    expiryDate: '2027-01-31',
    coverageAmount: 1000000,
    status: 'active',
    coverageItems: [
      { category: 'Hospital', covered: true, limit: 1000000, deductible: 500, notes: 'Private hospital rooms, specialist fees covered at scheduled rate' },
      { category: 'Specialist Visits', covered: true, limit: 5000, deductible: 0, notes: '80% of scheduled fee, referral required' },
      { category: 'Emergency', covered: true, limit: 50000, deductible: 250, notes: 'Emergency ambulance fully covered' },
      { category: 'Prescription Drugs', covered: true, limit: 10000, deductible: 0, notes: 'PBS-listed medications covered' },
      { category: 'Mental Health', covered: true, limit: 5000, deductible: 0, notes: '30 sessions per year inpatient, 20 outpatient' },
      { category: 'Joint Replacements', covered: true, limit: 50000, deductible: 500, notes: 'Hip, knee, shoulder replacements covered' },
      { category: 'General Dental', covered: false, notes: 'NOT covered — extras policy required' },
      { category: 'Orthodontics', covered: false, notes: 'NOT covered — extras policy required' },
      { category: 'Optical/Vision', covered: false, notes: 'NOT covered — extras policy required' },
      { category: 'Cosmetic Procedures', covered: false, notes: 'NOT covered — elective cosmetic excluded' },
    ],
    documents: [
      { id: 'doc-h-001', name: 'Medibank Gold Hospital Certificate.pdf', type: 'policy', uploadedAt: '2026-01-03T09:00:00Z', size: 389120, policyId: 'pol-health-002', extractedData: { 'Member ID': 'MBK-4421988', 'Excess': '$500', 'Waiting Period Served': 'Yes', 'Network': 'Medibank Members Choice' } },
    ],
    contacts: [
      { type: 'Claims', name: 'Medibank Member Services', phone: '132-331', website: 'https://www.medibank.com.au', hours: 'Mon–Fri 7am–9pm, Sat 8am–6pm AEST' },
      { type: 'Emergency', name: 'Medibank Nurse on Call', phone: '1800-644-325', hours: '24/7' },
    ],
  },
  {
    id: 'pol-auto-003',
    name: 'Comprehensive Auto',
    type: 'auto',
    provider: 'NRMA Insurance',
    policyNumber: 'NRMA-9928847733',
    premium: 128,
    premiumFrequency: 'monthly',
    expiryDate: '2026-09-30',
    coverageAmount: 500000,
    status: 'active',
    coverageItems: [
      { category: 'Accidental Damage', covered: true, limit: 500000, deductible: 750, notes: 'Standard excess $750, under-25 excess $1,500' },
      { category: 'Theft', covered: true, limit: 500000, deductible: 750, notes: 'Vehicle theft and attempted theft' },
      { category: 'Third Party Liability', covered: true, limit: 20000000, deductible: 0, notes: 'Unlimited in practice, $20M CTP' },
      { category: 'Windscreen', covered: true, limit: 2000, deductible: 0, notes: 'No excess for windscreen repair or replacement' },
      { category: 'Roadside Assistance', covered: true, limit: 500, deductible: 0, notes: 'Towing, battery jump, lockout service' },
      { category: 'Rental Car After Accident', covered: true, limit: 900, deductible: 0, notes: '$50/day for up to 14 days' },
    ],
    documents: [
      { id: 'doc-a-001', name: 'NRMA Comprehensive Auto Policy.pdf', type: 'policy', uploadedAt: '2025-10-01T08:00:00Z', size: 204800, policyId: 'pol-auto-003', extractedData: { 'Policy Number': 'NRMA-9928847733', 'Vehicle': '2022 Toyota RAV4', 'Standard Excess': '$750', 'Under-25 Excess': '$1,500', 'Windscreen': 'No excess' } },
    ],
    contacts: [
      { type: 'Claims', name: 'NRMA Claims', phone: '132-132', website: 'https://www.nrma.com.au/claims', hours: '24/7' },
      { type: 'Roadside', name: 'NRMA Roadside Assist', phone: '131-111', hours: '24/7' },
    ],
  },
]

export const mockGaps: CoverageGap[] = [
  {
    category: 'Dental / Optical',
    severity: 'high',
    description: 'No dental or optical cover. Your Medibank Gold Hospital policy covers hospital only — extras not held. Annual dental costs average $800–$2,000 without insurance.',
    recommendation: 'Add Medibank Extras 60% Cover from $45/month to cover general dental, orthodontics, and optical.',
  },
  {
    category: 'Income Protection',
    severity: 'high',
    description: 'No income protection policy detected. If you cannot work due to illness or injury, you have no replacement income cover.',
    recommendation: 'TAL Income Protection covers 75% of salary for up to 2 years. Costs from $89/month.',
  },
  {
    category: 'Home & Contents',
    severity: 'high',
    description: 'No home or contents insurance detected. Building damage, theft, or fire could result in significant uninsured losses.',
    recommendation: 'AAMI Home & Contents insurance from $75/month covers building and contents including flood.',
  },
  {
    category: 'Travel Mental Health',
    severity: 'medium',
    description: 'Your Allianz Travel Gold policy excludes psychiatric treatment abroad. Mental health crises while travelling are fully out-of-pocket.',
    recommendation: 'Upgrade to Allianz Annual Multi-Trip Plus which includes $10,000 mental health coverage.',
  },
  {
    category: 'Adventure Sports',
    severity: 'medium',
    description: 'Skiing, scuba diving, rock climbing and similar activities are excluded from your Allianz travel policy.',
    recommendation: 'Add Cover-More Adventure Sports cover from $12/trip or $120/year for annual coverage.',
  },
]

export const mockClaims: Claim[] = [
  {
    id: 'claim-001',
    policyId: 'pol-travel-001',
    type: 'Flight Delay',
    date: '2026-02-14',
    description: 'Flight SYD to LHR delayed 5 hours due to mechanical issue. Claimed $200 for meals and transport.',
    status: 'approved',
    amount: 200,
  },
  {
    id: 'claim-002',
    policyId: 'pol-health-002',
    type: 'Specialist Visit',
    date: '2026-03-15',
    description: 'Consultation with specialist. 80% of scheduled fee covered.',
    status: 'approved',
    amount: 180,
  },
  {
    id: 'claim-003',
    policyId: 'pol-auto-003',
    type: 'Windscreen',
    date: '2026-04-02',
    description: 'Windscreen chip repair — no excess applies.',
    status: 'processing',
    amount: 320,
  },
]

export const USER_NAME = 'Alex'
export const USER_LOCATION = 'Sydney, NSW, Australia'
