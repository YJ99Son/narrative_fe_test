import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { ChevronLeft, Check, ArrowRight, Info, MessageCircle, ChevronUp, Map, X } from 'lucide-react'
import { DEPTH_STEPS, SCENARIO_DATA } from '../data/scenarioData'
import type { ScenarioOption } from '../data/scenarioData'

type MobileBuilderStepperProps = {
    selectedIds: string[]
    setSelectedIds: (ids: string[]) => void
    currentStep: number
    setCurrentStep: (step: number) => void
}

const FullFlowModal = ({ isOpen, onClose, selectedIds }: { isOpen: boolean, onClose: () => void, selectedIds: string[] }) => {
    // Traverse to get all nodes for display
    const getPathNodes = () => {
        const nodes: ScenarioOption[] = []
        let currentLevel = SCENARIO_DATA
        for (const id of selectedIds) {
            const found = currentLevel.find(n => n.id === id)
            if (found) {
                nodes.push(found)
                currentLevel = found.children || []
            } else {
                break
            }
        }
        return nodes
    }
    const pathNodes = getPathNodes()

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.95)', zIndex: 100,
                        display: 'flex', flexDirection: 'column', padding: '24px'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>시나리오 전체 보기</h2>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {pathNodes.map((node, index) => (
                            <div key={node.id} style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ 
                                            width: '12px', height: '12px', borderRadius: '50%', 
                                            background: '#3b82f6', border: '2px solid rgba(59,130,246,0.3)',
                                            boxShadow: '0 0 10px rgba(59,130,246,0.5)'
                                        }} />
                                        {index < pathNodes.length - 1 && (
                                            <div style={{ width: '2px', height: '60px', background: '#333', margin: '4px 0' }} />
                                        )}
                                    </div>
                                    <div style={{ paddingBottom: '32px' }}>
                                        <div style={{ fontSize: '12px', color: '#666', fontWeight: 700, marginBottom: '4px' }}>
                                            {DEPTH_STEPS[index]}
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                                            {node.name}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#888' }}>
                                            {node.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const MobileBuilderStepper = ({ selectedIds, setSelectedIds, currentStep, setCurrentStep }: MobileBuilderStepperProps) => {
    const [direction, setDirection] = useState(0)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isMapOpen, setIsMapOpen] = useState(false)
    const sheetControls = useDragControls()
    
    // Derived state for path summary
    const selectedOptions = selectedIds.map((id) => {
        let found: ScenarioOption | null = null
        const traverse = (opts: ScenarioOption[]) => {
            for (const o of opts) {
                if (o.id === id) { found = o; return }
                if (o.children) traverse(o.children)
            }
        }
        traverse(SCENARIO_DATA)
        return found
    })

    const filteredSelectedOptions = selectedOptions.filter((opt) => opt !== null && opt !== undefined) as ScenarioOption[]

    const currentSelectedOption = filteredSelectedOptions[currentStep] || null

    const getOptions = (depth: number) => {
        if (depth === 0) return SCENARIO_DATA
        const pid = selectedIds[depth - 1]
        if (!pid) return []
        
        let opts = SCENARIO_DATA
        for (let i = 0; i < depth; i++) {
            const id = selectedIds[i]
            const f = opts.find(o => o.id === id)
            if (!f || !f.children) return []
            opts = f.children
        }
        return opts
    }

    const currentOptions = getOptions(currentStep)
    const currentSelectedId = selectedIds[currentStep]

    const handleSelect = (option: ScenarioOption) => {
        const newIds = [...selectedIds]
        newIds[currentStep] = option.id
        
        let curr = option
        let depth = currentStep + 1
        while (curr.children?.length && depth < 5) {
            curr = curr.children[0]
            newIds[depth] = curr.id
            depth++
        }
        
        setSelectedIds(newIds)
    }

    const nextStep = () => {
        if (currentStep < 4) {
            setDirection(1)
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setDirection(-1)
            setCurrentStep(currentStep - 1)
        }
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        })
    }

    const contentRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0
    }, [currentStep])

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#050505', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <FullFlowModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} selectedIds={selectedIds} />
            
            {/* Header / Progress */}
            <div style={{ padding: '20px 24px 10px', background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(10px)', zIndex: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', color: '#666' }}>
                        NARRATIVE<span style={{ color: '#3b82f6' }}>.FLOW</span>
                    </div>
                    
                    {/* Map Toggle Button */}
                    <button 
                        onClick={() => setIsMapOpen(true)}
                        style={{ 
                            background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', 
                            borderRadius: '20px', padding: '6px 12px', 
                            display: 'flex', alignItems: 'center', gap: '6px',
                            color: '#3b82f6', fontSize: '12px', fontWeight: 600, cursor: 'pointer' 
                        }}
                    >
                        <Map size={14} /> 전체 보기
                    </button>
                </div>

                {/* Navigation Breadcrumbs (Picker Style) */}
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    overflowX: 'auto', 
                    paddingBottom: '12px',
                    marginBottom: '8px',
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none'
                }}>
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                    {filteredSelectedOptions.map((opt, i) => (
                        <div key={opt.id} 
                            onClick={() => setCurrentStep(i)}
                            style={{
                                flexShrink: 0,
                                fontSize: '13px',
                                padding: '8px 16px',
                                background: i === currentStep ? '#3b82f6' : '#222',
                                color: i === currentStep ? 'white' : '#888',
                                borderRadius: '999px',
                                border: i === currentStep ? '1px solid #3b82f6' : '1px solid #333',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: i === currentStep ? '0 2px 8px rgba(59,130,246,0.3)' : 'none'
                            }}
                        >
                            {opt.name}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                        {DEPTH_STEPS[currentStep]}
                    </h2>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            overflowY: 'auto',
                            padding: '10px 24px 180px' // Increased padding for bottom sheet
                        }}
                        ref={contentRef}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {currentOptions.length > 0 ? currentOptions.map(opt => {
                                const isSelected = currentSelectedId === opt.id
                                const isPositive = opt.change >= 0
                                
                                return (
                                    <motion.div 
                                        key={opt.id}
                                        onClick={() => {
                                            handleSelect(opt)
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            background: isSelected ? 'rgba(59,130,246,0.1)' : '#111',
                                            border: isSelected ? '1px solid #3b82f6' : '1px solid #222',
                                            borderRadius: '16px',
                                            padding: '20px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Connector Line (Top) */}
                                        {currentStep > 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: '50%',
                                                width: '2px',
                                                height: '10px',
                                                background: isSelected ? '#3b82f6' : 'transparent',
                                                transform: 'translateX(-50%)',
                                                opacity: 0.5
                                            }} />
                                        )}

                                        {/* Connector Line (Bottom) */}
                                        {currentStep < 4 && isSelected && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '50%',
                                                width: '2px',
                                                height: '10px',
                                                background: '#3b82f6',
                                                transform: 'translateX(-50%)',
                                                opacity: 0.5
                                            }} />
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: isSelected ? 'white' : '#ddd' }}>
                                                {opt.name}
                                            </h3>
                                            {isSelected && (
                                                <div style={{ background: '#3b82f6', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Check size={12} color="white" strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#888', lineHeight: 1.5 }}>
                                            {opt.description}
                                        </p>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: isSelected ? '1px solid rgba(59,130,246,0.2)' : '1px solid #222' }}>
                                            <span style={{ fontSize: '12px', color: '#555', fontWeight: 600 }}>{opt.indexName}</span>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '15px', fontWeight: 700, color: '#eee', marginRight: '8px' }}>
                                                    {opt.indexValue.toLocaleString()}
                                                </span>
                                                <span style={{ fontSize: '13px', fontWeight: 600, color: isPositive ? '#ef4444' : '#3b82f6' }}>
                                                    {isPositive ? '▲' : '▼'} {Math.abs(opt.change)}%
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            }) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#444' }}>
                                    <Info style={{ margin: '0 auto 10px', display: 'block' }} />
                                    선택 가능한 옵션이 없습니다.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Draggable Bottom Sheet (Chat & Report) */}
            <motion.div
                drag="y"
                dragControls={sheetControls}
                dragConstraints={{ top: -600, bottom: 0 }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                    if (info.offset.y < -50 || (info.velocity.y < -300)) {
                        setIsSheetOpen(true)
                    } else if (info.offset.y > 50 || (info.velocity.y > 300)) {
                        setIsSheetOpen(false)
                    }
                }}
                initial="closed"
                animate={isSheetOpen ? "open" : "closed"}
                variants={{
                    open: { y: -500 },
                    closed: { y: 0 }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                style={{
                    position: 'absolute',
                    bottom: isSheetOpen ? 0 : '100px', // Sit above buttons when closed? No, let's fix it at bottom but above buttons layer
                    left: 0, 
                    right: 0,
                    height: '600px', // Tall enough
                    background: '#1a1a1a',
                    borderRadius: '24px 24px 0 0',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
                    zIndex: 40,
                    transform: 'translateY(85%)', // Initial peek state
                    touchAction: 'none'
                }}
            >
                {/* Handle */}
                <div 
                    onClick={() => setIsSheetOpen(!isSheetOpen)}
                    style={{ padding: '12px', display: 'flex', justifyContent: 'center', cursor: 'grab' }}
                >
                    <div style={{ width: '40px', height: '4px', background: '#444', borderRadius: '2px' }} />
                </div>

                {/* Content */}
                <div style={{ padding: '0 24px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <MessageCircle size={18} color="#3b82f6" />
                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>AI 분석 리포트</span>
                        {isSheetOpen ? <ChevronUp size={16} style={{ marginLeft: 'auto', transform: 'rotate(180deg)' }} /> : <ChevronUp size={16} style={{ marginLeft: 'auto' }} />}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', background: '#111', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.6 }}>
                            "현재 선택하신 <strong>{currentSelectedOption?.name || '...'}</strong> 단계에서는 
                            경쟁사 동향을 주의 깊게 보셔야 합니다. 특히 최근 수급이 집중되고 있어 
                            단기 변동성에 유의하세요."
                        </div>
                    </div>
                    
                    <button style={{ 
                        width: '100%', padding: '14px', 
                        background: '#333', border: 'none', 
                        borderRadius: '12px', color: '#fff', 
                        fontWeight: 600, fontSize: '13px' 
                    }}>
                        AI에게 자세히 물어보기...
                    </button>
                </div>
            </motion.div>

            {/* Footer Navigation (Fixed) */}
            <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '100%', 
                padding: '10px 24px 80px',
                background: 'linear-gradient(to top, #050505 80%, rgba(5,5,5,0))',
                zIndex: 50, // Highest z-index to stay on top
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                pointerEvents: isSheetOpen ? 'none' : 'auto', // Disable clicks when sheet is up? Or maybe just keep them clickable
                opacity: isSheetOpen ? 0.2 : 1,
                transition: 'opacity 0.2s'
            }}>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button 
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        style={{
                            height: '56px',
                            width: '56px',
                            borderRadius: '28px',
                            background: '#111',
                            border: '1px solid #333',
                            color: currentStep === 0 ? '#444' : 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    
                    <button 
                        onClick={nextStep}
                        disabled={currentStep === 4 && !selectedIds[4]} 
                        style={{
                            flex: 1,
                            height: '56px',
                            borderRadius: '28px',
                            background: currentStep === 4 ? '#3b82f6' : 'white',
                            color: currentStep === 4 ? 'white' : 'black',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}
                    >
                        {currentStep === 4 ? (
                            <>설정 완료 <Check size={20} /></>
                        ) : (
                            <>다음 단계 <ArrowRight size={20} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MobileBuilderStepper