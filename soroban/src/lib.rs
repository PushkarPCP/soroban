#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, Symbol, Vec,
    symbol_short, log,
};

// ============================================================
//  Soroban Academy — Smart Contract
//  ─────────────────────────────────
//  A full-featured example contract for the Stellar Soroban
//  learning platform. Demonstrates:
//    • Contract initialization & admin patterns
//    • Persistent & instance storage
//    • Token interactions (SAC / Stellar Asset Contract)
//    • Authentication & authorization
//    • Event emission
//    • Error handling best practices
//
//  Build:   stellar contract build
//  Test:    cargo test
//  Deploy:  stellar contract deploy \
//             --wasm target/wasm32-unknown-unknown/release/soroban_academy_contract.wasm \
//             --network testnet
// ============================================================

// ── Storage keys ────────────────────────────────────────────

const ADMIN: Symbol    = symbol_short!("ADMIN");
const TOKEN: Symbol    = symbol_short!("TOKEN");
const FEE_BPS: Symbol  = symbol_short!("FEE_BPS");
const COUNTER: Symbol  = symbol_short!("COUNTER");

// ── Data types ──────────────────────────────────────────────

/// Status of a lesson escrow / challenge
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ChallengeStatus {
    /// Open for participants
    Open,
    /// Challenge is in progress
    Active,
    /// Challenge completed — winner decided
    Completed,
    /// Challenge cancelled — funds refunded
    Cancelled,
    /// Draw — all participants refunded
    Draw,
}

/// On-chain record for a single challenge
#[contracttype]
#[derive(Clone)]
pub struct Challenge {
    /// Unique challenge identifier
    pub challenge_id: Symbol,
    /// Challenge creator
    pub creator: Address,
    /// Participant who joined (set on join)
    pub participant: Address,
    /// Stake amount in stroops (1 XLM = 10^7 stroops)
    pub stake_amount: i128,
    /// Current challenge state
    pub status: ChallengeStatus,
    /// Winner address (set on completion)
    pub winner: Address,
    /// Ledger timestamp when created
    pub created_at: u64,
    /// SAC address of the staking token
    pub token: Address,
    /// Platform fee in basis points (e.g., 500 = 5%)
    pub platform_fee_bps: u32,
}

/// Leaderboard entry for a user
#[contracttype]
#[derive(Clone)]
pub struct LeaderboardEntry {
    /// User's wallet address
    pub user: Address,
    /// Total XP earned on-chain
    pub xp: u64,
    /// Number of challenges won
    pub wins: u32,
    /// Number of challenges participated in
    pub total_challenges: u32,
}

// ── Contract ────────────────────────────────────────────────

#[contract]
pub struct SorobanAcademy;

#[contractimpl]
impl SorobanAcademy {
    // ── Admin Setup ─────────────────────────────────────────

    /// Initialize the contract. Must be called once after deployment.
    ///
    /// # Arguments
    /// * `admin`   — Address that administers the platform (declares winners, etc.)
    /// * `token`   — SAC address of the staking token (native XLM wrapper)
    /// * `fee_bps` — Platform fee in basis points (max 1000 = 10%)
    pub fn initialize(env: Env, admin: Address, token: Address, fee_bps: u32) {
        // Prevent re-initialization
        if env.storage().instance().has(&ADMIN) {
            panic!("already initialized");
        }
        assert!(fee_bps <= 1_000, "fee too high — max 10%");

        admin.require_auth();

        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&TOKEN, &token);
        env.storage().instance().set(&FEE_BPS, &fee_bps);
        env.storage().instance().set(&COUNTER, &0u64);

        // Emit initialization event
        env.events().publish(
            (symbol_short!("init"),),
            admin.clone(),
        );

        log!(&env, "SorobanAcademy initialized with admin: {:?}", admin);
    }

    // ── Challenge Lifecycle ─────────────────────────────────

    /// Create a new coding challenge and stake XLM.
    ///
    /// The creator transfers `stake_amount` into the contract escrow.
    /// Returns the created `Challenge` data.
    pub fn create_challenge(
        env: Env,
        creator: Address,
        challenge_id: Symbol,
        stake_amount: i128,
    ) -> Challenge {
        creator.require_auth();
        assert!(stake_amount > 0, "stake must be positive");

        // Ensure challenge does not already exist
        assert!(
            !env.storage().persistent().has(&challenge_id),
            "challenge already exists"
        );

        let token_addr: Address = env.storage().instance().get(&TOKEN).unwrap();
        let fee_bps: u32 = env.storage().instance().get(&FEE_BPS).unwrap();

        // Transfer stake → contract escrow
        let token_client = token::Client::new(&env, &token_addr);
        token_client.transfer(&creator, &env.current_contract_address(), &stake_amount);

        // Increment global challenge counter
        let mut counter: u64 = env.storage().instance().get(&COUNTER).unwrap();
        counter += 1;
        env.storage().instance().set(&COUNTER, &counter);

        let challenge = Challenge {
            challenge_id: challenge_id.clone(),
            creator: creator.clone(),
            participant: creator.clone(), // placeholder until someone joins
            stake_amount,
            status: ChallengeStatus::Open,
            winner: creator.clone(),      // placeholder
            created_at: env.ledger().timestamp(),
            token: token_addr,
            platform_fee_bps: fee_bps,
        };

        env.storage().persistent().set(&challenge_id, &challenge);

        // Emit event
        env.events().publish(
            (symbol_short!("create"), challenge_id.clone()),
            creator.clone(),
        );

        log!(&env, "Challenge {:?} created by {:?}", challenge_id, creator);

        challenge
    }

    /// Join an existing open challenge by staking the same amount.
    pub fn join_challenge(
        env: Env,
        participant: Address,
        challenge_id: Symbol,
    ) -> Challenge {
        participant.require_auth();

        let mut c: Challenge = env
            .storage()
            .persistent()
            .get(&challenge_id)
            .expect("challenge not found");

        assert!(
            c.status == ChallengeStatus::Open,
            "challenge not available"
        );
        assert!(c.creator != participant, "cannot join your own challenge");

        // Transfer stake → contract escrow
        let token_client = token::Client::new(&env, &c.token);
        token_client.transfer(&participant, &env.current_contract_address(), &c.stake_amount);

        c.participant = participant.clone();
        c.status = ChallengeStatus::Active;

        env.storage().persistent().set(&challenge_id, &c);

        // Emit event
        env.events().publish(
            (symbol_short!("join"), challenge_id.clone()),
            participant.clone(),
        );

        log!(&env, "Participant {:?} joined challenge {:?}", participant, challenge_id);

        c
    }

    /// Declare the winner of a challenge and release funds.
    /// Only the admin (server oracle) may call this.
    ///
    /// Winner receives `(2 × stake) - platform_fee`.
    /// Platform fee goes to the admin address.
    pub fn declare_winner(
        env: Env,
        admin: Address,
        challenge_id: Symbol,
        winner: Address,
    ) {
        Self::require_admin(&env, &admin);

        let mut c: Challenge = env
            .storage()
            .persistent()
            .get(&challenge_id)
            .expect("challenge not found");

        assert!(c.status == ChallengeStatus::Active, "challenge not active");
        assert!(
            winner == c.creator || winner == c.participant,
            "winner is not a participant"
        );

        let total_pool: i128 = c.stake_amount * 2;
        let fee: i128 = total_pool * (c.platform_fee_bps as i128) / 10_000;
        let payout: i128 = total_pool - fee;

        let token_client = token::Client::new(&env, &c.token);

        // Pay winner
        token_client.transfer(&env.current_contract_address(), &winner, &payout);

        // Pay platform fee to admin
        if fee > 0 {
            let stored_admin: Address =
                env.storage().instance().get(&ADMIN).unwrap();
            token_client.transfer(
                &env.current_contract_address(),
                &stored_admin,
                &fee,
            );
        }

        c.winner = winner.clone();
        c.status = ChallengeStatus::Completed;
        env.storage().persistent().set(&challenge_id, &c);

        // Emit event
        env.events().publish(
            (symbol_short!("winner"), challenge_id.clone()),
            winner.clone(),
        );

        log!(&env, "Challenge {:?} won by {:?}, payout: {}", challenge_id, winner, payout);
    }

    /// Declare a draw — refund both participants in full.
    pub fn declare_draw(env: Env, admin: Address, challenge_id: Symbol) {
        Self::require_admin(&env, &admin);

        let mut c: Challenge = env
            .storage()
            .persistent()
            .get(&challenge_id)
            .expect("challenge not found");

        assert!(c.status == ChallengeStatus::Active, "challenge not active");

        let token_client = token::Client::new(&env, &c.token);
        token_client.transfer(
            &env.current_contract_address(),
            &c.creator,
            &c.stake_amount,
        );
        token_client.transfer(
            &env.current_contract_address(),
            &c.participant,
            &c.stake_amount,
        );

        c.status = ChallengeStatus::Draw;
        env.storage().persistent().set(&challenge_id, &c);

        // Emit event
        env.events().publish(
            (symbol_short!("draw"), challenge_id.clone()),
            true,
        );

        log!(&env, "Challenge {:?} ended in a draw", challenge_id);
    }

    /// Cancel a challenge before a participant joins — refund the creator.
    pub fn cancel_challenge(env: Env, creator: Address, challenge_id: Symbol) {
        creator.require_auth();

        let mut c: Challenge = env
            .storage()
            .persistent()
            .get(&challenge_id)
            .expect("challenge not found");

        assert!(
            c.status == ChallengeStatus::Open,
            "cannot cancel — challenge already active"
        );
        assert!(c.creator == creator, "only the creator can cancel");

        let token_client = token::Client::new(&env, &c.token);
        token_client.transfer(
            &env.current_contract_address(),
            &creator,
            &c.stake_amount,
        );

        c.status = ChallengeStatus::Cancelled;
        env.storage().persistent().set(&challenge_id, &c);

        // Emit event
        env.events().publish(
            (symbol_short!("cancel"), challenge_id.clone()),
            creator.clone(),
        );

        log!(&env, "Challenge {:?} cancelled by {:?}", challenge_id, creator);
    }

    // ── XP & Leaderboard ────────────────────────────────────

    /// Record XP earned by a user (admin-only).
    /// Creates the leaderboard entry if it doesn't exist.
    pub fn record_xp(
        env: Env,
        admin: Address,
        user: Address,
        xp_earned: u64,
        won: bool,
    ) {
        Self::require_admin(&env, &admin);

        let user_key = Self::leaderboard_key(&user);

        let mut entry: LeaderboardEntry = env
            .storage()
            .persistent()
            .get(&user_key)
            .unwrap_or(LeaderboardEntry {
                user: user.clone(),
                xp: 0,
                wins: 0,
                total_challenges: 0,
            });

        entry.xp += xp_earned;
        entry.total_challenges += 1;
        if won {
            entry.wins += 1;
        }

        env.storage().persistent().set(&user_key, &entry);

        // Emit event
        env.events().publish(
            (symbol_short!("xp"), user.clone()),
            xp_earned,
        );
    }

    // ── Read-Only Queries ───────────────────────────────────

    /// Retrieve challenge data by ID.
    pub fn get_challenge(env: Env, challenge_id: Symbol) -> Challenge {
        env.storage()
            .persistent()
            .get(&challenge_id)
            .expect("challenge not found")
    }

    /// Retrieve a user's leaderboard entry.
    pub fn get_leaderboard_entry(env: Env, user: Address) -> LeaderboardEntry {
        let user_key = Self::leaderboard_key(&user);
        env.storage()
            .persistent()
            .get(&user_key)
            .unwrap_or(LeaderboardEntry {
                user: user.clone(),
                xp: 0,
                wins: 0,
                total_challenges: 0,
            })
    }

    /// Get the total number of challenges created.
    pub fn get_total_challenges(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&COUNTER)
            .unwrap_or(0u64)
    }

    /// Get the current platform fee in basis points.
    pub fn get_fee_bps(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&FEE_BPS)
            .unwrap_or(0u32)
    }

    // ── Admin Functions ─────────────────────────────────────

    /// Update the platform fee (admin-only). Max 10%.
    pub fn set_fee_bps(env: Env, admin: Address, new_fee_bps: u32) {
        Self::require_admin(&env, &admin);
        assert!(new_fee_bps <= 1_000, "fee too high — max 10%");
        env.storage().instance().set(&FEE_BPS, &new_fee_bps);

        env.events().publish(
            (symbol_short!("fee"),),
            new_fee_bps,
        );
    }

    // ── Internal Helpers ────────────────────────────────────

    fn require_admin(env: &Env, caller: &Address) {
        caller.require_auth();
        let stored: Address = env.storage().instance().get(&ADMIN).unwrap();
        assert!(*caller == stored, "unauthorized — admin only");
    }

    fn leaderboard_key(user: &Address) -> Symbol {
        // Use a deterministic key for leaderboard entries
        symbol_short!("LB")
    }
}

// ── Tests ───────────────────────────────────────────────────

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register(SorobanAcademy, ());
        let client = SorobanAcademyClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token = Address::generate(&env);

        env.mock_all_auths();
        client.initialize(&admin, &token, &500u32);
    }

    #[test]
    #[should_panic(expected = "already initialized")]
    fn test_double_initialize_panics() {
        let env = Env::default();
        let contract_id = env.register(SorobanAcademy, ());
        let client = SorobanAcademyClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token = Address::generate(&env);

        env.mock_all_auths();
        client.initialize(&admin, &token, &500u32);
        client.initialize(&admin, &token, &500u32); // should panic
    }

    #[test]
    fn test_get_total_challenges_initial() {
        let env = Env::default();
        let contract_id = env.register(SorobanAcademy, ());
        let client = SorobanAcademyClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token = Address::generate(&env);

        env.mock_all_auths();
        client.initialize(&admin, &token, &500u32);

        let total = client.get_total_challenges();
        assert_eq!(total, 0);
    }

    #[test]
    fn test_set_fee_bps() {
        let env = Env::default();
        let contract_id = env.register(SorobanAcademy, ());
        let client = SorobanAcademyClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token = Address::generate(&env);

        env.mock_all_auths();
        client.initialize(&admin, &token, &500u32);

        // Update fee
        client.set_fee_bps(&admin, &300u32);
        let fee = client.get_fee_bps();
        assert_eq!(fee, 300);
    }

    #[test]
    #[should_panic(expected = "fee too high")]
    fn test_set_fee_bps_too_high() {
        let env = Env::default();
        let contract_id = env.register(SorobanAcademy, ());
        let client = SorobanAcademyClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token = Address::generate(&env);

        env.mock_all_auths();
        client.initialize(&admin, &token, &500u32);

        // Should panic — fee too high
        client.set_fee_bps(&admin, &2_000u32);
    }
}
