# 🤖 Carepanion — Empathy-Powered Eldercare through AI & Blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Solana](https://img.shields.io/badge/Solana-Web3-9945FF.svg)](https://solana.com/)

**Carepanion** is an AI-powered platform that combines **empathetic voice technology** with **blockchain-based incentives** to improve the quality of eldercare.
By collecting, labeling, and analyzing real voice samples from users, Carepanion trains emotion-aware AI models to help companion robots respond more compassionately — while rewarding contributors transparently on-chain.

### The Problem
- **70% of elderly people** experience loneliness and social isolation
- Current AI companions lack emotional intelligence and cultural sensitivity
- Proprietary datasets are expensive, biased, and not transparent
- No incentive mechanism for quality data contribution

### Our Solution
- **Crowdsource emotional voice labels** from diverse global contributors
- **Blockchain-verified data provenance** - every label is recorded on Solana
- **Token rewards** for quality contributions (0.001 SOL per label on MVP)
- **Privacy-first approach** - only anonymized demographic data collected

---

## 🧩 System Overview


### High-Level Architecture
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ◄─────► │   Backend    │ ◄─────► │  Database   │
│  (React)    │         │  (FastAPI)   │         │ (PostgreSQL)│
└──────┬──────┘         └──────┬───────┘         └─────────────┘
       │                       │
       │                       │
       └───────────┬───────────┘
                   │
                   ▼
         ┌─────────────────┐
         │Solana Blockchain│
         │ (Smart Contract)│
         └─────────────────┘
```
---

## ✨ Core Features

* 🔐 **Secure Authentication** — Wallet-based identity using Solana
* 🧠 **AI Voice Labeling** — Empathy-based annotation system for eldercare AI
* 💎 **Blockchain Rewards** — Solana smart contracts for transparent contributor rewards
* 🧾 **Data Management Backend** — Secure API for storing and validating voice metadata
* 📈 **Progress & Reward Dashboard** — Real-time tracking of contributions and token earnings
* 🌍 **Open Impact** — Contributing to a global dataset that improves care robotics worldwide

---

## 🛠️ Technology Stack

#### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: Shadcn/ui + Tailwind CSS
- **Wallet Integration**: @solana/wallet-adapter-react
- **State Management**: TanStack Query (React Query)
- **Deployment**: Vercel

#### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Blockchain Integration**: Solana Python SDK (solana-py)
- **Deployment**: Render.com

#### Smart Contract
- **Blockchain**: Solana (Devnet for MVP)
- **Language**: Native Rust
- **Architecture**: Program Derived Addresses (PDAs)
- **Features**: On-chain label verification + automated rewards

---

## ⏳ User Workflow

### Step 1: Wallet Connection
```
User → Connect Wallet (Phantom/Solflare) → Backend creates JWT
```
- **Technical Decision**: Using Solana wallet as universal identity
- **Why**: No passwords, no email collection, truly Web3-native
- **MVP Simplification**: Wallet address only (no signature verification)

### Step 2: Profile Setup (First-time users only)
User provides:
- Gender (Female/Male/Non-binary/Prefer not to say)
- Age Bracket (60-69, 70-79, 80-89, 90+)
- Hearing Ability (Normal, Mild loss, Moderate loss, Severe loss, Profound)
- Nationality (TH, US, JP, KR, GB, AU)

**Why this matters**: Elderly care AI needs to understand diverse voices across different demographics and hearing abilities.

### Step 3: Voice Labeling Interface
```
Backend → Fetch unlabeled audio → User rates → Submit → Record on-chain → Reward user
```

Users rate each 5-10 second voice clip on:
1. **Comfort Level** (1-5): How comfortable would an elderly person feel hearing this?
2. **Clarity** (1-5): How easy is it to understand the speech?
3. **Speaking Rate** (Slow/Medium/Fast): Natural speaking pace
4. **Perceived Empathy** (Low/Medium/High): Does the voice convey warmth and care?
5. **Notes** (Optional): Additional observations

**Feature Prioritization**: We focused on 4 core metrics that directly impact elderly care quality, rather than 20+ attributes that would slow down labeling.

---

## ❔ Major Technical Decisions

### Decision 1: Why Solana?
**Options Considered:**
- Ethereum (too expensive, ~$5 per transaction)
- Polygon (cheaper but still ~$0.01 per tx)
- Solana (< $0.0001 per tx)

**Chosen**: Solana
- **Speed**: 400ms confirmation time vs 15s+ on other chains
- **Cost**: Micro-transactions economically viable
- **UX**: No gas wars, predictable fees
- **Ecosystem**: Strong wallet support (Phantom, Solflare)

### Decision 2: Hybrid Storage (Option B)
**Why not fully on-chain?**
- **Cost**: 10,000 labels × 0.01 SOL = 100 SOL ($10,000+)
- **Query Performance**: SQL queries > on-chain reads for analytics
- **Flexibility**: Can add new label fields without contract upgrades

**Our Approach:**
- **On-chain**: Label hash, user stats, reward distribution
- **Off-chain**: Full label data, audio files, user profiles
- **Best of both**: Verifiable + scalable

### Decision 3: Native Rust vs Anchor
**Why Native Rust?**
- **Learning**: Team wanted to understand Solana fundamentals
- **Control**: Fine-grained optimization for our use case
- **Size**: Smaller program size = lower rent costs

**Trade-off**: More complex but educational

### Decision 4: JWT Authentication (MVP)
**Why not full SIWS (Sign-In with Solana)?**
- **MVP Speed**: Wallet address sufficient for identity
- **Upgrade Path**: Can add signature verification later
- **Security**: JWT + HTTPS adequate for devnet testing

**Production Plan**: Implement challenge-response with signature

---

## 🧬 Integration: How We Used Solana

### 1. Wallet as Identity
```typescript
// Frontend: @solana/wallet-adapter-react
const { publicKey, connected } = useWallet();

// On connect → Backend creates user
POST /api/auth/login { wallet_address: publicKey.toBase58() }
```

### 2. On-Chain Label Verification
```python
# Backend: Generate proof
label_hash = hashlib.sha256(label_data.encode()).digest()

# Call Solana program
instruction = create_record_label_instruction(
    user_wallet=user_pubkey,
    label_hash=label_hash,
    audio_id=audio_id
)

# Submit transaction
signature = await solana_client.send_transaction(instruction)
```

### 3. Transparent Rewards
- Every label = verifiable on-chain transaction
- Users can see their `total_rewards_earned` in explorer
- Community can audit fairness

### 4. Decentralized Governance (Future)
- Token-weighted voting on label quality standards
- Community-driven audio sourcing
- DAO treasury for rewards pool

---

## 🔮 Future Roadmap

### Phase 1: Launch (Current MVP)
- ✅ Core labeling platform
- ✅ Solana devnet integration
- ✅ Basic rewards system

### Phase 2: Token Launch 
- 🔜 $CARE token on Solana
- 🔜 Staking for bonus rewards
- 🔜 NFT badges for top contributors

### Phase 3: Scale 
- 🔜 10+ languages supported
- 🔜 Real audio from partner hospitals
- 🔜 API for AI developers

### Phase 4: Governance 
- 🔜 DAO for platform decisions
- 🔜 Community audio curation
- 🔜 Revenue sharing model

---

## 🧭 Repository Structure

```
carepanion/
├──packages/
    ├── frontend/           # React + Solana wallet adapter
    ├── backend/            # FastAPI + Solana Python SDK
    ├── smart-contract/     # Rust program source
```

### Deployment URLs
- **Frontend**: https://mvp-carepanion.vercel.app
- **Backend**: https://mvp-carepanion-backend.onrender.com 
- **Smart Contract**: [431uCPYwa2niRi2xpsbvrwmS74wC7gyfAfHkGz8VmkvK]

### Security Considerations
- JWT tokens expire after 24 hours
- CORS restricted to frontend domain
- Rate limiting on API endpoints
- No private keys stored in browser/backend


---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

* [shadcn/ui](https://ui.shadcn.com/) for the elegant component framework
* [Solana Foundation](https://solana.com/) for decentralized infrastructure
* [OpenAI](https://openai.com/) for advancing empathetic AI research

---

**Developed with ❤️ by Carepanion Team**

> We're not just building a dataset - we're building the future of empathetic AI.