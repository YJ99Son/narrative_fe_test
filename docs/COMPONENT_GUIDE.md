# 컴포넌트 가이드

**버전**: 1.0  
**마지막 업데이트**: 2026-02-02  
**프로젝트**: Narrative-AI 컴포넌트 문서

---

## 목차

1. [개요](#overview)
2. [컴포넌트 라이브러리](#component-library)
3. [컴포넌트 패턴](#component-patterns)
4. [사용 가이드라인](#usage-guidelines)
5. [컴포넌트 스타일링](#styling-components)
6. [컴포넌트 만들기](#creating-components)
7. [권장 사항](#best-practices)

---

## Overview

이 문서는 Narrative-AI 애플리케이션에서 재사용 가능한 컴포넌트의 **목적, Props, 사용 예시**를 정리합니다.

### Component Principles

1. **재사용성(Reusable)**: 여러 맥락에서 사용할 수 있어야 함
2. **조합 가능(Composable)**: 조합해 더 복잡한 UI를 만들 수 있어야 함
3. **테스트 용이(Testable)**: 독립적으로 테스트 가능해야 함
4. **접근성(Accessible)**: WCAG 가이드라인을 따름
5. **문서화(Documented)**: Props와 사용 예시를 명확히 제공

---

## Component Library

### FloatingNav

**Location**: `src/components/FloatingNav.tsx`
**Styles**: `src/styles/components/FloatingNav.css`

**목적**: 글래스모피즘 효과가 적용된 하단 내비게이션 바로, 주요 화면(View)으로 빠르게 이동할 수 있게 합니다.

#### Props

| Prop | Type | Required | Default | Description |
|-------|------|-----------|-------------|
| `setView` | `(view: ViewState) => void` | Yes | - | 현재 화면을 변경하는 함수 |
| `current` | `ViewState` | Yes | - | 현재 활성화된 뷰 상태 |

#### Usage

```tsx
import FloatingNav from '@/components/FloatingNav'

function App() {
  const [view, setView] = useState<ViewState>('LANDING')

  return (
    <>
      {/* Main content */}
      <LandingView setView={setView} current={view} />

      {/* Navigation */}
      <FloatingNav setView={setView} current={view} />
    </>
  )
}
```

#### Features

- **Glassmorphism**: 반투명 배경 + 블러 효과
- **Active State**: 현재 뷰를 하이라이트
- **Toast Integration**: 제한된 영역 접근 시 경고 토스트 표시
- **Responsive**: 모바일에서 간격/배치가 자연스럽게 적응

#### Styling Variables

```css
.floating-nav {
  /* Positioning */
  position: fixed;
  bottom: var(--space-14);
  left: 50%;
  transform: translateX(-50%);

  /* Glassmorphism */
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);

  /* Layout */
  gap: var(--gap-3xl);
}
```

---

## Component Patterns

### Pattern 1: Controlled Components

컴포넌트가 상태와 콜백을 Props로 받아 동작하는 패턴입니다.

```tsx
interface ComponentProps {
  value: string
  onChange: (value: string) => void
}

function Component({ value, onChange }: ComponentProps) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />
}
```

### Pattern 2: Compound Components

여러 하위 컴포넌트를 조합해 하나의 컴포넌트를 구성하는 패턴입니다.

```tsx
function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  )
}
```

### Pattern 3: Conditional Rendering

Props에 따라 서로 다른 UI를 렌더링하는 패턴입니다.

```tsx
function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <span className={`badge ${status}`}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  )
}
```

---

## Usage Guidelines

### When to Create a Component

**다음 경우 컴포넌트를 만드세요**:

1. UI 요소가 2곳 이상에서 재사용됨
2. 로직이 복잡함(10줄 이상)
3. 자체 상태를 가짐
4. 전용 스타일링이 필요함

**다음 경우 굳이 컴포넌트를 만들지 마세요**:

1. 한 번만 사용됨
2. 로직이 단순함(5줄 미만)
3. 기존 컴포넌트를 감싸는 얇은 래퍼 수준임

### Component Naming

**파일 이름**: PascalCase.tsx
```
✅ Good: FloatingNav.tsx, Card.tsx, Button.tsx
❌ Bad: floatingNav.tsx, card.tsx, button.tsx
```

**컴포넌트 이름**: PascalCase
```tsx
✅ Good: function FloatingNav() {}
❌ Bad: function floatingNav() {}
```

### Component Location

**규칙**:
1. 재사용 컴포넌트 → `src/components/`
2. 페이지 전용 컴포넌트 → `src/views/`
3. 기능(Feature) 전용 컴포넌트 → `src/features/<feature>/`

**예시**:
- `FloatingNav` → `src/components/FloatingNav.tsx` (used in all views)
- `BuilderView` → `src/views/BuilderView.tsx` (only builder page)
- `ChatBubble` → `src/features/chat/ChatBubble.tsx` (only chat feature)

---

## Styling Components

### CSS Module Pattern

각 컴포넌트는 자신의 CSS 파일을 가지는 것을 권장합니다.

```
src/components/
├── ComponentName.tsx
└── ComponentName.css
```

### Importing Styles

```tsx
import './ComponentName.css'

function ComponentName() {
  return <div className="component-name">...</div>
}
```

### CSS Naming Convention

**클래스 이름**: kebab-case
```css
.component-name {}
.component-name__element {}
.component-name--modifier {}
```

**Examples**:
```css
.card {}                     /* Block */
.card__title {}              /* Element */
.card__content {}            /* Element */
.card--highlighted {}        /* Modifier */
.card--disabled {}           /* Modifier */
```

### Using Design Tokens

가능한 한 `src/styles/variables.css`의 CSS 변수를 사용하세요.

```css
❌ Bad:
.card {
  background: #0b0b0b;
  padding: 24px;
  border: 1px solid #1f2937;
}

✅ Good:
.card {
  background: var(--bg-secondary);
  padding: var(--space-8);
  border: 1px solid var(--border-light);
}
```

---

## Creating Components

### Component Template

새 컴포넌트를 만들 때 아래 템플릿을 사용하세요.

```tsx
import { useState, useEffect } from 'react'
import './ComponentName.css'

interface ComponentNameProps {
  // Required props
  requiredProp: string

  // Optional props with defaults
  optionalProp?: boolean
  callbackProp?: () => void
}

function ComponentName({ requiredProp, optionalProp = false, callbackProp }: ComponentNameProps) {
  // Component logic
  const [state, setState] = useState(null)

  useEffect(() => {
    // Side effects
  }, [])

  const handleClick = () => {
    // Event handler
    callbackProp?.()
  }

  return (
    <div className="component-name">
      {/* Component JSX */}
    </div>
  )
}

export default ComponentName
```

### TypeScript Best Practices

1. **Props 인터페이스 정의**
   ```tsx
   interface Props {
     value: string
     onChange: (value: string) => void
   }
   ```

2. **적절한 타입 사용**
   ```tsx
   // Use existing types
   import type { ViewState } from '@/data'

   // Define new types
   type Status = 'active' | 'inactive' | 'pending'
   ```

3. **선택 Props를 명확히 표현**
   ```tsx
   interface Props {
     required: string      // Always required
     optional?: number    // Optional with ?
     optionalWithDefault?: boolean  // Optional with default
   }
   ```

---

## Best Practices

### Performance

1. **비용이 큰 컴포넌트에는 React.memo 사용**
   ```tsx
   export default React.memo(ComponentName)
   ```

2. **콜백에는 useCallback 사용**
   ```tsx
   const handleClick = useCallback(() => {
     // Handler logic
   }, [dependencies])
   ```

3. **인라인 함수를 지양**
   ```tsx
   ❌ Bad:
   <button onClick={() => handleClick()}>Click</button>

   ✅ Good:
   const handleClick = useCallback(() => { ... }, [])
   <button onClick={handleClick}>Click</button>
   ```

### Accessibility

1. **시맨틱 HTML 사용**
   ```tsx
   ✅ Good: <button>Click</button>
   ❌ Bad: <div onClick={...}>Click</div>
   ```

2. **ARIA 라벨 추가**
   ```tsx
   <button aria-label="Close" onClick={handleClose}>
     <XIcon />
   </button>
   ```

3. **키보드 내비게이션**
   ```tsx
   <div
     role="button"
     tabIndex={0}
     onClick={handleClick}
     onKeyDown={(e) => e.key === 'Enter' && handleClick()}
   >
     Click me
   </div>
   ```

### Testing

1. **유닛 테스트 작성**(테스트 인프라가 추가되면)
   ```tsx
   import { render, screen } from '@testing-library/react'
   import ComponentName from './ComponentName'

   test('renders correctly', () => {
     render(<ComponentName requiredProp="test" />)
     expect(screen.getByText('test')).toBeInTheDocument()
   })
   ```

2. **Props 변형 케이스 테스트**
   ```tsx
   test('renders with active state', () => {
     render(<ComponentName status="active" />)
     expect(screen.getByTestId('badge')).toHaveClass('active')
   })
   ```

3. **사용자 인터랙션 테스트**
   ```tsx
   test('calls callback on click', () => {
     const handleClick = jest.fn()
     render(<ComponentName onClick={handleClick} />)
     fireEvent.click(screen.getByRole('button'))
     expect(handleClick).toHaveBeenCalled()
   })
   ```

---

## Component Examples

### Button Component (Future)

**사용 시점**: 주요 액션, 내비게이션 버튼

```tsx
import './Button.css'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### Card Component (Future)

**사용 시점**: 콘텐츠 컨테이너, 시나리오 카드

```tsx
import './Card.css'

interface CardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  onClick?: () => void
  selected?: boolean
}

function Card({ title, subtitle, children, onClick, selected }: CardProps) {
  return (
    <div
      className={`card ${selected ? 'card--selected' : ''}`}
      onClick={onClick}
    >
      <div className="card__header">
        <h3 className="card__title">{title}</h3>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
      </div>
      <div className="card__content">{children}</div>
    </div>
  )
}
```

---

## Resources

- [React Component Patterns](https://reactpatterns.com)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Project Architecture](./ARCHITECTURE.md)
