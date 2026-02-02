import type { NewsArticle } from '../../data'

// Mock news data - 2 weeks before (시나리오 생성 이전 뉴스)
export const MOCK_NEWS_BEFORE: NewsArticle[] = [
    {
        id: 'before_1',
        title: 'AI 데이터센터 투자, 2024년 사상 최대 전망',
        source: 'Bloomberg',
        date: '2026-01-14',
        url: '#',
        phase: 'ai_supercycle',
        sentiment: 'POSITIVE',
    },
    {
        id: 'before_2',
        title: 'HBM3E 양산 본격화, 삼성·하이닉스 경쟁 격화',
        source: '전자신문',
        date: '2026-01-13',
        url: '#',
        phase: 'memory_sector',
        sentiment: 'POSITIVE',
    },
    {
        id: 'before_3',
        title: 'SK하이닉스, 엔비디아 독점 공급 계약 연장 논의',
        source: 'Reuters',
        date: '2026-01-12',
        url: '#',
        phase: 'sk_hynix',
        sentiment: 'POSITIVE',
    },
    {
        id: 'before_4',
        title: '한미반도체, TC본더 수주 잔고 2년치 확보',
        source: 'Korea Economic Daily',
        date: '2026-01-11',
        url: '#',
        phase: 'hanmi_semi_eq',
        sentiment: 'POSITIVE',
    },
]

// Mock news data - Current (현재 뉴스)
export const MOCK_NEWS_CURRENT: NewsArticle[] = [
    {
        id: 'current_1',
        title: 'HBM4 수요 급증, SK하이닉스 수주 잔고 역대 최대',
        source: '전자신문',
        date: '2026-01-28',
        url: '#',
        phase: 'memory_sector',
        sentiment: 'POSITIVE',
    },
    {
        id: 'current_2',
        title: '엔비디아 Blackwell GPU, 데이터센터 점유율 95% 돌파',
        source: 'Reuters',
        date: '2026-01-27',
        url: '#',
        phase: 'logic_sector',
        sentiment: 'POSITIVE',
    },
    {
        id: 'current_3',
        title: 'SK하이닉스, HBM3E 12단 적층 양산 성공',
        source: 'ZDNet Korea',
        date: '2026-01-26',
        url: '#',
        phase: 'sk_hynix',
        sentiment: 'POSITIVE',
    },
    {
        id: 'current_4',
        title: '한미반도체, 마이크론 공급 계약 체결로 고객 다변화',
        source: 'Fnnews',
        date: '2026-01-25',
        url: '#',
        phase: 'hanmi_semi_eq',
        sentiment: 'POSITIVE',
    },
]

// Mock news data - 2 weeks after (시나리오 생성 이후 뉴스 - 미래)
export const MOCK_NEWS_AFTER: NewsArticle[] = [
    {
        id: 'after_1',
        title: '[예정] CES 2026에서 HBM4 첫 공개 예정',
        source: 'The Verge',
        date: '2026-02-10',
        url: '#',
        phase: 'memory_sector',
        sentiment: 'NEUTRAL',
    },
    {
        id: 'after_2',
        title: '[예정] SK하이닉스 1분기 실적 발표',
        source: 'IR Calendar',
        date: '2026-02-08',
        url: '#',
        phase: 'sk_hynix',
        sentiment: 'NEUTRAL',
    },
    {
        id: 'after_3',
        title: '[예정] 엔비디아 GTC 2026 컨퍼런스',
        source: 'NVIDIA',
        date: '2026-02-05',
        url: '#',
        phase: 'logic_sector',
        sentiment: 'NEUTRAL',
    },
]

// Get news by phase and time period
export const getNewsByPhaseAndTime = (
    phaseId: string,
    period: 'before' | 'current' | 'after'
): NewsArticle[] => {
    const newsMap = {
        before: MOCK_NEWS_BEFORE,
        current: MOCK_NEWS_CURRENT,
        after: MOCK_NEWS_AFTER,
    }
    return newsMap[period].filter((news) => news.phase === phaseId)
}

// Get all news by time period
export const getNewsByTime = (
    period: 'before' | 'current' | 'after',
    limit = 10
): NewsArticle[] => {
    const newsMap = {
        before: MOCK_NEWS_BEFORE,
        current: MOCK_NEWS_CURRENT,
        after: MOCK_NEWS_AFTER,
    }
    return newsMap[period].slice(0, limit)
}

// Calculate time-based ratio (how much time has passed since scenario creation)
export const getTimeRatio = (createdAt: number): { beforeRatio: number; afterRatio: number } => {
    const now = Date.now()
    const elapsed = now - createdAt
    const twoWeeksMs = 14 * 24 * 60 * 60 * 1000

    // If more than 2 weeks have passed, show more "after" news
    const progress = Math.min(elapsed / twoWeeksMs, 1)

    return {
        beforeRatio: 1 - progress, // Starts at 1, goes to 0
        afterRatio: progress, // Starts at 0, goes to 1
    }
}
