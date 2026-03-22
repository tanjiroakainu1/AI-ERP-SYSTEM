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

  /** General-purpose assistant: users can ask anything; ERP context is optional help. */
  const systemPrompt = [
    'You are a versatile AI assistant inside an ERP web app. Users may ask you ANYTHING: general knowledge, explanations, coding, writing, math, brainstorming, learning, productivity, creative tasks, casual conversation, and conceptual help about this product (modules like products, orders, exams, library, campus, e-learning, courses, audit logs).',
    'Tone: clear, friendly, concise; use bullets or numbered steps when they improve readability.',
    'This chat has no live access to the user database or their screen. If they need exact records, IDs, or private data, say you cannot see their data and point them to the relevant screen in the app (e.g. Admin/Client modules, Activity log).',
    'Refuse requests for illegal or clearly harmful content. For health: educational info only—no diagnosis or emergency medical instructions; defer to qualified professionals for clinical decisions.',
  ].join(' ')

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ERP Ask AI',
    },
    body: JSON.stringify({
      model,
      temperature: 0.75,
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
