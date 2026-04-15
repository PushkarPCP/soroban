/**
 * Landing Page — Hero section with animated intro and CTAs.
 * First impression page with feature highlights and social proof.
 */

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Rocket, Code2, Trophy, BookOpen, Zap, Shield, 
  ArrowRight, Star, Users, GitBranch, ChevronRight, Wallet
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Interactive Lessons',
    description: 'Step-by-step tutorials with rich theory alongside hands-on coding exercises.',
    color: 'var(--color-neon-cyan)',
    bg: 'rgba(0, 245, 255, 0.06)',
  },
  {
    icon: Code2,
    title: 'Live Code Editor',
    description: 'Write real Rust smart contracts with syntax highlighting and instant validation.',
    color: 'var(--color-neon-purple)',
    bg: 'rgba(168, 85, 247, 0.06)',
  },
  {
    icon: Trophy,
    title: 'Gamified Progression',
    description: 'Earn XP, unlock badges, maintain streaks, and rise through the levels.',
    color: 'var(--color-neon-orange)',
    bg: 'rgba(249, 115, 22, 0.06)',
  },
  {
    icon: Shield,
    title: 'Real-World Patterns',
    description: 'Learn production patterns: auth, storage, cross-contract calls, and more.',
    color: 'var(--color-neon-pink)',
    bg: 'rgba(236, 72, 153, 0.06)',
  },
  {
    icon: Zap,
    title: 'Challenge Mode',
    description: 'Fix bugs, complete logic, and optimize contracts in timed challenges.',
    color: 'var(--color-success)',
    bg: 'rgba(34, 197, 94, 0.06)',
  },
  {
    icon: GitBranch,
    title: 'Soroban Ecosystem',
    description: 'Built specifically for Stellar Soroban — the next-gen smart contracts platform.',
    color: 'var(--color-neon-blue)',
    bg: 'rgba(59, 130, 246, 0.06)',
  },
  {
    icon: Wallet,
    title: 'Stellar Integration',
    description: 'Connect your Freighter wallet and interact with real smart contracts on the Stellar testnet.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.06)',
  },
]

const levels = [
  { name: 'Beginner', icon: '🌱', lessons: 4, color: '#22c55e', topics: ['Rust fundamentals', 'Your first contract', 'Error handling'] },
  { name: 'Intermediate', icon: '⚡', lessons: 4, color: '#f59e0b', topics: ['Storage & state', 'Authentication', 'Events', 'Testing'] },
  { name: 'Advanced', icon: '🔥', lessons: 3, color: '#ef4444', topics: ['Token contracts', 'Cross-contract calls', 'Design patterns'] },
]

const stats = [
  { value: '11+', label: 'Lessons' },
  { value: '3', label: 'Challenges' },
  { value: '8', label: 'Badges' },
  { value: '∞', label: 'Potential' },
  { value: '⭐', label: 'Stellar' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-12 sm:pt-32 md:pt-40 md:pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-[var(--color-neon-cyan)] rounded-full blur-[200px] opacity-[0.04]" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-[var(--color-neon-purple)] rounded-full blur-[200px] opacity-[0.04]" />
        
        <div className="container-main relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,245,255,0.06)] border border-[rgba(0,245,255,0.15)] text-sm text-[var(--color-neon-cyan)] mb-6"
            >
              <Star size={14} className="shrink-0" />
              <span className="text-xs sm:text-sm">The #1 Way to Learn Soroban Development</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-4 sm:mb-6"
            >
              Master{' '}
              <span className="gradient-text">Soroban</span>
              <br />
              Smart Contracts
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2"
            >
              Learn to write <strong className="text-[var(--color-text-primary)]">Rust smart contracts</strong> on the Stellar network through{' '}
              <strong className="text-[var(--color-neon-cyan)]">gamified, interactive</strong> coding challenges.
              From zero to deployed — all in your browser.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/lessons" className="no-underline w-full sm:w-auto">
                <button className="btn-primary w-full sm:w-auto !px-6 sm:!px-8 !py-3 sm:!py-3.5 text-sm sm:text-base">
                  <Rocket size={18} />
                  Start Learning
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/dashboard" className="no-underline w-full sm:w-auto">
                <button className="btn-secondary w-full sm:w-auto !px-6 sm:!px-8 !py-3 sm:!py-3.5 text-sm sm:text-base">
                  View Dashboard
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--color-border-default)]"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="card !p-0 overflow-hidden neon-glow-cyan">
              {/* Editor top bar */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[rgba(0,0,0,0.3)] border-b border-[var(--color-border-default)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs text-[var(--color-text-muted)] font-mono">hello_soroban.rs</span>
              </div>
              <pre className="p-3 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto m-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                <code>
{`use soroban_sdk::{contract, contractimpl, Env, String};

`}<span className="text-[var(--color-neon-purple)]">#[contract]</span>{`
`}<span className="text-[var(--color-neon-cyan)]">pub struct</span>{` HelloContract;

`}<span className="text-[var(--color-neon-purple)]">#[contractimpl]</span>{`
`}<span className="text-[var(--color-neon-cyan)]">impl</span>{` HelloContract {
    `}<span className="text-[var(--color-neon-cyan)]">pub fn</span>{` `}<span className="text-[var(--color-neon-orange)]">hello</span>{`(env: Env) -> String {
        String::from_str(&env, `}<span className="text-[var(--color-success)]">"Hello, Soroban! 🚀"</span>{`)
    }
}`}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-20 bg-[var(--color-bg-secondary)]">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Build on Soroban</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              A complete learning platform designed for developers, by developers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card card-interactive"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: feature.bg, border: `1px solid ${feature.color}22` }}
                  >
                    <Icon size={20} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Your Learning <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Progress through three levels of mastery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {levels.map((level, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card text-center"
              >
                <div className="text-4xl mb-3">{level.icon}</div>
                <h3 className="text-xl font-bold mb-1" style={{ color: level.color }}>
                  {level.name}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  {level.lessons} lessons
                </p>
                <ul className="text-sm text-[var(--color-text-secondary)] space-y-1.5 text-left list-none p-0">
                  {level.topics.map((topic, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <ChevronRight size={12} style={{ color: level.color }} />
                      {topic}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[var(--color-bg-secondary)]">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Build the Future?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
              Start writing smart contracts on Stellar today. No setup required, no prerequisites — just you and your code.
            </p>
            <Link to="/lessons" className="no-underline">
              <button className="btn-primary w-full sm:w-auto !px-8 sm:!px-10 !py-3.5 sm:!py-4 text-base sm:text-lg">
                <Rocket size={20} />
                Begin Your Journey
                <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border-default)]">
        <div className="container-main text-center text-sm text-[var(--color-text-muted)]">
          <p>
            Built with ❤️ for the{' '}
            <span className="text-[var(--color-neon-cyan)]">Stellar</span>{' '}
            community •{' '}
            <span className="gradient-text font-medium">Soroban Academy</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
