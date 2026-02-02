import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import '../Dashboard.css'
import BrandLogo from '../components/BrandLogo'
import type { SavedScenario } from './MyScenariosView'
import type { ViewState } from '../data'

type MobileMyPageProps = {
    scenarios: SavedScenario[]
    setView: (v: ViewState) => void
}

const MobileMyPage = ({ scenarios, // Placeholder for MobileMyPage content check
    // If this file has emojis, I will replace them.
    setView }: MobileMyPageProps) => {
    const totalScenarios = scenarios.length
    const profitCount = scenarios.filter(s => s.currentPrice >= s.startPrice).length
    const winRate = ((profitCount / totalScenarios) * 100).toFixed(0)
    const mainInterest = "AI / 반도체"

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('ko-KR', {
            month: '2-digit',
            day: '2-digit',
        })
    }

    const calculateChange = (start: number, current: number) => {
        const change = current - start
        const percent = (change / start) * 100
        return { change, percent }
    }

    return (
        <div style={{ height: '100%', overflowY: 'auto', background: 'var(--dash-bg)', color: 'var(--dash-text)', paddingBottom: '100px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{
                padding: '24px 24px 16px',
                background: 'var(--dash-mypage-header-bg)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <BrandLogo size="md" withText={true} />
                </div>

                <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--dash-text)', margin: 0, letterSpacing: '-0.02em' }}>
                    나의 시나리오
                </h1>
            </div>

            <div style={{ padding: '0 24px' }}>
                {/* Quiz / Review Card like a "Liked Songs" or "Daily Mix" special card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setView('QUIZ')}
                    style={{
                        background: 'linear-gradient(135deg, #450af5 0%, #c4efd9 100%)', // Fun gradient like Liked Songs
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                        minHeight: '100px'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Daily Mix
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                            퀴즈로 복습하기
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
                            오늘 학습한 내용 확인하기
                        </div>
                    </div>
                    <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white'
                    }}>
                        <ChevronRight size={24} />
                    </div>
                </motion.div>

                {/* Stats Row */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {/* Win Rate */}
                    <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '16px', minWidth: '100px', border: '1px solid transparent' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dash-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>승률</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--dash-primary)' }}>{winRate}%</div>
                    </div>
                    {/* Total Count */}
                    <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '16px', minWidth: '100px', border: '1px solid transparent' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dash-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>학습량</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--dash-text)' }}>{totalScenarios}</div>
                    </div>
                    {/* Interest */}
                    <div style={{ background: 'var(--dash-surface)', borderRadius: '8px', padding: '16px', minWidth: '140px', flex: 1, border: '1px solid transparent' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dash-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>관심 분야</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--dash-text)' }}>{mainInterest}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--dash-text)', margin: 0 }}>최근 활동</h2>
                    <span style={{ fontSize: '12px', color: 'var(--dash-muted)', fontWeight: 600 }}>전체보기</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                    {scenarios.map((scenario, idx) => {
                        const { change, percent } = calculateChange(scenario.startPrice, scenario.currentPrice)
                        const isProfit = change >= 0

                        return (
                            <motion.div
                                key={scenario.id}
                                onClick={() => {
                                    localStorage.setItem('narrative_active_scenario', JSON.stringify({
                                        stock: scenario.stock,
                                        stockCode: scenario.stockCode,
                                        openChat: true
                                    }))
                                    setView('PRESENTATION')
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                layout
                                style={{
                                    background: 'var(--dash-bg)',
                                    padding: '12px 0',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}
                                whileTap={{ scale: 0.98, opacity: 0.8 }}
                            >
                                {/* Album Art / Icon */}
                                <div style={{
                                    width: '56px', height: '56px',
                                    background: 'var(--dash-surface-highlight)',
                                    borderRadius: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '20px', fontWeight: 700, color: 'var(--dash-muted)',
                                    flexShrink: 0
                                }}>
                                    {scenario.stock[0]}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--dash-text)', marginBottom: '4px' }}>
                                        {scenario.stock}
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--dash-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{
                                            background: 'var(--dash-muted)', color: 'var(--dash-bg)', borderRadius: '2px',
                                            padding: '0 4px', fontSize: '10px', fontWeight: 700
                                        }}>E</span>
                                        {scenario.path[1]} • {formatDate(scenario.createdAt)}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '14px', fontWeight: 600,
                                        color: isProfit ? 'var(--dash-danger)' : 'var(--dash-blue)'
                                    }}>
                                        {isProfit ? '+' : ''}{percent.toFixed(1)}%
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MobileMyPage