import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LogOut,
    User,
    ChevronRight,
    ChevronLeft,
    TrendingUp,
    Sparkles
} from 'lucide-react'
import type { ViewState } from './data'
import { SCENARIO_DATA } from './data/scenarioData'
import type { ScenarioOption } from './data/scenarioData'
import FloatingNav from './components/FloatingNav'
import './Dashboard.css'

interface DashboardProps {
    setView: (view: ViewState) => void
}

// News Ticker Data
const NEWS_ITEMS = [
    '🔔 삼성전자, HBM4 양산 가속화... 경쟁사 격차 축소 전망',
    '📈 코스피 2,650선 돌파 임박, 외국인 순매수 지속',
    '💡 AI 반도체 수요 폭발적 증가, 메모리 업체 수혜',
    '⚡ 미 연준 금리 인하 시사, 아시아 증시 상승세',
    '🌍 중동 지정학 리스크 완화, 유가 안정세 진입',
    '🚀 SK하이닉스, 엔비디아향 HBM3E 공급 확대',
]

// Flattened Stock Type
type FlatStock = {
    id: string
    name: string
    indexName: string
    indexValue: number
    change: number
    description: string
    path: ScenarioOption[]
    news?: { title: string, content: string }[]
    chartData?: { o: number, c: number, h: number, l: number }[]
}

export default function Dashboard({ setView }: DashboardProps) {
    const [tickerOffset, setTickerOffset] = useState(0)
    const [stocks, setStocks] = useState<FlatStock[]>([])
    const [listMode, setListMode] = useState<'KOSPI' | 'MY_STOCK'>('KOSPI')
    const [expandedStockId, setExpandedStockId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Filter Logic
    const filteredStocks = listMode === 'KOSPI'
        ? stocks
        : stocks.filter((_, i) => i % 2 === 0)

    // Limit stocks for demo
    const displayStocks = filteredStocks.slice(0, 5)

    const toggleExpand = (id: string) => {
        if (expandedStockId === id) setExpandedStockId(null)
        else setExpandedStockId(id)
    }

    // Clear active scenario on mount to prevent stale navigation
    useEffect(() => {
        localStorage.removeItem('narrative_active_scenario')
    }, [])

    // Sync expanded stock to localStorage so FloatingNav knows what is "selected"
    useEffect(() => {
        if (expandedStockId) {
            const stock = displayStocks.find(s => s.id === expandedStockId)
            if (stock) {
                localStorage.setItem('narrative_active_scenario', JSON.stringify({
                    stock: stock.id,
                    stockName: stock.name,
                    path: stock.path
                }))
            }
        } else {
            localStorage.removeItem('narrative_active_scenario')
        }
    }, [expandedStockId, displayStocks])

    useEffect(() => {
        const interval = setInterval(() => {
            setTickerOffset(prev => prev - 1)
        }, 30)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const foundStocks: FlatStock[] = []

        const STOCK_DESCRIPTIONS: Record<string, string> = {
            '삼성전자': 'AI 반도체 슈퍼사이클의 진입으로 HBM3E 공급이 본격화되며 실적 턴어라운드가 강력하게 예상됩니다. 파운드리 가동률 상승과 함께 메모리 판가 상승이 겹치며, 외국인 투자자들의 매수세가 집중되고 있습니다. 12개월 선행 PER 기준 저평가 매력이 부각되는 시점입니다.',
            'SK하이닉스': 'HBM 시장에서의 압도적인 기술 격차를 기반으로 NVIDIA향 독점적 공급 지위를 공고히 유지하고 있습니다. 서버용 고용량 모듈 수요 증가가 수익성을 견인하고 있으며, 올해 영업이익은 사상 최대치를 경신할 것으로 전망됩니다.',
            '한미반도체': 'AI 반도체 패키징의 핵심 공정인 TC 본딩 장비 분야에서 글로벌 점유율 1위를 확고히 하고 있습니다. 글로벌 반도체 기업들의 설비 투자 확대(CAPEX) 기조와 맞물려 수주 잔고가 폭발적으로 증가하고 있어 가파른 성장이 기대됩니다.',
            'HD현대일렉트릭': '북미를 중심으로 한 노후 전력망 교체 수요와 AI 데이터센터 전력 공급 부족 이슈로 초호황기를 맞이했습니다. 변압기 수주 물량은 3년 치가 이미 확보된 상태이며, 판가 인상(P)과 물량 증가(Q)가 동시에 발생하고 있습니다.',
            '알테오젠': '머크(Merck)와의 독점 계약 변경을 통해 바이오 플랫폼 기술의 가치를 입증했습니다. 키트루다 SC 제형 변경에 따른 마일스톤 유입과 로열티 수익이 본격화되며 바이오 섹터 내 최우수 픽으로 꼽힙니다.'
        }

        // Helper to get realistic random news
        const getNews = (name: string) => [
            { title: `${name}, 차세대 기술 로드맵 발표`, content: "글로벌 시장 리더십 강화를 위한 중장기 전략 공개..." },
            { title: `[특징주] ${name}, 외국인 5일 연속 순매수`, content: "실적 개선 기대감에 주요 매매 창구 상위 랭크..." },
            { title: `${name}, '어닝 서프라이즈' 기대감 고조`, content: "증권가, 목표 주가 줄줄이 상향 조정..." }
        ];

        // Helper to generate random candle data
        const getChartData = () => {
            let price = 100;
            return Array.from({ length: 14 }).map(() => {
                const move = (Math.random() - 0.45) * 8; // Random move
                const o = price;
                const c = price + move;
                // High is max of o, c plus random wick
                const h = Math.max(o, c) + Math.random() * 3;
                // Low is min of o, c minus random wick
                const l = Math.min(o, c) - Math.random() * 3;
                price = c;
                return { o, c, h, l };
            });
        }

        const getDesc = (node: ScenarioOption) => {
            return STOCK_DESCRIPTIONS[node.name] ||
                `${node.name}은(는) ${node.indexName} 섹터 내에서 견고한 펀더멘털을 보유하고 있습니다. 최근 매크로 환경 변화에 민감하게 반응하며 상승 탄력을 받고 있으며, 중장기적 관점에서 매력적인 투자처로 분석됩니다.`;
        }

        const traverse = (node: ScenarioOption, path: ScenarioOption[], depth: number) => {
            const currentPath = [...path, node]
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => traverse(child, currentPath, depth + 1))
            } else {
                if (depth >= 3) {
                    foundStocks.push({
                        id: node.id,
                        name: node.name,
                        indexName: node.indexName,
                        indexValue: node.indexValue,
                        change: node.change,
                        description: getDesc(node),
                        path: currentPath,
                        news: getNews(node.name),
                        chartData: getChartData()
                    })
                }
            }
        }

        SCENARIO_DATA.forEach(macro => traverse(macro, [], 0))
        setStocks(foundStocks)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('narrative_session')
        setView('LANDING')
    }

    useEffect(() => {
        if (stocks.length > 0 && scrollRef.current) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        }
    }, [stocks.length])

    return (
        <div className="dash-container" style={{ background: 'var(--dash-bg)', color: 'var(--dash-text)', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            {/* News Ticker (Sticky Top) - Sleeker */}
            <div className="news-ticker-container" style={{ background: 'var(--dash-ticker-bg)', borderBottom: '1px solid var(--dash-border)', position: 'sticky', top: 0, zIndex: 100, height: '36px' }}>
                <div className="live-badge" style={{ background: 'var(--dash-primary)', color: '#ffffff', fontSize: '10px', padding: '0 12px' }}>LIVE</div>
                <div className="ticker-wrapper">
                    <div className="ticker-content" style={{ transform: `translateX(${tickerOffset % 2000}px)` }}>
                        {[...NEWS_ITEMS, ...NEWS_ITEMS].map((news, i) => (
                            <span key={i} className="ticker-item" style={{ color: 'var(--dash-muted)', fontSize: '12px', fontWeight: 500 }}>
                                {news}
                                <span className="ticker-separator" style={{ color: 'var(--dash-border)' }}>|</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <header className="dash-header" style={{
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--dash-header-bg)', // Subtle gradient
                borderBottom: 'none'
            }}>
                <div className="dash-brand" style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                    <Sparkles size={24} color="var(--dash-primary)" fill="var(--dash-primary)" />
                    NARRATIVE<span style={{ color: 'var(--dash-primary)' }}>.</span>FLOW
                </div>

                <div className="header-status" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="user-section" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="user-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--dash-surface-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--dash-border)' }}>
                            <User size={18} color="var(--dash-muted)" />
                        </div>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--dash-muted)' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="dash-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto', paddingBottom: '100px' }}>

                <div style={{ padding: '24px 24px 32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.2, margin: 0, letterSpacing: '-0.02em', color: 'var(--dash-text)' }}>
                        관심있는 종목의<br />
                        <span style={{ color: 'var(--dash-primary)' }}>시나리오</span>
                    </h1>
                </div>

                {/* STOCK LIST SECTION */}
                <div style={{ padding: '0 24px 20px', background: 'transparent' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '24px',
                        fontSize: '14px', fontWeight: 700, color: 'var(--dash-muted)',
                        marginBottom: '24px', marginTop: '0',
                        borderBottom: '1px solid var(--dash-border)'
                    }}>
                        <div onClick={() => setListMode('KOSPI')} style={{
                            color: listMode === 'KOSPI' ? 'var(--dash-text)' : 'var(--dash-muted)',
                            borderBottom: listMode === 'KOSPI' ? '3px solid var(--dash-primary)' : '3px solid transparent',
                            paddingBottom: '12px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', top: '1px'
                        }}>KOSPI</div>
                        <div onClick={() => setListMode('MY_STOCK')} style={{
                            color: listMode === 'MY_STOCK' ? 'var(--dash-text)' : 'var(--dash-muted)',
                            borderBottom: listMode === 'MY_STOCK' ? '3px solid var(--dash-primary)' : '3px solid transparent',
                            paddingBottom: '12px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', top: '1px'
                        }}>내 관심종목</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {displayStocks.map((stock) => {
                            const isExpanded = expandedStockId === stock.id

                            return (
                                <motion.div
                                    key={stock.id}
                                    layout
                                    style={{
                                        background: 'var(--dash-surface)',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        // Spotify card hover effect style
                                        transition: 'background 0.3s ease',
                                        border: '1px solid var(--dash-border)'
                                    }}
                                    whileHover={{ background: 'var(--dash-surface-highlight)' }}
                                >
                                    {/* Header / Summary Clickable */}
                                    <div
                                        onClick={() => toggleExpand(stock.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '16px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            {/* Fake Album Art for Stock */}
                                            <div style={{
                                                width: '48px', height: '48px', background: 'var(--dash-surface-highlight)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontSize: '18px', color: 'var(--dash-muted)',
                                                borderRadius: '4px', // Spotify uses slight radius or none for albums
                                                boxShadow: '0 4px 10px var(--dash-shadow)'
                                            }}>
                                                {stock.name[0]}
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--dash-text)', lineHeight: 1 }}>{stock.name}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '13px', color: 'var(--dash-muted)' }}>{stock.indexName}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                            <div style={{
                                                fontSize: '14px', fontWeight: 700,
                                                color: stock.change >= 0 ? 'var(--dash-danger)' : 'var(--dash-blue)', // KR: Red Up, Blue Down (Pastel)
                                            }}>
                                                {stock.change >= 0 ? '+' : ''}{stock.change}%
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--dash-muted)', marginTop: '2px' }}>
                                                {stock.indexValue.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content (Carousel: Info -> Chart -> Network -> News) */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden', position: 'relative', background: 'var(--dash-surface-highlight)' }}
                                            >
                                                {/* Carousel Indicators (Arrows) */}
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        document.getElementById(`carousel-${stock.id}`)?.scrollBy({ left: -300, behavior: 'smooth' })
                                                    }}
                                                    style={{ position: 'absolute', top: '50%', left: '0', zIndex: 20, cursor: 'pointer', color: 'var(--dash-muted)', transform: 'translateY(-50%)', padding: '20px' }}
                                                >
                                                    <ChevronLeft size={28} />
                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        document.getElementById(`carousel-${stock.id}`)?.scrollBy({ left: 300, behavior: 'smooth' })
                                                    }}
                                                    style={{ position: 'absolute', top: '50%', right: '0', zIndex: 20, cursor: 'pointer', color: 'var(--dash-muted)', transform: 'translateY(-50%)', padding: '20px' }}
                                                >
                                                    <ChevronRight size={28} />
                                                </div>

                                                <div
                                                    id={`carousel-${stock.id}`}
                                                    style={{
                                                        display: 'flex',
                                                        width: '100%',
                                                        overflowX: 'auto',
                                                        scrollSnapType: 'x mandatory',
                                                        WebkitOverflowScrolling: 'touch',
                                                        msOverflowStyle: 'none',
                                                        scrollbarWidth: 'none',
                                                        padding: '20px 0'
                                                    }}
                                                >
                                                    <style>{`#carousel-${stock.id}::-webkit-scrollbar { display: none; }`}</style>

                                                    {/* Card 1: Key Point */}
                                                    <div style={{
                                                        minWidth: '100%',
                                                        scrollSnapAlign: 'start',
                                                        padding: '0 24px',
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '24px', height: '220px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px var(--dash-shadow)' }}>
                                                            <div style={{ fontSize: '11px', color: 'var(--dash-primary)', marginBottom: '12px', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>Key Point</div>
                                                            <div style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--dash-text)', wordBreak: 'keep-all', overflowY: 'auto' }}>
                                                                {stock.description}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card 2: Candle Chart (Realistic) */}
                                                    <div style={{
                                                        minWidth: '100%',
                                                        scrollSnapAlign: 'start',
                                                        padding: '0 24px',
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '24px', height: '220px', boxShadow: '0 4px 20px var(--dash-shadow)' }}>
                                                            <div style={{ fontSize: '11px', color: 'var(--dash-primary)', marginBottom: '16px', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>Price Action</div>
                                                            <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 4px' }}>
                                                                {stock.chartData?.map((data, i) => {
                                                                    const min = Math.min(...stock.chartData!.map(d => d.l));
                                                                    const max = Math.max(...stock.chartData!.map(d => d.h));
                                                                    const range = max - min;
                                                                    const getY = (val: number) => ((val - min) / range) * 100;
                                                                    const isUp = data.c >= data.o;
                                                                    const color = isUp ? 'var(--dash-danger)' : 'var(--dash-blue)'; // Pastel Red/Blue

                                                                    const topWick = getY(data.h);
                                                                    const bottomWick = getY(data.l);
                                                                    const topBody = getY(Math.max(data.o, data.c));
                                                                    const bottomBody = getY(Math.min(data.o, data.c));
                                                                    const bodyHeight = Math.max(2, topBody - bottomBody);

                                                                    return (
                                                                        <div key={i} style={{ flex: 1, height: '100%', position: 'relative', margin: '0 2px' }}>
                                                                            <div style={{ position: 'absolute', bottom: `${bottomWick}%`, height: `${topWick - bottomWick}%`, width: '1px', background: color, left: '50%', transform: 'translateX(-50%)' }} />
                                                                            <div style={{ position: 'absolute', bottom: `${bottomBody}%`, height: `${bodyHeight}%`, width: '100%', background: color, left: '50%', transform: 'translateX(-50%)', borderRadius: '1px' }} />
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card 3: Value Chain */}
                                                    <div style={{
                                                        minWidth: '100%',
                                                        scrollSnapAlign: 'start',
                                                        padding: '0 24px',
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '24px', height: '220px', position: 'relative', boxShadow: '0 4px 20px var(--dash-shadow)' }}>
                                                            <div style={{ fontSize: '11px', color: 'var(--dash-primary)', marginBottom: '10px', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>Value Chain</div>
                                                            <div style={{ position: 'relative', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <div style={{
                                                                    width: '64px', height: '64px', borderRadius: '50%',
                                                                    background: 'var(--dash-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    boxShadow: '0 4px 15px rgba(41, 121, 255, 0.3)',
                                                                    zIndex: 10
                                                                }}>
                                                                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#ffffff', textAlign: 'center' }}>{stock.name}</span>
                                                                </div>
                                                                {[
                                                                    { name: 'NVIDIA', x: 20, y: 20 },
                                                                    { name: 'SK Hynix', x: 80, y: 15 },
                                                                    { name: 'TSMC', x: 85, y: 80 },
                                                                    { name: 'Hanmi', x: 15, y: 85 }
                                                                ].map((node, i) => (
                                                                    <div key={i}>
                                                                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                                                            <line x1="50%" y1="50%" x2={`${node.x}%`} y2={`${node.y}%`} stroke="#888" strokeWidth="1" strokeDasharray="4 2" />
                                                                            <circle cx={`${node.x}%`} cy={`${node.y}%`} r="2" fill="#888" />
                                                                        </svg>
                                                                        <div style={{
                                                                            position: 'absolute', left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)',
                                                                            padding: '6px 10px', borderRadius: '20px',
                                                                            background: 'var(--dash-surface-highlight)', border: '1px solid var(--dash-border)',
                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                            fontSize: '10px', color: 'var(--dash-text)', fontWeight: 600, zIndex: 11,
                                                                            whiteSpace: 'nowrap'
                                                                        }}>
                                                                            {node.name}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card 4: Major News */}
                                                    <div style={{
                                                        minWidth: '100%',
                                                        scrollSnapAlign: 'start',
                                                        padding: '0 24px',
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '24px', height: '220px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px var(--dash-shadow)' }}>
                                                            <div style={{ fontSize: '11px', color: 'var(--dash-primary)', marginBottom: '16px', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>Major News</div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                                                                {stock.news?.map((n, i) => (
                                                                    <div key={i} style={{ paddingLeft: '0' }}>
                                                                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dash-text)', marginBottom: '4px' }}>{n.title}</div>
                                                                        <div style={{ fontSize: '12px', color: 'var(--dash-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.content}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <div style={{ padding: '0 24px 24px' }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            localStorage.setItem('narrative_active_scenario', JSON.stringify({
                                                                stock: stock.id,
                                                                stockName: stock.name,
                                                                path: stock.path
                                                            }))
                                                            setView('PRESENTATION')
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            background: 'var(--dash-primary)',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '16px',
                                                            borderRadius: '30px', // Full pill shape
                                                            fontWeight: 800,
                                                            fontSize: '15px',
                                                            cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                            boxShadow: '0 4px 20px rgba(41, 121, 255, 0.3)',
                                                            transform: 'scale(1)',
                                                            transition: 'transform 0.1s'
                                                        }}
                                                    >
                                                        시나리오 분석하러 가기 <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                        {displayStocks.length === 0 && (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--dash-muted)', fontSize: '15px' }}>
                                pending...
                            </div>
                        )}
                    </div>
                </div>

                {/* BOTTOM Market Overview Section */}
                <div style={{ marginTop: '20px', padding: '0 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <TrendingUp size={18} color="var(--dash-primary)" />
                        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--dash-text)' }}>오늘의 시장 체크</span>
                    </div>

                    <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '24px' }}>
                        {/* KOSPI Chart Mock (Candle Style) */}
                        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '180px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', padding: '0 8px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--dash-muted)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>KOSPI</div>
                                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--dash-text)', letterSpacing: '-0.5px' }}>2,782.50</div>
                                </div>
                                <div style={{
                                    color: 'var(--dash-danger)', fontWeight: 700, fontSize: '15px',
                                    padding: '6px 0',
                                    display: 'flex', alignItems: 'center', gap: '4px'
                                }}>
                                    <span style={{ fontSize: '12px' }}>▲</span> 1.25%
                                </div>
                            </div>

                            {/* Realistic Candle Chart Container */}
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', position: 'relative' }}>
                                {[
                                    { o: 2650, c: 2660, h: 2665, l: 2645 },
                                    { o: 2660, c: 2655, h: 2670, l: 2650 },
                                    { o: 2655, c: 2680, h: 2685, l: 2650 },
                                    { o: 2680, c: 2675, h: 2690, l: 2670 },
                                    { o: 2675, c: 2700, h: 2710, l: 2670 },
                                    { o: 2700, c: 2720, h: 2725, l: 2695 },
                                    { o: 2720, c: 2710, h: 2730, l: 2705 },
                                    { o: 2710, c: 2740, h: 2750, l: 2705 },
                                    { o: 2740, c: 2730, h: 2745, l: 2720 },
                                    { o: 2730, c: 2760, h: 2770, l: 2725 },
                                    { o: 2760, c: 2750, h: 2765, l: 2740 },
                                    { o: 2750, c: 2782, h: 2790, l: 2745 }
                                ].map((d, i) => {
                                    const min = 2640;
                                    const max = 2800;
                                    const range = max - min;
                                    const getY = (val: number) => ((val - min) / range) * 100;

                                    const isUp = d.c >= d.o;
                                    const color = isUp ? 'var(--dash-danger)' : 'var(--dash-blue)';

                                    const topWick = getY(d.h);
                                    const bottomWick = getY(d.l);
                                    const topBody = getY(Math.max(d.o, d.c));
                                    const bottomBody = getY(Math.min(d.o, d.c));
                                    const bodyHeight = Math.max(3, topBody - bottomBody);

                                    return (
                                        <div key={i} style={{ flex: 1, height: '100%', position: 'relative', margin: '0 2px' }}>
                                            <div style={{ position: 'absolute', bottom: `${bottomWick}%`, height: `${topWick - bottomWick}%`, width: '1px', background: color, left: '50%', transform: 'translateX(-50%)' }} />
                                            <div style={{ position: 'absolute', bottom: `${bottomBody}%`, height: `${bodyHeight}%`, width: '100%', background: color, left: '50%', transform: 'translateX(-50%)', borderRadius: '2px' }} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* AI Summary Bubble */}
                        <div style={{ background: 'var(--dash-surface-highlight)', borderRadius: '8px', padding: '16px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--dash-muted)', lineHeight: 1.5 }}>
                                        <strong style={{ color: 'var(--dash-text)' }}>오늘 시장, 분위기 좋아요!</strong><br />
                                        외국인이 반도체 중심으로 순매수를 늘리고 있어요. 특히 삼성전자와 하이닉스 주가가 강세네요.
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
                                        * AI 해석이므로 투자에 참고만 하세요.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <FloatingNav setView={setView} current="DASHBOARD" />
        </div>
    )
}
