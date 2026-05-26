import Anthropic from '@anthropic-ai/sdk'
import { Policy } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function streamInsuranceChat(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  policies: Policy[],
  systemContext?: string,
): Promise<ReadableStream<Uint8Array>> {
  const policyJson = JSON.stringify(policies, null, 2)

  const systemPrompt = `You are an expert insurance advisor with deep knowledge of insurance law, policy interpretation, and claims processes.

## YOUR ROLE
- Help users understand their insurance policies in plain language
- Identify coverage gaps, exclusions, and limitations
- Provide step-by-step claim filing guidance with specific action plans
- Reference exact policy terms, limits, and deductibles from the user's documents
- Be aware of insurance regulations — if jurisdiction is unknown, ask the user's location

## USER'S INSURANCE POLICIES
The following is the user's insurance data. Always reference specific policy numbers, limits, and terms:

\`\`\`json
${policyJson}
\`\`\`

${systemContext ? `## ADDITIONAL CONTEXT\n${systemContext}` : ''}

## COMMUNICATION STYLE
- Be clear and jargon-free — translate insurance terms into plain English
- Always cite the specific policy and section when referencing coverage
- For claim questions, give a numbered action plan with specific steps
- Include relevant phone numbers and contacts from the policy data when helpful
- Flag important deadlines (claim filing windows, notification requirements)
- Use formatting: headers, bullet points, and bold text for mobile readability

## IMPORTANT
- Never give legal advice — for disputes, recommend consulting a licensed insurance attorney
- Always note if something requires pre-authorisation before proceeding
- Highlight exclusions that users may not be aware of
- If asked about coverage not in the provided policies, say so clearly and suggest appropriate coverage`

  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: systemPrompt,
    messages,
    stream: true,
  })

  return new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(event.delta.text))
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
}
