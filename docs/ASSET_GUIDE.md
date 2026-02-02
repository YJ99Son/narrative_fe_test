# 에셋(자산) 관리 가이드

**버전**: 1.0  
**마지막 업데이트**: 2026-02-02  
**프로젝트**: Narrative-AI 에셋 문서

---

## 목차

1. [개요](#overview)
2. [에셋 구조](#asset-structure)
3. [에셋 분류](#asset-categories)
4. [에셋 추가](#adding-assets)
5. [에셋 사용](#using-assets)
6. [에셋 최적화](#asset-optimization)
7. [권장 사항](#best-practices)
8. [문제 해결](#troubleshooting)

---

## Overview

이 문서는 Narrative-AI 애플리케이션에서 에셋(이미지/아이콘/로고 등)을 **관리, 정리, 사용하는 방법**을 설명합니다.

### Asset Philosophy

1. **중앙화(Centralized)**: 하나의 설정(config)으로 모든 에셋을 관리
2. **타입 안정성(Type-Safe)**: 모든 에셋에 대해 TypeScript 정의 제공
3. **문서화(Documented)**: 각 에셋의 목적/설명을 명확히 기록
4. **최적화(Optimized)**: 빠른 로딩과 최소 번들 크기 지향

### Asset Configuration

중앙 설정은 `src/assets/config.ts`에 있습니다.

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

---

## Asset Structure

### Directory Layout

```
src/assets/
├── images/           # Backgrounds, illustrations
├── icons/            # Custom SVG icons
├── logos/            # Brand assets
└── config.ts         # Asset configuration

public/
├── logo/            # Public-facing logos
├── vite.svg         # Vite default
└── pwa-icon.svg     # PWA icon
```

### File Locations

| Asset Type | Location | Served From |
|------------|----------|--------------|
| Brand logos | `public/logo/` | `/logo/` |
| Application icons | `public/` | `/` |
| Custom icons | `src/assets/icons/` | `/assets/icons/` |
| Images | `src/assets/images/` | `/assets/images/` |

---

## Asset Categories

### 1. Brand Assets (`/public/logo/`)

**목적**: Narrative-AI 브랜드 아이덴티티

| File | Purpose | Size |
|------|---------|-------|
| `logo-primary.svg` | Main logo | 200x40 |
| `logo-secondary.svg` | Secondary logo | - |
| `logo-icon.svg` | App icon | 48x48 |
| `favicon.svg` | Browser favicon | 32x32 |

**디자인 가이드라인**:
- 어두운 배경에서는 흰색 텍스트 사용
- 주요 포인트 컬러: `#3b82f6`(블루)
- 깔끔하고 현대적인 산세리프 타이포그래피
- 미니멀한 디자인

### 2. Icons (`/src/assets/icons/`)

**목적**: 기능성 UI 아이콘

| Icon | Usage | Size |
|------|-------|-------|
| `ai.svg` | AI features | 24x24 |
| `chart.svg` | Data visualization | 24x24 |
| `news.svg` | News feed | 24x24 |
| `scenario.svg` | Scenario management | 24x24 |
| `dashboard.svg` | Dashboard navigation | 24x24 |
| `settings.svg` | Settings page | 24x24 |

**디자인 가이드라인**:
- 스트로크 기반(라인) 아이콘
- 2px stroke 두께
- 라인 캡/조인은 round
- 24x24 viewBox
- Fill: `none`, Stroke: `currentColor`

**대안**: 코드 기반 아이콘은 `lucide-react` 사용을 권장합니다.

```tsx
import { Home, Settings, User } from 'lucide-react'

<Home size={18} />
<Settings size={18} />
<User size={18} />
```

### 3. Images (`/src/assets/images/`)

**목적**: 일러스트/배경 이미지

**분류**:
- **Hero**: 랜딩 페이지 일러스트
- **Patterns**: 배경 패턴
- **Features**: 기능별 일러스트

**가이드라인**:
- 가능하면 SVG 포맷 사용
- 웹 최적화(WebP, SVG) 우선
- 큰 이미지는 지연 로딩(Lazy loading) 적용
- 반응형 사이즈 제공

### 4. Public Assets (`/public/`)

**목적**: 그대로(정적) 제공되는 파일

**파일**:
- `vite.svg`: Vite 기본 아이콘(교체 가능)
- `pwa-icon.svg`: PWA(Progressive Web App) 아이콘
- `favicon.svg`: 브라우저 탭 아이콘

**사용**: `index.html`에서 직접 참조하거나 절대 경로로 접근

---

## Adding Assets

### Adding a New Icon

1. `src/assets/icons/`에 **SVG 파일 생성**:
   ```bash
   touch src/assets/icons/new-icon.svg
   ```

2. 올바른 구조로 **SVG 편집**:
   ```xml
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
     <!-- Icon content -->
   </svg>
   ```

3. `src/assets/config.ts`에 **config 등록**:
   ```typescript
   export const ICON_ASSETS = {
     // ... existing icons
     newIcon: '/src/assets/icons/new-icon.svg',
   } as const
   ```

4. **컴포넌트에서 사용**:
   ```tsx
   import { ICON_ASSETS } from '@/assets/config'

   <img src={ICON_ASSETS.newIcon} alt="New Icon" />
   ```

### Adding a New Logo

1. `public/logo/`에 **SVG 파일 생성**:
   ```bash
   touch public/logo/logo-new.svg
   ```

2. **config 등록**:
   ```typescript
   export const BRAND_ASSETS = {
     // ... existing logos
     newLogo: '/public/logo/logo-new.svg',
   } as const
   ```

3. **애플리케이션에서 사용**:
   ```tsx
   import { BRAND_ASSETS } from '@/assets/config'

   <img src={BRAND_ASSETS.newLogo} alt="New Logo" />
   ```

### Adding an Image

1. 추가 전에 **이미지 최적화**:
   - WebP로 변환(권장)
   - Squoosh, TinyPNG 등으로 압축
   - 반응형 사이즈 생성

2. **디렉터리에 배치**:
   ```bash
   cp optimized-image.webp src/assets/images/
   ```

3. **config 등록**:
   ```typescript
   export const IMAGE_ASSETS = {
     newImage: '/src/assets/images/new-image.webp',
   } as const
   ```

4. **지연 로딩과 함께 사용**:
   ```tsx
   import { lazy } from 'react'

   const LazyImage = lazy(() => import('@/assets/images/new-image.webp'))
   ```

---

## Using Assets

### Importing from Config

```tsx
import { BRAND_ASSETS, ICON_ASSETS, IMAGE_ASSETS } from '@/assets/config'

function Component() {
  return (
    <div>
      <img src={BRAND_ASSETS.primary} alt="Brand Logo" />
      <img src={ICON_ASSETS.ai} alt="AI Icon" />
      <img src={IMAGE_ASSETS.heroBackground} alt="Hero Background" />
    </div>
  )
}
```

### Dynamic Asset Path Generation

```tsx
import { getAssetPath } from '@/assets/config'

function Component({ iconName }: { iconName: string }) {
  const iconPath = getAssetPath('icons', iconName, 'svg')
  return <img src={iconPath} alt={iconName} />
}
```

### Preloading Assets

중요 에셋은 앱 시작 시점에 프리로딩하는 것을 권장합니다.

```tsx
import { useEffect } from 'react'
import { preloadAssets } from '@/assets/config'

function App() {
  useEffect(() => {
    preloadAssets([
      BRAND_ASSETS.primary,
      ICON_ASSETS.ai,
      ICON_ASSETS.chart,
    ])
  }, [])

  return <>{/* App content */}</>
}
```

### Conditional Asset Loading

```tsx
function Component() {
  const [assetLoaded, setAssetLoaded] = useState(false)

  const handleLoad = () => setAssetLoaded(true)

  return (
    <>
      {!assetLoaded && <Placeholder />}
      <img
        src={ICON_ASSETS.ai}
        alt="AI Icon"
        onLoad={handleLoad}
        style={{ display: assetLoaded ? 'block' : 'none' }}
      />
    </>
  )
}
```

---

## Asset Optimization

### SVG Optimization

**SVG를 추가하기 전**:

1. **불필요한 메타데이터 제거**:
   ```xml
   <!-- Remove -->
   <title>, <desc>, metadata tags
   ```

2. 도구로 **최소화(Minify)**:
   - [SVGOMG](https://jakearchibald.github.io/svgomg/)
   - [SVGO](https://github.com/svg/svgo)

3. **효율적인 패스 사용**:
   ```xml
   <!-- Good: Simple shapes -->
   <circle cx="12" cy="12" r="10" />

   <!-- Bad: Complex paths -->
   <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10 10z" />
   ```

### Image Optimization

**PNG/JPG 이미지의 경우**:

1. 도구로 **압축(Compress)**:
   - [Squoosh](https://squoosh.app/)
   - [TinyPNG](https://tinypng.com/)
   - [ImageOptim](https://imageoptim.com/)

2. **WebP로 변환**(권장):
   - PNG 대비 약 30% 더 작은 용량
   - 같은 용량에서 더 나은 품질
   - 최신 브라우저 지원

3. **반응형 사이즈 생성**:
   ```
   hero-image-320.webp   # Mobile
   hero-image-768.webp   # Tablet
   hero-image-1024.webp  # Desktop
   hero-image-1920.webp  # Large
   ```

### Font Optimization

커스텀 폰트를 추가한다면:

1. **최신 포맷 사용**:
   - WOFF2: 최신/압축 효율이 좋음
   - WOFF: 폴백
   - TTF: 레거시 폴백

2. **서브셋(subset) 처리**:
   - 실제로 쓰는 글자만 포함
   - 파일 크기 50%+ 절감 가능

3. **중요 폰트 프리로드**:
   ```html
   <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" />
   ```

---

## Best Practices

### 1. Use SVG Icons

**이유**: 어떤 해상도에서도 선명하고, 확장 가능하며, 파일 용량이 작음

```tsx
✅ Good: <svg width="24" height="24">...</svg>
❌ Bad: <img src="icon.png" width="24" height="24" />
```

### 2. Use Lucide React When Possible

**이유**: 트리 셰이킹 가능, 디자인 일관성 확보, 커스텀 SVG 유지보수 부담 감소

```tsx
✅ Good:
import { Search, Bell } from 'lucide-react'
<Search size={18} />

❌ Bad:
<img src="/src/assets/icons/search.svg" alt="Search" />
```

### 3. Lazy Load Non-Critical Assets

**이유**: 초기 로딩이 빨라지고 전반적인 성능이 좋아짐

```tsx
✅ Good:
const LazyChart = lazy(() => import('@/assets/images/chart.svg'))
<Suspense fallback={<Placeholder />}>
  <LazyChart />
</Suspense>

❌ Bad:
import chart from '@/assets/images/chart.svg'
<img src={chart} />
```

### 4. Use Alt Text

**이유**: 접근성(Accessibility) 및 SEO

```tsx
✅ Good:
<img src={ICON_ASSETS.ai} alt="AI features icon" />

❌ Bad:
<img src={ICON_ASSETS.ai} />
```

### 5. Use Proper Sizes

**이유**: 레이아웃 시프트 방지, UX 개선

```tsx
✅ Good:
<img
  src={IMAGE_ASSETS.hero}
  alt="Hero illustration"
  width="800"
  height="600"
  loading="lazy"
/>

❌ Bad:
<img src={IMAGE_ASSETS.hero} alt="Hero" />
```

---

## Troubleshooting

### Asset Not Loading

**문제**: 이미지/아이콘이 깨진 링크로 표시됨

**해결 방법**:
1. config.ts의 경로 확인
2. 파일이 올바른 디렉터리에 존재하는지 확인
3. 파일 권한 확인
4. 브라우저 캐시 삭제

```bash
# Verify file exists
ls -la src/assets/icons/ai.svg

# Check file content
cat src/assets/icons/ai.svg
```

### SVG Not Rendering

**문제**: SVG가 이미지로 렌더링되지 않고 코드처럼 보임

**해결 방법**:
1. XML 네임스페이스 확인: `xmlns="http://www.w3.org/2000/svg"`
2. 닫히지 않은 태그가 없는지 확인
3. [SVG Validator](https://validator.w3.org/)로 검증

### Asset Too Large

**문제**: 번들 사이즈가 너무 큼

**해결 방법**:
1. SVGO로 SVG 최적화
2. 이미지 압축
3. 지연 로딩 적용
4. 코드 기반 아이콘(lucide-react) 고려

### Color Issues in Dark Mode

**문제**: 다크 모드에서 아이콘 색상이 테마와 맞지 않음

**해결 방법**:
1. fill/stroke에 `currentColor` 사용
2. 색상 하드코딩 금지
3. 브랜드 컬러는 CSS 변수 사용

```xml
✅ Good:
<svg fill="currentColor" stroke="currentColor">
  <!-- Icon content -->
</svg>

❌ Bad:
<svg fill="#000000" stroke="#000000">
  <!-- Icon content -->
</svg>
```

---

## Asset Checklist

새 에셋을 추가하기 전, 아래 항목을 확인하세요.

- [ ] File is optimized (minified/compressed)
- [ ] File has proper format (SVG/WebP)
- [ ] Alt text is meaningful
- [ ] Dimensions are specified
- [ ] File is added to config.ts
- [ ] File has accessible description
- [ ] File is in correct directory
- [ ] File follows naming convention
- [ ] File is tested in component

---

## Resources

- [SVG Optimization](https://jakearchibald.github.io/svgomg/)
- [Image Compression](https://squoosh.app/)
- [Lucide Icons](https://lucide.dev/)
- [Asset Config](../src/assets/config.ts)
- [Architecture Guide](./ARCHITECTURE.md)
