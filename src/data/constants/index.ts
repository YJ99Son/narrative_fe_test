/**
 * Constants
 * Application constants and configuration values
 *
 * @module data/constants
 */

// Application Constants
export const APP_NAME = 'Narrative-AI'
export const APP_VERSION = '1.0.0'

// Step Configuration
export const TOTAL_STEPS = 5
export const STEPS_CONFIG = {
  STEP1: { id: 'step1', title: 'STEP 01. MACRO TREND', question: 'Q1. 미래 3년을 좌우할 거대한 물결은 무엇입니까?' },
  STEP2: { id: 'step2', title: 'STEP 02. KEY SECTOR', question: 'Q2. 그 물결 속에서 가장 유망한 산업군은?' },
  STEP3: { id: 'step3', title: 'STEP 03. DOMINANT PLAYER', question: 'Q3. 해당 섹터를 장악한 1등/주도 기업은?' },
  STEP4: { id: 'step4', title: 'STEP 04. VALUE CHAIN', question: 'Q4. 1등 기업과 함께 성장할 핵심 파트너는?' },
  STEP5: { id: 'step5', title: 'STEP 05. PORTFOLIO', question: 'Q5. 최종적으로 어떤 종목을 매수하시겠습니까?' }
} as const

// Option Type Labels
export const OPTION_TYPE_LABELS = {
  MAIN: { label: '시대적 흐름', color: '#3b82f6' },
  ALTERNATIVE: { label: '대안', color: '#d97706' },
  RISKY: { label: '고위험', color: '#dc2626' }
} as const

// LocalStorage Keys
export const STORAGE_KEYS = {
  SESSION: 'narrative_session',
  ACTIVE_SCENARIO: 'narrative_active_scenario',
  USER_PREFERENCES: 'narrative_preferences',
  CHAT_HISTORY: 'narrative_chat_history'
} as const

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const

// UI Constants
export const UI_CONSTANTS = {
  CARD_WIDTH: 320,
  GAP: 20,
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 2000
} as const
