import { useState } from 'react'
import type { Option } from '../../data'
import type { ChatMessage } from './types'
import { MODEL_OPTIONS } from './chatConfig'

type UseChatReturn = {
  selectedModel: string
  setSelectedModel: (value: string) => void
  chatInput: string
  setChatInput: (value: string) => void
  isChatting: boolean
  searchQuery: string
  setSearchQuery: (value: string) => void
  chatByOption: Record<string, ChatMessage[]>
  handleChatSend: (activeOption: Option | null) => Promise<void>
  handleSearchOpen: (activeOption: Option | null) => void
}

const useChat = (): UseChatReturn => {
  const [selectedModel, setSelectedModel] = useState<string>(MODEL_OPTIONS[0].id)
  const [chatByOption, setChatByOption] = useState<Record<string, ChatMessage[]>>({})
  const [chatInput, setChatInput] = useState('')
  const [isChatting, setIsChatting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const appendChatMessage = (optionId: string, message: ChatMessage) => {
    setChatByOption((prev) => ({
      ...prev,
      [optionId]: [...(prev[optionId] ?? []), message],
    }))
  }

  const handleChatSend = async (activeOption: Option | null) => {
    if (!activeOption) return
    const trimmed = chatInput.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    appendChatMessage(activeOption.id, userMessage)
    setChatInput('')
    setIsChatting(true)

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
    const baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'

    if (!apiKey) {
      appendChatMessage(activeOption.id, {
        role: 'assistant',
        content: 'OpenRouter API key is missing. Set VITE_OPENROUTER_API_KEY to continue.',
      })
      setIsChatting(false)
      return
    }

    const optionContext = `Card Title: ${activeOption.title}\nSubtitle: ${activeOption.subtitle}\nDescription: ${activeOption.desc}`
    const systemPrompt = `You are a scenario analyst helping refine a card. Use the card context below.\n\n${optionContext}`
    const history = [...(chatByOption[activeOption.id] ?? []), userMessage]

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Narrative AI',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'system', content: systemPrompt }, ...history],
          stream: false,
        }),
      })

      if (!response.ok) {
        appendChatMessage(activeOption.id, {
          role: 'assistant',
          content: `Request failed (${response.status}). Please check your OpenRouter setup.`,
        })
        return
      }

      const data = await response.json()
      const reply = data?.choices?.[0]?.message?.content || 'No response received.'
      appendChatMessage(activeOption.id, { role: 'assistant', content: reply })
    } catch (error) {
      appendChatMessage(activeOption.id, {
        role: 'assistant',
        content: 'Network error. Please try again.',
      })
    } finally {
      setIsChatting(false)
    }
  }

  const handleSearchOpen = (activeOption: Option | null) => {
    const query = searchQuery.trim() || chatInput.trim() || activeOption?.title
    if (!query) return
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return {
    selectedModel,
    setSelectedModel,
    chatInput,
    setChatInput,
    isChatting,
    searchQuery,
    setSearchQuery,
    chatByOption,
    handleChatSend,
    handleSearchOpen,
  }
}

export default useChat
