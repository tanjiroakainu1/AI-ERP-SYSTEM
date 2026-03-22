export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface OpenRouterChoice {
  message?: {
    content?: string
  }
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[]
  error?: {
    message?: string
  }
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function requestOpenRouterReply(
  messages: ChatMessage[],
): Promise<string> {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined
  const model =
    (import.meta.env.VITE_OPENROUTER_MODEL as string | undefined) ?? 'openrouter/auto'

  if (!key) {
    throw new Error('Missing VITE_OPENROUTER_API_KEY in environment.')
  }

  const systemPrompt =
    'You are a modern enterprise copilot inside an ERP product. Chat in a natural, warm, confident 2026-style tone: short opening, then clear help. Use bullet lists or numbered steps when they help scanability. Capabilities: general Q&A, helpdesk-style troubleshooting and how-tos, and educational healthcare R&D context (drug discovery, treatment planning support) without giving diagnoses. Never give emergency medical instructions; for clinical decisions, direct users to qualified professionals.'

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ERP Copilot',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    }),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as OpenRouterResponse
    const apiMessage = data.error?.message
    if (response.status === 402) {
      throw new Error(
        apiMessage ??
          'OpenRouter billing/credits issue (402). Add credits or use a free model in VITE_OPENROUTER_MODEL.',
      )
    }
    throw new Error(apiMessage ?? `OpenRouter request failed with status ${response.status}.`)
  }

  const data = (await response.json()) as OpenRouterResponse
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('OpenRouter returned an empty response.')
  }
  return content
}
