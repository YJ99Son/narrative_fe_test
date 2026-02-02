import { useState, useRef, useEffect } from 'react'
import type { ViewState } from '../data'
import FloatingNav from '../components/FloatingNav'
import { SCENARIO_DATA, DEPTH_STEPS } from '../data/scenarioData'
import type { ScenarioOption } from '../data/scenarioData'
import { Save, Send, ZoomIn, ZoomOut, RotateCcw, ChevronRight, ChevronLeft, Sparkles, LayoutTemplate } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Xarrow, { Xwrapper, useXarrow } from 'react-xarrows'
import BrandLogo from '../components/BrandLogo'

type BuilderViewProps = {
    setView: (v: ViewState) => void
    current: ViewState
}

// Chat message type
type ChatMessage = {
    id: string;
    sender: 'user' | 'ai';
    type: 'text' | 'phase-summary';
    text: string;
    data?: {
        stepName: string;
        optionName: string;
        desc: string;
        indexValue: string;
        change: number;
        questions: string[];
    }
}

// Context guides for each depth step
const CONTEXT_GUIDES: Record<string, { desc: string, qs: string[] }> = {
    'THEME': {
        desc: '이 테마가 시장에서 주목받는 이유와 성장 잠재력을 확인해보세요.',
        qs: ['현재 시장 규모는?', '주요 성장 동력은?', '관련 리스크 요인은?']
    },
    'SECTOR': {
        desc: '해당 섹터 내에서의 경쟁 구도와 핵심 기술 트렌드를 파악해야 합니다.',
        qs: ['경쟁사 대비 우위는?', '기술적 진입장벽은?', '최근 주요 이슈는?']
    },
    'MACRO': {
        desc: '거시경제 환경이 해당 산업에 미치는 영향을 분석하는 단계입니다.',
        qs: ['금리 인상의 영향은?', '환율 변동성 리스크는?', '정책적 수혜 가능성은?']
    },
    'STOCK': {
        desc: '개별 기업의 재무 건전성과 모멘텀을 최종 점검하세요.',
        qs: ['최근 실적 추이는?', '목표 주가 컨센서스는?', '기관 수급 현황은?']
    },
    'VALUE_CHAIN (Suppliers)': {
        desc: '밸류체인 내 핵심 공급사를 확인합니다.',
        qs: ['공급 점유율은?', '기술 경쟁력은?']
    }
}

const BuilderView = ({ setView, current }: BuilderViewProps) => {
    // --- MOBILE STATE ---
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
    // --- DESKTOP STATE ---
    const [desktopFooterExpanded, setDesktopFooterExpanded] = useState(false)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 480)
        window.addEventListener('resize', handleResize)
        console.log("OpenRouter API Key Present:", !!import.meta.env.VITE_OPENROUTER_API_KEY)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Messages
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'ai',
            type: 'text',
            text: '선택하신 종목의 전체 밸류체인을 시각화했습니다. 각 단계를 클릭하거나 하단 채팅을 통해 분석을 진행해보세요.'
        }
    ])
    const [inputValue, setInputValue] = useState('')

    // -- CANVAS STATE --
    const [pan, setPan] = useState({ x: -2000, y: -2000 })
    const [scale, setScale] = useState(1)
    const isDragging = useRef(false)
    const lastPos = useRef({ x: 0, y: 0 })
    const updateXarrow = useXarrow()

    // Path Selection State
    // Default to empty or pre-selected if available
    const [selectedIds, setSelectedIds] = useState<string[]>(['macro_ai', 'sector_semi', 'theme_hbm', 'stock_sk', 'vc_sk_1'])

    // Builder Step State
    const [currentStep, setCurrentStep] = useState(0)

    // Picker State & Refs (Removed unused)
    // const [showPicker, setShowPicker] = useState(false)
    // const [pickerDepth, setPickerDepth] = useState<number | null>(null)
    const pathContainerRef = useRef<HTMLDivElement>(null)
    const pathItemRefs = useRef<(HTMLDivElement | null)[]>([])

    // -- SCROLL RESET REF --
    const contentScrollRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (contentScrollRef.current) {
            contentScrollRef.current.scrollTop = 0
        }
    }, [currentStep])

    // ...

    // Guide State (Removed unused)
    // const [showGuide, setShowGuide] = useState(true)

    // ...

    // --- CONTEXTUAL AI ON STEP CHANGE ---
    useEffect(() => {
        // Removed check for showGuide/showChat since they are removed
        const stepName = DEPTH_STEPS[currentStep]
        const currentOptionName = getSelectedName(currentStep)

        if (!currentOptionName) return

        const guide = CONTEXT_GUIDES[stepName]
        if (!guide) return

        // Optional: Add system message about context change, but avoid spamming?
        // existing logic continues...
    }, [currentStep, selectedIds]) // Removed showGuide/showChat from deps

    // --- PRE-SELECTION (DEEP LINKING) ---
    const findPathToNode = (nodes: ScenarioOption[], targetNameOrId: string, currentPath: string[] = []): string[] | null => {
        for (const node of nodes) {
            // Normalize for loose matching (remove parens, lowercase)
            const normNodeName = node.name.replace(/\(.*\)/, '').trim().toLowerCase()
            const normTarget = targetNameOrId.replace(/\(.*\)/, '').trim().toLowerCase()

            if (node.id === targetNameOrId || normNodeName === normTarget || normNodeName.includes(normTarget)) {
                return [...currentPath, node.id]
            }
            if (node.children) {
                const res = findPathToNode(node.children, targetNameOrId, [...currentPath, node.id])
                if (res) return res
            }
        }
        return null
    }

    // ... (existing effects) ...

    useEffect(() => {
        if (current !== 'BUILDER') return

        try {
            const stored = localStorage.getItem('narrative_active_scenario')
            if (stored) {
                const data = JSON.parse(stored)

                const target = data.stock || data.stockName
                if (target) {
                    const path = findPathToNode(SCENARIO_DATA, target)
                    if (path) {
                        let curr: any = SCENARIO_DATA.find(n => n.id === path[0])
                        for (let i = 1; i < path.length; i++) curr = curr?.children?.find((n: any) => n.id === path[i])

                        if (curr && curr.children && curr.children.length > 0) {
                            path.push(curr.children[0].id)
                        }
                        setSelectedIds(path)

                        // Check for specific start step
                        const initialStepRaw = localStorage.getItem('narrative_builder_initial_step')
                        if (initialStepRaw !== null) {
                            const initial = parseInt(initialStepRaw, 10)
                            if (!isNaN(initial) && initial >= 0 && initial < DEPTH_STEPS.length) {
                                setCurrentStep(initial)
                            }
                            // Clear it so it doesn't persist forever
                            localStorage.removeItem('narrative_builder_initial_step')
                        } else {
                            // Default behavior if no specific step requested
                            // Maybe we don't want to reset to 0 if just switching back and forth?
                            // But for now, let's leave it or set to 0 strictly if it's a new scenario load.
                        }
                        setTimeout(updateXarrow, 200) // Update xarrows after path is set
                    }
                }
            }
        } catch (e) { console.error(e) }
        setTimeout(updateXarrow, 200)
    }, [])

    // --- ZOOM & PAN ---
    const handleWheel = (e: React.WheelEvent) => {
        const zoomSensitivity = 0.0005
        const newScale = Math.min(Math.max(scale - e.deltaY * zoomSensitivity, 0.4), 1.0)
        setScale(newScale)
        updateXarrow()
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true
        lastPos.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }))
        lastPos.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseUp = () => { isDragging.current = false; updateXarrow(); }

    // Auto-scroll Path Bar
    useEffect(() => {
        if (isMobile && pathContainerRef.current) {
            const activeItem = pathItemRefs.current[currentStep]
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        }
    }, [currentStep, isMobile])

    // Helpers
    const getOptionsForDepth = (depth: number) => {
        if (depth === 0) return SCENARIO_DATA
        const pid = selectedIds[depth - 1]; if (!pid) return []
        let opts = SCENARIO_DATA
        for (let i = 0; i < depth; i++) {
            const id = selectedIds[i]
            const f = opts.find(o => o.id === id)
            if (!f || !f.children) return []
            opts = f.children
        }
        return opts
    }

    const getSelectedName = (depth: number): string | null => {
        const selectedId = selectedIds[depth]
        if (!selectedId) return null
        const options = getOptionsForDepth(depth)
        const found = options.find(o => o.id === selectedId)
        return found?.name || null
    }

    const handleSelect = (opt: ScenarioOption, depth: number) => {
        const newIds = [...selectedIds.slice(0, depth), opt.id]
        let curr = opt
        while (curr.children?.length) {
            curr = curr.children[0]
            newIds.push(curr.id)
        }
        setSelectedIds(newIds)
        setTimeout(updateXarrow, 50)
    }

    const handleNextStep = () => {
        if (currentStep < DEPTH_STEPS.length - 1 && selectedIds[currentStep]) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleSendMessage = async (text: string = inputValue) => {
        if (!text.trim()) return
        const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', type: 'text', text }
        setChatMessages(prev => [...prev, newMsg])
        setInputValue('')

        try {
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-exp:free",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful investment analyst assistant. Analyze the user's scenario and provide concise, professional insights. Keep answers brief (under 3 sentences) if possible. Current scenario context: " + selectedIds.join(' > ')
                        },
                        ...chatMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
                        { role: "user", content: text }
                    ]
                })
            })

            const data = await response.json()
            const aiText = data.choices?.[0]?.message?.content || "죄송합니다. 일시적인 오류가 발생했습니다."

            setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', type: 'text', text: aiText }])
        } catch (error) {
            console.error('Chat API Error:', error)
            setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', type: 'text', text: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }])
        }
    }

    // --- CONTEXTUAL AI ON STEP CHANGE ---
    // --- CONTEXTUAL AI ON STEP CHANGE ---
    useEffect(() => {
        // Removed showGuide/showChat check

        const stepName = DEPTH_STEPS[currentStep]
        const currentOptionName = getSelectedName(currentStep)

        const guide = CONTEXT_GUIDES[stepName] || { desc: '이 단계의 주요 포인트를 확인하세요.', qs: ['핵심 포인트는?', '리스크 요인은?'] }

        // Find current selected option data
        const options = getOptionsForDepth(currentStep)
        const selected = options.find(o => o.id === selectedIds[currentStep])

        setChatMessages(prev => {
            const lastMsg = prev[prev.length - 1]
            // Prevent duplicate summary for same step
            if (lastMsg?.type === 'phase-summary' && lastMsg.data?.stepName === stepName) return prev

            return [...prev, {
                id: Date.now().toString(),
                sender: 'ai',
                type: 'phase-summary',
                text: '', // visual block used instead
                data: {
                    stepName: stepName,
                    optionName: currentOptionName || '미선택',
                    desc: guide.desc,
                    indexValue: selected?.indexValue.toLocaleString() || '-',
                    change: selected?.change || 0,
                    questions: guide.qs
                }
            }]
        })

    }, [currentStep]) // trigger when step changes logic

    // --- MOBILE UI RENDER ---
    if (isMobile) {
        const [chatExpanded, setChatExpanded] = useState(false)
        const scrollContainerRef = useRef<HTMLDivElement>(null)

        // Ensure active item is centered in the header
        useEffect(() => {
            if (scrollContainerRef.current) {
                const activeEl = scrollContainerRef.current.children[currentStep] as HTMLElement
                if (activeEl) {
                    activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                }
            }
        }, [currentStep])

        // Function to reconstruct the full path objects from selectedIds
        const getFullSelectedPath = () => {
            const pathObjects: ScenarioOption[] = []
            let currentOpts = SCENARIO_DATA
            for (const id of selectedIds) {
                const found = currentOpts.find(o => o.id === id)
                if (found) {
                    pathObjects.push(found)
                    if (found.children) currentOpts = found.children
                }
            }
            return pathObjects
        }

        const selectedPath = getFullSelectedPath()
        const currentOption = selectedPath[currentStep]
        const guide = CONTEXT_GUIDES[DEPTH_STEPS[currentStep]] || { desc: '분석 정보를 확인하세요.', qs: [] }

        return (
            <div style={{ position: 'fixed', inset: 0, background: 'var(--dash-bg)', color: 'var(--dash-text)', zIndex: 9999, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* 1. HEADER: Horizontal Scroll Path */}
                <div style={{ position: 'relative', borderBottom: '1px solid var(--dash-border)', background: 'var(--dash-bg)', zIndex: 20 }}>
                    <div style={{ padding: '20px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <BrandLogo size="sm" withText />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                                onClick={() => setView('MYSCENARIOS')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                    background: 'var(--dash-surface)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--dash-border)'
                                }}
                            >
                                <Save size={14} color="var(--dash-primary)" />
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--dash-text)' }}>저장</span>
                            </div>
                            <div
                                onClick={() => {
                                    localStorage.setItem('presentation_skip_animation', 'true')
                                    localStorage.setItem('presentation_initial_step', currentStep.toString())
                                    setView('PRESENTATION')
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                    background: 'var(--dash-surface)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--dash-border)'
                                }}
                            >
                                <LayoutTemplate size={14} color="var(--dash-primary)" />
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--dash-text)' }}>구조도</span>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicators - Left/Right Gradients/Arrows */}
                    <div style={{ position: 'absolute', top: '50px', bottom: 0, left: 0, width: '32px', background: 'linear-gradient(to right, var(--dash-bg), transparent)', zIndex: 12, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronLeft size={16} color="var(--dash-text)" style={{ opacity: 0.8 }} />
                    </div>
                    <div style={{ position: 'absolute', top: '50px', bottom: 0, right: 0, width: '32px', background: 'linear-gradient(to left, var(--dash-bg), transparent)', zIndex: 12, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronRight size={16} color="var(--dash-text)" style={{ opacity: 0.8 }} />
                    </div>

                    <div
                        ref={scrollContainerRef}
                        style={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: '12px',
                            padding: '0 20px 10px',
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none', // Firefox
                            msOverflowStyle: 'none', // IE/Edge
                        }}
                    >
                        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                        {selectedPath.map((opt, idx) => {
                            const isActive = idx === currentStep
                            return (
                                <motion.div
                                    key={opt.id}
                                    onClick={() => setCurrentStep(idx)}
                                    animate={{
                                        opacity: isActive ? 1 : 0.5,
                                        scale: isActive ? 1 : 0.95,
                                        background: isActive ? 'var(--dash-primary)' : 'var(--dash-surface)',
                                        borderColor: isActive ? 'var(--dash-blue)' : 'var(--dash-border)'
                                    }}
                                    style={{
                                        minWidth: '130px',
                                        padding: '10px 14px',
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        color: isActive ? 'white' : 'var(--dash-muted)',
                                        cursor: 'pointer',
                                        scrollSnapAlign: 'center',
                                        display: 'flex', flexDirection: 'column', gap: '4px',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ fontSize: '9px', opacity: 0.8, fontWeight: 700 }}>{DEPTH_STEPS[idx]}</div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {opt.name}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* 2. MAIN CONTENT */}
                <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Navigation Buttons (Fixed) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: 'var(--dash-bg)', zIndex: 5 }}>
                        <button
                            onClick={handlePrevStep}
                            disabled={currentStep === 0}
                            style={{
                                padding: '10px', borderRadius: '50%', background: 'var(--dash-surface)', border: 'none', color: 'var(--dash-text)',
                                opacity: currentStep === 0 ? 0.3 : 1, backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px var(--dash-shadow)'
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div style={{ fontSize: '12px', color: 'var(--dash-muted)', fontWeight: 600 }}>
                            {currentStep + 1} / {selectedPath.length}
                        </div>
                        <button
                            onClick={handleNextStep}
                            disabled={currentStep === selectedPath.length - 1}
                            style={{
                                padding: '10px', borderRadius: '50%', background: 'var(--dash-surface)', border: 'none', color: 'var(--dash-text)',
                                opacity: currentStep === selectedPath.length - 1 ? 0.3 : 1, backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px var(--dash-shadow)'
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Content Detail */}
                    <div ref={contentScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '0 24px 160px' }}> {/* Extra padding for comfortable scroll above chat */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>{currentOption?.name}</h2>
                                <span style={{
                                    fontSize: '12px', fontWeight: 700,
                                    color: (currentOption?.change || 0) >= 0 ? 'var(--dash-danger)' : 'var(--dash-blue)',
                                    background: (currentOption?.change || 0) >= 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(41, 121, 255, 0.1)',
                                    padding: '4px 8px', borderRadius: '6px'
                                }}>
                                    {currentOption?.change >= 0 ? '+' : ''}{Math.abs(currentOption?.change || 0)}%
                                </span>
                            </div>

                            <div style={{ background: 'var(--dash-surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--dash-border)', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '14px', color: 'var(--dash-muted)', margin: '0 0 10px 0' }}>핵심 분석</h3>
                                <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--dash-text)', margin: 0 }}>
                                    {currentOption?.description}
                                    <br /><br />
                                    <span style={{ fontSize: '14px', color: 'var(--dash-muted)' }}>{guide.desc}</span>
                                </p>
                            </div>

                            {/* Market Data Analysis (Added to Main View) */}
                            <div style={{ background: 'var(--dash-surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--dash-border)', marginBottom: '20px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--dash-muted)', marginBottom: '12px' }}>MARKET DATA ANALYSIS</div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '8px' }}>
                                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                        <div key={i} style={{ flex: 1, background: i === 6 ? 'var(--dash-primary)' : 'var(--dash-surface-highlight)', height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
                                    ))}
                                </div>
                                <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--dash-text)', lineHeight: 1.5 }}>
                                    최근 1개월간 <strong>{currentOption?.name}</strong> 관련 지표가 상승세입니다. 특히 기관 수급이 긍정적입니다.
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ background: 'var(--dash-surface)', padding: '16px', borderRadius: '12px' }}>
                                    <div style={{ color: 'var(--dash-muted)', fontSize: '11px', marginBottom: '4px' }}>INDEX</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--dash-text)' }}>{currentOption?.indexName}</div>
                                </div>
                                <div style={{ background: 'var(--dash-surface)', padding: '16px', borderRadius: '12px' }}>
                                    <div style={{ color: 'var(--dash-muted)', fontSize: '11px', marginBottom: '4px' }}>VALUE</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--dash-text)' }}>{currentOption?.indexValue.toLocaleString()}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 3. FOOTER: Chat & Viz (Expandable) */}
                {/* Backdrop for closing chat when expanded */}
                {chatExpanded && (
                    <div
                        onClick={() => setChatExpanded(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.5)' }}
                    />
                )}

                <motion.div
                    animate={{ height: chatExpanded ? '80%' : '140px' }}
                    transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={(_, info) => {
                        if (info.offset.y < -30) setChatExpanded(true)
                        if (info.offset.y > 30) setChatExpanded(false)
                    }}
                    style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'var(--dash-surface)', borderRadius: '24px 24px 0 0',
                        borderTop: '1px solid var(--dash-border)',
                        zIndex: 1000,
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '0 -10px 30px var(--dash-shadow)'
                    }}
                >
                    {/* Handle */}
                    <div
                        onClick={() => setChatExpanded(!chatExpanded)}
                        style={{ display: 'flex', justifyContent: 'center', padding: '12px', cursor: 'pointer', width: '100%' }}
                    >
                        <div style={{ width: '40px', height: '4px', background: 'var(--dash-border)', borderRadius: '2px' }} />
                    </div>

                    {/* Chat Content */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px', overflowY: 'hidden' }}>

                        {/* Always visible header in chat */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }} onClick={() => setChatExpanded(true)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={20} color="var(--dash-primary)" fill="var(--dash-primary)" />
                                <span style={{ fontWeight: 700, fontSize: '15px' }}>AI Analyst</span>
                            </div>
                            {!chatExpanded && (
                                <div style={{ fontSize: '12px', color: 'var(--dash-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>Tap or Swipe</span>
                                    <ChevronLeft size={12} style={{ transform: 'rotate(90deg)' }} />
                                </div>
                            )}
                        </div>

                        {/* Scrollable Area */}
                        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Visual Explanation (Graph/Table) */}
                            <div style={{ background: 'var(--dash-surface)', borderRadius: '16px', padding: '16px', border: '1px solid var(--dash-border)' }}>
                                <div style={{ fontSize: '12px', color: 'var(--dash-muted)', marginBottom: '12px' }}>MARKET DATA ANALYSIS</div>
                                {/* Mock Graph */}
                                <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '8px' }}>
                                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                        <div key={i} style={{ flex: 1, background: i === 6 ? 'var(--dash-primary)' : 'var(--dash-surface-highlight)', height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
                                    ))}
                                </div>
                                <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--dash-text)', lineHeight: 1.4 }}>
                                    최근 1개월간 <strong>{currentOption?.name}</strong> 관련 지표가 상승세입니다. 특히 기관 수급이 긍정적입니다.
                                </div>
                            </div>

                            {/* Recommended Questions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--dash-muted)' }}>RECOMMENDED QUESTIONS</div>
                                {guide.qs.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSendMessage(q)}
                                        style={{
                                            textAlign: 'left', padding: '12px 16px', borderRadius: '12px',
                                            background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', color: 'var(--dash-text)', fontSize: '13px'
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>

                            {/* Chat History */}
                            {chatMessages.map(msg => (
                                <div key={msg.id} style={{
                                    padding: '12px 16px', borderRadius: '16px',
                                    background: msg.sender === 'user' ? 'var(--dash-primary)' : 'var(--dash-surface)',
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%', color: msg.sender === 'user' ? 'white' : 'var(--dash-text)', fontSize: '13px', lineHeight: 1.5
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Input Area (Only when expanded) */}
                    {/* Padding bottom increased to 120px to clear navigation clearly */}
                    <motion.div
                        animate={{ opacity: chatExpanded ? 1 : 0, y: chatExpanded ? 0 : 20 }}
                        style={{ padding: '0 10px 120px', display: chatExpanded ? 'block' : 'none', width: '100%', boxSizing: 'border-box' }}
                    >
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                value={inputValue} onChange={e => setInputValue(e.target.value)}
                                placeholder="추가로 궁금한 점을 물어보세요..."
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                style={{
                                    flex: 1, background: 'var(--dash-surface-highlight)', border: '1px solid var(--dash-border)',
                                    padding: '16px', borderRadius: '16px', color: 'var(--dash-text)', fontSize: '14px', outline: 'none'
                                }}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                style={{
                                    background: 'var(--dash-primary)', border: 'none', width: '50px', height: '50px',
                                    borderRadius: '16px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Floating Nav */}
                <FloatingNav setView={setView} current="BUILDER" />
            </div>
        )
    }



    // --- DESKTOP RENDER (Unchanged logic, just using foreign data) ---
    return (
        <div style={{ background: 'var(--dash-bg)', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header style={{ padding: '20px 40px', borderBottom: '1px solid var(--dash-border)', background: 'var(--dash-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <div style={{ color: 'var(--dash-text)' }}>
                    <BrandLogo size="sm" />
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', background: 'var(--dash-surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--dash-border)' }}>
                        <button onClick={() => setScale(s => Math.min(s + 0.1, 1))} style={{ background: 'none', border: 'none', color: 'var(--dash-text)', cursor: 'pointer' }}><ZoomIn size={16} /></button>
                        <span style={{ fontSize: '12px', color: 'var(--dash-muted)', minWidth: '40px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.max(s - 0.1, 0.4))} style={{ background: 'none', border: 'none', color: 'var(--dash-text)', cursor: 'pointer' }}><ZoomOut size={16} /></button>
                        <div style={{ width: '1px', background: 'var(--dash-border)', margin: '0 4px' }} />
                        <button onClick={() => { setScale(1); setPan({ x: 0, y: 0 }) }} style={{ background: 'none', border: 'none', color: 'var(--dash-text)', cursor: 'pointer' }}><RotateCcw size={14} /></button>
                    </div>
                    <button className="action-btn" onClick={() => setView('MYSCENARIOS')} style={{
                        background: '#3b82f6', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '9999px',
                        fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                    }}>
                        <Save size={16} /> 저장하기
                    </button>
                    <button className="action-btn" onClick={() => {
                        localStorage.setItem('presentation_skip_animation', 'true')
                        localStorage.setItem('presentation_initial_step', currentStep.toString())
                        setView('PRESENTATION')
                    }} style={{
                        background: 'var(--dash-surface)', color: 'var(--dash-text)', border: '1px solid var(--dash-border)', padding: '8px 24px', borderRadius: '9999px',
                        fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px var(--dash-shadow)'
                    }}>
                        <LayoutTemplate size={16} /> 구조도
                    </button>
                </div>
            </header>
            <main style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <section className="builder-canvas" style={{ flex: 1, width: '100%', height: '100%', cursor: isDragging.current ? 'grabbing' : 'grab', background: 'radial-gradient(circle at 1px 1px, var(--dash-border) 1px, transparent 0)', backgroundSize: '40px 40px', overflow: 'hidden' }} onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    <div style={{
                        transform: `translate(${pan.x}px, ${pan.y + (desktopFooterExpanded ? -window.innerHeight * 0.3 : 0)}px) scale(${scale})`,
                        transformOrigin: '50% 50%',
                        transition: isDragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', // Smooth sync with footer
                        width: '5000px', height: '5000px', position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', left: '2500px', top: '2500px', transform: 'translate(-50%, -50%)', display: 'flex', gap: '80px' }}>
                            <Xwrapper>
                                {DEPTH_STEPS.map((step, depth) => {
                                    const options = getOptionsForDepth(depth)
                                    return (
                                        <div key={depth} style={{ display: 'flex', flexDirection: 'column', minWidth: '320px', maxWidth: '320px', gap: '24px' }}>
                                            <div style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 700, color: 'var(--dash-muted)', marginBottom: '10px', textAlign: 'center', userSelect: 'none' }}>{step}</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <AnimatePresence>
                                                    {options.length > 0 ? options.map(opt => {
                                                        const isSel = selectedIds[depth] === opt.id
                                                        // const nextSel = selectedIds[depth + 1]
                                                        return (
                                                            <motion.div key={opt.id} id={opt.id} onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); handleSelect(opt, depth) }}
                                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                                style={{
                                                                    background: isSel ? 'var(--dash-primary)' : 'var(--dash-surface)',
                                                                    border: isSel ? '1px solid var(--dash-primary)' : '1px solid var(--dash-border)',
                                                                    borderRadius: '16px', padding: '24px', cursor: 'pointer', position: 'relative',
                                                                    opacity: (selectedIds[depth] && !isSel) ? 0.3 : 1,
                                                                    boxShadow: isSel ? '0 0 30px rgba(41, 121, 255, 0.3)' : '0 4px 6px var(--dash-shadow)', zIndex: isSel ? 20 : 10
                                                                }}
                                                            >
                                                                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: isSel ? '#fff' : 'var(--dash-text)', userSelect: 'none' }}>{opt.name}</h4>
                                                                <p style={{ margin: 0, fontSize: '13px', color: isSel ? 'rgba(255,255,255,0.8)' : 'var(--dash-muted)', userSelect: 'none' }}>{opt.description}</p>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: isSel ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--dash-border)', paddingTop: '12px' }}>
                                                                    <span style={{ fontSize: '12px', color: isSel ? 'rgba(255,255,255,0.8)' : 'var(--dash-muted)', userSelect: 'none' }}>{opt.indexName}</span>
                                                                    <div style={{ textAlign: 'right' }}>
                                                                        <div style={{ fontSize: '14px', fontWeight: 700, color: isSel ? '#fff' : 'var(--dash-text)', userSelect: 'none' }}>{opt.indexValue.toLocaleString()}</div>
                                                                        <div style={{ fontSize: '12px', fontWeight: 600, color: isSel ? 'white' : (opt.change >= 0 ? 'var(--dash-danger)' : 'var(--dash-blue)'), userSelect: 'none' }}>{Math.abs(opt.change)}%</div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )
                                                    }) : <div style={{ color: '#444', fontSize: '13px', textAlign: 'center', padding: '20px', userSelect: 'none' }}>옵션 없음</div>}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )
                                })}
                                {/* Render Connections Separately for better stability and style */}
                                {selectedIds.map((id, i) => {
                                    if (i === selectedIds.length - 1) return null
                                    const nextId = selectedIds[i + 1]
                                    return (
                                        <Xarrow
                                            key={`${id}-${nextId}`}
                                            start={id}
                                            end={nextId}
                                            color="#2979FF"
                                            strokeWidth={2}
                                            path="smooth"
                                            showHead={false}
                                            startAnchor="right"
                                            endAnchor="left"
                                            curveness={0.5}
                                            zIndex={0}
                                            animateDrawing={false}
                                        />
                                    )
                                })}
                            </Xwrapper>
                        </div>
                    </div>
                </section >
                <motion.section
                    initial={{ height: 60 }}
                    animate={{ height: desktopFooterExpanded ? '70vh' : 60 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    style={{
                        position: 'absolute', bottom: 95, left: 0, right: 0, // Full width, lifted 5px more
                        borderTop: '1px solid var(--dash-border)',
                        borderRadius: '24px 24px 0 0', // Top corners only
                        background: 'var(--dash-bg)',
                        zIndex: 100,
                        boxShadow: '0 -4px 30px rgba(0,0,0,0.1)',
                        display: 'flex', flexDirection: 'column'
                    }}
                >
                    {/* Handle / Header Area - Always Visible */}
                    <div
                        onClick={() => setDesktopFooterExpanded(!desktopFooterExpanded)}
                        style={{
                            height: '60px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            borderBottom: desktopFooterExpanded ? '1px solid var(--dash-border)' : 'none',
                            background: 'var(--dash-surface)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: '4px', background: 'var(--dash-border)', borderRadius: '2px' }} />
                            {!desktopFooterExpanded && (
                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--dash-muted)' }}>
                                    분석 및 AI 채팅 열기
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content Area - Visible when Expanded */}
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', overflow: 'hidden' }}>
                        <div style={{ borderRight: '1px solid var(--dash-border)', padding: '32px', overflowY: 'auto' }}>
                            {selectedIds.length > 0 ? (() => {
                                const lastId = selectedIds[selectedIds.length - 1]
                                let targetOption: ScenarioOption | null = null
                                const traverse = (opts: ScenarioOption[]) => { for (const o of opts) { if (o.id === lastId) { targetOption = o; return } if (o.children) traverse(o.children) } }
                                traverse(SCENARIO_DATA)
                                if (!targetOption) return null
                                const opt = targetOption as ScenarioOption
                                return (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: 'var(--dash-text)' }}>
                                            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{opt.name}</h2>
                                            <span style={{ padding: '4px 8px', background: 'var(--dash-surface-highlight)', borderRadius: '4px', fontSize: '12px', color: 'var(--dash-muted)' }}>{DEPTH_STEPS[selectedIds.length - 1]}</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                            <div style={{ background: 'var(--dash-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--dash-border)' }}>
                                                <div style={{ fontSize: '12px', color: 'var(--dash-muted)', marginBottom: '4px' }}>PRICE</div>
                                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--dash-text)' }}>{opt.indexValue.toLocaleString()}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--dash-muted)' }}>{opt.indexName}</div>
                                            </div>
                                            <div style={{ background: 'var(--dash-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--dash-border)' }}>
                                                <div style={{ fontSize: '12px', color: 'var(--dash-muted)', marginBottom: '4px' }}>CHANGE</div>
                                                <div style={{ fontSize: '20px', fontWeight: 700, color: opt.change >= 0 ? 'var(--dash-danger)' : 'var(--dash-blue)' }}>{opt.change > 0 ? '+' : ''} {Math.abs(opt.change)}%</div>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'var(--dash-muted)', lineHeight: 1.6 }}>{opt.description}</p>
                                    </>
                                )
                            })() : null}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--dash-bg)' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} color="var(--dash-primary)" fill="var(--dash-primary)" /><span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--dash-text)' }}>AI Assistant</span></div>
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {chatMessages.map(msg => (<div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--dash-primary)' : 'var(--dash-surface)', padding: '12px 16px', borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', maxWidth: '85%', fontSize: '14px', lineHeight: 1.5, color: msg.sender === 'user' ? 'white' : 'var(--dash-text)' }}>{msg.text}</div>))}
                            </div>
                            <div style={{ padding: '16px', borderTop: '1px solid var(--dash-border)', display: 'flex', gap: '12px' }}>
                                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="질문하기..." style={{ flex: 1, background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', padding: '12px 20px', color: 'var(--dash-text)', fontSize: '14px', outline: 'none', borderRadius: '9999px' }} />
                                <button onClick={() => handleSendMessage()} style={{ background: 'var(--dash-primary)', border: 'none', color: 'white', padding: '0 20px', cursor: 'pointer', borderRadius: '9999px' }}><Send size={18} /></button>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main >
            <FloatingNav setView={setView} current={current} />
        </div >
    )
}




export default BuilderView

