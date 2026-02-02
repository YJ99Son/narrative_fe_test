import { ALL_STEPS } from '../../data'
import type { Option } from '../../data'
import { STEP_EXPLANATIONS } from './flowConfig'

type ScenarioFlowProps = {
  selections: Record<string, string>
  currentProbability: number
  isStepVisible: (index: number) => boolean
  visibleOptionsByStep: (index: number) => Option[]
  onSelect: (stepId: string, optionId: string) => void
  onConfirm: (stepId: string) => void
}

const ScenarioFlow = ({ selections, currentProbability, isStepVisible, visibleOptionsByStep, onSelect, onConfirm }: ScenarioFlowProps) => (
  <>
    <header className="top-bar">
      <div className="brand">
        NARRATIVE<span style={{ opacity: 0.3 }}>FLOW</span>
      </div>
      <div className="probability-meter">
        <span>현재 시나리오 적중 확률</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${currentProbability}%` }} />
        </div>
        <strong>{currentProbability}%</strong>
      </div>
    </header>

    <main className="main-stage">
      {ALL_STEPS.map((step, index) => {
        if (!isStepVisible(index)) return null

        const visibleOptions = visibleOptionsByStep(index)
        if (visibleOptions.length === 0) return null

        const selectedId = selections[step.id]

            return (
              <div key={step.id} id={`step-${step.id}`} className={`step-wrapper ${selectedId ? 'current' : ''}`}>
            <div className="step-header">
              <div>
                <div className="step-title">
                  <span className="step-index">{step.title}</span>
                  <h2>{step.question}</h2>
                </div>
                <p className="step-explain">{STEP_EXPLANATIONS[step.id]}</p>
              </div>
              <button
                className="step-confirm"
                type="button"
                onClick={() => onConfirm(step.id)}
                disabled={!selectedId}
              >
                선택 확정
              </button>
            </div>

            <section className="card-section">
              <div className="card-scroller">
                {visibleOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`option-card type-${option.type.toLowerCase()} ${selectedId === option.id ? 'selected' : ''}`}
                    onClick={() => onSelect(step.id, option.id)}
                  >
                    <div className="card-header">
                      <span className="card-tag">{option.badge}</span>
                      <span className="card-prob">{option.probability}%</span>
                    </div>
                    <div className="card-icon material-icons" style={{ fontSize: '36px', color: '#0f172a' }}>{option.icon}</div>
                    <h3 className="card-title">{option.title}</h3>
                    <p className="card-desc">{option.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )
      })}
    </main>
  </>
)

export default ScenarioFlow
