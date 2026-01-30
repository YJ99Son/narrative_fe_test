import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, ChevronLeft, SkipForward } from 'lucide-react'
import type { ViewState } from '../data'
import { SCENARIO_DATA, DEPTH_STEPS } from '../data/scenarioData'
import type { ScenarioOption } from '../data/scenarioData'
import Xarrow, { Xwrapper } from 'react-xarrows'

type PresentationViewProps = {
    setView: (v: ViewState) => void
    current: ViewState
}

export default function PresentationView({ setView }: PresentationViewProps) {
    const [path, setPath] = useState<ScenarioOption[]>([])
    const [visibleDepth, setVisibleDepth] = useState(0) // Control progressive display
    const containerRef = useRef<HTMLDivElement>(null)

    // Check for skip flag immediate on mount
    const [skipAnimation, setSkipAnimation] = useState(() => localStorage.getItem('presentation_skip_animation') === 'true')

    useEffect(() => {
        if (skipAnimation) {
            localStorage.removeItem('presentation_skip_animation')
        }
    }, [skipAnimation])

    useEffect(() => {
        try {
            const stored = localStorage.getItem('narrative_active_scenario')
            if (stored) {
                const data = JSON.parse(stored)
                if (data.path && Array.isArray(data.path)) {
                    setPath(data.path)
                } else if (data.stock) {
                    const foundPath = findPathToNode(SCENARIO_DATA, data.stock)
                    if (foundPath) {
                        const resolvedPath: ScenarioOption[] = []
                        let currentOptions = SCENARIO_DATA
                        for (const id of foundPath) {
                            const found = currentOptions.find(o => o.id === id)
                            if (found) {
                                resolvedPath.push(found)
                                if (found.children) currentOptions = found.children
                            }
                        }
                        setPath(resolvedPath)
                    }
                }
            }
        } catch (e) { console.error("Failed to load scenario", e) }
    }, [])

    // Progressive Line Drawing
    useEffect(() => {
        if (path.length === 0) return

        if (skipAnimation) {
            setVisibleDepth(path.length)
            return
        }

        setVisibleDepth(0)
        const interval = setInterval(() => {
            setVisibleDepth(prev => {
                if (prev >= path.length - 1) {
                    clearInterval(interval)
                    return prev
                }
                return prev + 1
            })
        }, 1350) // Sync with 1.35s phase duration

        return () => clearInterval(interval)
    }, [path, skipAnimation])

    const findPathToNode = (nodes: ScenarioOption[], targetId: string, currentPath: string[] = []): string[] | null => {
        for (const node of nodes) {
            if (node.id === targetId) return [...currentPath, node.id]
            if (node.children) {
                const res = findPathToNode(node.children, targetId, [...currentPath, node.id])
                if (res) return res
            }
        }
        return null
    }

    const getOptionsForDepth = (depth: number) => {
        if (depth === 0) return SCENARIO_DATA
        const parentOpt = path[depth - 1]
        if (!parentOpt || !parentOpt.children) return []
        return parentOpt.children
    }

    const handleStartAnalysis = (stepIndex: number = 0) => {
        // Save the desired start step and navigate immediately
        localStorage.setItem('narrative_builder_initial_step', stepIndex.toString())
        setView('BUILDER')
    }

    // Progressive auto-scroll synchronized with animation
    useEffect(() => {
        if (path.length > 0 && !skipAnimation) {
            path.forEach((_, index) => {
                // Animation delay: index * 1.35s (1350ms) - sped up 1.12x
                const delay = index * 1350 + 720

                setTimeout(() => {
                    if (containerRef.current) {
                        const columnWidth = 260
                        const gap = 40
                        const padding = 20
                        const stride = columnWidth + gap

                        // Calculate position to center the current column
                        const currentColumnX = padding + (index * stride)
                        const containerWidth = containerRef.current.clientWidth

                        // Center the column
                        const targetScroll = currentColumnX - (containerWidth / 2) + (columnWidth / 2)

                        containerRef.current.scrollTo({
                            left: Math.max(0, targetScroll),
                            behavior: 'smooth'
                        })
                    }
                }, delay)
            })
        } else if (path.length > 0 && skipAnimation) {
            // If skipped, maybe scroll to beginning or keep as is? 
            // Default behavior is usually 0, or we can scroll to the end if desired.
            // Let's just create a slight timeout to ensure layout is ready then scroll to start/0
            setTimeout(() => {
                if (containerRef.current) {
                    const initialStepRaw = localStorage.getItem('presentation_initial_step')
                    let initialScrollLeft = 0

                    if (initialStepRaw) {
                        const stepIndex = parseInt(initialStepRaw, 10)
                        if (!isNaN(stepIndex)) {
                            const columnWidth = 260
                            const gap = 40
                            const padding = 20
                            const stride = columnWidth + gap
                            const currentColumnX = padding + (stepIndex * stride)
                            const containerWidth = containerRef.current.clientWidth

                            // Center the column
                            initialScrollLeft = Math.max(0, currentColumnX - (containerWidth / 2) + (columnWidth / 2))
                        }
                        localStorage.removeItem('presentation_initial_step')
                    }

                    containerRef.current.scrollTo({ left: initialScrollLeft, behavior: 'auto' })
                }
            }, 100)
        }
    }, [path, skipAnimation])

    return (
        <div style={{
            background: 'var(--dash-bg)', // Spotify Dark Background
            height: '100vh',
            color: 'var(--dash-text)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            <header style={{
                padding: '24px',
                background: 'var(--dash-header-bg)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0
            }}>
                <button onClick={() => setView('DASHBOARD')} style={{
                    background: 'var(--dash-shadow)',
                    border: 'none',
                    color: 'var(--dash-text)',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    backdropFilter: 'blur(4px)'
                }}>
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <div style={{ fontSize: '11px', color: 'var(--dash-primary)', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px', textTransform: 'uppercase' }}>
                        Scenario Flow
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                        전체 시나리오 조감도
                    </h1>
                </div>

            </header>

            <motion.main
                ref={containerRef}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    flex: 1,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '80px 24px 24px 24px', // Top padding for fixed header
                    position: 'relative',
                }}
            >
                <Xwrapper>
                    <div style={{ display: 'flex', gap: '40px', padding: '0 20px', minWidth: 'min-content' }}>
                        {DEPTH_STEPS.map((stepName, depth) => {
                            if (depth >= path.length && depth > 0) return null

                            const options = getOptionsForDepth(depth)
                            const selectedOption = path[depth]

                            return (
                                <div key={depth} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '220px', flexShrink: 0 }}>
                                    <div style={{
                                        color: 'var(--dash-muted)', fontSize: '12px', fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px'
                                    }}>
                                        {stepName}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {options.map((opt, idx) => {
                                            const isSelected = selectedOption && opt.id === selectedOption.id

                                            return (
                                                <motion.div
                                                    key={`${opt.id}-${skipAnimation}`} // Force remount on skip change
                                                    id={`node-${opt.id}`}
                                                    onClick={() => handleStartAnalysis(depth)}
                                                    initial={skipAnimation ? { opacity: 1, x: 0, scale: isSelected ? 1 : 1 } : { opacity: 0, x: -20, scale: 0.9 }}
                                                    animate={{ opacity: 1, x: 0, scale: isSelected ? 1 : 1 }}
                                                    transition={{
                                                        delay: skipAnimation ? 0 : depth * 1.35 + idx * 0.1,
                                                        duration: skipAnimation ? 0 : 0.5,
                                                        type: "spring",
                                                        stiffness: 100
                                                    }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{
                                                        padding: '16px',
                                                        borderRadius: '8px',
                                                        background: isSelected ? 'var(--dash-primary)' : 'var(--dash-surface)', // Blue selection background
                                                        border: isSelected ? '1px solid var(--dash-primary)' : '1px solid transparent',
                                                        color: isSelected ? '#ffffff' : 'var(--dash-muted)', // Keep white text on primary selection
                                                        position: 'relative',
                                                        zIndex: isSelected ? 20 : 10,
                                                        opacity: isSelected ? 1 : 0.6,
                                                        boxShadow: isSelected ? '0 4px 20px rgba(41, 121, 255, 0.4)' : 'none',
                                                        cursor: 'pointer',
                                                        minWidth: '100%',
                                                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '15px', fontWeight: 700 }}>{opt.name}</span>
                                                        <div style={{
                                                            fontSize: '12px', fontWeight: 700,
                                                            color: isSelected ? 'white' : (opt.change >= 0 ? 'var(--dash-primary)' : 'var(--dash-danger)'), // Updated: Blue Up, Red Down
                                                            background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--dash-shadow)',
                                                            padding: '4px 8px', borderRadius: '40px',
                                                            minWidth: '48px', textAlign: 'center'
                                                        }}>
                                                            {opt.change >= 0 ? '+' : ''}{opt.change}%
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {/* Progressive Line Rendering - Blue Lines */}
                    {path.map((node, i) => {
                        if (i === path.length - 1) return null

                        // Use derived depth for instant update
                        const currentDepth = skipAnimation ? path.length : visibleDepth
                        if (i >= currentDepth) return null

                        const nextNode = path[i + 1]
                        return (
                            <Xarrow
                                key={`${node.id}-${nextNode.id}-${skipAnimation}`} // Force remount logic for Xarrow
                                start={`node-${node.id}`}
                                end={`node-${nextNode.id}`}
                                color="var(--dash-primary)"
                                strokeWidth={2}
                                path="smooth"
                                showHead={false}
                                startAnchor="right"
                                endAnchor="left"
                                curveness={0.6}
                                animateDrawing={skipAnimation ? 0 : 0.5}
                                zIndex={5}
                            />
                        )
                    })}
                </Xwrapper>
            </motion.main>

            {/* Bottom Panel - Now Playing Style */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, type: 'spring', damping: 20 }}
                style={{
                    padding: '16px 24px 32px 24px',
                    background: 'var(--dash-surface)',
                    borderTop: '1px solid var(--dash-border)',
                    zIndex: 20
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', color: 'var(--dash-primary)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>Now Analyzing</div>
                        <div style={{ fontSize: '14px', color: 'var(--dash-text)', fontWeight: 600 }}>
                            {path[path.length - 1]?.name ? `${path[path.length - 1]?.name} 시나리오` : '시나리오 선택'}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--dash-muted)', marginTop: '2px', lineHeight: '1.4' }}>
                            {path[0]?.name} 기반으로 생성된 {path.length}단계의 맞춤형 투자 시나리오입니다.<br />
                            우측 재생 버튼을 눌러 각 단계별 상세 분석을 확인하세요.
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const isAnimating = (!skipAnimation && visibleDepth < path.length - 1)

                            if (isAnimating) {
                                setSkipAnimation(true)
                                // Force instant render update logic via state
                                setVisibleDepth(path.length)
                            } else {
                                if (containerRef.current) {
                                    const container = containerRef.current
                                    const scrollLeft = container.scrollLeft
                                    const containerWidth = container.clientWidth
                                    const viewportCenter = scrollLeft + (containerWidth / 2)
                                    const approximateIndex = Math.round((viewportCenter - 150) / 300)
                                    const targetIndex = Math.max(0, Math.min(path.length - 1, approximateIndex))
                                    handleStartAnalysis(targetIndex)
                                } else {
                                    handleStartAnalysis(0)
                                }
                            }
                        }}
                        style={{
                            width: (!skipAnimation && visibleDepth < path.length - 1) ? '56px' : 'auto', // Pill width if analyzing
                            padding: (!skipAnimation && visibleDepth < path.length - 1) ? '0' : '0 24px',
                            height: '56px',
                            background: 'var(--dash-primary)',
                            border: 'none',
                            borderRadius: (!skipAnimation && visibleDepth < path.length - 1) ? '50%' : '30px', // Pill radius
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                            boxShadow: '0 4px 10px rgba(41, 121, 255, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            fontWeight: 700,
                            fontSize: '16px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {(!skipAnimation && visibleDepth < path.length - 1) ? (
                            <SkipForward size={24} fill="currentColor" />
                        ) : (
                            // Analyze Text Button
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>분석하기</span>
                                <Play size={18} fill="currentColor" />
                            </div>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
