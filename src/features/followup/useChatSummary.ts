import { useState, useEffect, useCallback } from 'react'
import type { ConversationSummary } from '../../data'

const STORAGE_KEY = 'narrative_chat_summaries'

type UseChatSummaryReturn = {
    summaries: ConversationSummary[]
    saveSummary: (summary: ConversationSummary) => void
    getSummaryByOptionId: (optionId: string) => ConversationSummary | undefined
    clearSummaries: () => void
    generateSummary: (
        optionId: string,
        optionTitle: string,
        messages: { role: string; content: string }[]
    ) => Promise<string>
}

const useChatSummary = (): UseChatSummaryReturn => {
    const [summaries, setSummaries] = useState<ConversationSummary[]>([])

    // Load summaries from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                setSummaries(JSON.parse(stored))
            }
        } catch {
            console.error('Failed to load chat summaries from localStorage')
        }
    }, [])

    // Save to localStorage whenever summaries change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(summaries))
        } catch {
            console.error('Failed to save chat summaries to localStorage')
        }
    }, [summaries])

    const saveSummary = useCallback((summary: ConversationSummary) => {
        setSummaries((prev) => {
            const existing = prev.findIndex((s) => s.optionId === summary.optionId)
            if (existing >= 0) {
                const updated = [...prev]
                updated[existing] = summary
                return updated
            }
            return [...prev, summary]
        })
    }, [])

    const getSummaryByOptionId = useCallback(
        (optionId: string) => {
            return summaries.find((s) => s.optionId === optionId)
        },
        [summaries]
    )

    const clearSummaries = useCallback(() => {
        setSummaries([])
        localStorage.removeItem(STORAGE_KEY)
    }, [])

    const generateSummary = useCallback(
        async (
            optionId: string,
            optionTitle: string,
            messages: { role: string; content: string }[]
        ): Promise<string> => {
            if (messages.length === 0) {
                return '대화 내용이 없습니다.'
            }

            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
            const baseUrl =
                import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'

            if (!apiKey) {
                // Fallback: simple local summary
                const userMessages = messages.filter((m) => m.role === 'user')
                const fallbackSummary = `${optionTitle}에 대해 ${userMessages.length}개의 질문을 나눴습니다.`

                saveSummary({
                    optionId,
                    optionTitle,
                    summary: fallbackSummary,
                    timestamp: Date.now(),
                    messageCount: messages.length,
                })

                return fallbackSummary
            }

            try {
                const conversationText = messages
                    .map((m) => `${m.role === 'user' ? '사용자' : 'AI'}: ${m.content}`)
                    .join('\n')

                const response = await fetch(`${baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Narrative AI',
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content:
                                    '다음 대화를 2-3문장으로 간결하게 요약해주세요. 핵심 인사이트와 결론을 포함해주세요. 한국어로 작성해주세요.',
                            },
                            { role: 'user', content: conversationText },
                        ],
                        stream: false,
                    }),
                })

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`)
                }

                const data = await response.json()
                const summaryText =
                    data?.choices?.[0]?.message?.content || '요약을 생성할 수 없습니다.'

                saveSummary({
                    optionId,
                    optionTitle,
                    summary: summaryText,
                    timestamp: Date.now(),
                    messageCount: messages.length,
                })

                return summaryText
            } catch (error) {
                console.error('Failed to generate summary:', error)
                const fallbackSummary = `${optionTitle}에 대해 ${messages.length}개의 메시지를 주고받았습니다.`

                saveSummary({
                    optionId,
                    optionTitle,
                    summary: fallbackSummary,
                    timestamp: Date.now(),
                    messageCount: messages.length,
                })

                return fallbackSummary
            }
        },
        [saveSummary]
    )

    return {
        summaries,
        saveSummary,
        getSummaryByOptionId,
        clearSummaries,
        generateSummary,
    }
}

export default useChatSummary
