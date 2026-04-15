/**
 * App — Root component with routing, progress provider, wallet provider, and layout.
 */

import { Routes, Route } from 'react-router-dom'
import { ProgressProvider } from './store/useProgress'
import { WalletProvider } from './store/useWallet'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import LessonsPage from './pages/LessonsPage'
import LessonPage from './pages/LessonPage'
import ChallengesPage from './pages/ChallengesPage'
import AchievementsPage from './pages/AchievementsPage'
import SmartContractPage from './pages/SmartContractPage'

export default function App() {
  return (
    <WalletProvider>
      <ProgressProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-[var(--color-bg-primary)] overflow-x-hidden w-full relative">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/smart-contract" element={<SmartContractPage />} />
            </Routes>
          </main>
        </div>
      </ProgressProvider>
    </WalletProvider>
  )
}
