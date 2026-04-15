/**
 * LessonsPage — Browse all available lessons grouped by difficulty level.
 */

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Clock, Zap, CheckCircle2, Lock, ArrowRight, BookOpen, ChevronDown
} from 'lucide-react'
import { useProgress } from '../store/useProgress'
import { lessons, LEVELS } from '../data/lessons'
import { useState } from 'react'

export default function LessonsPage() {
  const { progress } = useProgress()
  const [expandedLevel, setExpandedLevel] = useState('beginner')

  // Group lessons by level
  const grouped = LEVELS.map(level => ({
    ...level,
    lessons: lessons.filter(l => l.level === level.id).sort((a, b) => a.order - b.order),
  }))

  function isLessonUnlocked(lesson) {
    if (progress.completedLessons.includes(lesson.id)) return true
    const levelLessons = lessons.filter(l => l.level === lesson.level).sort((a, b) => a.order - b.order)
    const idx = levelLessons.findIndex(l => l.id === lesson.id)
    if (idx === 0) {
      // First lesson in level — check if previous level is complete
      if (lesson.level === 'beginner') return true
      const prevLevel = lesson.level === 'intermediate' ? 'beginner' : 'intermediate'
      const prevLessons = lessons.filter(l => l.level === prevLevel)
      return prevLessons.every(l => progress.completedLessons.includes(l.id))
    }
    // Must complete previous lesson in same level
    return progress.completedLessons.includes(levelLessons[idx - 1].id)
  }

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
            <BookOpen size={32} className="text-[var(--color-neon-cyan)]" />
            Lessons
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Master Soroban smart contract development step by step
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="flex-1">
            <div className="text-sm text-[var(--color-text-muted)] mb-1">Overall Progress</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(progress.completedLessons.length / lessons.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-mono text-[var(--color-neon-cyan)]">
                {progress.completedLessons.length}/{lessons.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap size={16} className="text-[var(--color-neon-orange)]" />
            <span className="font-semibold text-[var(--color-neon-orange)]">{progress.xp}</span>
            <span className="text-[var(--color-text-muted)]">Total XP</span>
          </div>
        </motion.div>

        {/* Level Groups */}
        <div className="space-y-6">
          {grouped.map((group, gi) => {
            const completedInLevel = group.lessons.filter(l => progress.completedLessons.includes(l.id)).length
            const isExpanded = expandedLevel === group.id
            
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.15 }}
              >
                {/* Level Header */}
                <button
                  onClick={() => setExpandedLevel(isExpanded ? null : group.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-default)] cursor-pointer hover:border-[var(--color-border-hover)] transition-all"
                  style={{ borderLeftColor: group.color, borderLeftWidth: '3px' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.icon}</span>
                    <div className="text-left">
                      <h2 className="text-lg font-bold" style={{ color: group.color }}>
                        {group.name}
                      </h2>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {group.description} • {completedInLevel}/{group.lessons.length} completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block w-24 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${(completedInLevel / group.lessons.length) * 100}%`,
                          background: group.color 
                        }}
                      />
                    </div>
                    <ChevronDown 
                      size={18} 
                      className={`text-[var(--color-text-muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-3 pl-4 sm:pl-8"
                  >
                    {group.lessons.map((lesson, li) => {
                      const isCompleted = progress.completedLessons.includes(lesson.id)
                      const isUnlocked = isLessonUnlocked(lesson)
                      const score = progress.lessonScores[lesson.id]
                      
                      return (
                        <Link
                          key={lesson.id}
                          to={isUnlocked ? `/lesson/${lesson.id}` : '#'}
                          onClick={e => !isUnlocked && e.preventDefault()}
                          className="no-underline block"
                        >
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: li * 0.05 }}
                            className={`card card-interactive flex items-center gap-4 !p-4
                              ${isCompleted 
                                ? '!border-[rgba(34,197,94,0.2)] !bg-[rgba(34,197,94,0.03)]' 
                                : !isUnlocked 
                                  ? 'opacity-50 cursor-not-allowed !hover:transform-none' 
                                  : ''
                              }`}
                          >
                            {/* Order Number */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold
                              ${isCompleted 
                                ? 'bg-[rgba(34,197,94,0.12)] text-[var(--color-success)]' 
                                : isUnlocked 
                                  ? 'bg-[rgba(0,245,255,0.08)]' 
                                  : 'bg-[rgba(255,255,255,0.03)]'
                              }`}
                              style={!isCompleted && isUnlocked ? { color: group.color } : {}}
                            >
                              {isCompleted ? <CheckCircle2 size={18} /> : !isUnlocked ? <Lock size={16} /> : lesson.order}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold truncate">{lesson.title}</h3>
                              <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                                {lesson.description}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-text-muted)]">
                                <span className="flex items-center gap-1">
                                  <Clock size={10} /> {lesson.estimatedMinutes} min
                                </span>
                                <span className="flex items-center gap-1">
                                  <Zap size={10} className="text-[var(--color-neon-orange)]" /> +{lesson.xp} XP
                                </span>
                                {score && (
                                  <span className="badge badge-green !text-[10px] !py-0">
                                    Score: {score.score}%
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Arrow */}
                            {isUnlocked && (
                              <ArrowRight size={16} className="text-[var(--color-text-muted)] shrink-0" />
                            )}
                          </motion.div>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
