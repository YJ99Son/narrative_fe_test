import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Activity,
    Zap,
    List,
    TrendingUp,
    TrendingDown,
    LogOut,
    User,
    Menu
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ViewState } from './data'
import FloatingNav from './components/FloatingNav'
import './Dashboard.css'

interface DashboardProps {
    setView: (view: ViewState) => void
}

// Extended Mock Data
const MOCK_STOCKS = [
    {
        id: '005930', name: '삼성전자', price: 74200, change: 1.5, data: [
            { open: 72000, high: 74500, low: 71500, close: 74200 },
            { open: 71000, high: 72500, low: 70500, close: 72000 },
            { open: 70500, high: 71500, low: 69000, close: 71000 },
            { open: 72000, high: 72500, low: 70000, close: 70500 },
            { open: 71500, high: 73000, low: 71000, close: 72000 },
            { open: 69500, high: 72000, low: 69000, close: 71500 },
            { open: 68000, high: 70000, low: 67500, close: 69500 },
        ]
    },
    {
        id: '000660', name: 'SK하이닉스', price: 138500, change: 2.8, data: [
            { open: 135000, high: 139000, low: 134000, close: 138500 },
            { open: 133000, high: 136000, low: 132000, close: 135000 },
            { open: 130000, high: 134000, low: 129000, close: 133000 },
            { open: 132000, high: 133000, low: 129500, close: 130000 },
            { open: 129000, high: 133000, low: 128000, close: 132000 },
            { open: 128000, high: 130000, low: 127000, close: 129000 },
            { open: 125000, high: 129000, low: 124000, close: 128000 },
        ]
    },
    {
        id: '373220', name: 'LG에너지솔루션', price: 412000, change: -0.5, data: [
            { open: 415000, high: 416000, low: 410000, close: 412000 },
            { open: 418000, high: 420000, low: 414000, close: 415000 },
            { open: 416000, high: 419000, low: 415000, close: 418000 },
            { open: 413000, high: 417000, low: 412000, close: 416000 },
            { open: 410000, high: 414000, low: 408000, close: 413000 },
            { open: 415000, high: 416000, low: 409000, close: 410000 },
            { open: 420000, high: 421000, low: 414000, close: 415000 },
        ]
    },
    {
        id: '207940', name: '삼성바이오로직스', price: 820000, change: 0.2, data: [
            { open: 818000, high: 825000, low: 815000, close: 820000 },
            { open: 815000, high: 820000, low: 812000, close: 818000 },
            { open: 812000, high: 816000, low: 810000, close: 815000 },
            { open: 816000, high: 818000, low: 811000, close: 812000 },
            { open: 819000, high: 820000, low: 815000, close: 816000 },
            { open: 810000, high: 820000, low: 808000, close: 819000 },
            { open: 815000, high: 816000, low: 808000, close: 810000 },
        ]
    },
    {
        id: '005380', name: '현대자동차', price: 245000, change: -1.2, data: [
            { open: 248000, high: 250000, low: 243000, close: 245000 },
            { open: 246000, high: 249000, low: 245000, close: 248000 },
            { open: 247000, high: 248000, low: 244000, close: 246000 },
            { open: 244000, high: 248000, low: 243000, close: 247000 },
            { open: 242000, high: 245000, low: 240000, close: 244000 },
            { open: 248000, high: 249000, low: 241000, close: 242000 },
            { open: 250000, high: 252000, low: 247000, close: 248000 },
        ]
    },
    {
        id: '000270', name: '기아', price: 118000, change: -0.8, data: [
            { open: 119000, high: 120000, low: 117000, close: 118000 },
            { open: 118500, high: 120000, low: 118000, close: 119000 },
            { open: 119500, high: 120500, low: 118000, close: 118500 },
            { open: 117000, high: 120000, low: 116500, close: 119500 },
            { open: 116000, high: 118000, low: 115000, close: 117000 },
            { open: 119000, high: 119500, low: 115500, close: 116000 },
            { open: 120000, high: 121000, low: 118500, close: 119000 },
        ]
    },
    {
        id: '105560', name: 'KB금융', price: 68500, change: 1.2, data: [
            { open: 67000, high: 69000, low: 66500, close: 68500 },
            { open: 66000, high: 67500, low: 65500, close: 67000 },
            { open: 65000, high: 66500, low: 64500, close: 66000 },
            { open: 65500, high: 66000, low: 64000, close: 65000 },
            { open: 64500, high: 65500, low: 64000, close: 65500 },
            { open: 64000, high: 65000, low: 63500, close: 64500 },
            { open: 63000, high: 64000, low: 62500, close: 64000 },
        ]
    },
    {
        id: '055550', name: '신한지주', price: 42000, change: 0.8, data: [
            { open: 41500, high: 42200, low: 41000, close: 42000 },
            { open: 41200, high: 41800, low: 41000, close: 41500 },
            { open: 41000, high: 41500, low: 40800, close: 41200 },
            { open: 40800, high: 41200, low: 40500, close: 41000 },
            { open: 40500, high: 41000, low: 40200, close: 40800 },
            { open: 40200, high: 40800, low: 40000, close: 40500 },
            { open: 40000, high: 40500, low: 39800, close: 40200 },
        ]
    },
    {
        id: '066570', name: 'LG전자', price: 98500, change: -1.7, data: [
            { open: 100000, high: 101000, low: 98000, close: 98500 },
            { open: 101000, high: 102000, low: 100000, close: 100000 },
            { open: 102000, high: 103000, low: 101000, close: 101000 },
            { open: 100000, high: 102000, low: 99000, close: 102000 },
            { open: 99000, high: 101000, low: 98000, close: 100000 },
            { open: 100000, high: 101000, low: 99000, close: 99000 },
            { open: 98000, high: 100000, low: 97000, close: 100000 },
        ]
    },
    {
        id: '096770', name: 'SK이노베이션', price: 115000, change: 0.5, data: [
            { open: 114000, high: 116000, low: 113000, close: 115000 },
            { open: 113000, high: 115000, low: 112000, close: 114000 },
            { open: 112000, high: 114000, low: 111000, close: 113000 },
            { open: 114000, high: 115000, low: 112000, close: 112000 },
            { open: 111000, high: 113000, low: 110000, close: 114000 },
            { open: 112000, high: 113000, low: 110000, close: 111000 },
            { open: 110000, high: 112000, low: 109000, close: 112000 },
        ]
    },
    {
        id: '011200', name: 'HMM', price: 18500, change: -0.3, data: [
            { open: 18600, high: 18800, low: 18400, close: 18500 },
            { open: 18700, high: 18900, low: 18500, close: 18600 },
            { open: 18800, high: 19000, low: 18600, close: 18700 },
            { open: 18500, high: 18800, low: 18400, close: 18800 },
            { open: 18400, high: 18700, low: 18300, close: 18500 },
            { open: 18600, high: 18700, low: 18400, close: 18400 },
            { open: 18500, high: 18700, low: 18300, close: 18600 },
        ]
    },
    {
        id: '259960', name: '크래프톤', price: 210000, change: 2.1, data: [
            { open: 205000, high: 212000, low: 204000, close: 210000 },
            { open: 204000, high: 208000, low: 202000, close: 205000 },
            { open: 202000, high: 206000, low: 200000, close: 204000 },
            { open: 206000, high: 208000, low: 201000, close: 202000 },
            { open: 201000, high: 204000, low: 200000, close: 206000 },
            { open: 202000, high: 203000, low: 198000, close: 201000 },
            { open: 198000, high: 202000, low: 195000, close: 202000 },
        ]
    },
]

// News Ticker Data
const NEWS_ITEMS = [
    '🔔 삼성전자, HBM4 양산 가속화... 경쟁사 격차 축소 전망',
    '📈 코스피 2,650선 돌파 임박, 외국인 순매수 지속',
    '💡 AI 반도체 수요 폭발적 증가, 메모리 업체 수혜',
    '⚡ 미 연준 금리 인하 시사, 아시아 증시 상승세',
    '🌍 중동 지정학 리스크 완화, 유가 안정세 진입',
    '🚀 SK하이닉스, 엔비디아향 HBM3E 공급 확대',
]

// Candlestick Chart Component
const CandlestickChart = ({ data }: { data: { open: number, high: number, low: number, close: number }[] }) => {
    const chartHeight = 280
    const chartWidth = 600
    const candleWidth = 40
    const gap = 30

    const allPrices = data.flatMap(d => [d.high, d.low])
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const priceRange = maxPrice - minPrice

    const scaleY = (price: number) => chartHeight - ((price - minPrice) / priceRange) * (chartHeight - 40) - 20

    return (
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: 'visible' }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
                <g key={i}>
                    <line
                        x1="0"
                        y1={20 + i * ((chartHeight - 40) / 4)}
                        x2={chartWidth}
                        y2={20 + i * ((chartHeight - 40) / 4)}
                        stroke="#222"
                        strokeDasharray="4,4"
                    />
                    <text
                        x={chartWidth - 5}
                        y={20 + i * ((chartHeight - 40) / 4) + 4}
                        fill="#666"
                        fontSize="10"
                        textAnchor="end"
                        fontFamily="monospace"
                    >
                        {Math.round(maxPrice - (priceRange / 4) * i).toLocaleString()}
                    </text>
                </g>
            ))}

            {/* Candles */}
            {data.map((candle, i) => {
                const x = 40 + i * (candleWidth + gap)
                const isUp = candle.close >= candle.open
                const color = isUp ? 'var(--dash-danger)' : 'var(--dash-primary)'
                const bodyTop = scaleY(Math.max(candle.open, candle.close))
                const bodyBottom = scaleY(Math.min(candle.open, candle.close))
                const bodyHeight = Math.max(bodyBottom - bodyTop, 2)

                return (
                    <g key={i}>
                        {/* Wick */}
                        <line
                            x1={x + candleWidth / 2}
                            y1={scaleY(candle.high)}
                            x2={x + candleWidth / 2}
                            y2={scaleY(candle.low)}
                            stroke={color}
                            strokeWidth="2"
                        />
                        {/* Body */}
                        <rect
                            x={x}
                            y={bodyTop}
                            width={candleWidth}
                            height={bodyHeight}
                            fill={isUp ? color : color}
                            stroke={color}
                            strokeWidth="1"
                            rx="2"
                        />
                    </g>
                )
            })}

            {/* X-axis labels */}
            {data.map((_, i) => (
                <text
                    key={i}
                    x={40 + i * (candleWidth + gap) + candleWidth / 2}
                    y={chartHeight - 2}
                    fill="#666"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                >
                    T-{data.length - 1 - i}
                </text>
            ))}
        </svg>
    )
}

export default function Dashboard({ setView }: DashboardProps) {
    const [selectedStock, setSelectedStock] = useState(MOCK_STOCKS[0])
    const [tickerOffset, setTickerOffset] = useState(0)

    // News ticker animation
    useEffect(() => {
        const interval = setInterval(() => {
            setTickerOffset(prev => prev - 1)
        }, 30)
        return () => clearInterval(interval)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('narrative_session')
        setView('LANDING')
    }

    return (
        <div className="dash-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* News Ticker */}
            <div style={{
                height: 40,
                background: 'var(--dash-surface)',
                borderBottom: '1px solid var(--dash-border)',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    background: 'var(--dash-primary)',
                    color: 'white',
                    padding: '0 16px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: 12,
                    zIndex: 10
                }}>
                    LIVE
                </div>
                <div style={{
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    transform: `translateX(${tickerOffset % 2000}px)`,
                    gap: 60
                }}>
                    {[...NEWS_ITEMS, ...NEWS_ITEMS].map((news, i) => (
                        <span key={i} style={{ fontSize: 13, color: 'var(--dash-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {news}
                            <span style={{ color: 'var(--dash-border)' }}>|</span>
                        </span>
                    ))}
                </div>
            </div>

            <header className="dash-header">
                <div className="dash-brand">
                    <Activity size={24} className="accent" />
                    NARRATIVE<span className="accent">.</span>FLOW
                </div>

                <nav className="dash-nav">
                    <div className="dash-nav-item active">KOSPI</div>
                    <div className="dash-nav-item">KOSDAQ</div>
                    <div className="dash-nav-item" onClick={() => setView('MYSCENARIOS')}>My Page</div>
                </nav>

                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                        <span style={{ color: 'var(--dash-muted)' }}>KOSPI</span>
                        <span style={{ fontWeight: 700 }}>2,648.32</span>
                        <span style={{ color: 'var(--dash-danger)', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TrendingUp size={14} /> +0.82%
                        </span>
                    </div>
                    <div style={{ width: 1, height: 20, background: 'var(--dash-border)' }}></div>
                    <Search size={20} color="var(--dash-muted)" />

                    {/* User & Logout */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, background: 'var(--dash-surface-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, borderRadius: '4px' }}>
                            <User size={16} />
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--dash-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 12,
                                padding: '4px 8px'
                            }}
                            title="로그아웃"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="dash-main" style={{
                padding: 0,
                gap: 0,
                gridTemplateColumns: '7fr 3fr',
                flex: 1,
                height: 'auto', // Allow main content to determine height (enables scroll if needed)
                minHeight: 'calc(100vh - 121px)'
            }}>
                {/* LEFT PANEL: Chart & Details */}
                <div className="left-panel" style={{ padding: '0', borderRight: '1px solid var(--dash-border)', display: 'flex', flexDirection: 'column' }}>

                    {/* Main Scenario Flow Visualization */}
                    <div style={{
                        minHeight: '80px',
                        borderBottom: '1px solid var(--dash-border)',
                        background: 'linear-gradient(to bottom, #0a0a0a, #000)',
                        padding: '16px 40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 20
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <span style={{ color: 'var(--dash-muted)', fontSize: 11, fontWeight: 700 }}>ACTIVE SCENARIO</span>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>AI Supercycle <span style={{ color: '#444', fontWeight: 400 }}>→</span> HBM Shortage</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                                <span style={{ fontSize: 10, padding: '3px 6px', background: 'rgba(59,130,246,0.15)', color: 'var(--dash-primary)', border: '1px solid var(--dash-primary)' }}>HIGH CONFIDENCE 92%</span>
                                <span style={{ fontSize: 10, padding: '3px 6px', background: '#222', color: '#aaa' }}>STEP 3/5</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '32px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontSize: 12, color: 'var(--dash-muted)', marginBottom: 6, fontWeight: 600 }}>SELECTED ASSET</div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                                <h1 style={{ fontSize: 36, margin: 0, lineHeight: 1 }}>{selectedStock.name}</h1>
                                <span style={{ fontSize: 18, fontWeight: 300, color: 'var(--dash-muted)' }}>{selectedStock.id}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                                <span style={{ fontSize: 28, fontWeight: 700 }}>
                                    ₩{selectedStock.price.toLocaleString()}
                                </span>
                                <span style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: selectedStock.change >= 0 ? 'var(--dash-danger)' : 'var(--dash-primary)',
                                    display: 'flex', alignItems: 'center', gap: 4
                                }}>
                                    {selectedStock.change >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                    {selectedStock.change > 0 ? '+' : ''}{selectedStock.change}%
                                </span>
                            </div>
                        </div>

                        <div style={{ minHeight: 400, background: '#050505', border: '1px solid #1a1a1a', padding: '20px', position: 'relative' }}>
                            {/* Chart Header Overlay */}
                            <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 10, display: 'flex', gap: 16 }}>
                                <div style={{ fontSize: 11, color: '#555' }}>INTERVAL: <span style={{ color: '#888' }}>1D</span></div>
                                <div style={{ fontSize: 11, color: '#555' }}>TYPE: <span style={{ color: 'var(--dash-primary)' }}>CANDLE</span></div>
                            </div>

                            <div style={{ marginTop: 30 }}>
                                <CandlestickChart data={selectedStock.data} />
                            </div>
                        </div>

                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    localStorage.setItem('narrative_active_scenario', JSON.stringify({
                                        stock: selectedStock.name,
                                        stockCode: selectedStock.id
                                    }))
                                    setView('BUILDER')
                                }}
                                style={{
                                    background: 'var(--dash-primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 28px',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    transition: 'opacity 0.2s',
                                    borderRadius: '9999px'
                                }}
                            >
                                <Zap size={18} />
                                시나리오 분석 시작
                            </button>
                        </div>

                    </div>
                </div>

                {/* RIGHT PANEL: List */}
                <div className="right-panel" style={{
                    borderLeft: '1px solid var(--dash-border)',
                    background: 'var(--dash-bg)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--dash-border)', background: 'var(--dash-bg)', zIndex: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <List size={14} /> KOSPI TOP 종목
                        </div>
                    </div>

                    <div className="stock-list" style={{ flex: 1, overflowY: 'auto' }}>
                        {MOCK_STOCKS.map(stock => (
                            <motion.div
                                key={stock.id}
                                layoutId={stock.id}
                                onClick={() => setSelectedStock(stock)}
                                className="stock-item"
                                style={{
                                    padding: '16px 24px',
                                    borderBottom: '1px solid var(--dash-border)',
                                    cursor: 'pointer',
                                    background: selectedStock.id === stock.id ? 'var(--dash-surface-highlight)' : 'transparent',
                                    transition: 'background 0.2s'
                                }}
                                whileHover={{ background: 'var(--dash-surface)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700, fontSize: 14 }}>{stock.name}</span>
                                    <span style={{ fontWeight: 600, fontSize: 14 }}>₩{stock.price.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--dash-muted)' }}>
                                    <span>{stock.id}</span>
                                    <span style={{
                                        color: stock.change >= 0 ? 'var(--dash-danger)' : 'var(--dash-primary)',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4
                                    }}>
                                        {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {stock.change > 0 ? '+' : ''}{stock.change}%
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Floating Navigator */}
            <FloatingNav setView={setView} current="DASHBOARD" />
        </div>
    )
}
