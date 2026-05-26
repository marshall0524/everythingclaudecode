import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '',
})

const ADVISOR_SYSTEM_PROMPT = (policies: any[], location: string | null) => `
You are InsureOS Advisor — a brilliant, warm, and direct insurance expert. Think of yourself as the user's personal advisor: sharp, knowledgeable, proactive. You speak like a trusted friend who happens to be an expert, not a corporate chatbot.

USER LOCATION: ${location ?? 'Unknown — ask if relevant to the question'}
USER POLICIES (JSON):
${JSON.stringify(policies, null, 2)}

YOUR ROLE:
- Answer any insurance question with specific references to their actual policy terms
- Identify coverage gaps and over-coverage proactively
- When flights are delayed: cite the exact delay threshold from their travel policy, explain what expenses are claimable
- When denied boarding: pull the exact procedure from their policy, provide the specific contact number and claim form URL, write a step-by-step action plan
- For claims: draft the actual claim letter text they can copy-paste
- Be jurisdiction-aware: reference local insurance law and consumer protection rights for their location
- Never hedge with "consult a professional" — give the actual answer with the policy clause number if available
- Keep responses conversational but precise. Use bullet points for action steps.
- If you don't have a specific clause, say so clearly and recommend what to look for

TONE: Direct, warm, expert. Like a brilliant friend who saves you money and stress.
`

export async function streamAdvisorChat(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  policies: any[],
  location: string | null,
  onChunk: (text: string) => void,
  onDone: () => void
) {
  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: ADVISOR_SYSTEM_PROMPT(policies, location),
      messages,
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        onChunk(chunk.delta.text)
      }
    }

    onDone()
  } catch (err) {
    console.error('Claude stream error:', err)
    onChunk('\n\n[Error communicating with advisor. Please check your API key.]')
    onDone()
  }
}

export async function extractPolicyFromText(rawText: string): Promise<any> {
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Extract insurance policy information from this text and return ONLY valid JSON with these fields: { provider, policyType, policyNumber, expiryDate, premium, coverageItems: string[], contactInfo: string[], confidence: 0-1 }\n\nText:\n${rawText.slice(0, 4000)}`,
        },
      ],
    })
    const text =
      msg.content[0].type === 'text' ? msg.content[0].text : '{}'
    return JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim())
  } catch {
    return null
  }
}
