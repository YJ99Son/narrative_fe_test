import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ViewState } from '../data'
import { Home, Layers, User, AlertCircle } from 'lucide-react'

type FloatingNavProps = {
  setView: (v: ViewState) => void
  current: ViewState
}

// Ensure the CSS is imported for glass effects if not already global
// import '../Dashboard.css' // Assuming the user has this globally or I'll add inline styles properly

const FloatingNav = ({ setView, current }: FloatingNavProps) => {
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  return (
    <>
      <div className="floating-nav">
        <button
          className={`nav-item ${current === 'LANDING' || current === 'DASHBOARD' ? 'active' : ''}`}
          onClick={() => {
            if (localStorage.getItem('narrative_session') === 'active') {
              setView('DASHBOARD')
            } else {
              setView('LANDING')
            }
          }}
          style={{ color: current === 'LANDING' || current === 'DASHBOARD' ? 'var(--dash-primary)' : 'var(--dash-muted)' }}
        >
          <Home size={18} />
          <span>HOME</span>
        </button>
        <button
          className={`nav-item ${current === 'BUILDER' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            const raw = localStorage.getItem('narrative_active_scenario');
            let hasValid = false;
            try {
              if (raw) {
                const parsed = JSON.parse(raw);
                // Check for stock info to consider it "selected"
                if (parsed && (parsed.stock || parsed.stockCode || parsed.stockName)) {
                  hasValid = true;
                }
              }
            } catch (e) { hasValid = false; }

            if (hasValid) {
              setView('PRESENTATION');
            } else {
              setShowToast(true);
            }
          }}
          style={{
            color: current === 'BUILDER' ? 'var(--dash-primary)' : 'var(--dash-muted)',
            opacity: current === 'BUILDER' ? 1 : 0.5
          }}
        >
          <Layers size={18} />
          <span>BUILDER</span>
        </button>
        <button
          className={`nav-item ${current === 'MYSCENARIOS' ? 'active' : ''}`}
          onClick={() => setView('MYSCENARIOS')}
          style={{ color: current === 'MYSCENARIOS' ? 'var(--dash-primary)' : 'var(--dash-muted)' }}
        >
          <User size={18} />
          <span>MY PAGE</span>
        </button>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{
              position: 'fixed',
              bottom: '120px',
              left: '50%',
              background: '#ffffff',
              backdropFilter: 'blur(20px)',
              padding: '16px 24px',
              borderRadius: '99px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              color: '#333333',
              fontSize: '14px',
              fontWeight: 600,
              zIndex: 10002,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              pointerEvents: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            <AlertCircle size={20} color="#3b82f6" />
            종목을 먼저 선택해 주세요.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingNav
