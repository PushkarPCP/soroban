/**
 * Soroban Academy — User Progress Store
 * Manages user XP, completed lessons, badges, streaks, and achievements.
 * Uses localStorage for persistence (can be swapped with Firebase/MongoDB).
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { BADGES } from '../data/lessons'

const STORAGE_KEY = 'soroban_academy_progress'

// Default user profile
const defaultProgress = {
  username: 'SorobanDev',
  xp: 0,
  level: 1,
  completedLessons: [],
  completedChallenges: [],
  unlockedBadges: [],
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  perfectScores: 0,
  totalTimeSpent: 0, // in minutes
  lessonScores: {}, // lessonId -> { score: 0-100, attempts: N, bestTime: seconds }
  joinDate: new Date().toISOString(),
}

const ProgressContext = createContext(null)

/**
 * Calculates the user's display level based on total XP.
 * Levels follow an exponential curve for satisfying progression.
 */
function calculateLevel(xp) {
  if (xp < 100) return 1
  if (xp < 300) return 2
  if (xp < 600) return 3
  if (xp < 1000) return 4
  if (xp < 1500) return 5
  if (xp < 2200) return 6
  if (xp < 3000) return 7
  if (xp < 4000) return 8
  if (xp < 5500) return 9
  return 10
}

/**
 * Returns the XP threshold for a given level.
 */
function xpForLevel(level) {
  const thresholds = [0, 0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500]
  return thresholds[level] || 5500
}

/**
 * XP needed to reach the next level.
 */
function xpToNextLevel(xp) {
  const currentLevel = calculateLevel(xp)
  const nextThreshold = xpForLevel(currentLevel + 1)
  return nextThreshold - xp
}

/**
 * Progress percentage within current level.
 */
function levelProgress(xp) {
  const currentLevel = calculateLevel(xp)
  const currentThreshold = xpForLevel(currentLevel)
  const nextThreshold = xpForLevel(currentLevel + 1)
  const range = nextThreshold - currentThreshold
  if (range <= 0) return 100
  return Math.min(100, ((xp - currentThreshold) / range) * 100)
}

/**
 * Checks if a streak should continue or reset based on last active date.
 */
function checkStreak(lastActiveDate) {
  if (!lastActiveDate) return { streak: 0, isNewDay: true }
  
  const last = new Date(lastActiveDate)
  const now = new Date()
  const diffHours = (now - last) / (1000 * 60 * 60)
  
  if (diffHours < 24) {
    return { streak: 'maintain', isNewDay: false }
  } else if (diffHours < 48) {
    return { streak: 'increment', isNewDay: true }
  } else {
    return { streak: 'reset', isNewDay: true }
  }
}

/**
 * ProgressProvider — wraps the app and provides user progress state.
 */
export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...defaultProgress, ...parsed }
      }
    } catch (e) {
      console.error('Failed to load progress:', e)
    }
    return { ...defaultProgress }
  })

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch (e) {
      console.error('Failed to save progress:', e)
    }
  }, [progress])

  // Update streak on app load
  useEffect(() => {
    const { streak, isNewDay } = checkStreak(progress.lastActiveDate)
    if (isNewDay) {
      setProgress(prev => {
        let newStreak = prev.currentStreak
        if (streak === 'increment') {
          newStreak = prev.currentStreak + 1
        } else if (streak === 'reset') {
          newStreak = 1
        } else {
          newStreak = 1
        }
        return {
          ...prev,
          currentStreak: newStreak,
          longestStreak: Math.max(prev.longestStreak, newStreak),
          lastActiveDate: new Date().toISOString(),
        }
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Marks a lesson as completed and awards XP.
   */
  const completeLesson = useCallback((lessonId, xpReward, score = 100, timeSpent = 0) => {
    setProgress(prev => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId)
      const newXp = alreadyCompleted ? prev.xp : prev.xp + xpReward
      const newCompleted = alreadyCompleted 
        ? prev.completedLessons 
        : [...prev.completedLessons, lessonId]
      const newPerfect = score === 100 && !alreadyCompleted 
        ? prev.perfectScores + 1 
        : prev.perfectScores
      
      const newScores = {
        ...prev.lessonScores,
        [lessonId]: {
          score: Math.max(score, prev.lessonScores[lessonId]?.score || 0),
          attempts: (prev.lessonScores[lessonId]?.attempts || 0) + 1,
          bestTime: Math.min(timeSpent || Infinity, prev.lessonScores[lessonId]?.bestTime || Infinity),
        }
      }

      return {
        ...prev,
        xp: newXp,
        level: calculateLevel(newXp),
        completedLessons: newCompleted,
        perfectScores: newPerfect,
        totalTimeSpent: prev.totalTimeSpent + timeSpent,
        lessonScores: newScores,
        lastActiveDate: new Date().toISOString(),
      }
    })
  }, [])

  /**
   * Marks a challenge as completed and awards XP.
   */
  const completeChallenge = useCallback((challengeId, xpReward) => {
    setProgress(prev => {
      if (prev.completedChallenges.includes(challengeId)) return prev
      const newXp = prev.xp + xpReward
      return {
        ...prev,
        xp: newXp,
        level: calculateLevel(newXp),
        completedChallenges: [...prev.completedChallenges, challengeId],
        lastActiveDate: new Date().toISOString(),
      }
    })
  }, [])

  /**
   * Unlocks a badge if not already unlocked.
   */
  const unlockBadge = useCallback((badgeId) => {
    setProgress(prev => {
      if (prev.unlockedBadges.includes(badgeId)) return prev
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId],
      }
    })
  }, [])

  /**
   * Checks and awards badges based on current progress.
   */
  const checkBadges = useCallback(() => {
    const earned = []
    
    // First Step — complete 1 lesson
    if (progress.completedLessons.length >= 1 && !progress.unlockedBadges.includes('first_step')) {
      earned.push('first_step')
    }
    
    // Rust Rookie — complete all beginner lessons
    const beginnerLessons = ['intro-rust', 'rust-structs', 'first-soroban', 'error-handling']
    if (beginnerLessons.every(l => progress.completedLessons.includes(l)) && 
        !progress.unlockedBadges.includes('rust_rookie')) {
      earned.push('rust_rookie')
    }
    
    // Code Warrior — complete 5 challenges
    if (progress.completedChallenges.length >= 5 && !progress.unlockedBadges.includes('code_warrior')) {
      earned.push('code_warrior')
    }
    
    // Soroban Dev — complete intermediate
    const intermediateLessons = ['soroban-storage', 'soroban-auth', 'soroban-events', 'soroban-testing']
    if (intermediateLessons.every(l => progress.completedLessons.includes(l)) && 
        !progress.unlockedBadges.includes('soroban_dev')) {
      earned.push('soroban_dev')
    }
    
    // Streak Master
    if (progress.currentStreak >= 7 && !progress.unlockedBadges.includes('streak_master')) {
      earned.push('streak_master')
    }
    
    // Perfectionist
    if (progress.perfectScores >= 3 && !progress.unlockedBadges.includes('perfectionist')) {
      earned.push('perfectionist')
    }
    
    // Blockchain Sage — complete all advanced
    const advancedLessons = ['token-contract', 'cross-contract', 'advanced-patterns']
    if (advancedLessons.every(l => progress.completedLessons.includes(l)) && 
        !progress.unlockedBadges.includes('blockchain_sage')) {
      earned.push('blockchain_sage')
    }
    
    earned.forEach(b => unlockBadge(b))
    return earned
  }, [progress, unlockBadge])

  /**
   * Resets all progress (with confirmation).
   */
  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress, joinDate: new Date().toISOString() })
  }, [])

  const value = {
    progress,
    completeLesson,
    completeChallenge,
    unlockBadge,
    checkBadges,
    resetProgress,
    calculateLevel,
    xpForLevel,
    xpToNextLevel,
    levelProgress,
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

/**
 * Hook to access user progress state and actions.
 */
export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}

export { calculateLevel, xpForLevel, xpToNextLevel, levelProgress }
