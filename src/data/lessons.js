/**
 * Soroban Academy — Lessons Data
 * Contains all lesson content, code templates, and challenge configurations.
 * Each lesson includes theory, starter code, solution validation, and XP rewards.
 */

export const LEVELS = [
  { id: 'beginner', name: 'Beginner', color: '#22c55e', icon: '🌱', description: 'Start your Soroban journey' },
  { id: 'intermediate', name: 'Intermediate', color: '#f59e0b', icon: '⚡', description: 'Level up your skills' },
  { id: 'advanced', name: 'Advanced', color: '#ef4444', icon: '🔥', description: 'Master Soroban development' },
]

export const BADGES = [
  { id: 'first_step', name: 'First Step', icon: '👣', description: 'Complete your first lesson', requirement: 'complete_1_lesson' },
  { id: 'rust_rookie', name: 'Rust Rookie', icon: '🦀', description: 'Complete all beginner lessons', requirement: 'complete_beginner' },
  { id: 'code_warrior', name: 'Code Warrior', icon: '⚔️', description: 'Complete 5 challenges', requirement: 'complete_5_challenges' },
  { id: 'soroban_dev', name: 'Soroban Dev', icon: '🌟', description: 'Complete intermediate level', requirement: 'complete_intermediate' },
  { id: 'streak_master', name: 'Streak Master', icon: '🔥', description: 'Maintain a 7-day streak', requirement: 'streak_7' },
  { id: 'perfectionist', name: 'Perfectionist', icon: '💎', description: 'Get 100% on 3 lessons', requirement: 'perfect_3' },
  { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Complete a challenge in under 2 minutes', requirement: 'fast_completion' },
  { id: 'blockchain_sage', name: 'Blockchain Sage', icon: '🧙', description: 'Complete all advanced lessons', requirement: 'complete_advanced' },
]

export const lessons = [
  // ============================================
  // BEGINNER LEVEL
  // ============================================
  {
    id: 'intro-rust',
    title: 'Introduction to Rust',
    level: 'beginner',
    order: 1,
    xp: 100,
    estimatedMinutes: 10,
    description: 'Learn the basics of Rust programming language — the foundation for Soroban smart contracts.',
    theory: `
# Welcome to Rust! 🦀

Rust is a systems programming language focused on **safety**, **speed**, and **concurrency**. It's the language used to write Soroban smart contracts on Stellar.

## Key Concepts

### Variables
In Rust, variables are **immutable by default**. Use \`let mut\` to make them mutable:

\`\`\`rust
let x = 5;        // immutable
let mut y = 10;    // mutable — can be changed
y = 20;            // ✅ works because y is mutable
\`\`\`

### Functions
Functions are declared with \`fn\` and must specify return types:

\`\`\`rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // no semicolon = return value
}
\`\`\`

### Data Types
Rust is statically typed. Common types include:
- \`i32\`, \`i64\` — signed integers
- \`u32\`, \`u64\` — unsigned integers  
- \`bool\` — boolean
- \`String\` — heap-allocated string
- \`&str\` — string slice (reference)

## Your Task
Complete the function below to return the sum of two numbers.
    `,
    starterCode: `// Your first Rust function!
// Complete the function to return the sum of a and b

fn add(a: i32, b: i32) -> i32 {
    // TODO: Return the sum of a and b
    
}

// Don't modify the test
fn main() {
    let result = add(3, 7);
    assert_eq!(result, 10);
    println!("✅ Test passed! 3 + 7 = {}", result);
}`,
    solution: `fn add(a: i32, b: i32) -> i32 {
    a + b
}`,
    validationKeywords: ['a + b', 'a+b'],
    hints: [
      'In Rust, the last expression in a function (without a semicolon) is the return value.',
      'You just need to write `a + b` inside the function body.',
      'Make sure there\'s no semicolon after the expression if you want it to be the return value.'
    ],
  },
  {
    id: 'rust-structs',
    title: 'Structs & Enums',
    level: 'beginner',
    order: 2,
    xp: 150,
    estimatedMinutes: 12,
    description: 'Learn about Rust structs and enums — essential building blocks for smart contract data.',
    theory: `
# Structs & Enums in Rust 📦

## Structs
Structs let you create custom data types by grouping related values:

\`\`\`rust
struct Wallet {
    address: String,
    balance: u64,
    is_active: bool,
}
\`\`\`

## Enums
Enums define a type that can be one of several variants:

\`\`\`rust
enum TransactionType {
    Transfer,
    Mint,
    Burn,
}
\`\`\`

## Implementation Blocks
Use \`impl\` to add methods to your types:

\`\`\`rust
impl Wallet {
    fn new(address: String) -> Self {
        Wallet {
            address,
            balance: 0,
            is_active: true,
        }
    }
    
    fn deposit(&mut self, amount: u64) {
        self.balance += amount;
    }
}
\`\`\`

## Your Task
Create a \`Token\` struct with name, symbol, and total_supply fields. Then implement a \`new\` constructor.
    `,
    starterCode: `// Define a Token struct with:
// - name: String
// - symbol: String  
// - total_supply: u64

// TODO: Define the struct here


// TODO: Implement a 'new' constructor
// impl Token { ... }


fn main() {
    let token = Token::new(
        String::from("SorobanCoin"),
        String::from("SBC"),
        1000000
    );
    assert_eq!(token.name, "SorobanCoin");
    assert_eq!(token.symbol, "SBC");
    assert_eq!(token.total_supply, 1000000);
    println!("✅ Token created: {} ({})", token.name, token.symbol);
    println!("   Total supply: {}", token.total_supply);
}`,
    solution: `struct Token {
    name: String,
    symbol: String,
    total_supply: u64,
}

impl Token {
    fn new(name: String, symbol: String, total_supply: u64) -> Self {
        Token { name, symbol, total_supply }
    }
}`,
    validationKeywords: ['struct Token', 'impl Token', 'fn new', 'Self'],
    hints: [
      'Define the struct with `struct Token { ... }` and list each field with its type.',
      'Use `impl Token { ... }` to add the constructor method.',
      'The `new` method should return `Self` and create a new `Token` instance.'
    ],
  },
  {
    id: 'first-soroban',
    title: 'Your First Soroban Contract',
    level: 'beginner',
    order: 3,
    xp: 200,
    estimatedMinutes: 15,
    description: 'Write your very first smart contract on the Stellar Soroban platform!',
    theory: `
# Your First Soroban Contract 🚀

## What is Soroban?
Soroban is Stellar's smart contracts platform. Contracts are written in **Rust** and compiled to **WebAssembly (Wasm)**.

## Contract Structure
Every Soroban contract needs:
1. The \`soroban_sdk\` crate
2. A struct for the contract
3. An \`impl\` block with the \`#[contractimpl]\` attribute

\`\`\`rust
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, name: String) -> String {
        // Contract logic here
    }
}
\`\`\`

## Key Concepts
- \`Env\` — The contract environment, provides access to storage, events, etc.
- \`#[contract]\` — Marks a struct as a Soroban contract
- \`#[contractimpl]\` — Marks the implementation block
- All public functions become **callable contract methods**

## Your Task
Complete the contract below to return a greeting message.
    `,
    starterCode: `use soroban_sdk::{contract, contractimpl, Env, String as SorobanString};

#[contract]
pub struct GreetingContract;

#[contractimpl]
impl GreetingContract {
    /// Returns a greeting message
    /// Should return "Hello, {name}!"
    pub fn greet(env: Env, name: SorobanString) -> SorobanString {
        // TODO: Create and return a greeting string
        // Hint: Use SorobanString::from_str(&env, "your string")
        
    }
}

// Mock test
fn main() {
    println!("✅ Contract structure is correct!");
    println!("   GreetingContract.greet() is defined");
}`,
    solution: `pub fn greet(env: Env, name: SorobanString) -> SorobanString {
    let greeting = SorobanString::from_str(&env, "Hello, World!");
    greeting
}`,
    validationKeywords: ['SorobanString::from_str', 'greeting', '&env'],
    hints: [
      'Use `SorobanString::from_str(&env, "your message")` to create a Soroban string.',
      'You can concatenate strings or just return a greeting for now.',
      'Remember: the function must return a SorobanString type.'
    ],
  },
  {
    id: 'error-handling',
    title: 'Error Handling in Rust',
    level: 'beginner',
    order: 4,
    xp: 150,
    estimatedMinutes: 12,
    description: 'Master Result and Option types for robust smart contract error handling.',
    theory: `
# Error Handling in Rust ⚠️

Rust doesn't have exceptions. Instead, it uses two powerful enums:

## Option<T>
For values that might not exist:

\`\`\`rust
fn find_user(id: u32) -> Option<String> {
    if id == 1 {
        Some(String::from("Alice"))
    } else {
        None
    }
}
\`\`\`

## Result<T, E>
For operations that might fail:

\`\`\`rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(a / b)
    }
}
\`\`\`

## Pattern Matching
Use \`match\` to handle all cases:

\`\`\`rust
match divide(10.0, 2.0) {
    Ok(result) => println!("Result: {}", result),
    Err(e) => println!("Error: {}", e),
}
\`\`\`

## Your Task
Implement a safe division function that returns a Result.
    `,
    starterCode: `// Implement safe_divide that:
// - Returns Ok(result) when b is not zero
// - Returns Err("Division by zero") when b is zero

fn safe_divide(a: f64, b: f64) -> Result<f64, String> {
    // TODO: Implement the function
    
}

fn main() {
    match safe_divide(10.0, 2.0) {
        Ok(result) => {
            assert_eq!(result, 5.0);
            println!("✅ 10 / 2 = {}", result);
        },
        Err(e) => println!("❌ Unexpected error: {}", e),
    }
    
    match safe_divide(10.0, 0.0) {
        Ok(_) => println!("❌ Should have returned an error!"),
        Err(e) => {
            assert_eq!(e, "Division by zero");
            println!("✅ Correctly caught: {}", e);
        },
    }
}`,
    solution: `fn safe_divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Division by zero"))
    } else {
        Ok(a / b)
    }
}`,
    validationKeywords: ['Ok(', 'Err(', 'b == 0.0', 'Division by zero'],
    hints: [
      'Check if `b` equals `0.0` first.',
      'Return `Err(String::from("Division by zero"))` for the error case.',
      'Return `Ok(a / b)` for the success case.'
    ],
  },

  // ============================================
  // INTERMEDIATE LEVEL
  // ============================================
  {
    id: 'soroban-storage',
    title: 'Soroban Storage & State',
    level: 'intermediate',
    order: 1,
    xp: 250,
    estimatedMinutes: 15,
    description: 'Learn how to persist data in Soroban smart contracts using storage.',
    theory: `
# Soroban Storage & State 💾

Smart contracts need to store data on the blockchain. Soroban provides three storage types:

## Storage Types

### 1. Instance Storage
Data persists as long as the contract exists:
\`\`\`rust
env.storage().instance().set(&key, &value);
\`\`\`

### 2. Persistent Storage
Long-lived data with TTL (Time To Live):
\`\`\`rust
env.storage().persistent().set(&key, &value);
\`\`\`

### 3. Temporary Storage
Short-lived data, cheapest option:
\`\`\`rust
env.storage().temporary().set(&key, &value);
\`\`\`

## Reading & Writing

\`\`\`rust
// Define storage keys
#[contracttype]
enum DataKey {
    Counter,
    Balance(Address),
}

// Write to storage
env.storage().instance().set(&DataKey::Counter, &42u32);

// Read from storage
let count: u32 = env.storage()
    .instance()
    .get(&DataKey::Counter)
    .unwrap_or(0);
\`\`\`

## Your Task
Complete the counter contract to increment and read a counter value.
    `,
    starterCode: `use soroban_sdk::{contract, contractimpl, contracttype, Env};

#[contracttype]
enum DataKey {
    Counter,
}

#[contract]
pub struct CounterContract;

#[contractimpl]
impl CounterContract {
    /// Increment the counter by 1 and return the new value
    pub fn increment(env: Env) -> u32 {
        // TODO: Read current counter (default to 0)
        // TODO: Add 1 to the counter
        // TODO: Save the new value
        // TODO: Return the new value
        
    }
    
    /// Get the current counter value
    pub fn get_count(env: Env) -> u32 {
        // TODO: Read and return the counter value (default 0)
        
    }
}

fn main() {
    println!("✅ Counter contract structure is valid!");
}`,
    solution: `pub fn increment(env: Env) -> u32 {
    let mut count: u32 = env.storage().instance().get(&DataKey::Counter).unwrap_or(0);
    count += 1;
    env.storage().instance().set(&DataKey::Counter, &count);
    count
}

pub fn get_count(env: Env) -> u32 {
    env.storage().instance().get(&DataKey::Counter).unwrap_or(0)
}`,
    validationKeywords: ['env.storage()', 'instance()', '.get(', '.set(', 'DataKey::Counter', 'unwrap_or'],
    hints: [
      'Use `env.storage().instance().get(&DataKey::Counter).unwrap_or(0)` to read the counter.',
      'Use `env.storage().instance().set(&DataKey::Counter, &count)` to save the new value.',
      'Remember to add 1 to the count before saving and returning.'
    ],
  },
  {
    id: 'soroban-auth',
    title: 'Authentication & Access Control',
    level: 'intermediate',
    order: 2,
    xp: 300,
    estimatedMinutes: 18,
    description: 'Implement authentication and access control in Soroban contracts.',
    theory: `
# Authentication & Access Control 🔐

Securing your smart contract is critical. Soroban provides built-in authentication.

## The Address Type
Soroban uses \`Address\` to identify accounts and contracts:

\`\`\`rust
use soroban_sdk::Address;
\`\`\`

## Requiring Authorization

\`\`\`rust
pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
    // Verify the caller is 'from'
    from.require_auth();
    
    // Now safe to proceed with transfer
    // ...
}
\`\`\`

## Admin Pattern
A common pattern is to set an admin on initialization:

\`\`\`rust
#[contracttype]
enum DataKey {
    Admin,
}

pub fn initialize(env: Env, admin: Address) {
    // Only allow initialization once
    if env.storage().instance().has(&DataKey::Admin) {
        panic!("Already initialized");
    }
    env.storage().instance().set(&DataKey::Admin, &admin);
}

pub fn admin_only_action(env: Env, caller: Address) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    if caller != admin {
        panic!("Unauthorized");
    }
    caller.require_auth();
    // ... admin logic
}
\`\`\`

## Your Task
Complete the admin-protected contract below.
    `,
    starterCode: `use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
enum DataKey {
    Admin,
    Value,
}

#[contract]
pub struct AdminContract;

#[contractimpl]
impl AdminContract {
    /// Initialize the contract with an admin address
    pub fn init(env: Env, admin: Address) {
        // TODO: Check if admin is already set (panic if so)
        // TODO: Store the admin address
        
    }
    
    /// Set a value (admin only)
    pub fn set_value(env: Env, caller: Address, value: u64) {
        // TODO: Get the stored admin
        // TODO: Verify caller is admin
        // TODO: Require authorization
        // TODO: Store the value
        
    }
    
    /// Get the stored value (anyone can call)
    pub fn get_value(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::Value).unwrap_or(0)
    }
}

fn main() {
    println!("✅ Admin contract structure is valid!");
}`,
    solution: `pub fn init(env: Env, admin: Address) {
    if env.storage().instance().has(&DataKey::Admin) {
        panic!("Already initialized");
    }
    env.storage().instance().set(&DataKey::Admin, &admin);
}

pub fn set_value(env: Env, caller: Address, value: u64) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    if caller != admin {
        panic!("Unauthorized");
    }
    caller.require_auth();
    env.storage().instance().set(&DataKey::Value, &value);
}`,
    validationKeywords: ['require_auth', 'DataKey::Admin', 'panic!', 'Unauthorized'],
    hints: [
      'Use `env.storage().instance().has(&DataKey::Admin)` to check if admin exists.',
      'Compare `caller` with the stored admin address.',
      'Call `caller.require_auth()` after verifying the caller is authorized.'
    ],
  },
  {
    id: 'soroban-events',
    title: 'Events & Logging',
    level: 'intermediate',
    order: 3,
    xp: 250,
    estimatedMinutes: 14,
    description: 'Learn how to emit events from your Soroban smart contracts.',
    theory: `
# Events & Logging in Soroban 📡

Events allow your contract to communicate important state changes to off-chain applications.

## Emitting Events
Use \`env.events().publish()\` to emit events:

\`\`\`rust
use soroban_sdk::{Env, Symbol, symbol_short};

// Simple event
env.events().publish(
    (symbol_short!("transfer"),),
    (from, to, amount)
);
\`\`\`

## Event Topics
Events have **topics** (indexed, searchable) and **data** (the payload):

\`\`\`rust
// Multiple topics for filtering
env.events().publish(
    (symbol_short!("token"), symbol_short!("mint")),
    amount
);
\`\`\`

## Symbol Short
\`symbol_short!\` creates short symbols (max 9 chars) at compile time:

\`\`\`rust
let action = symbol_short!("deposit");
\`\`\`

## Your Task
Complete the vault contract to emit events on deposit and withdrawal.
    `,
    starterCode: `use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
enum DataKey {
    Balance(Address),
}

#[contract]
pub struct VaultContract;

#[contractimpl]
impl VaultContract {
    /// Deposit funds into the vault
    pub fn deposit(env: Env, user: Address, amount: u64) {
        user.require_auth();
        
        let mut balance: u64 = env.storage()
            .persistent()
            .get(&DataKey::Balance(user.clone()))
            .unwrap_or(0);
        
        balance += amount;
        env.storage().persistent().set(&DataKey::Balance(user.clone()), &balance);
        
        // TODO: Emit a "deposit" event with user and amount
        
    }
    
    /// Withdraw funds from the vault
    pub fn withdraw(env: Env, user: Address, amount: u64) {
        user.require_auth();
        
        let mut balance: u64 = env.storage()
            .persistent()
            .get(&DataKey::Balance(user.clone()))
            .unwrap_or(0);
        
        if amount > balance {
            panic!("Insufficient balance");
        }
        
        balance -= amount;
        env.storage().persistent().set(&DataKey::Balance(user.clone()), &balance);
        
        // TODO: Emit a "withdraw" event with user and amount
        
    }
}

fn main() {
    println!("✅ Vault contract with events is valid!");
}`,
    solution: `env.events().publish(
    (symbol_short!("deposit"),),
    (user, amount)
);

env.events().publish(
    (symbol_short!("withdraw"),),
    (user, amount)
);`,
    validationKeywords: ['env.events()', 'publish', 'symbol_short!', 'deposit', 'withdraw'],
    hints: [
      'Use `env.events().publish(topics, data)` to emit an event.',
      'Topics should use `symbol_short!("deposit")` or `symbol_short!("withdraw")`.',
      'Pass user and amount as the event data.'
    ],
  },
  {
    id: 'soroban-testing',
    title: 'Testing Soroban Contracts',
    level: 'intermediate',
    order: 4,
    xp: 300,
    estimatedMinutes: 16,
    description: 'Write comprehensive tests for your Soroban smart contracts.',
    theory: `
# Testing Soroban Contracts 🧪

Testing is crucial for smart contracts — bugs can be very expensive!

## Test Environment
Soroban provides a test environment:

\`\`\`rust
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::Env;
    
    #[test]
    fn test_increment() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CounterContract);
        let client = CounterContractClient::new(&env, &contract_id);
        
        assert_eq!(client.increment(), 1);
        assert_eq!(client.increment(), 2);
        assert_eq!(client.get_count(), 2);
    }
}
\`\`\`

## Test Patterns
- **Setup**: Create env, register contract, create client
- **Act**: Call contract methods
- **Assert**: Verify expected outcomes
- **Edge Cases**: Test error conditions

## Mock Auth
For testing authenticated calls:

\`\`\`rust
env.mock_all_auths();
\`\`\`

## Your Task
Write tests for a simple token contract.
    `,
    starterCode: `use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
enum DataKey {
    Balance(Address),
    TotalSupply,
}

#[contract]
pub struct SimpleToken;

#[contractimpl]
impl SimpleToken {
    pub fn mint(env: Env, to: Address, amount: u64) {
        let mut balance: u64 = env.storage().persistent()
            .get(&DataKey::Balance(to.clone())).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&DataKey::Balance(to), &balance);
        
        let mut supply: u64 = env.storage().instance()
            .get(&DataKey::TotalSupply).unwrap_or(0);
        supply += amount;
        env.storage().instance().set(&DataKey::TotalSupply, &supply);
    }
    
    pub fn balance(env: Env, account: Address) -> u64 {
        env.storage().persistent().get(&DataKey::Balance(account)).unwrap_or(0)
    }
    
    pub fn total_supply(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0)
    }
}

// TODO: Write tests below
// Test 1: Minting should increase balance
// Test 2: Minting should increase total supply  
// Test 3: Multiple mints should accumulate
// Test 4: Unminted accounts should have 0 balance

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::Env;
    
    // TODO: Write your test functions here
    
}

fn main() {
    println!("✅ Token contract with tests is valid!");
}`,
    solution: `#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::Env;

    #[test]
    fn test_mint_increases_balance() {
        let env = Env::default();
        let contract_id = env.register_contract(None, SimpleToken);
        let client = SimpleTokenClient::new(&env, &contract_id);
        let user = Address::generate(&env);
        
        client.mint(&user, &1000);
        assert_eq!(client.balance(&user), 1000);
    }
    
    #[test]
    fn test_total_supply() {
        let env = Env::default();
        let contract_id = env.register_contract(None, SimpleToken);
        let client = SimpleTokenClient::new(&env, &contract_id);
        let user = Address::generate(&env);
        
        client.mint(&user, &500);
        assert_eq!(client.total_supply(), 500);
    }
}`,
    validationKeywords: ['#[test]', '#[cfg(test)]', 'mod tests', 'assert_eq!', 'Env::default()'],
    hints: [
      'Start with `#[cfg(test)]` and `mod tests { ... }`.',
      'Create an environment with `Env::default()` inside each test.',
      'Use `assert_eq!` to verify expected values.'
    ],
  },

  // ============================================
  // ADVANCED LEVEL
  // ============================================
  {
    id: 'token-contract',
    title: 'Building a Token Contract',
    level: 'advanced',
    order: 1,
    xp: 400,
    estimatedMinutes: 20,
    description: 'Build a complete token contract with minting, burning, and transfers.',
    theory: `
# Building a Token Contract 🪙

Let's build a full-featured token contract following Soroban standards!

## Token Interface
A proper token contract needs:
- **mint** — Create new tokens
- **burn** — Destroy tokens
- **transfer** — Move tokens between accounts
- **balance** — Check account balance
- **total_supply** — Total tokens in circulation

## Soroban Token Standard
The Stellar ecosystem has a token interface standard:

\`\`\`rust
pub trait TokenInterface {
    fn mint(env: Env, to: Address, amount: i128);
    fn burn(env: Env, from: Address, amount: i128);
    fn transfer(env: Env, from: Address, to: Address, amount: i128);
    fn balance(env: Env, account: Address) -> i128;
    fn total_supply(env: Env) -> i128;
}
\`\`\`

## Safety Checks
Always validate:
- ✅ Amounts must be positive
- ✅ Sender has enough balance
- ✅ Authorization is verified
- ✅ Overflow protection

## Your Task
Implement the transfer and burn functions for the token contract.
    `,
    starterCode: `use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
enum DataKey {
    Balance(Address),
    TotalSupply,
    Admin,
}

#[contract]
pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalSupply, &0i128);
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        
        if amount <= 0 { panic!("Amount must be positive"); }
        
        let mut balance: i128 = env.storage().persistent()
            .get(&DataKey::Balance(to.clone())).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &balance);
        
        let mut supply: i128 = env.storage().instance()
            .get(&DataKey::TotalSupply).unwrap_or(0);
        supply += amount;
        env.storage().instance().set(&DataKey::TotalSupply, &supply);
        
        env.events().publish((symbol_short!("mint"),), (to, amount));
    }

    /// TODO: Implement transfer
    /// - Verify 'from' is authorized
    /// - Check amount > 0
    /// - Check 'from' has enough balance
    /// - Decrease 'from' balance, increase 'to' balance
    /// - Emit "transfer" event
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        // YOUR CODE HERE
        
    }

    /// TODO: Implement burn
    /// - Verify 'from' is authorized  
    /// - Check amount > 0
    /// - Check 'from' has enough balance
    /// - Decrease balance and total supply
    /// - Emit "burn" event
    pub fn burn(env: Env, from: Address, amount: i128) {
        // YOUR CODE HERE
        
    }

    pub fn balance(env: Env, account: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(account)).unwrap_or(0)
    }

    pub fn total_supply(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0)
    }
}

fn main() {
    println!("✅ Full token contract is valid!");
}`,
    solution: `pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
    from.require_auth();
    if amount <= 0 { panic!("Amount must be positive"); }
    
    let mut from_balance: i128 = env.storage().persistent()
        .get(&DataKey::Balance(from.clone())).unwrap_or(0);
    if from_balance < amount { panic!("Insufficient balance"); }
    
    from_balance -= amount;
    env.storage().persistent().set(&DataKey::Balance(from.clone()), &from_balance);
    
    let mut to_balance: i128 = env.storage().persistent()
        .get(&DataKey::Balance(to.clone())).unwrap_or(0);
    to_balance += amount;
    env.storage().persistent().set(&DataKey::Balance(to.clone()), &to_balance);
    
    env.events().publish((symbol_short!("transfer"),), (from, to, amount));
}

pub fn burn(env: Env, from: Address, amount: i128) {
    from.require_auth();
    if amount <= 0 { panic!("Amount must be positive"); }
    
    let mut balance: i128 = env.storage().persistent()
        .get(&DataKey::Balance(from.clone())).unwrap_or(0);
    if balance < amount { panic!("Insufficient balance"); }
    
    balance -= amount;
    env.storage().persistent().set(&DataKey::Balance(from.clone()), &balance);
    
    let mut supply: i128 = env.storage().instance()
        .get(&DataKey::TotalSupply).unwrap_or(0);
    supply -= amount;
    env.storage().instance().set(&DataKey::TotalSupply, &supply);
    
    env.events().publish((symbol_short!("burn"),), (from, amount));
}`,
    validationKeywords: ['require_auth', 'Insufficient balance', 'transfer', 'burn', 'events().publish'],
    hints: [
      'Start with `from.require_auth()` to verify authorization.',
      'Always check that the balance is sufficient before deducting.',
      'Don\'t forget to update both the from and to balances for transfer.',
      'For burn, decrease both the account balance and total supply.'
    ],
  },
  {
    id: 'cross-contract',
    title: 'Cross-Contract Calls',
    level: 'advanced',
    order: 2,
    xp: 400,
    estimatedMinutes: 20,
    description: 'Learn how to make contracts interact with each other on Soroban.',
    theory: `
# Cross-Contract Calls 🔗

In the real world, contracts need to interact with each other. Soroban makes this possible through cross-contract calls.

## How It Works

### 1. Define the Interface
\`\`\`rust
use soroban_sdk::contractclient;

#[contractclient(name = "TokenClient")]
pub trait TokenInterface {
    fn transfer(env: Env, from: Address, to: Address, amount: i128);
    fn balance(env: Env, account: Address) -> i128;
}
\`\`\`

### 2. Call Another Contract
\`\`\`rust
let token_client = TokenClient::new(&env, &token_address);
token_client.transfer(&from, &to, &amount);
\`\`\`

## DEX Example
A simple swap contract might:
1. Take token A from user
2. Calculate exchange rate
3. Send token B to user

\`\`\`rust
pub fn swap(env: Env, user: Address, 
            token_a: Address, token_b: Address,
            amount_in: i128) {
    user.require_auth();
    
    let client_a = TokenClient::new(&env, &token_a);
    let client_b = TokenClient::new(&env, &token_b);
    
    // Transfer token A from user to this contract
    client_a.transfer(&user, &env.current_contract_address(), &amount_in);
    
    // Calculate amount out (simplified)
    let amount_out = amount_in * 98 / 100; // 2% fee
    
    // Send token B to user
    client_b.transfer(&env.current_contract_address(), &user, &amount_out);
}
\`\`\`

## Your Task
Complete the escrow contract that uses cross-contract calls.
    `,
    starterCode: `use soroban_sdk::{contract, contractimpl, contracttype, contractclient, 
                     Address, Env, symbol_short};

// Token interface for cross-contract calls
#[contractclient(name = "TokenClient")]
pub trait TokenInterface {
    fn transfer(env: Env, from: Address, to: Address, amount: i128);
    fn balance(env: Env, account: Address) -> i128;
}

#[contracttype]
pub struct EscrowDeal {
    pub seller: Address,
    pub buyer: Address,
    pub token: Address,
    pub amount: i128,
    pub is_complete: bool,
}

#[contracttype]
enum DataKey {
    Deal(u32),
    DealCount,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Create a new escrow deal
    /// Buyer deposits tokens into the contract
    pub fn create_deal(env: Env, buyer: Address, seller: Address, 
                       token: Address, amount: i128) -> u32 {
        buyer.require_auth();
        
        // TODO: Transfer tokens from buyer to this contract
        // Hint: Use TokenClient::new(&env, &token)
        
        
        let deal_id: u32 = env.storage().instance()
            .get(&DataKey::DealCount).unwrap_or(0);
        
        let deal = EscrowDeal {
            seller: seller.clone(),
            buyer: buyer.clone(),
            token,
            amount,
            is_complete: false,
        };
        
        env.storage().persistent().set(&DataKey::Deal(deal_id), &deal);
        env.storage().instance().set(&DataKey::DealCount, &(deal_id + 1));
        
        deal_id
    }

    /// Complete the deal — release tokens to seller
    pub fn complete_deal(env: Env, deal_id: u32, buyer: Address) {
        buyer.require_auth();
        
        let mut deal: EscrowDeal = env.storage().persistent()
            .get(&DataKey::Deal(deal_id)).unwrap();
        
        if deal.is_complete { panic!("Deal already completed"); }
        if deal.buyer != buyer { panic!("Only buyer can complete"); }
        
        // TODO: Transfer tokens from contract to seller
        
        
        deal.is_complete = true;
        env.storage().persistent().set(&DataKey::Deal(deal_id), &deal);
        
        env.events().publish((symbol_short!("complete"),), deal_id);
    }
}

fn main() {
    println!("✅ Escrow contract structure is valid!");
}`,
    solution: `// In create_deal:
let token_client = TokenClient::new(&env, &token);
token_client.transfer(&buyer, &env.current_contract_address(), &amount);

// In complete_deal:
let token_client = TokenClient::new(&env, &deal.token);
token_client.transfer(&env.current_contract_address(), &deal.seller, &deal.amount);`,
    validationKeywords: ['TokenClient::new', 'token_client.transfer', 'current_contract_address'],
    hints: [
      'Create a token client with `TokenClient::new(&env, &token_address)`.',
      'Use `env.current_contract_address()` to get this contract\'s address.',
      'For create_deal, transfer FROM buyer TO contract. For complete_deal, transfer FROM contract TO seller.'
    ],
  },
  {
    id: 'advanced-patterns',
    title: 'Advanced Design Patterns',
    level: 'advanced',
    order: 3,
    xp: 500,
    estimatedMinutes: 25,
    description: 'Master advanced patterns like upgradeable contracts and time-locks.',
    theory: `
# Advanced Design Patterns 🏗️

Let's explore powerful patterns used in production Soroban contracts.

## 1. Time-Locked Operations
Use ledger timestamps for time-based logic:

\`\`\`rust
let current_time = env.ledger().timestamp();
if current_time < unlock_time {
    panic!("Too early!");
}
\`\`\`

## 2. Multi-Signature Pattern
Require multiple approvals:

\`\`\`rust
#[contracttype]
pub struct Proposal {
    pub action: u32,
    pub approvals: Vec<Address>,
    pub required: u32,
    pub executed: bool,
}
\`\`\`

## 3. Factory Pattern
Deploy contracts from contracts:

\`\`\`rust
pub fn create_token(env: Env, wasm_hash: BytesN<32>, 
                    name: String, symbol: String) -> Address {
    let new_contract = env.deployer()
        .with_current_contract(salt)
        .deploy(wasm_hash);
    new_contract
}
\`\`\`

## 4. Reentrancy Guard
\`\`\`rust
enum DataKey { Locked }

fn lock(env: &Env) {
    if env.storage().instance().has(&DataKey::Locked) {
        panic!("Reentrancy detected!");
    }
    env.storage().instance().set(&DataKey::Locked, &true);
}

fn unlock(env: &Env) {
    env.storage().instance().remove(&DataKey::Locked);
}
\`\`\`

## Your Task
Build a time-locked vault with a reentrancy guard.
    `,
    starterCode: `use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
enum DataKey {
    Balance(Address),
    LockUntil(Address),
    Locked,
}

#[contract]
pub struct TimeLockVault;

#[contractimpl]
impl TimeLockVault {
    /// Deposit tokens with a time lock
    pub fn deposit(env: Env, user: Address, amount: u64, lock_duration: u64) {
        user.require_auth();
        Self::reentrancy_check(&env);
        
        let mut balance: u64 = env.storage().persistent()
            .get(&DataKey::Balance(user.clone())).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&DataKey::Balance(user.clone()), &balance);
        
        // TODO: Calculate unlock_time = current ledger timestamp + lock_duration
        // TODO: Store the unlock time for this user
        // Hint: env.ledger().timestamp()
        
        
        Self::reentrancy_release(&env);
        env.events().publish((symbol_short!("deposit"),), (user, amount));
    }
    
    /// Withdraw tokens (only after lock expires)
    pub fn withdraw(env: Env, user: Address, amount: u64) {
        user.require_auth();
        Self::reentrancy_check(&env);
        
        // TODO: Check if current time >= unlock_time
        // TODO: Verify sufficient balance
        // TODO: Decrease balance
        // TODO: Remove lock if balance is 0
        
        
        Self::reentrancy_release(&env);
        env.events().publish((symbol_short!("withdraw"),), (user, amount));
    }
    
    /// Get user's balance
    pub fn get_balance(env: Env, user: Address) -> u64 {
        env.storage().persistent().get(&DataKey::Balance(user)).unwrap_or(0)
    }
    
    /// Get unlock time for user
    pub fn get_unlock_time(env: Env, user: Address) -> u64 {
        env.storage().persistent().get(&DataKey::LockUntil(user)).unwrap_or(0)
    }
    
    // TODO: Implement reentrancy_check
    // Should panic if Locked key exists
    fn reentrancy_check(env: &Env) {
        
    }
    
    // TODO: Implement reentrancy_release
    // Should remove the Locked key
    fn reentrancy_release(env: &Env) {
        
    }
}

fn main() {
    println!("✅ Time-locked vault with reentrancy guard is valid!");
}`,
    solution: `// deposit:
let unlock_time = env.ledger().timestamp() + lock_duration;
env.storage().persistent().set(&DataKey::LockUntil(user.clone()), &unlock_time);

// withdraw:
let unlock_time: u64 = env.storage().persistent()
    .get(&DataKey::LockUntil(user.clone())).unwrap_or(0);
let current_time = env.ledger().timestamp();
if current_time < unlock_time {
    panic!("Tokens are still locked");
}
let mut balance: u64 = env.storage().persistent()
    .get(&DataKey::Balance(user.clone())).unwrap_or(0);
if amount > balance { panic!("Insufficient balance"); }
balance -= amount;
env.storage().persistent().set(&DataKey::Balance(user.clone()), &balance);

// reentrancy_check:
fn reentrancy_check(env: &Env) {
    if env.storage().instance().has(&DataKey::Locked) {
        panic!("Reentrancy detected!");
    }
    env.storage().instance().set(&DataKey::Locked, &true);
}

// reentrancy_release:
fn reentrancy_release(env: &Env) {
    env.storage().instance().remove(&DataKey::Locked);
}`,
    validationKeywords: ['ledger().timestamp()', 'LockUntil', 'reentrancy', 'Locked', 'still locked'],
    hints: [
      'Get the current time with `env.ledger().timestamp()`.',
      'Calculate unlock_time as `current_time + lock_duration`.',
      'For reentrancy guard, check if `DataKey::Locked` exists, panic if so, otherwise set it.',
      'Always release the reentrancy lock at the end of the function.'
    ],
  },
]

// Challenge data — standalone coding challenges separate from lessons
export const challenges = [
  {
    id: 'fix-transfer',
    title: 'Fix the Broken Transfer',
    level: 'beginner',
    type: 'fix',
    xp: 200,
    description: 'This transfer function has 3 bugs. Find and fix them all!',
    starterCode: `// This transfer function has 3 bugs. Find and fix them!

fn transfer(from_balance: u64, to_balance: u64, amount: u64) 
    -> Result<(u64, u64), String> 
{
    // Bug 1: Wrong comparison
    if amount < 0 {
        return Err(String::from("Amount must be positive"));
    }
    
    // Bug 2: Missing balance check
    let new_from = from_balance - amount;
    
    // Bug 3: Wrong operation
    let new_to = to_balance - amount;
    
    Ok((new_from, new_to))
}

fn main() {
    // Test 1: Normal transfer
    match transfer(100, 50, 30) {
        Ok((from, to)) => {
            assert_eq!(from, 70);
            assert_eq!(to, 80);
            println!("✅ Test 1 passed: Normal transfer");
        },
        Err(e) => println!("❌ Test 1 failed: {}", e),
    }
    
    // Test 2: Insufficient balance
    match transfer(10, 50, 20) {
        Ok(_) => println!("❌ Test 2 failed: Should have returned error"),
        Err(e) => {
            println!("✅ Test 2 passed: {}", e);
        },
    }
    
    // Test 3: Zero amount
    match transfer(100, 50, 0) {
        Ok(_) => println!("❌ Test 3 failed: zero amount should fail"),
        Err(_) => println!("✅ Test 3 passed: Zero amount rejected"),
    }
}`,
    validationKeywords: ['amount <= 0', 'amount == 0', 'from_balance < amount', 'to_balance + amount'],
    hints: [
      'Bug 1: Think about what happens when amount is 0. Should that be allowed?',
      'Bug 2: What if `from_balance` is less than `amount`? You\'ll get an underflow!',
      'Bug 3: When transferring, the recipient should RECEIVE tokens, not lose them.'
    ],
  },
  {
    id: 'complete-staking',
    title: 'Complete the Staking Logic',
    level: 'intermediate',
    type: 'complete',
    xp: 350,
    description: 'The staking contract is missing its reward calculation. Complete it!',
    starterCode: `use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

const REWARD_RATE: u64 = 5; // 5% annual reward

#[contracttype]
pub struct StakeInfo {
    pub amount: u64,
    pub start_time: u64,
}

#[contracttype]
enum DataKey {
    Stake(Address),
    TotalStaked,
}

#[contract]
pub struct StakingContract;

#[contractimpl]
impl StakingContract {
    pub fn stake(env: Env, user: Address, amount: u64) {
        user.require_auth();
        
        let stake_info = StakeInfo {
            amount,
            start_time: env.ledger().timestamp(),
        };
        
        env.storage().persistent().set(&DataKey::Stake(user), &stake_info);
        
        let mut total: u64 = env.storage().instance()
            .get(&DataKey::TotalStaked).unwrap_or(0);
        total += amount;
        env.storage().instance().set(&DataKey::TotalStaked, &total);
    }
    
    /// TODO: Calculate pending rewards
    /// Formula: (amount * REWARD_RATE * time_elapsed) / (100 * 365 * 24 * 3600)
    /// time_elapsed = current_timestamp - start_time
    pub fn pending_rewards(env: Env, user: Address) -> u64 {
        // YOUR CODE HERE
        
    }
    
    /// TODO: Unstake and claim rewards
    /// Should return (staked_amount, rewards)
    pub fn unstake(env: Env, user: Address) -> (u64, u64) {
        user.require_auth();
        // YOUR CODE HERE
        
    }
}

fn main() {
    println!("✅ Staking contract structure is valid!");
}`,
    validationKeywords: ['pending_rewards', 'time_elapsed', 'REWARD_RATE', 'unstake', 'stake_info'],
    hints: [
      'Get the stake info from storage using `env.storage().persistent().get(&DataKey::Stake(user))`.',
      'Calculate time elapsed as `env.ledger().timestamp() - stake_info.start_time`.',
      'For unstake, calculate rewards first, then remove the stake from storage.'
    ],
  },
  {
    id: 'optimize-storage',
    title: 'Optimize Storage Usage',
    level: 'advanced',
    type: 'optimize',
    xp: 500,
    description: 'This contract uses storage inefficiently. Optimize it to reduce costs!',
    starterCode: `use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, Map};

// INEFFICIENT: Each field stored separately
// TODO: Optimize by grouping related data into structs
// and using appropriate storage types

#[contracttype]
enum DataKey {
    UserName(Address),
    UserEmail(Address),
    UserLevel(Address),
    UserXp(Address),
    UserBadge1(Address),
    UserBadge2(Address),
    UserBadge3(Address),
    UserStreak(Address),
    UserLastLogin(Address),
    TotalUsers,
}

#[contract]
pub struct InefficientContract;

#[contractimpl]
impl InefficientContract {
    pub fn create_user(env: Env, user: Address, name: String, email: String) {
        // INEFFICIENT: 9 separate storage writes!
        env.storage().persistent().set(&DataKey::UserName(user.clone()), &name);
        env.storage().persistent().set(&DataKey::UserEmail(user.clone()), &email);
        env.storage().persistent().set(&DataKey::UserLevel(user.clone()), &1u32);
        env.storage().persistent().set(&DataKey::UserXp(user.clone()), &0u64);
        env.storage().persistent().set(&DataKey::UserBadge1(user.clone()), &false);
        env.storage().persistent().set(&DataKey::UserBadge2(user.clone()), &false);
        env.storage().persistent().set(&DataKey::UserBadge3(user.clone()), &false);
        env.storage().persistent().set(&DataKey::UserStreak(user.clone()), &0u32);
        env.storage().persistent().set(&DataKey::UserLastLogin(user.clone()), &0u64);
        
        let mut total: u32 = env.storage().instance()
            .get(&DataKey::TotalUsers).unwrap_or(0);
        total += 1;
        env.storage().instance().set(&DataKey::TotalUsers, &total);
    }
    
    // TODO: Rewrite this contract using a UserProfile struct
    // to store all user data in a single storage entry
    // 
    // Hint: 
    // #[contracttype]
    // pub struct UserProfile {
    //     name: String,
    //     email: String,
    //     level: u32,
    //     xp: u64,
    //     badges: Vec<bool>,
    //     streak: u32,
    //     last_login: u64,
    // }
}

fn main() {
    println!("✅ Optimize the storage usage!");
}`,
    validationKeywords: ['struct UserProfile', '#[contracttype]', 'pub struct', 'single storage'],
    hints: [
      'Create a `UserProfile` struct that groups all user data together.',
      'Use a single `DataKey::User(Address)` instead of multiple keys.',
      'This reduces the number of storage operations from 9 to just 1!'
    ],
  },
]
