# Narrative-AI 아키텍처 문서

**버전**: 1.0  
**마지막 업데이트**: 2026-02-02  
**프로젝트**: Narrative-AI (맥락 기반 투자 시나리오 큐레이션 플랫폼)

---

## 목차

1. [개요](#overview)
2. [프로젝트 구조](#project-structure)
3. [기술 스택](#technology-stack)
4. [모듈 구성](#module-organization)
5. [데이터 흐름](#data-flow)
6. [상태 관리](#state-management)
7. [라우팅](#routing)
8. [스타일링 아키텍처](#styling-architecture)
9. [에셋(자산) 관리](#asset-management)
10. [빌드 & 배포](#build--deployment)

---

## Overview

Narrative-AI는 React 기반의 투자 시나리오 큐레이션 플랫폼으로, 사용자가 **5단계 가이드 프로세스**를 통해 투자 내러티브(서사)를 발견하고, 만들고, 추적할 수 있도록 돕습니다.

### Core Value Proposition

- **"Don't watch news, design the flow."**
- 단편적인 금융 데이터를 **일관된 투자 내러티브**로 재구성
- 사용자가 **논리적인 투자 의사결정**을 하도록 단계적으로 안내
- **실시간 업데이트**로 내러티브의 유효성을 추적

### Key Features

1. **Scenario Market**: AI가 큐레이션한 투자 테마
2. **Scenario Builder**: 5단계 가이드 기반 내러티브 생성
3. **My Narratives**: 구독한 시나리오를 추적하는 대시보드
4. **Follow-up**: AI 기반 뉴스 분석 및 알림

---

## Project Structure

```
narrative_fe_refactor/
├── public/                     # Static assets served directly
│   ├── logo/                # Brand logos and icons
│   ├── vite.svg             # Vite default icon
│   └── pwa-icon.svg        # PWA application icon
│
├── src/                        # Application source code
│   ├── assets/              # Unified asset management
│   │   ├── images/         # Illustrations, backgrounds
│   │   ├── icons/          # Custom SVG icons
│   │   ├── logos/          # Brand assets
│   │   └── config.ts       # Asset configuration
│   │
│   ├── components/          # Reusable UI components
│   │   └── FloatingNav.tsx
│   │
│   ├── data/              # Data layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── constants/      # Application constants
│   │   ├── scenarios/      # Scenario data structures
│   │   └── mock/          # Mock data for development
│   │
│   ├── features/          # Feature-based modules
│   │   ├── chat/         # Chat functionality
│   │   ├── flow/         # Scenario flow logic
│   │   └── followup/     # Follow-up tracking
│   │
│   ├── styles/            # Modular CSS architecture
│   │   ├── variables.css  # Design tokens
│   │   ├── base.css      # Global styles
│   │   ├── animations.css # Animation keyframes
│   │   ├── components/   # Component-specific styles
│   │   └── views/        # View-specific styles
│   │
│   ├── views/             # Page-level components
│   │   ├── LandingView.tsx
│   │   ├── BuilderView.tsx
│   │   ├── MyScenariosView.tsx
│   │   ├── QuizView.tsx
│   │   └── PresentationView.tsx
│   │
│   ├── App.tsx           # Root component with routing
│   ├── App.css           # Legacy main stylesheet
│   ├── Dashboard.tsx      # Main dashboard component
│   ├── Login.tsx         # Authentication page
│   ├── data.ts           # Legacy data file
│   ├── main.tsx          # Application entry point
│   └── index.css         # Base imports
│
├── docs/                    # Project documentation
│   ├── PRD.md
│   ├── Functional_Specifications.md
│   ├── Frontend_Architecture.md
│   └── ARCHITECTURE.md
│
├── backend/              # Future backend services
├── package.json          # Dependencies
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project README
```

---

## Technology Stack

### Frontend Framework
- **React 19.2.0**: 동시성(Concurrent) 기능을 포함한 UI 라이브러리
- **TypeScript 5.9.3**: 타입 안정성과 개발 경험 향상

### Build Tool
- **Vite 7.2.4**: 빠른 개발 서버 및 최적화된 빌드
- **@vitejs/plugin-react 5.1.1**: Vite용 React 지원

### Styling
- **CSS Modules**: 컴포넌트 단위 스코프 스타일
- **CSS Variables**: 테마/디자인 토큰을 위한 CSS 변수
- **Framer Motion 12.29.2**: 애니메이션 라이브러리

### UI Components
- **Lucide React 0.563.0**: 아이콘 라이브러리
- **Recharts 3.7.0**: 데이터 시각화 차트 라이브러리
- **React-XArrows 2.0.2**: 시나리오 플로우 연결선을 위한 라이브러리

### Development Tools
- **ESLint 9.39.1**: 코드 린팅
- **TypeScript ESLint 8.46.4**: TypeScript 전용 규칙
- **Prettier (설정됨)**: 코드 포매팅

---

## Module Organization

### Components (`src/components/`)

여러 화면(View)에서 재사용 가능한 UI 컴포넌트입니다.

| Component | Purpose | Props |
|-----------|---------|-------|
| `FloatingNav` | Bottom navigation with glassmorphism | `setView`, `current` |

### Views (`src/views/`)

주요 애플리케이션 화면을 나타내는 페이지 단위 컴포넌트입니다.

| View | Purpose | Key Features |
|------|---------|--------------|
| `LandingView` | Hero/landing page | Brand showcase, CTA |
| `BuilderView` | 5-step scenario builder | Guided flow, AI chat |
| `MyScenariosView` | User's scenario dashboard | Scenario cards, tracking |
| `QuizView` | Investment knowledge quiz | Interactive quiz |
| `PresentationView` | Scenario presentation | Visual scenario display |

### Features (`src/features/`)

도메인(기능) 단위로 묶인 모듈입니다.

#### Chat (`src/features/chat/`)

**목적**: 시나리오 가이드를 위한 AI 기반 채팅 인터페이스

**파일**:
- `ChatSidebar.tsx`: Chat interface
- `useChat.ts`: Chat hook
- `chatConfig.ts`: Chat configuration
- `types.ts`: Chat type definitions

#### Flow (`src/features/flow/`)

**목적**: 시나리오 플로우 관리 및 시각화

**파일**:
- `ScenarioFlow.tsx`: Flow visualization
- `NewsTicker.tsx`: News ticker component
- `flowConfig.ts`: Flow configuration
- `useScenarioFlow.ts`: Flow hook

#### Follow-up (`src/features/followup/`)

**목적**: 시나리오 추적 및 뉴스 분석

**파일**:
- `NewsFeed.tsx`: News feed component
- `useChatSummary.ts`: Chat summary hook
- `mockNews.ts`: Mock news data

---

## Data Flow

### View State Management

이 애플리케이션은 단순한 **뷰 상태(ViewState) 기반 라우팅** 방식을 사용합니다.

```typescript
type ViewState = 'LANDING' | 'BUILDER' | 'MYSCENARIOS' | 'LOGIN' | 'DASHBOARD' | 'QUIZ' | 'PRESENTATION'
```

**흐름**:
1. 사용자는 `LANDING`(또는 로그인 상태면 `DASHBOARD`)에서 시작
2. `FloatingNav`를 통해 화면 간 이동
3. 뷰 상태는 루트 컴포넌트 `App.tsx`에서 관리
4. 세션은 `localStorage`로 유지

### Data Flow Diagram

```
┌─────────────┐
│   User     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    App.tsx                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │         ViewState (useState)                   │  │
│  │  'LANDING' → 'BUILDER' → 'MYSCENARIOS'  │  │
│  └─────────────────────────────────────────────────┘  │
└───────────┬───────────────────────────────────────────┘
            │
     ┌──────┴──────┬───────────────┬─────────────┐
     ▼             ▼               ▼             ▼
┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ LandingView│ │ BuilderView│ │Dashboard │ │MyScenarios│
└─────┬─────┘ └─────┬────┘ └─────┬────┘ └─────┬─────┘
      │              │              │             │
      ▼              ▼              ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    data.ts   │ │ features/chat │ │features/flow │ │data/scenarios│
│ (Scenario    │ │  (ChatHook) │ │(FlowHook)   │ │  (Data)     │
│   Data)      │ │              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Data Sources

1. **시나리오 데이터**: `src/data/scenarioData.ts`
   - 5단계 시나리오 구조
   - 50개 이상의 투자 옵션
   - AI 분석 데이터

2. **사용자 데이터**: `localStorage`
   - 활성 시나리오 선택값
   - 세션 상태
   - 사용자 설정

3. **목(Mock) 데이터**: `src/features/*/mock*.ts`
   - 개발용 데이터
   - 뉴스 피드 샘플
   - 채팅 예시

---

## State Management

### Local State

React 훅을 사용하는 **컴포넌트 단위 로컬 상태**입니다.

```typescript
const [view, setView] = useState<ViewState>('LANDING')
const [showToast, setShowToast] = useState(false)
```

### Persistent State

세션 간 상태 유지를 위해 **localStorage**를 사용합니다.

```typescript
// Session management
localStorage.setItem('narrative_session', 'active')

// Active scenario
localStorage.setItem('narrative_active_scenario', JSON.stringify(scenario))
```

### Future: Global State

상태가 복잡해지는 경우 아래 도입을 고려할 수 있습니다.
- Zustand: 가벼운 전역 상태 관리
- Redux Toolkit: 복잡한 상태 요구에 적합
- React Query: 서버 상태 관리

---

## Routing

### Current Implementation

조건부 렌더링으로 구현한 단순 뷰 기반 라우팅입니다.

```typescript
if (view === 'LANDING') {
  return <LandingView setView={setView} current={view} />
}
if (view === 'BUILDER') {
  return <BuilderView setView={setView} current={view} />
}
```

### Future: React Router

프로덕션 환경에서는 다음과 같은 형태로 React Router 적용을 고려할 수 있습니다.

```bash
npm install react-router-dom
```

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingView />} />
    <Route path="/builder" element={<BuilderView />} />
    <Route path="/my-scenarios" element={<MyScenariosView />} />
  </Routes>
</BrowserRouter>
```

---

## Styling Architecture

### CSS Organization

```
src/styles/
├── variables.css      # Design tokens (colors, spacing, typography)
├── base.css         # Global resets and base styles
├── animations.css   # Animation keyframes
├── components/      # Component-specific styles
│   └── FloatingNav.css
└── views/          # View-specific styles
    └── Landing.css
```

### Design Tokens

CSS 변수로 일관된 테마를 제공합니다.

```css
:root {
  /* Colors */
  --bg-primary: #000000;
  --text-primary: #ffffff;
  --primary-blue: #3b82f6;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;

  /* Typography */
  --text-base: 0.85rem;
  --text-lg: 1rem;
}
```

### Responsive Design

모바일 퍼스트 접근이며, 브레이크포인트는 다음과 같습니다.

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: 768px - 1024px
- **Large**: > 1024px

### Theme

**현재**: 다크 모드(기본 테마)  
**향후**: 라이트 모드 토글

---

## Asset Management

### Asset Structure

```
src/assets/
├── images/        # Backgrounds, illustrations
├── icons/         # Custom SVG icons
├── logos/         # Brand assets
└── config.ts      # Asset configuration

public/
├── logo/         # Public-facing logos
└── [static files]
```

### Asset Configuration

`src/assets/config.ts`를 통해 에셋을 중앙에서 관리합니다.

```typescript
export const BRAND_ASSETS = {
  primary: '/public/logo/logo-primary.svg',
  icon: '/public/logo/logo-icon.svg',
}

export const ICON_ASSETS = {
  ai: '/src/assets/icons/ai.svg',
  chart: '/src/assets/icons/chart.svg',
}

export const getAssetPath = (category, name, format) => {
  return `/src/assets/${category}/${name}.${format}`
}
```

### Asset Loading

프리로딩을 위한 유틸리티 함수를 제공합니다.

```typescript
import { preloadAsset, preloadAssets } from '@/assets/config'

// Single asset
await preloadAsset('/src/assets/images/hero-bg.svg')

// Multiple assets
await preloadAssets([
  '/src/assets/icons/ai.svg',
  '/src/assets/icons/chart.svg',
])
```

---

## Build & Deployment

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**개발 서버**: http://localhost:5173

### Production Build

```bash
# Build for production
npm run build
```

**출력물**: `dist/` 디렉터리

### Preview Build

```bash
# Preview production build
npm run preview
```

### Linting

```bash
# Run linter
npm run lint
```

---

## Performance Considerations

### Code Splitting

- 초기 로딩 속도를 위해 View를 지연 로딩(Lazy load)
- 캐싱을 위해 vendor 번들을 분리

### Asset Optimization

- 확장성을 위해 SVG 아이콘 사용
- 이미지 WebP 포맷(향후)
- 중요한 경로(Critical path) 에셋 프리로딩

### Bundle Size

현재 추정 크기: 약 500KB(gzipped)

목표: 300KB 미만(gzipped)

---

## Security Considerations

### API Keys

민감한 값은 환경변수로 관리합니다.

```env
VITE_OPENROUTER_API_KEY=your_key_here
```

⚠️ **주의**: `VITE_*` 변수는 클라이언트에 노출됩니다. 프로덕션에서는 백엔드 프록시를 사용하세요.

### Data Validation

- 모든 사용자 입력 검증
- AI 응답 정제(Sanitize)
- TypeScript를 통한 타입 안정성

---

## Future Improvements

### Phase 2: Enhanced Architecture

1. **React Router**: URL 기반의 정식 라우팅
2. **상태 관리**: 복잡한 상태를 위한 Zustand 도입
3. **API 레이어**: Axios 인터셉터 및 에러 처리
4. **테스트**: Vitest 유닛 테스트, Playwright E2E

### Phase 3: Scalability

1. **코드 스플리팅**: 라우트 기반 청킹
2. **가상 스크롤**: 긴 리스트 성능 개선
3. **이미지 최적화**: WebP, 지연 로딩
4. **서비스 워커**: 오프라인 지원

### Phase 4: Developer Experience

1. **Storybook**: 컴포넌트 문서화
2. **ESLint 설정**: 더 엄격한 규칙 적용
3. **Pre-commit 훅**: Husky로 코드 품질 보장
4. **CI/CD**: GitHub Actions 기반 자동 테스트

---

## Contributing

### Code Style

- 기존 컨벤션 준수
- TypeScript를 엄격하게 사용
- 컴포넌트 네이밍: PascalCase
- 파일 네이밍: PascalCase.tsx

### Commit Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## References

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Project README](../README.md)
- [PRD](./PRD.md)
