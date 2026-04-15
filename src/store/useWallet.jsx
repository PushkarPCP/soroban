/**
 * Soroban Academy — Wallet Store
 * React context for managing Stellar wallet connection state.
 *
 * Provides:
 *  - walletAddress, isConnected, balance, networkName
 *  - connectWallet() / disconnectWallet() actions
 *  - Auto-reconnect on page reload
 *  - Loading & error states
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  connectWallet as connectFreighter,
  getBalance,
  getNetworkName,
  isFreighterInstalled,
} from '../utils/stellarService'

const WALLET_STORAGE_KEY = 'soroban_academy_wallet'

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null)
  const [balance, setBalance] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [hasFreighter, setHasFreighter] = useState(false)

  const networkName = getNetworkName()

  // Check if Freighter is installed on mount
  useEffect(() => {
    isFreighterInstalled().then(setHasFreighter)
  }, [])

  // Auto-reconnect if previously connected
  useEffect(() => {
    const saved = localStorage.getItem(WALLET_STORAGE_KEY)
    if (saved) {
      reconnect(saved)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function reconnect(address) {
    try {
      setWalletAddress(address)
      setIsConnected(true)
      const bal = await getBalance(address)
      setBalance(bal)
    } catch {
      // Silent fail on reconnect — user can manually reconnect
      localStorage.removeItem(WALLET_STORAGE_KEY)
    }
  }

  /**
   * Connect to Freighter wallet.
   */
  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const address = await connectFreighter()
      setWalletAddress(address)
      setIsConnected(true)
      localStorage.setItem(WALLET_STORAGE_KEY, address)

      // Fetch balance
      const bal = await getBalance(address)
      setBalance(bal)
    } catch (err) {
      setError(err.message)
      setIsConnected(false)
      setWalletAddress(null)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  /**
   * Disconnect wallet.
   */
  const disconnect = useCallback(() => {
    setWalletAddress(null)
    setIsConnected(false)
    setBalance(null)
    setError(null)
    localStorage.removeItem(WALLET_STORAGE_KEY)
  }, [])

  /**
   * Refresh the wallet balance.
   */
  const refreshBalance = useCallback(async () => {
    if (!walletAddress) return
    try {
      const bal = await getBalance(walletAddress)
      setBalance(bal)
    } catch {
      // Silent
    }
  }, [walletAddress])

  /**
   * Truncate address for display: GABC...XYZ
   */
  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null

  const value = {
    walletAddress,
    truncatedAddress,
    balance,
    isConnected,
    isConnecting,
    error,
    hasFreighter,
    networkName,
    connect,
    disconnect,
    refreshBalance,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

/**
 * Hook to access wallet state and actions.
 */
export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
