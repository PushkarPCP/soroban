/**
 * SmartContractPage — Interactive Stellar smart contract interface.
 * Allows users to connect their Freighter wallet, view contract state,
 * create/join/cancel challenges, and look up leaderboard entries.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet, Unplug, RefreshCw, Rocket, Shield, Trophy, Zap,
  Copy, Check, ExternalLink, AlertTriangle, Loader2,
  PlusCircle, LogIn, XCircle, Search, Database, Coins,
  FileCode2, Globe, Hash, ArrowRight, Sparkles, Info
} from 'lucide-react'
import { useWallet } from '../store/useWallet'
import {
  hasContractId, getContractId, getRpcUrl,
  getTotalChallenges, getFeeBps, getChallenge,
  getLeaderboardEntry, createChallenge, joinChallenge,
  cancelChallenge, fundTestnetAccount,
} from '../utils/stellarService'

// ── Subcomponents ──────────────────────────────────────────────────

function StatusDot({ color }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{
        background: color,
        boxShadow: `0 0 8px ${color}`,
      }}
    />
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md bg-transparent border-none cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] transition-colors"
      title="Copy"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="card flex flex-col items-center text-center gap-2 py-5">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}10`, border: `1px solid ${color}22` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">{label}</div>
      <div className="text-xl font-bold" style={{ color }}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : (value ?? '—')}
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────

export default function SmartContractPage() {
  const {
    walletAddress, truncatedAddress, balance, isConnected,
    isConnecting, error: walletError, hasFreighter, networkName,
    connect, disconnect, refreshBalance,
  } = useWallet()

  // Contract state
  const [totalChallenges, setTotalChallenges] = useState(null)
  const [feeBps, setFeeBps] = useState(null)
  const [loadingContract, setLoadingContract] = useState(false)

  // Challenge actions
  const [createId, setCreateId] = useState('')
  const [createStake, setCreateStake] = useState('')
  const [joinId, setJoinId] = useState('')
  const [cancelId, setCancelId] = useState('')
  const [lookupId, setLookupId] = useState('')
  const [challengeResult, setChallengeResult] = useState(null)

  // Leaderboard
  const [leaderboardAddress, setLeaderboardAddress] = useState('')
  const [leaderboardResult, setLeaderboardResult] = useState(null)

  // Action states
  const [actionLoading, setActionLoading] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)
  const [fundingAccount, setFundingAccount] = useState(false)

  // Active tab for challenge actions
  const [activeTab, setActiveTab] = useState('create')

  // Fetch contract data when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress && hasContractId()) {
      fetchContractData()
    }
  }, [isConnected, walletAddress]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchContractData() {
    setLoadingContract(true)
    try {
      const [total, fee] = await Promise.all([
        getTotalChallenges(walletAddress),
        getFeeBps(walletAddress),
      ])
      setTotalChallenges(total)
      setFeeBps(fee)
    } catch (err) {
      console.error('Failed to fetch contract data:', err)
    } finally {
      setLoadingContract(false)
    }
  }

  async function handleCreateChallenge(e) {
    e.preventDefault()
    if (!createId.trim() || !createStake.trim()) return
    setActionLoading('create')
    setActionMessage(null)
    try {
      const stakeStroops = Math.floor(parseFloat(createStake) * 10_000_000)
      await createChallenge(walletAddress, createId.trim(), stakeStroops)
      setActionMessage({ type: 'success', text: `Challenge "${createId}" created with ${createStake} XLM stake!` })
      setCreateId('')
      setCreateStake('')
      refreshBalance()
      fetchContractData()
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message })
    } finally {
      setActionLoading(null)
    }
  }

  async function handleJoinChallenge(e) {
    e.preventDefault()
    if (!joinId.trim()) return
    setActionLoading('join')
    setActionMessage(null)
    try {
      await joinChallenge(walletAddress, joinId.trim())
      setActionMessage({ type: 'success', text: `Successfully joined challenge "${joinId}"!` })
      setJoinId('')
      refreshBalance()
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message })
    } finally {
      setActionLoading(null)
    }
  }

  async function handleCancelChallenge(e) {
    e.preventDefault()
    if (!cancelId.trim()) return
    setActionLoading('cancel')
    setActionMessage(null)
    try {
      await cancelChallenge(walletAddress, cancelId.trim())
      setActionMessage({ type: 'success', text: `Challenge "${cancelId}" cancelled. Stake refunded.` })
      setCancelId('')
      refreshBalance()
      fetchContractData()
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message })
    } finally {
      setActionLoading(null)
    }
  }

  async function handleLookupChallenge(e) {
    e.preventDefault()
    if (!lookupId.trim()) return
    setActionLoading('lookup')
    setChallengeResult(null)
    try {
      const result = await getChallenge(walletAddress, lookupId.trim())
      setChallengeResult(result ? { found: true, data: result } : { found: false })
    } catch (err) {
      setChallengeResult({ found: false, error: err.message })
    } finally {
      setActionLoading(null)
    }
  }

  async function handleLeaderboardLookup(e) {
    e.preventDefault()
    const addr = leaderboardAddress.trim() || walletAddress
    if (!addr) return
    setActionLoading('leaderboard')
    setLeaderboardResult(null)
    try {
      const result = await getLeaderboardEntry(walletAddress, addr)
      setLeaderboardResult(result ? { found: true, data: result } : { found: false })
    } catch (err) {
      setLeaderboardResult({ found: false, error: err.message })
    } finally {
      setActionLoading(null)
    }
  }

  async function handleFundAccount() {
    if (!walletAddress) return
    setFundingAccount(true)
    try {
      const success = await fundTestnetAccount(walletAddress)
      if (success) {
        setActionMessage({ type: 'success', text: 'Account funded with 10,000 testnet XLM!' })
        refreshBalance()
      } else {
        setActionMessage({ type: 'error', text: 'Failed to fund account. Try again later.' })
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Friendbot error.' })
    } finally {
      setFundingAccount(false)
    }
  }

  const contractConfigured = hasContractId()

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-main">
        {/* ── Page Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <FileCode2 size={32} className="text-[var(--color-neon-cyan)]" />
            Smart Contract
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Connect your Stellar wallet and interact with the Soroban Academy contract on {networkName.toLowerCase()}
          </p>
        </motion.div>

        {/* ── Wallet Connection Panel ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card mb-6 neon-glow-cyan"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shrink-0">
                <Wallet size={24} className="text-[#0a0a0f]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold">Freighter Wallet</h2>
                  <StatusDot color={isConnected ? '#22c55e' : '#f59e0b'} />
                </div>
                {isConnected ? (
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-mono text-[var(--color-neon-cyan)]">{truncatedAddress}</span>
                    <CopyButton text={walletAddress} />
                    <span className="text-[var(--color-text-muted)]">•</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">{balance} XLM</span>
                    <button
                      onClick={refreshBalance}
                      className="p-1 rounded bg-transparent border-none cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] transition-colors"
                      title="Refresh balance"
                    >
                      <RefreshCw size={12} />
                    </button>
                    <span className="badge badge-cyan !text-[10px]">
                      <Globe size={8} />
                      {networkName}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {hasFreighter
                      ? 'Click Connect to link your Freighter wallet'
                      : 'Install the Freighter browser extension to connect'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isConnected ? (
                <>
                  <button
                    onClick={handleFundAccount}
                    disabled={fundingAccount}
                    className="btn-secondary !py-2 !px-3 !text-xs flex-1 sm:flex-none"
                  >
                    {fundingAccount ? <Loader2 size={12} className="animate-spin" /> : <Coins size={12} />}
                    Fund Testnet
                  </button>
                  <button onClick={disconnect} className="btn-secondary !py-2 !px-3 !text-xs flex-1 sm:flex-none !text-[var(--color-neon-pink)] !border-[rgba(236,72,153,0.3)] hover:!bg-[rgba(236,72,153,0.08)]">
                    <Unplug size={12} />
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={connect}
                  disabled={isConnecting || !hasFreighter}
                  className="btn-primary !py-2.5 !px-5 w-full sm:w-auto"
                >
                  {isConnecting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Wallet size={16} />
                  )}
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>

          {/* Wallet Error */}
          <AnimatePresence>
            {walletError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 rounded-xl bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] text-sm text-[#ef4444] flex items-start gap-2"
              >
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                {walletError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Not installed warning */}
          {!hasFreighter && !isConnected && (
            <div className="mt-4 p-3 rounded-xl bg-[rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.2)] text-sm text-[var(--color-neon-orange)] flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <div>
                Freighter wallet not detected.{' '}
                <a
                  href="https://www.freighter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold hover:text-[var(--color-neon-cyan)] transition-colors"
                >
                  Install Freighter →
                </a>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Action Message Toast ─────────────────────── */}
        <AnimatePresence>
          {actionMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl border text-sm flex items-start gap-2 ${
                actionMessage.type === 'success'
                  ? 'bg-[rgba(34,197,94,0.06)] border-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                  : 'bg-[rgba(239,68,68,0.06)] border-[rgba(239,68,68,0.2)] text-[#ef4444]'
              }`}
            >
              {actionMessage.type === 'success' ? <Check size={16} className="shrink-0 mt-0.5" /> : <AlertTriangle size={16} className="shrink-0 mt-0.5" />}
              <span className="flex-1">{actionMessage.text}</span>
              <button
                onClick={() => setActionMessage(null)}
                className="p-0.5 rounded bg-transparent border-none cursor-pointer text-inherit opacity-60 hover:opacity-100"
              >
                <XCircle size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Contract Dashboard ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Database size={20} className="text-[var(--color-neon-purple)]" />
            Contract Dashboard
          </h2>

          {!contractConfigured ? (
            <div className="card !bg-[rgba(255,255,255,0.02)] text-center py-10">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-secondary)]">
                No Contract Deployed
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto mb-4">
                Deploy the Soroban Academy contract to the Stellar testnet and add the contract ID in{' '}
                <code className="text-[var(--color-neon-cyan)] bg-[rgba(0,245,255,0.06)] px-1.5 py-0.5 rounded text-xs">stellarService.js</code>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
                <code className="bg-[rgba(255,255,255,0.04)] px-3 py-1.5 rounded-lg font-mono">
                  stellar contract deploy --wasm ... --network testnet
                </code>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Hash}
                label="Total Challenges"
                value={totalChallenges}
                color="var(--color-neon-cyan)"
                loading={loadingContract}
              />
              <StatCard
                icon={Coins}
                label="Platform Fee"
                value={feeBps !== null ? `${(feeBps / 100).toFixed(1)}%` : null}
                color="var(--color-neon-orange)"
                loading={loadingContract}
              />
              <StatCard
                icon={Globe}
                label="Network"
                value={networkName}
                color="var(--color-neon-purple)"
                loading={false}
              />
              <StatCard
                icon={Shield}
                label="Status"
                value={isConnected ? 'Connected' : 'Disconnected'}
                color={isConnected ? 'var(--color-success)' : 'var(--color-text-muted)'}
                loading={false}
              />
            </div>
          )}

          {/* Contract ID display */}
          {contractConfigured && (
            <div className="mt-4 card !py-3 !px-4 !bg-[rgba(255,255,255,0.02)] flex items-center gap-3 text-xs">
              <span className="text-[var(--color-text-muted)]">Contract ID:</span>
              <code className="font-mono text-[var(--color-neon-cyan)] truncate flex-1">{getContractId()}</code>
              <CopyButton text={getContractId()} />
              <a
                href={`https://stellar.expert/explorer/testnet/contract/${getContractId()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </motion.div>

        {/* ── Two-Column: Challenge Arena + Leaderboard ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge Arena (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Rocket size={20} className="text-[var(--color-neon-pink)]" />
              Challenge Arena
            </h2>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-1 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--color-border-default)]">
              {[
                { id: 'create', label: 'Create', icon: PlusCircle },
                { id: 'join', label: 'Join', icon: LogIn },
                { id: 'cancel', label: 'Cancel', icon: XCircle },
                { id: 'lookup', label: 'Lookup', icon: Search },
              ].map(tab => {
                const TabIcon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all bg-transparent border-none cursor-pointer
                      ${isActive
                        ? 'text-[var(--color-neon-cyan)] bg-[rgba(0,245,255,0.08)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                      }`}
                  >
                    <TabIcon size={14} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="card">
              {!isConnected ? (
                <div className="text-center py-8">
                  <Wallet size={32} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Connect your wallet to interact with challenges
                  </p>
                </div>
              ) : !contractConfigured ? (
                <div className="text-center py-8">
                  <FileCode2 size={32} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Deploy a contract to start using the Challenge Arena
                  </p>
                </div>
              ) : (
                <>
                  {/* Create Challenge */}
                  {activeTab === 'create' && (
                    <form onSubmit={handleCreateChallenge} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
                          Challenge ID
                        </label>
                        <input
                          type="text"
                          value={createId}
                          onChange={e => setCreateId(e.target.value)}
                          placeholder="e.g. CHAL001"
                          maxLength={9}
                          className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-active)] transition-colors font-mono"
                        />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Max 9 characters (Soroban symbol limit)</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
                          Stake Amount (XLM)
                        </label>
                        <input
                          type="number"
                          value={createStake}
                          onChange={e => setCreateStake(e.target.value)}
                          placeholder="10.00"
                          step="0.01"
                          min="0.01"
                          className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-active)] transition-colors font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={actionLoading === 'create' || !createId.trim() || !createStake.trim()}
                        className="btn-primary w-full !py-3"
                      >
                        {actionLoading === 'create' ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <PlusCircle size={16} />
                        )}
                        {actionLoading === 'create' ? 'Creating...' : 'Create Challenge'}
                      </button>
                    </form>
                  )}

                  {/* Join Challenge */}
                  {activeTab === 'join' && (
                    <form onSubmit={handleJoinChallenge} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
                          Challenge ID to Join
                        </label>
                        <input
                          type="text"
                          value={joinId}
                          onChange={e => setJoinId(e.target.value)}
                          placeholder="e.g. CHAL001"
                          maxLength={9}
                          className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-active)] transition-colors font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={actionLoading === 'join' || !joinId.trim()}
                        className="btn-success w-full !py-3"
                      >
                        {actionLoading === 'join' ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <LogIn size={16} />
                        )}
                        {actionLoading === 'join' ? 'Joining...' : 'Join Challenge'}
                      </button>
                    </form>
                  )}

                  {/* Cancel Challenge */}
                  {activeTab === 'cancel' && (
                    <form onSubmit={handleCancelChallenge} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
                          Challenge ID to Cancel
                        </label>
                        <input
                          type="text"
                          value={cancelId}
                          onChange={e => setCancelId(e.target.value)}
                          placeholder="e.g. CHAL001"
                          maxLength={9}
                          className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-active)] transition-colors font-mono"
                        />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Only open challenges can be cancelled by their creator</p>
                      </div>
                      <button
                        type="submit"
                        disabled={actionLoading === 'cancel' || !cancelId.trim()}
                        className="btn-danger w-full !py-3"
                      >
                        {actionLoading === 'cancel' ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <XCircle size={16} />
                        )}
                        {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel Challenge'}
                      </button>
                    </form>
                  )}

                  {/* Lookup Challenge */}
                  {activeTab === 'lookup' && (
                    <div className="space-y-4">
                      <form onSubmit={handleLookupChallenge} className="flex gap-2">
                        <input
                          type="text"
                          value={lookupId}
                          onChange={e => setLookupId(e.target.value)}
                          placeholder="Challenge ID"
                          maxLength={9}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-active)] transition-colors font-mono"
                        />
                        <button
                          type="submit"
                          disabled={actionLoading === 'lookup' || !lookupId.trim()}
                          className="btn-primary !py-2.5 !px-4"
                        >
                          {actionLoading === 'lookup' ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        </button>
                      </form>

                      {challengeResult && (
                        <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[var(--color-border-default)]">
                          {challengeResult.found ? (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-[var(--color-neon-cyan)]" />
                                <span className="font-semibold">Challenge Found</span>
                              </div>
                              <pre className="text-xs text-[var(--color-text-secondary)] font-mono bg-[rgba(0,0,0,0.2)] rounded-lg p-3 overflow-auto whitespace-pre-wrap">
                                {JSON.stringify(challengeResult.data, null, 2)}
                              </pre>
                            </div>
                          ) : (
                            <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                              <AlertTriangle size={14} />
                              {challengeResult.error || 'Challenge not found'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Leaderboard (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-[var(--color-neon-orange)]" />
              Leaderboard
            </h2>

            <div className="card">
              {!isConnected ? (
                <div className="text-center py-8">
                  <Trophy size={32} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Connect your wallet to view leaderboard stats
                  </p>
                </div>
              ) : !contractConfigured ? (
                <div className="text-center py-8">
                  <Trophy size={32} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Deploy a contract first
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleLeaderboardLookup} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        value={leaderboardAddress}
                        onChange={e => setLeaderboardAddress(e.target.value)}
                        placeholder={truncatedAddress || 'G...'}
                        className="w-full px-3 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-default)] text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-active)] transition-colors font-mono"
                      />
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Leave empty to look up your own stats</p>
                    </div>
                    <button
                      type="submit"
                      disabled={actionLoading === 'leaderboard'}
                      className="btn-secondary w-full !py-2.5"
                    >
                      {actionLoading === 'leaderboard' ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Search size={14} />
                      )}
                      Lookup Stats
                    </button>
                  </form>

                  {leaderboardResult && (
                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[var(--color-border-default)]">
                      {leaderboardResult.found ? (
                        <div className="space-y-3">
                          <div className="text-xs font-semibold text-[var(--color-neon-cyan)]">Player Stats</div>
                          <pre className="text-xs text-[var(--color-text-secondary)] font-mono bg-[rgba(0,0,0,0.2)] rounded-lg p-3 overflow-auto whitespace-pre-wrap">
                            {JSON.stringify(leaderboardResult.data, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                          <Info size={14} />
                          {leaderboardResult.error || 'No stats found for this address'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick info */}
                  <div className="pt-4 border-t border-[var(--color-border-default)]">
                    <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                      On-Chain Stats
                    </div>
                    <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-2">
                        <Zap size={12} className="text-[var(--color-neon-orange)]" />
                        XP earned from challenges
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy size={12} className="text-[var(--color-neon-cyan)]" />
                        Win/loss record
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight size={12} className="text-[var(--color-neon-purple)]" />
                        Total participation count
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Contract Info Footer ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 card !bg-[rgba(255,255,255,0.02)] !py-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[var(--color-neon-cyan)]" />
              <span>Soroban Academy Contract — Built on <strong className="text-[var(--color-text-secondary)]">Stellar</strong></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Globe size={12} />
                RPC: <code className="font-mono text-[var(--color-neon-cyan)]">{getRpcUrl().replace('https://', '')}</code>
              </span>
              <a
                href="https://soroban.stellar.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] transition-colors no-underline"
              >
                Docs <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
