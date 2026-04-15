# 🚀 Soroban Academy — Smart Contract

A Stellar Soroban smart contract for the Academy learning platform. Manages challenge escrows, XP tracking, and leaderboard state on-chain.

## Features

- **Challenge Escrow**: Create, join, and resolve coding challenges with XLM stakes
- **Winner Payout**: Automatic fund distribution with configurable platform fee
- **Draw & Cancellation**: Full refund handling for draws and early cancellations
- **XP Tracking**: On-chain leaderboard with XP, wins, and participation stats
- **Admin Controls**: Protected initialization and fee management
- **Event Emission**: Rich event logging for frontend integration

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (stable)
- [Stellar CLI](https://soroban.stellar.org/docs/getting-started/setup) (`stellar`)
- `wasm32-unknown-unknown` target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```

## Build

```bash
stellar contract build
```

Or manually:
```bash
cargo build --target wasm32-unknown-unknown --release
```

The compiled WASM will be at:
```
target/wasm32-unknown-unknown/release/soroban_academy_contract.wasm
```

## Test

```bash
cargo test
```

## Deploy (Testnet)

```bash
# Deploy to Stellar testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_academy_contract.wasm \
  --network testnet \
  --source <YOUR_SECRET_KEY>
```

## Initialize

After deployment, initialize with your admin address and the native XLM SAC address:

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  --source <ADMIN_SECRET_KEY> \
  -- initialize \
  --admin <ADMIN_PUBLIC_KEY> \
  --token <NATIVE_XLM_SAC_ADDRESS> \
  --fee_bps 500
```

## Contract Functions

| Function | Access | Description |
|----------|--------|-------------|
| `initialize` | Once | Set admin, token, and fee |
| `create_challenge` | Auth | Create challenge + stake XLM |
| `join_challenge` | Auth | Join open challenge + stake |
| `declare_winner` | Admin | Distribute winnings |
| `declare_draw` | Admin | Refund both participants |
| `cancel_challenge` | Creator | Cancel + refund (before join) |
| `record_xp` | Admin | Record XP for a user |
| `get_challenge` | Public | Read challenge data |
| `get_leaderboard_entry` | Public | Read user stats |
| `get_total_challenges` | Public | Total challenges created |
| `get_fee_bps` | Public | Current platform fee |
| `set_fee_bps` | Admin | Update platform fee |

## Architecture

```
soroban/
├── Cargo.toml          # Rust project manifest
├── README.md           # This file
└── src/
    └── lib.rs          # Smart contract implementation
```

## License

MIT — Built for the Stellar community.
