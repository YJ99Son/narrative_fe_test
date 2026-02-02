import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import BrandLogo from './components/BrandLogo'
import './Dashboard.css' // Re-using dashboard styles for consistency

interface LoginProps {
    onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
    const [userid, setUserid] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onLogin()
    }

    return (
        <div className="dash-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                border: '1px solid var(--dash-border)',
                background: 'var(--dash-surface)'
            }}>
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <div className="dash-brand" style={{ justifyContent: 'center', marginBottom: 16, display: 'flex' }}>
                        <BrandLogo size="lg" />
                    </div>
                    <div style={{ color: 'var(--dash-muted)', fontSize: 14 }}>
                        AI-Driven Investment Scenarios
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--dash-muted)' }}>ACCESS ID</label>
                        <input
                            type="text"
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                            placeholder="ENTER ID"
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'var(--dash-bg)',
                                border: '1px solid var(--dash-border)',
                                color: 'var(--dash-text)',
                                fontFamily: 'inherit',
                                fontSize: 14,
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--dash-muted)' }}>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="ENTER PASSWORD"
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'var(--dash-bg)',
                                border: '1px solid var(--dash-border)',
                                color: 'var(--dash-text)',
                                fontFamily: 'inherit',
                                fontSize: 14,
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: 12,
                            padding: '16px',
                            background: 'var(--dash-primary)',
                            color: 'white',
                            border: 'none',
                            fontSize: 14,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            transition: 'opacity 0.2s',
                            borderRadius: '9999px'
                        }}
                    >
                        로그인 <ArrowRight size={16} />
                    </button>
                </form>

                <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--dash-border)' }}>
                    SECURE CONNECTION // ENCRYPTED
                </div>
            </div>
        </div>
    )
}
