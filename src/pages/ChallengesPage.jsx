/**
 * ChallengesPage — Standalone coding challenges with fix/complete/optimize modes.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Swords, Zap, Bug, Puzzle, Gauge, CheckCircle2, ArrowRight, X, Trophy
} from 'lucide-react'
import { useProgress } from '../store/useProgress'
import { challenges } from '../data/lessons'
import CodeEditor from '../components/CodeEditor'

const typeConfig = {
  fix: { icon: Bug, label: 'Fix the Bug', color: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
  complete: { icon: Puzzle, label: 'Complete Logic', color: '#f59e0b', bg: 'rgba(249,115,22,0.06)' },
  optimize: { icon: Gauge, label: 'Optimize', color: '#8b5cf6', bg: 'rgba(139,92,246,0.06)' },
}

export default function ChallengesPage() {
  const { progress, completeChallenge, checkBadges } = useProgress()
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  function handleChallengeSuccess(challengeId, xpReward) {
    completeChallenge(challengeId, xpReward)
    checkBadges()
    setShowSuccess(true)
  }

  if (activeChallenge) {
    const challenge = challenges.find(c => c.id === activeChallenge)
    const isCompleted = progress.completedChallenges.includes(challenge.id)
    const config = typeConfig[challenge.type]
    const TypeIcon = config.icon

    return (
      <div className="min-h-screen pt-16">
        {/* Challenge Header */}
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-default)]">
          <div className="container-main py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setActiveChallenge(null); setShowSuccess(false) }}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.04)] transition-all bg-transparent border-none cursor-pointer"
                >
                  <X size={18} />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="badge" style={{ 
                      color: config.color, 
                      background: config.bg,
                      border: `1px solid ${config.color}33` 
                    }}>
                      <TypeIcon size={10} />
                      {config.label}
                    </span>
                    {isCompleted && (
                      <span className="badge badge-green">
                        <CheckCircle2 size={10} /> Done
                      </span>
                    )}
                  </div>
                  <h1 className="text-lg font-bold">{challenge.title}</h1>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Zap size={14} className="text-[var(--color-neon-orange)]" />
                <span className="font-semibold text-[var(--color-neon-orange)]">+{challenge.xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="container-main py-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-6 !bg-[rgba(255,255,255,0.02)]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
                style={{ background: config.bg }}>
                <TypeIcon size={20} style={{ color: config.color }} />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">{challenge.title}</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">{challenge.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CodeEditor
              starterCode={challenge.starterCode}
              validationKeywords={challenge.validationKeywords}
              hints={challenge.hints}
              onValidationSuccess={() => handleChallengeSuccess(challenge.id, challenge.xp)}
              lessonTitle={`challenge_${challenge.id}.rs`}
            />
          </motion.div>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)]"
              onClick={() => setShowSuccess(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="card !bg-[var(--color-bg-elevated)] !p-8 max-w-md w-full text-center neon-glow-purple"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                  className="text-6xl mb-4"
                >
                  ⚔️
                </motion.div>
                <h2 className="text-2xl font-bold mb-2 gradient-text">Challenge Complete!</h2>
                <p className="text-[var(--color-text-secondary)] mb-6">
                  You earned <strong className="text-[var(--color-neon-orange)]">+{challenge.xp} XP</strong>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setActiveChallenge(null); setShowSuccess(false) }}
                    className="btn-secondary flex-1"
                  >
                    Back to Challenges
                  </button>
                  <button
                    onClick={() => { setShowSuccess(false) }}
                    className="btn-primary flex-1"
                  >
                    <Trophy size={14} />
                    Review
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Challenge List View
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Swords size={32} className="text-[var(--color-neon-purple)]" />
            Challenge Mode
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Put your skills to the test with these coding challenges
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8 flex items-center gap-6"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-neon-cyan)]">
              {progress.completedChallenges.length}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Completed</div>
          </div>
          <div className="w-px h-8 bg-[var(--color-border-default)]" />
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-text-secondary)]">
              {challenges.length}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Total</div>
          </div>
          <div className="w-px h-8 bg-[var(--color-border-default)]" />
          <div className="flex-1">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(progress.completedChallenges.length / challenges.length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((challenge, i) => {
            const isCompleted = progress.completedChallenges.includes(challenge.id)
            const config = typeConfig[challenge.type]
            const TypeIcon = config.icon

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveChallenge(challenge.id)}
                className={`card card-interactive cursor-pointer
                  ${isCompleted ? '!border-[rgba(34,197,94,0.2)]' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: config.bg }}
                  >
                    <TypeIcon size={20} style={{ color: config.color }} />
                  </div>
                  {isCompleted ? (
                    <span className="badge badge-green">
                      <CheckCircle2 size={10} /> Done
                    </span>
                  ) : (
                    <span className="badge" style={{ 
                      color: config.color, background: config.bg, 
                      border: `1px solid ${config.color}22` 
                    }}>
                      {config.label}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold mb-1">{challenge.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-default)]">
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                    <span className={`badge ${challenge.level === 'beginner' ? 'badge-green' : challenge.level === 'intermediate' ? 'badge-orange' : 'badge-pink'} !text-[10px]`}>
                      {challenge.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Zap size={12} className="text-[var(--color-neon-orange)]" />
                    <span className="font-semibold text-[var(--color-neon-orange)]">+{challenge.xp}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
