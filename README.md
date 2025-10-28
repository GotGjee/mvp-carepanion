# 🤖 Carepanion — Empathy-Powered Eldercare through AI & Blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Solana](https://img.shields.io/badge/Solana-Web3-9945FF.svg)](https://solana.com/)

**Carepanion** is an AI-powered platform that combines **empathetic voice technology** with **blockchain-based incentives** to improve the quality of eldercare.
By collecting, labeling, and analyzing real voice samples from users, Carepanion trains emotion-aware AI models to help companion robots respond more compassionately — while rewarding contributors transparently on-chain.

---

## 🧩 System Overview

```
carepanion/
├── frontend/          # React + Next.js user interface
├── backend/           # FastAPI / Node.js API server
├── smartcontract/     # Solana smart contracts for rewards & verification
├── shared/            # Common interfaces, constants, and utilities
├── scripts/           # Deployment and automation scripts
└── README.md
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

## 🚀 Getting Started

### 1️⃣ Prerequisites

* Node.js v18+
* Python 3.10+
* Solana CLI
* Git

---

### 2️⃣ Installation

Clone the repository:

```bash
git clone https://github.com/GotGjee/mvp-carepanion.git
cd mvp-carepanion
```

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# runs on http://localhost:3000
```

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
# runs on http://localhost:8000
```

#### Smart Contract Deployment

```bash
cd smartcontract
anchor build
anchor deploy
```

---

## 🧠 Architecture

```
┌────────────────────────────┐
│        Frontend (Next.js)  │
│  - React + Tailwind UI     │
│  - Solana wallet connect   │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│     Backend API (FastAPI)  │
│  - Voice data management   │
│  - IPFS / DB storage       │
│  - Token reward logic      │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│   Smart Contract (Solana)  │
│  - Reward distribution     │
│  - Transparent ledger      │
└────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer          | Technology                                   | Purpose                               |
| -------------- | -------------------------------------------- | ------------------------------------- |
| **Frontend**   | Next.js 15, React 18, Tailwind CSS           | User interface & dashboard            |
| **Backend**    | FastAPI / Node.js                            | Data API, verification, orchestration |
| **Blockchain** | Solana, Anchor Framework                     | On-chain reward system                |
| **AI/ML**      | Python + Whisper / Emotion Models *(future)* | Voice emotion recognition             |
| **Storage**    | PostgreSQL / IPFS                            | Secure data persistence               |

---

## 🌱 Contributing

We welcome open-source contributions!
To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m "Add your feature"`)
4. Push and submit a PR

Please ensure all code follows the project’s TypeScript & Python style guidelines.

---

## 🧭 Development Principles

* Write modular and reusable components
* Ensure cross-layer type safety
* Document major functions and API endpoints
* Add unit tests for new features
* Keep commits atomic and descriptive
* Maintain consistency between frontend, backend, and smart contract logic

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

* [shadcn/ui](https://ui.shadcn.com/) for the elegant component framework
* [Solana Foundation](https://solana.com/) for decentralized infrastructure
* [OpenAI](https://openai.com/) for advancing empathetic AI research

---

## 🧭 Roadmap

* [ ] Voice Recording & Upload Module
* [ ] Emotion Recognition Model Integration
* [ ] Reward Claim Portal on Solana
* [ ] Multi-language Localization
* [ ] Mobile App Development
* [ ] IPFS Integration for Decentralized Storage
* [ ] AI Feedback Loop for Model Fine-tuning

---

**Developed with ❤️ by Carepanion Team**

> Empowering empathy through technology.
