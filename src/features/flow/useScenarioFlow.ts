import { useMemo, useState } from 'react'
import type { Option } from '../../data'
import { ALL_STEPS, STEP1_OPTIONS } from '../../data'

type UseScenarioFlowReturn = {
  selections: Record<string, string>
  activeOptionId: string | null
  activeOption: Option | null
  setActiveOptionId: (value: string | null) => void
  lastSelectedOption: Option
  currentProbability: number
  isStepVisible: (index: number) => boolean
  handleSelect: (stepId: string, optionId: string) => void
  confirmStep: (stepId: string) => void
  visibleOptionsByStep: (stepIndex: number) => Option[]
}

const useScenarioFlow = (): UseScenarioFlowReturn => {
  const [selections, setSelections] = useState<Record<string, string>>({
    step1: STEP1_OPTIONS?.[0]?.id || '',
  })
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null)

  const getOptionById = (optionId: string): Option | null => {
    for (const step of ALL_STEPS) {
      const found = step.options.find((opt) => opt.id === optionId)
      if (found) return found
    }
    return null
  }

  const lastSelectedOption = useMemo(() => {
    let found: Option | null = null
    for (let i = ALL_STEPS.length - 1; i >= 0; i--) {
      const step = ALL_STEPS[i]
      const selectedId = selections[step.id]
      if (selectedId) {
        found = getOptionById(selectedId)
        if (found) break
      }
    }
    return found || STEP1_OPTIONS[0]
  }, [selections])

  const activeOption = useMemo(() => {
    if (!activeOptionId) return null
    return getOptionById(activeOptionId)
  }, [activeOptionId])

  const currentProbability = useMemo(() => {
    const executedProbs: number[] = []
    ALL_STEPS.forEach((step) => {
      const selectedId = selections[step.id]
      if (selectedId) {
        const option = getOptionById(selectedId)
        if (option) executedProbs.push(option.probability)
      }
    })
    if (executedProbs.length === 0) return 0
    return Math.round(executedProbs.reduce((a, b) => a + b, 0) / executedProbs.length)
  }, [selections])

  const handleSelect = (stepId: string, optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [stepId]: optionId,
    }))
    setActiveOptionId(optionId)
  }

  const confirmStep = (stepId: string) => {
    setSelections((prev) => {
      const next = { ...prev }
      const stepIndex = ALL_STEPS.findIndex((s) => s.id === stepId)
      if (stepIndex < ALL_STEPS.length - 1) {
        for (let i = stepIndex + 1; i < ALL_STEPS.length; i++) {
          delete next[ALL_STEPS[i].id]
        }
      }
      return next
    })

    setTimeout(() => {
      const nextStepIndex = ALL_STEPS.findIndex((s) => s.id === stepId) + 1
      if (nextStepIndex < ALL_STEPS.length) {
        const nextElement = document.getElementById(`step-${ALL_STEPS[nextStepIndex].id}`)
        nextElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const isStepVisible = (stepIndex: number) => {
    if (stepIndex === 0) return true
    const prevStepId = ALL_STEPS[stepIndex - 1].id
    return Boolean(selections[prevStepId])
  }

  const visibleOptionsByStep = (stepIndex: number) => {
    const step = ALL_STEPS[stepIndex]
    if (!step) return []
    if (stepIndex === 0) return step.options
    const prevStepId = ALL_STEPS[stepIndex - 1].id
    const parentSelectionId = selections[prevStepId]
    return step.options.filter((opt) => !opt.parentId || opt.parentId === parentSelectionId)
  }

  return {
    selections,
    activeOptionId,
    activeOption,
    setActiveOptionId,
    lastSelectedOption,
    currentProbability,
    isStepVisible,
    handleSelect,
    confirmStep,
    visibleOptionsByStep,
  }
}

export default useScenarioFlow
