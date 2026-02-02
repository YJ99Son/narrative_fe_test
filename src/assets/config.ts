/**
 * Asset Configuration
 * Centralized asset paths and management for Narrative-AI
 *
 * This file provides a single source of truth for all asset paths
 * and includes documentation for each asset category
 *
 * @module assets/config
 */

export type AssetCategory = 'images' | 'icons' | 'logos';
export type AssetFormat = 'svg' | 'png' | 'jpg' | 'jpeg' | 'webp';

export interface AssetInfo {
  name: string;
  path: string;
  category: AssetCategory;
  format: AssetFormat;
  description?: string;
  usage?: string[];
}

/**
 * ASSET CATEGORIES
 * ===================
 *
 * IMAGES: Background images, illustrations, photos
 *   - Located in: /src/assets/images/
 *   - Used for: Hero sections, feature illustrations, user avatars
 *
 * ICONS: Functional icons for UI elements
 *   - Located in: /src/assets/icons/
 *   - Used for: Navigation, buttons, status indicators
 *   - Alternative: lucide-react icons (preferred for code-based icons)
 *
 * LOGOS: Brand assets and partner logos
 *   - Located in: /src/assets/logos/
 *   - Used for: Brand identity, company logos, product logos
 */

/**
 * PUBLIC ASSETS
 * Static files served directly from /public/
 */
export const PUBLIC_ASSETS = {
  viteLogo: '/vite.svg',
  pwaIcon: '/pwa-icon.svg',
} as const;

/**
 * BRAND ASSETS
 * Narrative-AI brand identity assets
 *
 * NOTE:
 * - Files under /public are served from the root.
 * - So /public/logo/logo-primary-logo.svg → /logo/logo-primary-logo.svg
 */
export const BRAND_ASSETS = {
  /** 로고 심볼(아이콘) 전용 SVG */
  primaryLogo: '/logo/logo-primary-logo.svg',
  /** 브랜드 텍스트 전용 SVG (워드마크) */
  primaryText: '/logo/logo-primary-text.svg',
  /** 조합된 풀 로고가 필요할 경우(선택) */
  primary: '/logo/logo-primary.svg',
  secondary: '/logo/logo-secondary.svg',
  icon: '/logo/logo-icon.svg',
  favicon: '/logo/favicon.ico',
} as const;

/**
 * ICON ASSETS
 * Custom SVG icons for Narrative-AI
 */
export const ICON_ASSETS = {
  ai: '/src/assets/icons/ai.svg',
  chart: '/src/assets/icons/chart.svg',
  news: '/src/assets/icons/news.svg',
  scenario: '/src/assets/icons/scenario.svg',
  dashboard: '/src/assets/icons/dashboard.svg',
  settings: '/src/assets/icons/settings.svg',
} as const;

/**
 * IMAGE ASSETS
 * Background and illustrative images
 */
export const IMAGE_ASSETS = {
  heroBackground: '/src/assets/images/hero-bg.svg',
  heroIllustration: '/src/assets/images/hero-illustration.svg',
  patternDark: '/src/assets/images/pattern-dark.svg',
  patternLight: '/src/assets/images/pattern-light.svg',
} as const;

/**
 * Asset Type Guards
 */
export const isImageAsset = (path: string): boolean => {
  return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(path);
};

export const isIconAsset = (path: string): boolean => {
  return path.includes('/icons/') || path.includes('/icon/');
};

/**
 * Utility function to get asset path
 */
export const getAssetPath = (
  category: AssetCategory,
  name: string,
  format: AssetFormat = 'svg'
): string => {
  const basePath = `/src/assets/${category}`;
  return `${basePath}/${name}.${format}`;
};

/**
 * Asset loading utilities
 */
export const preloadAsset = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = path;
  });
};

export const preloadAssets = async (paths: string[]): Promise<void> => {
  await Promise.all(paths.map(preloadAsset));
};

/**
 * DEFAULT ASSETS
 * Fallback assets when custom ones are not available
 */
export const DEFAULT_ASSETS = {
  placeholderImage: 'data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100" height="100" fill="%23333"/%3E%3C/svg%3E',
  defaultAvatar: 'data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23666"/%3E%3C/svg%3E',
} as const;
