/**
 * Type Definitions
 * All TypeScript types for Narrative-AI application
 *
 * @module data/types
 */

// View States
export type ViewState = 'LANDING' | 'BUILDER' | 'MYSCENARIOS' | 'LOGIN' | 'DASHBOARD' | 'QUIZ' | 'PRESENTATION'

// Option Types
export type OptionType = 'MAIN' | 'ALTERNATIVE' | 'RISKY'

// Sentiment Types
export type Sentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'

// Trend Direction
export type TrendDirection = 'UP' | 'DOWN'

// Follow-Up View Types
export interface ConversationSummary {
  optionId: string
  optionTitle: string
  summary: string
  timestamp: number
  messageCount: number
}

export interface NewsArticle {
  id: string
  title: string
  source: string
  date: string
  url: string
  phase: string
  sentiment: Sentiment
}

export interface ScenarioTrack {
  id: string
  path: string[]
  currentProbability: number
  probabilityHistory: { date: string; value: number }[]
  lastUpdated: number
}

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface DisclosureInfo {
  title: string
  date: string
  type: string
  keyMetric: string
  impact: Sentiment
}

export interface Trend {
  label: string
  value: string
  direction: TrendDirection
}

export interface AIAnalysis {
  summary: string
  detail: string
  easyTerm: string
  disclosure?: DisclosureInfo
  chart?: ChartData[]
  trend?: Trend
}

export interface Option {
  id: string
  type: OptionType
  badge: string
  title: string
  subtitle: string
  probability: number
  desc: string
  icon: string
  parentId?: string
  aiAnalysis: AIAnalysis
}

export interface Step {
  id: string
  title: string
  question: string
  options: Option[]
}
