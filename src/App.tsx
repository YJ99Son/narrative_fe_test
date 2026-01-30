import { useState } from 'react'
import './App.css'
import type { ViewState } from './data'
import LandingView from './views/LandingView'
import BuilderView from './views/BuilderView'
import MyScenariosView from './views/MyScenariosView'
import QuizView from './views/QuizView'
import Login from './Login'
import Dashboard from './Dashboard'

import PresentationView from './views/PresentationView'

const App = () => {
  const [view, setView] = useState<ViewState>('LANDING')

  // EFFECT: Check for session persistence on mount
  useState(() => {
    const savedSession = localStorage.getItem('narrative_session')
    if (savedSession === 'active') {
      setView('DASHBOARD')
    }
  })

  const handleLogin = () => {
    localStorage.setItem('narrative_session', 'active')
    setView('DASHBOARD')
  }

  if (view === 'LANDING') {
    return <LandingView setView={setView} current={view} />
  }

  if (view === 'LOGIN') {
    return <Login onLogin={handleLogin} />
  }

  if (view === 'DASHBOARD') {
    return <Dashboard setView={setView} />
  }

  if (view === 'MYSCENARIOS') {
    return <MyScenariosView setView={setView} current={view} />
  }

  if (view === 'QUIZ') {
    return <QuizView setView={setView} />
  }

  if (view === 'PRESENTATION') {
    return <PresentationView setView={setView} current={view} />
  }

  return <BuilderView setView={setView} current={view} />
}

export default App
