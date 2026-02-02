import type { Option } from '../../data'
import { MODEL_OPTIONS } from './chatConfig'
import useChat from './useChat'

type ChatSidebarProps = {
  activeOption: Option | null
}

const ChatSidebar = ({ activeOption }: ChatSidebarProps) => {
  const {
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
  } = useChat()

  const activeOptionId = activeOption?.id ?? null

  return (
    <aside className="ai-sidebar">
      <div className="ai-header">
        <div className="ai-avatar">AI</div>
        <div className="ai-title">
          <h2>SCENARIO ANALYST</h2>
          <span>V.2.6</span>
        </div>
      </div>

      <div className="ai-content">
        <div className="ai-chat">
          <div className="ai-chat-header">
            <span className="block-label">AI CHAT</span>
            <div className="model-picker">
              <label htmlFor="model-select">Model</label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(event) => setSelectedModel(event.target.value)}
              >
                {MODEL_OPTIONS.map((model) => (
                  <option key={model.id} value={model.id}>{model.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="chat-search">
            <div className="chat-search-header">
              <span className="block-label">WEB SEARCH</span>
              <span className="chat-search-note">무료: Google 검색으로 연결</span>
            </div>
            <div className="chat-search-row">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search the web for this scenario..."
              />
              <button className="secondary-btn" onClick={() => handleSearchOpen(activeOption)}>
                Search
              </button>
            </div>
          </div>
          <div className="chat-stream">
            {activeOptionId && (chatByOption[activeOptionId] ?? []).length > 0 ? (
              (chatByOption[activeOptionId] ?? []).map((message, index) => (
                <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
                  <span>{message.content}</span>
                </div>
              ))
            ) : (
              <div className="chat-empty">카드를 선택하고 대화를 시작하세요.</div>
            )}
          </div>
          <div className="chat-input-row">
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask the AI to refine this option..."
              rows={3}
              disabled={!activeOptionId}
            />
            <button className="primary-btn" onClick={() => handleChatSend(activeOption)} disabled={!activeOptionId || isChatting}>
              {isChatting ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default ChatSidebar
