# 🚀 Soroban Academy — Interactive Soroban Onboarding

A gamified, interactive web application that teaches developers how to write **Rust smart contracts** on the **Stellar Soroban** platform through hands-on coding challenges.

![Soroban Academy](https://img.shields.io/badge/Soroban-Academy-00f5ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38bdf8?style=flat-square)
![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-0078d4?style=flat-square)

## ✨ Features

### 🎮 Gamified Learning
- **3 Difficulty Levels**: Beginner → Intermediate → Advanced
- **XP & Leveling System**: Earn XP for completing lessons and challenges
- **8 Achievement Badges**: Unlock badges for milestones like completing levels, maintaining streaks
- **Daily Streak Tracking**: Build learning habits with streak counters
- **Progress Persistence**: All progress saved to localStorage

### 📚 11+ Interactive Lessons
| Level | Lessons | Topics |
|-------|---------|--------|
| 🌱 Beginner | 4 | Rust basics, Structs & Enums, First Soroban contract, Error handling |
| ⚡ Intermediate | 4 | Storage & state, Authentication, Events & logging, Testing |
| 🔥 Advanced | 3 | Token contracts, Cross-contract calls, Advanced design patterns |

### 💻 Live Code Editor
- **Monaco Editor** with Rust syntax highlighting
- Pre-written starter templates for each lesson
- **Run** (simulated compilation) and **Validate** buttons
- Instant feedback with error details and suggestions
- Progressive hint system (3 hints per lesson)

### 🧠 Challenge System
- **Fix the Bug**: Find and fix 3 bugs in a transfer function
- **Complete Logic**: Implement staking reward calculations
- **Optimize**: Refactor inefficient storage patterns

### 📊 Progress Dashboard
- XP progress bar with level tracking
- Skill breakdown by category
- Badge showcase
- Course completion percentage
- Next lesson recommendation

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Tailwind CSS v4** | Utility-first styling |
| **Vite** | Build tool & dev server |
| **Monaco Editor** | In-browser code editing |
| **Framer Motion** | Animations & transitions |
| **React Router** | Client-side routing |
| **Lucide React** | Icon library |
| **localStorage** | Progress persistence |
| **@stellar/stellar-sdk** | Stellar blockchain interaction |
| **@stellar/freighter-api** | Freighter wallet connection |
| **Soroban (Rust)** | On-chain smart contract |

## 📁 Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Root component with routing
├── index.css             # Design system & global styles
│
├── components/
│   ├── Navbar.jsx        # Top navigation with XP/level/wallet display
│   ├── CodeEditor.jsx    # Monaco editor with run/validate/hints
│   └── ScrollToTop.jsx   # Scroll restoration on route change
│
├── pages/
│   ├── LandingPage.jsx       # Hero, features, learning path, CTA
│   ├── Dashboard.jsx         # Progress overview, skill breakdown
│   ├── LessonsPage.jsx       # Browse lessons by level
│   ├── LessonPage.jsx        # Theory + code editor (split view)
│   ├── ChallengesPage.jsx    # Standalone coding challenges
│   ├── AchievementsPage.jsx  # Badges, stats, level breakdown
│   └── SmartContractPage.jsx # Stellar wallet & contract interaction
│
├── data/
│   └── lessons.js        # All lesson content, code templates, challenges
│
├── store/
│   ├── useProgress.jsx   # User progress context (XP, badges, streaks)
│   └── useWallet.jsx     # Stellar wallet context (Freighter connection)
│
└── utils/
    ├── contractRunner.js  # Mock code validation & simulation
    └── stellarService.js  # Stellar SDK service layer (RPC, transactions)

soroban/
├── Cargo.toml            # Rust project manifest
├── README.md             # Contract-specific documentation
└── src/
    └── lib.rs            # Soroban smart contract (escrow, XP, leaderboard)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## ⛓️ Stellar Smart Contract Setup

The project includes a full **Soroban smart contract** (`soroban/src/lib.rs`) and a frontend integration page at `/smart-contract`.

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (stable)
- [Stellar CLI](https://soroban.stellar.org/docs/getting-started/setup) (`stellar`)
- [Freighter Wallet](https://www.freighter.app/) browser extension
- `wasm32-unknown-unknown` target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```

### Step 1: Build the Contract

```bash
cd soroban
stellar contract build
```

The compiled WASM will be at:
```
target/wasm32-unknown-unknown/release/soroban_academy_contract.wasm
```

### Step 2: Deploy to Stellar Testnet

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_academy_contract.wasm \
  --network testnet \
  --source <YOUR_SECRET_KEY>
```

This will output a **Contract ID** — copy it for the next step.

### Step 3: Configure the Frontend

Open `src/utils/stellarService.js` and set your contract ID:

```js
const CONTRACT_ID = '<YOUR_DEPLOYED_CONTRACT_ID>'
```

### Step 4: Initialize the Contract

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

### Step 5: Connect Your Wallet

1. Install the [Freighter](https://www.freighter.app/) browser extension
2. Switch Freighter to **Testnet**
3. Fund your account using the **Fund Testnet** button on the Smart Contract page (uses [Friendbot](https://friendbot.stellar.org))
4. Navigate to `/smart-contract` and click **Connect Wallet**

### Smart Contract Functions

| Function | Access | Description |
|----------|--------|-------------|
| `initialize` | Once | Set admin, token, and fee |
| `create_challenge` | Auth | Create a challenge + stake XLM |
| `join_challenge` | Auth | Join an open challenge + stake |
| `declare_winner` | Admin | Distribute winnings |
| `declare_draw` | Admin | Refund both participants |
| `cancel_challenge` | Creator | Cancel + refund (before join) |
| `record_xp` | Admin | Record XP for a user |
| `get_challenge` | Public | Read challenge data |
| `get_leaderboard_entry` | Public | Read user stats |
| `get_total_challenges` | Public | Total challenges created |
| `get_fee_bps` | Public | Current platform fee |
| `set_fee_bps` | Admin | Update platform fee |

## 🎨 Design System

The app uses a **futuristic dark theme** with:
- **Background**: Deep dark blues (#0a0a0f, #111118)
- **Neon Accents**: Cyan (#00f5ff), Purple (#a855f7), Pink (#ec4899)
- **Glassmorphism**: Frosted glass cards with backdrop blur
- **Typography**: Inter (UI) + JetBrains Mono (code)
- **Animations**: Smooth Framer Motion transitions

## 📱 Responsive Design

- **Mobile**: Single-column layout, tab-based theory/code switching
- **Tablet**: Adaptive grid layouts
- **Desktop**: Side-by-side theory + code editor

## 🔄 Learning Flow

1. **Select a Level** → Choose Beginner, Intermediate, or Advanced
2. **Read Theory** → Understand the concept with examples
3. **Write Code** → Complete the coding task in Monaco Editor
4. **Run & Validate** → Get instant feedback on your code
5. **Earn XP** → Score updates, badges unlock
6. **Next Level** → Progress through the curriculum

## 🏆 Badges

| Badge | Name | Requirement |
|-------|------|-------------|
| 👣 | First Step | Complete your first lesson |
| 🦀 | Rust Rookie | Complete all beginner lessons |
| ⚔️ | Code Warrior | Complete 5 challenges |
| 🌟 | Soroban Dev | Complete intermediate level |
| 🔥 | Streak Master | Maintain a 7-day streak |
| 💎 | Perfectionist | Get 100% on 3 lessons |
| ⚡ | Speed Demon | Complete a challenge in under 2 minutes |
| 🧙 | Blockchain Sage | Complete all advanced lessons |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for the **Stellar** community

