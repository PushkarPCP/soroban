/**
 * AchievementsPage — Progress dashboard with badges, stats, and skill breakdown.
 */

import { motion } from 'framer-motion'
import { 
  Trophy, Zap, Flame, Star, Target, Clock, Award, 
  BookOpen, Swords, TrendingUp, CheckCircle2, Crown
} from 'lucide-react'
import { useProgress } from '../store/useProgress'
import { lessons, challenges, BADGES, LEVELS } from '../data/lessons'

export default function AchievementsPage() {
  const { progress, levelProgress: getLevelProgress, xpToNextLevel, resetProgress } = useProgress()

  const totalLessons = lessons.length
  const totalChallenges = challenges.length
  const totalXpAvailable = [...lessons, ...challenges].reduce((sum, l) => sum + l.xp, 0)
  
  // Time since joining
  const daysSinceJoin = Math.max(1, Math.floor((Date.now() - new Date(progress.joinDate).getTime()) / (1000 * 60 * 60 * 24)))

  // Stats cards
  const statCards = [
    { label: 'Total XP', value: progress.xp, max: totalXpAvailable, icon: Zap, color: 'var(--color-neon-orange)', subtitle: `of ${totalXpAvailable}` },
    { label: 'Level', value: progress.level, max: 10, icon: Star, color: 'var(--color-neon-cyan)', subtitle: `${Math.round(getLevelProgress(progress.xp))}% to next` },
    { label: 'Lessons Done', value: progress.completedLessons.length, max: totalLessons, icon: BookOpen, color: 'var(--color-neon-purple)', subtitle: `of ${totalLessons}` },
    { label: 'Challenges Done', value: progress.completedChallenges.length, max: totalChallenges, icon: Swords, color: 'var(--color-neon-pink)', subtitle: `of ${totalChallenges}` },
    { label: 'Current Streak', value: progress.currentStreak, icon: Flame, color: '#f43f5e', subtitle: `Best: ${progress.longestStreak}` },
    { label: 'Badges Earned', value: progress.unlockedBadges.length, max: BADGES.length, icon: Trophy, color: '#f59e0b', subtitle: `of ${BADGES.length}` },
  ]

  // Level breakdown
  const levelStats = LEVELS.map(level => {
    const levelLessons = lessons.filter(l => l.level === level.id)
    const completed = levelLessons.filter(l => progress.completedLessons.includes(l.id))
    return {
      ...level,
      total: levelLessons.length,
      completed: completed.length,
      xpEarned: completed.reduce((sum, l) => sum + l.xp, 0),
      totalXp: levelLessons.reduce((sum, l) => sum + l.xp, 0),
    }
  })

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgba(249,115,22,0.12)] to-[rgba(168,85,247,0.12)] border border-[rgba(249,115,22,0.2)] mb-4"
          >
            <Trophy size={32} className="text-[var(--color-neon-orange)]" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your <span className="gradient-text">Achievements</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Day {daysSinceJoin} of your Soroban journey
          </p>
        </motion.div>

        {/* Level Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8 gradient-border"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-black text-[#0a0a0f] shrink-0">
              {progress.level}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold mb-1">
                Level {progress.level} Developer
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                {xpToNextLevel(progress.xp)} XP to reach Level {progress.level + 1}
              </p>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${getLevelProgress(progress.xp)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
                <span>{progress.xp} XP</span>
                <span>{progress.xp + xpToNextLevel(progress.xp)} XP</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="card text-center"
              >
                <Icon size={24} style={{ color: stat.color }} className="mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</div>
                {stat.subtitle && (
                  <div className="text-[10px] text-[var(--color-text-muted)] mt-1 opacity-60">
                    {stat.subtitle}
                  </div>
                )}
                {stat.max && (
                  <div className="mt-2 h-1 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: stat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (stat.value / stat.max) * 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award size={22} className="text-[var(--color-neon-orange)]" />
            Badges — {progress.unlockedBadges.length}/{BADGES.length}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BADGES.map((badge, i) => {
              const unlocked = progress.unlockedBadges.includes(badge.id)
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className={`p-4 rounded-xl text-center transition-all border
                    ${unlocked 
                      ? 'bg-[rgba(249,115,22,0.06)] border-[rgba(249,115,22,0.15)]' 
                      : 'bg-[rgba(255,255,255,0.01)] border-[var(--color-border-default)] opacity-40'
                    }`}
                >
                  <div className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <h3 className="text-sm font-semibold mb-0.5">{badge.name}</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] leading-tight">
                    {badge.description}
                  </p>
                  {unlocked && (
                    <div className="mt-2">
                      <span className="badge badge-green !text-[9px] !py-0">
                        <CheckCircle2 size={8} /> Unlocked
                      </span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Level Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={22} className="text-[var(--color-neon-cyan)]" />
            Level Breakdown
          </h2>

          <div className="space-y-4">
            {levelStats.map((level, i) => (
              <div key={level.id} className="flex items-center gap-4">
                <div className="text-2xl">{level.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold" style={{ color: level.color }}>
                      {level.name}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {level.completed}/{level.total} lessons • {level.xpEarned}/{level.totalXp} XP
                    </span>
                  </div>
                  <div className="h-2 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: level.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${level.total > 0 ? (level.completed / level.total) * 100 : 0}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reset Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <button
            onClick={() => {
              if (window.confirm('⚠️ Are you sure you want to reset ALL progress? This cannot be undone!')) {
                resetProgress()
              }
            }}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors bg-transparent border-none cursor-pointer"
          >
            Reset All Progress
          </button>
        </motion.div>
      </div>
    </div>
  )
}
