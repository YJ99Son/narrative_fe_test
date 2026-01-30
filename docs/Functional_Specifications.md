# 기능 명세서 (Functional Specification)

> **관련 문서**: [PRD.md](PRD.md) | [Frontend_Architecture.md](Frontend_Architecture.md) | [Scenario_Flow_Architecture.md](Scenario_Flow_Architecture.md) | [System_Flow_Architecture.md](System_Flow_Architecture.md)

**Project Name**: Narrative-AI
**Version**: 2.1
**Date**: 2026-01-27

---

## 1. MVP 기능 명세 (Phase 1)

> **핵심 목표**: 사용자가 '시나리오를 탐색'하고, '논리적으로 동의'하는 경험에 집중

### 1.1 시나리오 마켓 (Home Tab)

| 항목 | 설명 |
|------|------|
| **Hero Section** | 오늘 가장 주목할 시나리오 1개 |
| **Sub Section** | 카테고리별 시나리오 리스트 (안정형 / 공격형 / 배당형) |

**데이터 필드**:
*   `title`: 시나리오 제목
*   `logic_flow`: [원인] → [현상] → [결과] 3단계 요약
*   `win_rate`: AI 예측 적중률 (%)
*   `related_stocks`: 관련 종목 Top 3

### 1.2 시나리오 빌더 (5-Step Wizard)

**Phase별 질문 로직**:

| Phase | 목표 | AI 질문 예시 |
|-------|------|-------------|
| **1. Theme** | 거시 테마 선택 | "지금 시장의 가장 큰 흐름은?" |
| **2. Logic** | 상승 논리 구체화 | "어떤 포인트에서 수익이 날까요?" |
| **3. Stock** | 종목 선정 | "누구를 파티에 영입하시겠습니까?" |
| **4. Risk** | Exit Plan 설정 ⭐ | "이 시나리오가 실패한다면 무엇 때문일까요?" |
| **5. Execute** | 비중/매수 확정 | "이 논리에 자산의 몇 %를 태우시겠습니까?" |

### 1.3 내러티브 대시보드 (My Portfolio)

**논리 상태 인디케이터**:

| 상태 | 색상 | 의미 |
|------|------|------|
| `ON_TRACK` | 🟢 초록 | 핵심 전제 유지 중 |
| `WARNING` | 🟡 노랑 | 전제 흔들림 (주의 필요) |
| `BROKEN` | 🔴 빨강 | 전제 붕괴 (매도 권장) |

---

## 2. Future 기능 명세 (Phase 2+)

### 2.1 라이프사이클 알림 (Smart Push)

*   단순 시세 알림 ❌ → **시나리오 전제 관련 뉴스만** 필터링 ✅
*   **Exit Guide**: 수익률 도달이 아닌, **'논리 훼손 시점'**에 매도 알림

### 2.2 초개인화 시나리오 추천

| 투자자 유형 | 추천 시나리오 성향 |
|-------------|-------------------|
| 보수적 | 배당 수익률 5%+ / 경기 방어주 위주 |
| 공격적 | 변동성 높음 / 모멘텀 강함 위주 |

### 2.3 커뮤니티 & 랭킹

*   **Scenario Sharing**: 내 시나리오 논리 공유
*   **Logic Ranking**: 수익률 랭킹 ❌ → **논리 적중률 랭킹** ✅

---

## 3. 기술 명세

### 3.1 Backend & AI

| 구성 요소 | 설명 |
|-----------|------|
| LLM Integration | 뉴스 → `Scenario` 객체 생성 (Daily Cron) |
| Vector DB | 과거 유사 시나리오 비교용 RAG 시스템 |
| Data Sources | DART API, 네이버 뉴스 API, KRX 수급 |

### 3.2 챗봇 레이어 구조

| 챗봇 | 역할 | 기반 기술 |
|------|------|----------|
| **챗봇 1** | 거시 테마 → 산업 선택 → 기업 Top 10 | Rule-based |
| **챗봇 2** | 이슈 선택 → 기업 분석 → 시각화 | 대화 + 시각화 |

### 3.3 Backend API 명세 (TODO)

| API | 엔드포인트 | 설명 |
|-----|-----------|------|
| Macro-Keysector | `GET /api/macro-keysector` | 키워드-산업 매핑 조회 |
| 기업 Top 10 | `GET /api/companies/:keysector` | 산업별 상위 기업 |
| 뉴스 | `GET /api/news/:company` | 기업별 관련 뉴스 |
| 대화 히스토리 | `POST /api/chat/history` | 대화 기록 저장 |

### 3.4 Frontend

| 요소 | 설명 |
|------|------|
| **Interaction** | "동의함" 버튼 = 계약서 서명 느낌의 무게감 있는 인터랙션 |
| **Visualization** | 텍스트 나열 ❌ → Flowchart 형태의 논리 구조 시각화 ✅ |

### 3.5 데이터 구조 (JSON)

```json
{
  "scenario_id": "sc_20260127_001",
  "user_id": "user_123",
  "title": "HBM 낙수효과: 소부장 집중 공략",
  "logic_path": {
    "theme": "AI_SEMICON",
    "rationale": "HBM_SUPPLY_CHAIN",
    "risk_factor": "NVDA_DROP_15PCT"
  },
  "portfolio": [
    { "ticker": "000660.KS", "name": "SK하이닉스", "weight": 0.5 }
  ],
  "status": {
    "logic_status": "ON_TRACK",
    "created_at": "2026-01-27T20:00:00Z"
  }
}
```
