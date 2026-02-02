import { useState, useEffect } from 'react'
import type { ViewState } from '../data'
import FloatingNav from '../components/FloatingNav'
import MobileMyPage from './MobileMyPage'
import BrandLogo from '../components/BrandLogo'
import { PieChart, TrendingUp, BookOpen, Activity } from 'lucide-react'

type MyScenariosViewProps = {
    setView: (v: ViewState) => void
    current: ViewState
}

export type SavedScenario = {
    id: string
    stock: string
    stockCode: string
    path: string[]
    createdAt: number
    startPrice: number
    currentPrice: number
}

// Mock saved scenarios - ensuring a mix of profit and loss for visualization
export const MOCK_SCENARIOS: SavedScenario[] = [
    {
        id: 'scenario_1',
        stock: '한미반도체',
        stockCode: '042700',
        path: ['AI 슈퍼사이클', 'HBM 메모리', 'SK하이닉스', '한미반도체'],
        createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        startPrice: 62000,
        currentPrice: 74500
    },
    {
        id: 'scenario_2',
        stock: '이마트',
        stockCode: '139480',
        path: ['경기 방어주', '유통', '이마트'],
        createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
        startPrice: 78000,
        currentPrice: 69000 // Loss scenario
    },
    {
        id: 'scenario_3',
        stock: '삼성전자',
        stockCode: '005930',
        path: ['AI 슈퍼사이클', '파운드리', '삼성전자'],
        createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        startPrice: 71000,
        currentPrice: 74200
    },
    {
        id: 'scenario_4',
        stock: 'NAVER',
        stockCode: '035420',
        path: ['플랫폼', 'AI', 'NAVER'],
        createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
        startPrice: 220000,
        currentPrice: 195000 // Loss scenario
    },
]

const MyScenariosView = ({ setView, current }: MyScenariosViewProps) => {
    const [scenarios] = useState<SavedScenario[]>(MOCK_SCENARIOS)
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (isMobile) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dash-bg)' }}>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <MobileMyPage scenarios={scenarios} setView={setView} />
                </div>
                <FloatingNav setView={setView} current={current} />
            </div>
        )
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    const calculateChange = (start: number, current: number) => {
        const change = current - start
        const percent = (change / start) * 100
        return { change, percent }
    }

    // Stats for Report
    const totalScenarios = scenarios.length
    const profitCount = scenarios.filter(s => s.currentPrice >= s.startPrice).length
    const mainInterest = "AI / 반도체" // Mock derived interest
    const winRate = ((profitCount / totalScenarios) * 100).toFixed(0)

    return (
        <div className="dashboard-page my-scenarios-page" style={{ background: 'var(--dash-bg)', minHeight: '100vh', color: 'var(--dash-text)', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
            {/* Header / Nav Area */}
            <header className="dashboard-header" style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--dash-header-bg)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BrandLogo size="md" withText={true} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ color: 'var(--dash-muted)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setView('DASHBOARD')}>DASHBOARD</div>
                    <div style={{ color: 'var(--dash-text)', fontSize: '14px', fontWeight: 700, borderBottom: '2px solid var(--dash-primary)', paddingBottom: '4px' }}>LIBRARY</div>
                    <button onClick={() => setView('QUIZ')} style={{
                        background: 'white', border: 'none', color: 'black',
                        padding: '12px 32px', borderRadius: '30px', fontSize: '14px', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        transition: 'transform 0.1s'
                    }}>
                        퀴즈 풀기
                    </button>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--dash-surface-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--dash-border)' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dash-muted)' }}>JS</span>
                    </div>
                </div>
            </header>

            <main style={{ padding: '20px 40px 60px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

                {/* 1. REPORT SECTION (New) - Like "Your Top Mixes" */}
                <section style={{ marginBottom: '48px' }}>
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>나의 투자 리포트</h2>
                        <p style={{ color: 'var(--dash-muted)', margin: 0, fontSize: '16px' }}>최근 학습 성과 요약</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        {/* Card 1: Interest */}
                        <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '24px', transition: 'background 0.3s', cursor: 'pointer' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dash-surface-highlight)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--dash-surface)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--dash-muted)' }}>
                                <PieChart size={20} /> <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>MAIN INTEREST</span>
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--dash-text)', marginBottom: '12px' }}>{mainInterest}</div>
                            <p style={{ margin: '0', color: 'var(--dash-muted)', fontSize: '14px' }}>
                                전체 시나리오의 <span style={{ color: 'var(--dash-primary)', fontWeight: 700 }}>65%</span>가<br />이 분야에 집중되어 있습니다.
                            </p>
                        </div>

                        {/* Card 2: Activity */}
                        <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '24px', transition: 'background 0.3s', cursor: 'pointer' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dash-surface-highlight)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--dash-surface)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--dash-muted)' }}>
                                <BookOpen size={20} /> <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>STUDY ACTIVITY</span>
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--dash-text)', marginBottom: '12px' }}>{totalScenarios} Scenarios</div>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} style={{ flex: 1, height: '4px', background: i <= totalScenarios ? 'var(--dash-primary)' : 'var(--dash-border)', borderRadius: '2px' }}></div>
                                ))}
                            </div>
                            <p style={{ margin: '0', color: 'var(--dash-muted)', fontSize: '14px' }}>
                                꾸준한 학습이 수익의 지름길입니다.
                            </p>
                        </div>

                        {/* Card 3: Performance */}
                        <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '24px', transition: 'background 0.3s', cursor: 'pointer' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dash-surface-highlight)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--dash-surface)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--dash-muted)' }}>
                                <TrendingUp size={20} /> <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>ESTIMATED WIN RATE</span>
                            </div>
                            <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--dash-primary)', marginBottom: '8px', lineHeight: 1 }}>{winRate}<span style={{ fontSize: '24px' }}>%</span></div>
                            <p style={{ margin: '0', color: 'var(--dash-muted)', fontSize: '14px' }}>
                                <span style={{ color: 'var(--dash-text)', fontWeight: 700 }}>{profitCount}개</span>의 시나리오 수익중
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. COMPACT LIST like Playlist */}
                <section>
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>학습 내역</h3>
                        <div style={{ fontSize: '14px', color: 'var(--dash-muted)', fontWeight: 700, cursor: 'pointer' }}>SEE ALL</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Header Row */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '40px 2fr 1.5fr 1fr 1.5fr',
                            padding: '0 16px 12px',
                            borderBottom: '1px solid var(--dash-border)',
                            color: 'var(--dash-muted)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px'
                        }}>
                            <div>#</div>
                            <div>TITLE</div>
                            <div>DATE ADDED</div>
                            <div>THEME</div>
                            <div style={{ textAlign: 'right' }}>RETURN</div>
                        </div>

                        {scenarios.map((scenario, index) => {
                            const { change, percent } = calculateChange(scenario.startPrice, scenario.currentPrice)
                            const isProfit = change >= 0

                            return (
                                <div key={scenario.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '40px 2fr 1.5fr 1fr 1.5fr',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        borderRadius: '4px',
                                        transition: 'background 0.2s',
                                        cursor: 'default'
                                    }}
                                    className="scenario-row"
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dash-surface)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => {
                                        localStorage.setItem('narrative_active_scenario', JSON.stringify({
                                            stock: scenario.stock,
                                            stockCode: scenario.stockCode,
                                            path: scenario.path
                                        }))
                                        setView('PRESENTATION')
                                    }}
                                >
                                    <div style={{ color: 'var(--dash-muted)', fontSize: '14px' }}>{index + 1}</div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        {/* Icon */}
                                        <div style={{
                                            width: '40px', height: '40px', background: 'var(--dash-surface-highlight)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--dash-muted)', fontWeight: 700, fontSize: '14px'
                                        }}>
                                            {scenario.stock[0]}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--dash-text)' }}>{scenario.stock}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--dash-muted)' }}>{scenario.stockCode}</span>
                                        </div>
                                    </div>

                                    <div style={{ color: 'var(--dash-muted)', fontSize: '14px' }}>
                                        {formatDate(scenario.createdAt)}
                                    </div>

                                    <div style={{ color: 'var(--dash-muted)', fontSize: '14px' }}>
                                        {scenario.path[1]}
                                    </div>

                                    <div style={{ textAlign: 'right', fontWeight: 600, color: isProfit ? '#2979FF' : '#ef4444' }}>
                                        {isProfit ? '+' : ''}{percent.toFixed(1)}%
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section >
            </main >
        </div >
    )
}

export default MyScenariosView
