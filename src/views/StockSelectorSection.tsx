import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, TrendingUp, Info } from 'lucide-react'
import { SCENARIO_DATA } from '../data/scenarioData'
import type { ScenarioOption } from '../data/scenarioData'

type StockEntryViewProps = {
    onSelect: (pathIds: string[]) => void
}

type FlatStock = {
    id: string
    name: string
    indexName: string
    indexValue: number
    change: number
    description: string
    path: ScenarioOption[] // [Macro, Sector, Theme, Stock]
}

const StockEntryView = ({ onSelect }: StockEntryViewProps) => {
    const [stocks, setStocks] = useState<FlatStock[]>([])
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Flatten Data to find all Stocks (Depth 3: Macro -> Sector -> Theme -> STOCK)
    useEffect(() => {
        const foundStocks: FlatStock[] = []

        const traverse = (node: ScenarioOption, path: ScenarioOption[], depth: number) => {
            const currentPath = [...path, node]
            if (depth === 3) {
                // This is a stock level node (Macro=0, Sector=1, Theme=2, Stock=3)
                foundStocks.push({
                    ...node,
                    path: currentPath
                })
                return
            }
            if (node.children) {
                node.children.forEach(child => traverse(child, currentPath, depth + 1))
            }
        }

        SCENARIO_DATA.forEach(macro => traverse(macro, [], 0))
        setStocks(foundStocks)
    }, [])

    const handleScroll = () => {
        if (!scrollRef.current) return
        const scrollLeft = scrollRef.current.scrollLeft
        const width = scrollRef.current.offsetWidth
        // Assuming each item is near full width or centered
        const index = Math.round(scrollLeft / (width * 0.7)) // Adjust factor based on card width
        if (index >= 0 && index < stocks.length && index !== activeIndex) {
            setActiveIndex(index)
        }
    }

    const scrollToStock = (index: number) => {
        if (!scrollRef.current) return
        const width = scrollRef.current.offsetWidth
        // Centering logic depends on card width (let's say 260px + gap)
        const cardWidth = 280
        const gap = 16
        const centerOffset = (width - cardWidth) / 2
        const pos = index * (cardWidth + gap) - centerOffset

        scrollRef.current.scrollTo({
            left: pos,
            behavior: 'smooth'
        })
        setActiveIndex(index)
    }

    // Initialize Scroll to Center first item
    useEffect(() => {
        if (stocks.length > 0) {
            setTimeout(() => scrollToStock(0), 100)
        }
    }, [stocks.length])

    if (stocks.length === 0) return <div>Loading...</div>

    const activeStock = stocks[activeIndex] || stocks[0]
    // Path: [Macro, Sector, Theme, Stock]
    // We want to show: Theme -> Sector -> Macro (Reverse context)
    const contextPath = activeStock.path.slice(0, 3).reverse()

    return (
        <div style={{
            height: '100vh',
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Header */}
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>
                    NARRATIVE<span style={{ opacity: 0.5 }}>FLOW</span>
                </div>
            </header>

            <div style={{ padding: '0 20px', marginBottom: '10px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', lineHeight: 1.3 }}>
                    어떤 종목의<br />
                    <span style={{ color: '#3b82f6' }}>이야기</span>가 궁금하신가요?
                </h1>
            </div>

            {/* Render Flow Connections (Background Lines) */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                {/* Visual lines can be added/animated here if needed */}
            </div>

            {/* STOCK CAROUSEL (Top Heavy) */}
            <div style={{ position: 'relative', zIndex: 10, paddingBottom: '20px' }}>
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    style={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: '16px',
                        padding: '20px calc(50% - 140px)', // Center the first card (280px / 2)
                        scrollSnapType: 'x mandatory',
                        scrollbarWidth: 'none',
                    }}
                >
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                    {stocks.map((stock, idx) => {
                        const isActive = idx === activeIndex
                        return (
                            <motion.div
                                key={stock.id}
                                onClick={() => scrollToStock(idx)}
                                animate={{
                                    scale: isActive ? 1.05 : 0.9,
                                    opacity: isActive ? 1 : 0.5,
                                    y: isActive ? 0 : 10
                                }}
                                style={{
                                    minWidth: '280px',
                                    scrollSnapAlign: 'center',
                                    background: isActive ? '#1a1a1a' : '#111',
                                    border: isActive ? '2px solid #3b82f6' : '1px solid #333',
                                    borderRadius: '20px',
                                    padding: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    boxShadow: isActive ? '0 10px 30px rgba(59,130,246,0.2)' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{stock.indexName}</div>
                                        <div style={{ fontSize: '22px', fontWeight: 700, color: 'white' }}>{stock.name}</div>
                                    </div>
                                    <div style={{
                                        background: stock.change >= 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                        color: stock.change >= 0 ? '#ef4444' : '#3b82f6',
                                        padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: 600
                                    }}>
                                        {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change)}%
                                    </div>
                                </div>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>
                                    {stock.indexValue.toLocaleString()}
                                </div>
                                <p style={{ fontSize: '14px', color: '#aaa', margin: 0, lineHeight: 1.5 }}>
                                    {stock.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* FLOW VISUALIZATION (Bottom Section) */}
            <div style={{
                flex: 1,
                position: 'relative',
                background: 'linear-gradient(to top, #000 0%, #050505 100%)',
                // padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Align items top
                zIndex: 5
            }}>
                <div style={{
                    position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                    width: '2px', height: '40px', background: 'linear-gradient(to bottom, #3b82f6, #333)'
                }} />

                <div style={{ padding: '0 30px', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                    <div style={{ color: '#666', fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>
                        WHY THIS STOCK?
                    </div>

                    {contextPath.map((node, i) => (
                        <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Connecting Line */}
                            {i > 0 && (
                                <motion.div
                                    initial={{ height: 0 }} animate={{ height: 20 }}
                                    style={{ width: '1px', background: '#333' }}
                                />
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    width: '100%',
                                    maxWidth: '320px',
                                    background: '#111',
                                    border: '1px dashed #333',
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    position: 'relative'
                                }}
                            >
                                <div style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: i === 0 ? '#a855f7' : (i === 1 ? '#10b981' : '#f59e0b') // Theme, Sector, Macro colors
                                }} />
                                <div>
                                    <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {i === 0 ? 'THEME' : (i === 1 ? 'SECTOR' : 'MACRO')}
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#ddd' }}>{node.name}</div>
                                </div>
                                <div style={{ marginLeft: 'auto', opacity: 0.3 }}>
                                    {i === 0 ? <TrendingUp size={16} /> : <Info size={16} />}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', padding: '20px 30px 40px' }}>
                    <button
                        onClick={() => {
                            // Pass selected IDs to Builder
                            if (!activeStock || !activeStock.path) return
                            const pathIds = activeStock.path.map(n => n.id)
                            onSelect(pathIds)
                        }}
                        style={{
                            width: '100%',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '16px',
                            borderRadius: '16px',
                            fontWeight: 700,
                            fontSize: '16px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        시나리오 확인하기 <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StockEntryView
