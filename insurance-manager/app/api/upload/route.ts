import { NextRequest, NextResponse } from 'next/server'

function guessDocumentType(filename: string): string {
  const lower = filename.toLowerCase()
  if (lower.includes('policy') || lower.includes('certificate')) return 'policy'
  if (lower.includes('pds') || lower.includes('disclosure')) return 'pds'
  if (lower.includes('eob') || lower.includes('explanation')) return 'eob'
  if (lower.includes('claim')) return 'claim'
  if (lower.includes('invoice') || lower.includes('receipt')) return 'invoice'
  if (lower.includes('id') || lower.includes('card')) return 'id-card'
  return 'document'
}

function generateMockExtractedData(filename: string, type: string): Record<string, string> {
  const lower = filename.toLowerCase()

  if (type === 'policy') {
    if (lower.includes('travel') || lower.includes('allianz')) {
      return {
        'Policy Number': 'ATZ-2024-' + Math.floor(Math.random() * 900000 + 100000),
        'Coverage Type': 'International Travel Insurance',
        'Medical Coverage': '$250,000',
        'Cancellation Coverage': '$5,000',
        'Excess': '$100',
        'Valid Until': '2025-12-31',
      }
    }
    if (lower.includes('health') || lower.includes('bcbs') || lower.includes('blue')) {
      return {
        'Member ID': 'BCBS-' + Math.floor(Math.random() * 9000000 + 1000000),
        'Group Number': 'GRP-' + Math.floor(Math.random() * 90000 + 10000),
        'Plan Type': 'PPO',
        'Deductible': '$1,500',
        'Out-of-Pocket Max': '$5,000',
        'Copay (Primary Care)': '$25',
        'Copay (Specialist)': '$45',
      }
    }
    if (lower.includes('auto') || lower.includes('car') || lower.includes('vehicle')) {
      return {
        'Policy Number': 'AUTO-' + Math.floor(Math.random() * 9000000000 + 1000000000),
        'Vehicle': '2021 Toyota Camry',
        'Liability Limit': '$300,000',
        'Collision Deductible': '$1,000',
        'Comprehensive Deductible': '$500',
        'Expiry Date': '2025-09-30',
      }
    }
    return {
      'Document Type': 'Insurance Policy',
      'Status': 'Active',
      'Extracted': 'Policy details identified',
    }
  }

  if (type === 'eob') {
    return {
      'Claim Number': 'CLM-' + Math.floor(Math.random() * 900000 + 100000),
      'Service Date': new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      'Provider': 'Medical Provider',
      'Amount Billed': '$' + Math.floor(Math.random() * 500 + 100),
      'Plan Paid': '$' + Math.floor(Math.random() * 400 + 50),
      'Your Responsibility': '$' + Math.floor(Math.random() * 100 + 25),
    }
  }

  if (type === 'invoice') {
    return {
      'Invoice Number': 'INV-' + Math.floor(Math.random() * 900000 + 100000),
      'Date': new Date().toISOString().split('T')[0],
      'Total Amount': '$' + Math.floor(Math.random() * 1000 + 50),
      'Provider': 'Healthcare Provider',
    }
  }

  return {
    'File Type': type,
    'Processed': 'true',
    'Timestamp': new Date().toISOString(),
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic']
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or image files.' },
        { status: 400 },
      )
    }

    const docType = guessDocumentType(file.name)
    const extractedData = generateMockExtractedData(file.name, docType)

    const document = {
      id: 'doc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      name: file.name,
      type: docType,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      extractedData,
    }

    return NextResponse.json({ success: true, document })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: `Upload error: ${msg}` }, { status: 500 })
  }
}
