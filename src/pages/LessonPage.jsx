/**
 * LessonPage — Individual lesson view with theory + coding playground.
 * Shows concept explanation on left, Monaco editor on right (desktop).
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, BookOpen, Code2, Zap, Clock, 
  CheckCircle, ChevronRight, Trophy, Sparkles
} from 'lucide-react'
import { useProgress } from '../store/useProgress'
import { lessons, BADGES } from '../data/lessons'
import CodeEditor from '../components/CodeEditor'

export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { progress, completeLesson, checkBadges } = useProgress()
  
  const [activeTab, setActiveTab] = useState('theory') // 'theory' | 'code'
  const [showComplete, setShowComplete] = useState(false)
  const [newBadges, setNewBadges] = useState([])
  
  const lesson = lessons.find(l => l.id === lessonId)
  const lessonIndex = lessons.findIndex(l => l.id === lessonId)
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null
  const isCompleted = progress.completedLessons.includes(lessonId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [lessonId])

  if (!lesson) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
          <Link to="/lessons" className="text-[var(--color-neon-cyan)]">← Back to lessons</Link>
        </div>
      </div>
    )
  }

  /**
   * Called when the user successfully validates their code.
   */
  function handleValidationSuccess(score) {
    completeLesson(lesson.id, lesson.xp, score)
    const earned = checkBadges()
    setNewBadges(earned)
    setShowComplete(true)
  }

  /**
   * Renders markdown-like theory content with basic formatting.
   */
  function renderTheory(content) {
    const lines = content.trim().split('\n')
    const elements = []
    let inCodeBlock = false
    let codeLines = []
    let codeLanguage = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={i} className="bg-[rgba(0,0,0,0.4)] rounded-lg p-4 my-3 overflow-x-auto text-sm font-mono border border-[var(--color-border-default)]">
              <code>{codeLines.join('\n')}</code>
            </pre>
          )
          codeLines = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
          codeLanguage = line.trim().replace('```', '')
        }
        continue
      }
      
      if (inCodeBlock) {
        codeLines.push(line)
        continue
      }
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold mt-6 mb-3 gradient-text">{line.slice(2)}</h2>)
        continue
      }
      if (line.startsWith('## ')) {
        elements.push(<h3 key={i} className="text-xl font-bold mt-5 mb-2 text-[var(--color-text-primary)]">{line.slice(3)}</h3>)
        continue
      }
      if (line.startsWith('### ')) {
        elements.push(<h4 key={i} className="text-lg font-semibold mt-4 mb-2 text-[var(--color-neon-cyan)]">{line.slice(4)}</h4>)
        continue
      }
      
      // Lists
      if (line.trim().startsWith('- ')) {
        const content = line.trim().slice(2)
        elements.push(
          <div key={i} className="flex items-start gap-2 my-1 ml-2">
            <ChevronRight size={14} className="text-[var(--color-neon-cyan)] mt-1 shrink-0" />
            <span className="text-[var(--color-text-secondary)] text-sm leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: formatInline(content) }}
            />
          </div>
        )
        continue
      }
      
      // Empty lines
      if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />)
        continue
      }
      
      // Regular paragraph
      elements.push(
        <p key={i} className="text-[var(--color-text-secondary)] text-sm leading-relaxed my-1.5"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      )
    }
    
    return elements
  }

  /**
   * Simple inline markdown formatting.
   */
  function formatInline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--color-text-primary)] font-semibold">$1</strong>')
      .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-[rgba(0,245,255,0.08)] text-[var(--color-neon-cyan)] text-xs font-mono">$1</code>')
      .replace(/✅/g, '<span class="text-[var(--color-success)]">✅</span>')
      .replace(/❌/g, '<span class="text-[var(--color-error)]">❌</span>')
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Lesson Header */}
      <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-default)]">
        <div className="container-main py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Link to="/lessons" className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.04)] transition-all no-underline">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`badge ${lesson.level === 'beginner' ? 'badge-green' : lesson.level === 'intermediate' ? 'badge-orange' : 'badge-pink'}`}>
                    {lesson.level === 'beginner' ? '🌱' : lesson.level === 'intermediate' ? '⚡' : '🔥'}
                    {lesson.level}
                  </span>
                  {isCompleted && (
                    <span className="badge badge-green">
                      <CheckCircle size={10} /> Completed
                    </span>
                  )}
                </div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight">{lesson.title}</h1>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {lesson.estimatedMinutes} min
              </span>
              <span className="flex items-center gap-1">
                <Zap size={14} className="text-[var(--color-neon-orange)]" /> +{lesson.xp} XP
              </span>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex gap-2 mt-3 lg:hidden">
            <button
              onClick={() => setActiveTab('theory')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all border-none cursor-pointer
                ${activeTab === 'theory' 
                  ? 'bg-[rgba(0,245,255,0.08)] text-[var(--color-neon-cyan)]' 
                  : 'bg-transparent text-[var(--color-text-muted)]'
                }`}
            >
              <BookOpen size={14} className="inline mr-1.5" />
              Theory
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all border-none cursor-pointer
                ${activeTab === 'code' 
                  ? 'bg-[rgba(0,245,255,0.08)] text-[var(--color-neon-cyan)]' 
                  : 'bg-transparent text-[var(--color-text-muted)]'
                }`}
            >
              <Code2 size={14} className="inline mr-1.5" />
              Code Editor
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-main py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theory Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${activeTab === 'code' ? 'hidden lg:block' : ''}`}
          >
            <div className="card lg:!max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--color-border-default)]">
                <BookOpen size={18} className="text-[var(--color-neon-cyan)]" />
                <span className="font-semibold">Concept</span>
              </div>
              <div className="prose-content">
                {renderTheory(lesson.theory)}
              </div>
            </div>
          </motion.div>

          {/* Code Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${activeTab === 'theory' ? 'hidden lg:block' : ''}`}
          >
            <CodeEditor
              starterCode={lesson.starterCode}
              validationKeywords={lesson.validationKeywords}
              solution={lesson.solution}
              hints={lesson.hints}
              onValidationSuccess={handleValidationSuccess}
              lessonTitle={`${lesson.title}.rs`}
            />
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[var(--color-border-default)]">
          {prevLesson ? (
            <Link to={`/lesson/${prevLesson.id}`} className="btn-secondary !py-2 no-underline text-xs sm:text-sm text-center">
              <ArrowLeft size={14} />
              <span className="truncate max-w-[120px] sm:max-w-none">{prevLesson.title}</span>
            </Link>
          ) : <div />}

          {nextLesson ? (
            <Link to={`/lesson/${nextLesson.id}`} className="btn-secondary !py-2 no-underline text-xs sm:text-sm text-center">
              <span className="truncate max-w-[120px] sm:max-w-none">{nextLesson.title}</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link to="/challenges" className="btn-primary !py-2 no-underline">
              Try Challenges
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)]"
            onClick={() => setShowComplete(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="card !bg-[var(--color-bg-elevated)] !p-8 max-w-md w-full text-center neon-glow-cyan"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 gradient-text">Lesson Complete!</h2>
              <p className="text-[var(--color-text-secondary)] mb-4">
                You earned <strong className="text-[var(--color-neon-orange)]">+{lesson.xp} XP</strong>
              </p>
              
              {newBadges.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-[rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.15)]">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles size={16} className="text-[var(--color-neon-orange)]" />
                    <span className="text-sm font-semibold text-[var(--color-neon-orange)]">New Badge Unlocked!</span>
                  </div>
                  <div className="flex justify-center gap-3">
                    {newBadges.map(id => {
                      const badge = BADGES.find(b => b.id === id)
                      return badge ? (
                        <div key={id} className="text-center">
                          <div className="text-3xl mb-1">{badge.icon}</div>
                          <div className="text-xs text-[var(--color-text-secondary)]">{badge.name}</div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowComplete(false)} 
                  className="btn-secondary flex-1"
                >
                  Review
                </button>
                {nextLesson ? (
                  <button
                    onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                    className="btn-primary flex-1"
                  >
                    Next Lesson
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/achievements')}
                    className="btn-primary flex-1"
                  >
                    <Trophy size={14} />
                    View Achievements
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
