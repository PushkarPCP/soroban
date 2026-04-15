/**
 * Navbar — Top navigation bar with progress indicators.
 * Shows XP, level, streak, and navigation links.
 */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Code2, Trophy, Zap, Flame, Menu, X, 
  LayoutDashboard, Swords, Home, FileCode2, Wallet 
} from 'lucide-react'
import { useProgress } from '../store/useProgress'
import { useWallet } from '../store/useWallet'

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lessons', label: 'Lessons', icon: BookOpen },
  { to: '/challenges', label: 'Challenges', icon: Swords },
  { to: '/smart-contract', label: 'Smart Contract', icon: FileCode2 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { progress, levelProgress: getLevelProgress } = useProgress()
  const { isConnected: walletConnected, truncatedAddress } = useWallet()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Code2 size={18} className="text-[#0a0a0f]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--color-text-primary)] hidden sm:block">
              Soroban<span className="gradient-text">Academy</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline
                    ${isActive 
                      ? 'text-[var(--color-neon-cyan)] bg-[rgba(0,245,255,0.08)]' 
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.04)]'
                    }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Stats Bar */}
          <div className="hidden md:flex items-center gap-4">
            {/* XP */}
            <div className="flex items-center gap-1.5 text-sm">
              <Zap size={14} className="text-[var(--color-neon-orange)]" />
              <span className="font-semibold text-[var(--color-neon-orange)]">{progress.xp}</span>
              <span className="text-[var(--color-text-muted)]">XP</span>
            </div>

            {/* Level */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-[#0a0a0f]">
                {progress.level}
              </div>
              <div className="w-16 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-purple)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${getLevelProgress(progress.xp)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 text-sm">
              <Flame size={14} className="text-[var(--color-neon-pink)]" />
              <span className="font-semibold text-[var(--color-neon-pink)]">{progress.currentStreak}</span>
            </div>

            {/* Wallet Indicator */}
            <div className="flex items-center gap-1.5 text-sm">
              <Wallet size={14} className={walletConnected ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'} />
              {walletConnected ? (
                <span className="font-mono text-xs text-[var(--color-success)]">{truncatedAddress}</span>
              ) : (
                <span className="text-xs text-[var(--color-text-muted)]">—</span>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.04)] border-none bg-transparent cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[var(--color-border-default)]"
          >
            <div className="container-main py-3 flex flex-col gap-1">
              {/* Mobile Stats */}
              <div className="flex items-center gap-4 py-2 px-3 mb-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                <div className="flex items-center gap-1.5 text-sm">
                  <Zap size={14} className="text-[var(--color-neon-orange)]" />
                  <span className="font-semibold text-[var(--color-neon-orange)]">{progress.xp} XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-[#0a0a0f]">
                    {progress.level}
                  </span>
                  <span className="text-[var(--color-text-muted)]">Level</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Flame size={14} className="text-[var(--color-neon-pink)]" />
                  <span className="font-semibold text-[var(--color-neon-pink)]">{progress.currentStreak} day</span>
                </div>
              </div>
              
              {navLinks.map(link => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all
                      ${isActive 
                        ? 'text-[var(--color-neon-cyan)] bg-[rgba(0,245,255,0.08)]' 
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
