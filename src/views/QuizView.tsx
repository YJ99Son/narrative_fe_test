import { useState } from 'react'
import type { ViewState } from '../data'
// import FloatingNav from '../components/FloatingNav'
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, HelpCircle, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type QuizViewProps = {
    setView: (v: ViewState) => void
}

type Question = {
    id: number
    type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER'
    question: string
    options?: string[]
    answer: string
    explanation: string
}

const MOCK_QUIZ: Question[] = [
    {
        id: 1,
        type: 'MULTIPLE_CHOICE',
        question: '다음 중 "AI 슈퍼사이클"의 주요 수혜 섹터가 아닌 것은?',
        options: ['반도체 (HBM)', '전력 인프라', '전통 제조업 (철강)', '데이터센터 기술'],
        answer: '전통 제조업 (철강)',
        explanation: 'AI 산업 확장에 따라 반도체, 전력, 데이터센터가 핵심 수혜를 입습니다.'
    },
    {
        id: 2,
        type: 'SHORT_ANSWER',
        question: 'SK하이닉스가 세계 시장을 주도하고 있는 고대역폭 메모리의 약자는 무엇인가요? (영어 대문자 3글자)',
        answer: 'HBM',
        explanation: 'HBM (High Bandwidth Memory)은 AI 가속기에 필수적인 메모리 반도체입니다.'
    },
    {
        id: 3,
        type: 'MULTIPLE_CHOICE',
        question: '금리 인하 시기에 일반적으로 유리한 업종은?',
        options: ['은행', '보험', '바이오/성장주', '현금 보유'],
        answer: '바이오/성장주',
        explanation: '금리가 낮아지면 자금 조달 비용이 줄어들어 R&D 비중이 높은 바이오 등 성장주가 유리합니다.'
    },
    {
        id: 4,
        type: 'MULTIPLE_CHOICE',
        question: '반도체 후공정에서 칩을 쌓아 올리는 패키징 기술과 가장 관련 깊은 장비는?',
        options: ['노광 장비 (EUV)', 'TC 본더', '증착 장비', '세정 장비'],
        answer: 'TC 본더',
        explanation: 'TC 본더(Thermal Compression Bonder)는 HBM 등 적층 패키징에 필수적인 장비입니다.'
    }
]

const QuizView = ({ setView }: QuizViewProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [textAnswer, setTextAnswer] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [score, setScore] = useState(0)
    const [showResult, setShowResult] = useState(false)

    const currentQuestion = MOCK_QUIZ[currentIndex]
    const progress = ((currentIndex) / MOCK_QUIZ.length) * 100

    const handleSubmit = () => {
        if (isSubmitted) return

        let isCorrect = false
        if (currentQuestion.type === 'MULTIPLE_CHOICE') {
            if (selectedOption === currentQuestion.answer) isCorrect = true
        } else {
            if (textAnswer.trim().toUpperCase() === currentQuestion.answer) isCorrect = true
        }

        if (isCorrect) setScore(prev => prev + 1)
        setIsSubmitted(true)
    }

    const handleNext = () => {
        if (currentIndex < MOCK_QUIZ.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setSelectedOption(null)
            setTextAnswer('')
            setIsSubmitted(false)
        } else {
            setShowResult(true)
        }
    }

    const resetQuiz = () => {
        setCurrentIndex(0)
        setScore(0)
        setShowResult(false)
        setSelectedOption(null)
        setTextAnswer('')
        setIsSubmitted(false)
    }

    if (showResult) {
        return (
            <div style={{ background: 'var(--dash-bg)', minHeight: '100vh', color: 'var(--dash-text)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ background: 'var(--dash-surface)', padding: '60px', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--dash-border)', maxWidth: '500px', width: '90%' }}
                >
                    <Trophy size={64} color="#FBBF24" style={{ marginBottom: '24px' }} />
                    <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: 'var(--dash-text)' }}>퀴즈 완료!</h2>
                    <p style={{ color: 'var(--dash-muted)', marginBottom: '40px' }}>학습 내용을 얼마나 이해했는지 확인해보세요.</p>

                    <div style={{ fontSize: '64px', fontWeight: 800, color: 'var(--dash-primary)', marginBottom: '40px' }}>
                        {score} / {MOCK_QUIZ.length}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button onClick={() => setView('MYSCENARIOS')} style={{ padding: '16px 32px', borderRadius: '9999px', background: 'var(--dash-surface-highlight)', color: 'var(--dash-text)', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                            돌아가기
                        </button>
                        <button onClick={resetQuiz} style={{ padding: '16px 32px', borderRadius: '9999px', background: 'var(--dash-primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                            다시 풀기
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div style={{ background: 'var(--dash-bg)', minHeight: '100vh', color: 'var(--dash-text)', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button onClick={() => setView('MYSCENARIOS')} style={{ background: 'transparent', border: 'none', color: 'var(--dash-muted)', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ width: '100%', height: '4px', background: 'var(--dash-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{ height: '100%', background: 'var(--dash-primary)' }}
                    />
                </div>
                <div style={{ fontWeight: 700, minWidth: '60px', textAlign: 'right', color: 'var(--dash-text)' }}>문제 {currentIndex + 1}</div>
            </header>

            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: '100%', maxWidth: '600px' }}
                    >
                        <div style={{ marginBottom: '40px' }}>
                            <span style={{ fontSize: '14px', color: 'var(--dash-primary)', fontWeight: 700, marginBottom: '12px', display: 'block' }}>
                                {currentQuestion.type === 'MULTIPLE_CHOICE' ? '객관식 퀴즈' : '단답형 퀴즈'}
                            </span>
                            <h2 style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.4 }}>{currentQuestion.question}</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                            {currentQuestion.type === 'MULTIPLE_CHOICE' ? (
                                currentQuestion.options?.map((option, idx) => {
                                    const isSelected = selectedOption === option
                                    let borderColor = '#333'
                                    let bgColor = '#111'

                                    if (isSubmitted) {
                                        if (option === currentQuestion.answer) {
                                            borderColor = '#10B981' // Green
                                            bgColor = 'rgba(16, 185, 129, 0.1)'
                                        } else if (isSelected && option !== currentQuestion.answer) {
                                            borderColor = 'var(--dash-danger)' // Red
                                        }
                                    } else if (isSelected) {
                                        borderColor = 'var(--dash-primary)'
                                        bgColor = 'rgba(59, 130, 246, 0.1)'
                                    }

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => !isSubmitted && setSelectedOption(option)}
                                            style={{
                                                padding: '24px',
                                                border: borderColor === '#333' ? '1px solid transparent' : `1px solid ${borderColor}`,
                                                background: bgColor === '#111' ? 'var(--dash-surface)' : bgColor,
                                                borderRadius: '16px',
                                                cursor: isSubmitted ? 'default' : 'pointer',
                                                fontSize: '18px',
                                                fontWeight: 500,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {option}
                                            {isSubmitted && option === currentQuestion.answer && <CheckCircle size={20} color="#10B981" />}
                                            {isSubmitted && isSelected && option !== currentQuestion.answer && <XCircle size={20} color="var(--dash-danger)" />}
                                        </div>
                                    )
                                })
                            ) : (
                                <div>
                                    <input
                                        type="text"
                                        value={textAnswer}
                                        onChange={(e) => setTextAnswer(e.target.value)}
                                        placeholder="정답을 입력하세요"
                                        disabled={isSubmitted}
                                        style={{
                                            width: '100%',
                                            padding: '24px',
                                            background: 'var(--dash-surface)',
                                            border: `1px solid ${isSubmitted ? (textAnswer.trim().toUpperCase() === currentQuestion.answer ? '#10B981' : 'var(--dash-danger)') : 'var(--dash-border)'}`,
                                            borderRadius: '16px',
                                            color: 'var(--dash-text)',
                                            fontSize: '18px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    {isSubmitted && (
                                        <div style={{ marginTop: '16px', color: '#10B981', fontWeight: 600 }}>
                                            정답: {currentQuestion.answer}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {isSubmitted && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ background: 'var(--dash-surface)', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--dash-border)' }}
                            >
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', color: 'var(--dash-muted)', fontSize: '14px' }}>
                                    <HelpCircle size={16} /> 해설
                                </div>
                                <p style={{ lineHeight: 1.6, color: 'var(--dash-text)' }}>{currentQuestion.explanation}</p>
                            </motion.div>
                        )}

                        <button
                            onClick={isSubmitted ? handleNext : handleSubmit}
                            disabled={!isSubmitted && ((currentQuestion.type === 'MULTIPLE_CHOICE' && !selectedOption) || (currentQuestion.type === 'SHORT_ANSWER' && !textAnswer))}
                            style={{
                                width: '100%',
                                padding: '20px',
                                borderRadius: '9999px',
                                background: (!isSubmitted && ((currentQuestion.type === 'MULTIPLE_CHOICE' && !selectedOption) || (currentQuestion.type === 'SHORT_ANSWER' && !textAnswer))) ? 'var(--dash-surface-highlight)' : 'var(--dash-primary)',
                                color: (!isSubmitted && ((currentQuestion.type === 'MULTIPLE_CHOICE' && !selectedOption) || (currentQuestion.type === 'SHORT_ANSWER' && !textAnswer))) ? 'var(--dash-muted)' : 'white',
                                border: 'none',
                                fontSize: '18px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isSubmitted ? (currentIndex < MOCK_QUIZ.length - 1 ? '다음 문제' : '결과 보기') : '정답 확인'}
                            {isSubmitted && <ArrowRight size={20} />}
                        </button>

                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}

export default QuizView
