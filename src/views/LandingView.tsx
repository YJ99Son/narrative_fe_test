import type { ViewState } from '../data'
import FloatingNav from '../components/FloatingNav'
import './Landing.css'

type LandingViewProps = {
  setView: (v: ViewState) => void
  current: ViewState
}

const LandingView = ({ setView, current }: LandingViewProps) => (
  <div className="landing-page">
    <nav className="landing-nav">
      <div className="landing-brand">
        NARRATIVE<span>FLOW</span>
      </div>
      <button onClick={() => setView('LOGIN')} className="landing-login-btn">로그인</button>
    </nav>

    <main className="landing-main">
      <span className="landing-subtitle">AI-POWERED INVESTING</span>
      <h1 className="landing-title">
        뉴스를 보지 말고,<br />
        <span className="text-gradient">흐름을 설계하세요.</span>
      </h1>
      <p className="landing-desc">
        복잡한 공시 정보와 뉴스, AI가 분석해 드립니다.<br />가장 설득력 있는 시나리오를 선택하고 수익을 추적하세요.
      </p>
      <div className="landing-cta-wrapper">
        <button onClick={() => setView('LOGIN')} className="landing-cta-btn">
          시나리오 설계 시작하기
        </button>
      </div>


    </main>
    <FloatingNav setView={setView} current={current} />
  </div>
)

export default LandingView
