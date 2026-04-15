/**
 * Soroban Academy — Stellar Service Layer
 * Handles all Stellar/Soroban blockchain interactions.
 *
 * Wraps @stellar/stellar-sdk and @stellar/freighter-api to provide:
 *  - Freighter wallet connection & detection
 *  - Contract read queries (getChallenge, getTotalChallenges, etc.)
 *  - Contract invocations (createChallenge, joinChallenge, etc.)
 *  - Transaction assembly, simulation, and signing
 */

import * as StellarSdk from '@stellar/stellar-sdk'
import { isConnected as freighterIsConnected, requestAccess, signTransaction } from '@stellar/freighter-api'

// Polyfill Buffer for browser environments
import { Buffer } from 'buffer'
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer
}

// ── Network Configuration ──────────────────────────────────────────

const NETWORK = 'TESTNET'
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET
const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org'
const HORIZON_URL = 'https://horizon-testnet.stellar.org'

// Replace with your deployed contract ID (or leave empty for demo mode)
const CONTRACT_ID = ''

// ── Clients ────────────────────────────────────────────────────────

let rpcServer = null
let horizonServer = null

function getRpcServer() {
  if (!rpcServer) {
    rpcServer = new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL)
  }
  return rpcServer
}

function getHorizonServer() {
  if (!horizonServer) {
    horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL)
  }
  return horizonServer
}

// ── Wallet Helpers ─────────────────────────────────────────────────

/**
 * Check if Freighter browser extension is installed.
 */
export async function isFreighterInstalled() {
  try {
    const result = await freighterIsConnected()
    return result.isConnected || false
  } catch {
    return false
  }
}

/**
 * Connect to Freighter and return the user's public key.
 * Throws if Freighter is not installed or user declines.
 */
export async function connectWallet() {
  const installed = await isFreighterInstalled()
  if (!installed) {
    throw new Error('Freighter wallet extension is not installed. Please install it from freighter.app')
  }

  try {
    const accessResult = await requestAccess()
    if (accessResult.error) {
      throw new Error(accessResult.error)
    }
    return accessResult.address
  } catch (err) {
    throw new Error(`Failed to connect wallet: ${err.message}`)
  }
}

/**
 * Fetch the native XLM balance for a given public key.
 */
export async function getBalance(publicKey) {
  try {
    const server = getHorizonServer()
    const account = await server.loadAccount(publicKey)
    const nativeBalance = account.balances.find(b => b.asset_type === 'native')
    return nativeBalance ? parseFloat(nativeBalance.balance).toFixed(2) : '0.00'
  } catch (err) {
    if (err?.response?.status === 404) {
      return '0.00' // Account not funded
    }
    console.error('Failed to fetch balance:', err)
    return '—'
  }
}

/**
 * Fund a testnet account using Friendbot.
 */
export async function fundTestnetAccount(publicKey) {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`)
    if (!response.ok) throw new Error('Friendbot request failed')
    return true
  } catch (err) {
    console.error('Failed to fund account:', err)
    return false
  }
}

// ── Contract Interaction Helpers ───────────────────────────────────

/**
 * Check if a contract ID is configured.
 */
export function hasContractId() {
  return CONTRACT_ID && CONTRACT_ID.length > 0
}

/**
 * Get the configured contract ID.
 */
export function getContractId() {
  return CONTRACT_ID
}

/**
 * Build, simulate, and submit a contract invocation transaction.
 * Used for both read-only queries and state-changing calls.
 */
async function invokeContract(publicKey, method, args = [], readOnly = false) {
  if (!hasContractId()) {
    throw new Error('No contract ID configured. Deploy the contract first.')
  }

  const server = getRpcServer()
  const account = await server.getAccount(publicKey)

  const contract = new StellarSdk.Contract(CONTRACT_ID)

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build()

  // Simulate first
  const simulated = await server.simulateTransaction(tx)

  if (StellarSdk.SorobanRpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`)
  }

  if (readOnly) {
    // For read-only calls, return the simulation result
    if (simulated.result) {
      return simulated.result.retval
    }
    return null
  }

  // Prepare and sign for state-changing calls
  const prepared = StellarSdk.SorobanRpc.assembleTransaction(tx, simulated).build()

  const signResult = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    network: NETWORK,
  })

  if (signResult.error) {
    throw new Error(`Signing failed: ${signResult.error}`)
  }

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signResult.signedTxXdr,
    NETWORK_PASSPHRASE
  )

  const sendResponse = await server.sendTransaction(signedTx)

  if (sendResponse.status === 'ERROR') {
    throw new Error(`Transaction failed: ${sendResponse.errorResult}`)
  }

  // Poll for completion
  let result = sendResponse
  while (result.status === 'PENDING' || result.status === 'NOT_FOUND') {
    await new Promise(r => setTimeout(r, 2000))
    result = await server.getTransaction(sendResponse.hash)
  }

  if (result.status === 'SUCCESS') {
    return result.returnValue || true
  }

  throw new Error(`Transaction failed with status: ${result.status}`)
}

// ── Contract Read Functions ────────────────────────────────────────

/**
 * Get total number of challenges created.
 */
export async function getTotalChallenges(publicKey) {
  try {
    const result = await invokeContract(publicKey, 'get_total_challenges', [], true)
    return result ? Number(result.value()) : 0
  } catch (err) {
    console.error('getTotalChallenges error:', err)
    return null
  }
}

/**
 * Get platform fee in basis points.
 */
export async function getFeeBps(publicKey) {
  try {
    const result = await invokeContract(publicKey, 'get_fee_bps', [], true)
    return result ? Number(result.value()) : null
  } catch (err) {
    console.error('getFeeBps error:', err)
    return null
  }
}

/**
 * Get challenge details by ID.
 */
export async function getChallenge(publicKey, challengeId) {
  try {
    const args = [StellarSdk.xdr.ScVal.scvSymbol(challengeId)]
    const result = await invokeContract(publicKey, 'get_challenge', args, true)
    return result
  } catch (err) {
    console.error('getChallenge error:', err)
    return null
  }
}

/**
 * Get leaderboard entry for a user.
 */
export async function getLeaderboardEntry(publicKey, userAddress) {
  try {
    const args = [new StellarSdk.Address(userAddress).toScVal()]
    const result = await invokeContract(publicKey, 'get_leaderboard_entry', args, true)
    return result
  } catch (err) {
    console.error('getLeaderboardEntry error:', err)
    return null
  }
}

// ── Contract Write Functions ───────────────────────────────────────

/**
 * Create a new challenge with a stake amount.
 */
export async function createChallenge(publicKey, challengeId, stakeAmount) {
  const args = [
    new StellarSdk.Address(publicKey).toScVal(),
    StellarSdk.xdr.ScVal.scvSymbol(challengeId),
    StellarSdk.nativeToScVal(stakeAmount, { type: 'i128' }),
  ]
  return invokeContract(publicKey, 'create_challenge', args)
}

/**
 * Join an existing open challenge.
 */
export async function joinChallenge(publicKey, challengeId) {
  const args = [
    new StellarSdk.Address(publicKey).toScVal(),
    StellarSdk.xdr.ScVal.scvSymbol(challengeId),
  ]
  return invokeContract(publicKey, 'join_challenge', args)
}

/**
 * Cancel an open challenge (creator only).
 */
export async function cancelChallenge(publicKey, challengeId) {
  const args = [
    new StellarSdk.Address(publicKey).toScVal(),
    StellarSdk.xdr.ScVal.scvSymbol(challengeId),
  ]
  return invokeContract(publicKey, 'cancel_challenge', args)
}

// ── Network Info ───────────────────────────────────────────────────

export function getNetworkName() {
  return NETWORK
}

export function getNetworkPassphrase() {
  return NETWORK_PASSPHRASE
}

export function getRpcUrl() {
  return SOROBAN_RPC_URL
}
