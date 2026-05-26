import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are an expert insurance advisor with 20 years of experience helping clients understand their policies, file claims, and navigate the insurance system.

## YOUR CAPABILITIES
- Interpret complex policy language into plain English
- Identify coverage gaps and exclusions
- Provide step-by-step claim filing action plans
- Reference specific policy terms, limits, and contact details
- Understand insurance regulations by jurisdiction (ask for user's location if not provided)

## COMMUNICATION GUIDELINES
- Always cite specific policy numbers and terms when referencing coverage
- For claims: give numbered action plans with deadlines
- Include relevant phone numbers and contacts when helpful
- Flag important exclusions users may not know about
- Use headers and bullet points for mobile readability
- Be direct and practical — people come to you when they need help

## IMPORTANT DISCLAIMERS
- Note when something requires pre-authorisation before proceeding
- For legal disputes, recommend a licensed insurance attorney
- Always confirm claim filing deadlines (typically 30–90 days from incident)`

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured. Add it to your environment variables.' },
      { status: 503 },
    )
  }

  let body: { messages?: Array<{ role: string; content: string }>; policies?: unknown; location?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { messages = [], policies = [], location } = body

  const policyContext = policies
    ? `\n\n## USER'S POLICIES\n\`\`\`json\n${JSON.stringify(policies, null, 2)}\n\`\`\``
    : ''

  const locationContext = location
    ? `\n\n## USER LOCATION\n${location} — apply relevant state/local insurance regulations.`
    : ''

  const fullSystem = SYSTEM_PROMPT + policyContext + locationContext

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const validMessages = (messages as Array<{ role: string; content: string }>)
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  if (validMessages.length === 0) {
    return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 })
  }

  try {
    const stream = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: fullSystem,
      messages: validMessages,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
          if (event.type === 'message_stop') {
            controller.close()
          }
        }
      },
      cancel() {
        stream.controller.abort()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: `Chat error: ${msg}` }, { status: 500 })
  }
}
