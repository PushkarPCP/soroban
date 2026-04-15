/**
 * Dashboard — Main learning hub showing progress, recent activity, and quick access.
 */

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Zap, Flame, BookOpen, Trophy, Target, Clock, 
  ArrowRight, Star, TrendingUp, CheckCircle2, Lock
} from 'lucide-react'
import { useProgress } from '../store/useProgress'
import { lessons, BADGES } from '../data/lessons'

export default function Dashboard() {
  const { progress, levelProgress: getLevelProgress, xpToNextLevel } = useProgress()
  
  const totalLessons = lessons.length
  const completedCount = progress.completedLessons.length
  const overallProgress = Math.round((completedCount / totalLessons) * 100)
  
  // Find next lesson to resume
  const nextLesson = lessons.find(l => !progress.completedLessons.includes(l.id))

  // Group lessons by level
  const beginnerLessons = lessons.filter(l => l.level === 'beginner')
  const intermediateLessons = lessons.filter(l => l.level === 'intermediate')
  const advancedLessons = lessons.filter(l => l.level === 'advanced')

  // Skill breakdown
  const skills = [
    { name: 'Rust Basics', total: beginnerLessons.length, done: beginnerLessons.filter(l => progress.completedLessons.includes(l.id)).length, color: '#22c55e' },
    { name: 'Soroban Core', total: intermediateLessons.length, done: intermediateLessons.filter(l => progress.completedLessons.includes(l.id)).length, color: '#f59e0b' },
    { name: 'Advanced', total: advancedLessons.length, done: advancedLessons.filter(l => progress.completedLessons.includes(l.id)).length, color: '#ef4444' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{progress.username || 'Developer'}</span> 👋
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {completedCount === 0 
              ? "Let's begin your Soroban journey!" 
              : `You've completed ${completedCount} of ${totalLessons} lessons. Keep going!`
            }
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total XP', value: progress.xp, icon: Zap, color: 'var(--color-neon-orange)', bg: 'rgba(249,115,22,0.06)' },
            { label: 'Level', value: progress.level, icon: Star, color: 'var(--color-neon-cyan)', bg: 'rgba(0,245,255,0.06)' },
            { label: 'Streak', value: `${progress.currentStreak}`, icon: Flame, color: 'var(--color-neon-pink)', bg: 'rgba(236,72,153,0.06)' },
            { label: 'Badges', value: progress.unlockedBadges.length, icon: Trophy, color: 'var(--color-neon-purple)', bg: 'rgba(168,85,247,0.06)' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: stat.bg }}
                  >
                    <Icon size={20} style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Progress & Resume */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* XP Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp size={18} className="text-[var(--color-neon-cyan)]" />
                  Level Progress
                </h2>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {xpToNextLevel(progress.xp)} XP to next level
                </span>
              </div>
              <div className="progress-bar mb-2">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${getLevelProgress(progress.xp)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                <span>Level {progress.level}</span>
                <span>Level {progress.level + 1}</span>
              </div>
            </motion.div>

            {/* Continue Learning */}
            {nextLesson && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link to={`/lesson/${nextLesson.id}`} className="no-underline block">
                  <div className="card card-interactive gradient-border !p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="badge badge-cyan mb-2 inline-flex">
                          {nextLesson.level === 'beginner' ? '🌱' : nextLesson.level === 'intermediate' ? '⚡' : '🔥'}
                          {nextLesson.level}
                        </span>
                        <h3 className="text-xl font-bold mb-1">{nextLesson.title}</h3>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {nextLesson.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-text-muted)]">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {nextLesson.estimatedMinutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap size={12} className="text-[var(--color-neon-orange)]" /> +{nextLesson.xp} XP
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(0,245,255,0.08)] shrink-0">
                        <ArrowRight size={20} className="text-[var(--color-neon-cyan)]" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Overall Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target size={18} className="text-[var(--color-neon-purple)]" />
                Course Progress — {overallProgress}%
              </h2>
              <div className="progress-bar mb-6">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
              
              <div className="space-y-3">
                {lessons.map((lesson, i) => {
                  const isCompleted = progress.completedLessons.includes(lesson.id)
                  const isNext = nextLesson?.id === lesson.id
                  const isLocked = !isCompleted && !isNext && i > 0 && !progress.completedLessons.includes(lessons[i-1]?.id)
                  
                  return (
                    <Link
                      key={lesson.id}
                      to={isLocked ? '#' : `/lesson/${lesson.id}`}
                      className={`no-underline flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                        ${isCompleted 
                          ? 'bg-[rgba(34,197,94,0.06)]' 
                          : isNext 
                            ? 'bg-[rgba(0,245,255,0.06)] border border-[rgba(0,245,255,0.15)]'
                            : isLocked
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:bg-[rgba(255,255,255,0.02)]'
                        }`}
                      onClick={e => isLocked && e.preventDefault()}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold
                        ${isCompleted 
                          ? 'bg-[rgba(34,197,94,0.15)] text-[var(--color-success)]'
                          : isNext 
                            ? 'bg-[rgba(0,245,255,0.15)] text-[var(--color-neon-cyan)]'
                            : 'bg-[rgba(255,255,255,0.04)] text-[var(--color-text-muted)]'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={16} /> : isLocked ? <Lock size={14} /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                          {lesson.title}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {lesson.level} • {lesson.estimatedMinutes} min • +{lesson.xp} XP
                        </div>
                      </div>
                      {isCompleted && progress.lessonScores[lesson.id] && (
                        <span className="badge badge-green text-[10px]">
                          {progress.lessonScores[lesson.id].score}%
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column — Skills & Badges */}
          <div className="flex flex-col gap-6">
            {/* Skill Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-[var(--color-neon-cyan)]" />
                Skill Breakdown
              </h2>
              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[var(--color-text-secondary)]">{skill.name}</span>
                      <span className="font-mono text-xs" style={{ color: skill.color }}>
                        {skill.done}/{skill.total}
                      </span>
                    </div>
                    <div className="h-2 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: skill.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.done / skill.total) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy size={18} className="text-[var(--color-neon-orange)]" />
                  Badges
                </h2>
                <Link to="/achievements" className="text-xs text-[var(--color-neon-cyan)] no-underline hover:underline">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {BADGES.slice(0, 8).map((badge) => {
                  const unlocked = progress.unlockedBadges.includes(badge.id)
                  return (
                    <div
                      key={badge.id}
                      className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all
                        ${unlocked 
                          ? 'bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.2)] animate-glow-pulse' 
                          : 'bg-[rgba(255,255,255,0.02)] border border-[var(--color-border-default)] opacity-30 grayscale'
                        }`}
                      title={`${badge.name}: ${badge.description}`}
                    >
                      {badge.icon}
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Streak Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card !bg-gradient-to-br !from-[rgba(236,72,153,0.08)] !to-[rgba(168,85,247,0.08)] !border-[rgba(236,72,153,0.15)]"
            >
              <div className="text-center">
                <Flame size={28} className="text-[var(--color-neon-pink)] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[var(--color-neon-pink)]">
                  {progress.currentStreak}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">Day Streak</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-2">
                  Best: {progress.longestStreak} days
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
