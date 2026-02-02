import { BRAND_ASSETS } from '../assets/config';

type BrandLogoSize = 'sm' | 'md' | 'lg';

interface BrandLogoProps {
  size?: BrandLogoSize;
  /**
   * 텍스트 SVG를 함께 붙여서 렌더링할지 여부
   */
  withText?: boolean;
}

const sizeToHeight: Record<BrandLogoSize, number> = {
  sm: 20,
  md: 28,
  lg: 36,
};

/**
 * 브랜드 로고 컴포넌트
 *
 * - `primaryLogo`: 심볼(아이콘) SVG
 * - `primaryText`: 워드마크(텍스트) SVG
 *
 * 두 SVG를 나란히 배치해서 사용합니다.
 */
export default function BrandLogo({ size = 'md', withText = true }: BrandLogoProps) {
  const height = sizeToHeight[size];
  const iconHeight = height * 1.1; // 텍스트보다 약간 더 크게
  const textHeight = height * 0.8; // 전체 높이 대비 살짝 작게

  return (
    <div
      className="brand-logo"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <img
        src={BRAND_ASSETS.primaryLogo}
        alt="Narrative-AI Logo Icon"
        style={{
          height: iconHeight,
          width: 'auto',
          display: 'block',
        }}
      />
      {withText && (
        <img
          src={BRAND_ASSETS.primaryText}
          alt="Narrative-AI Logo Text"
          style={{
            height: textHeight,
            width: 'auto',
            display: 'block',
          }}
        />
      )}
    </div>
  );
}

