# 🎭 SaucerHedge Vincent Packages - Complete Documentation

> **Enterprise-Grade Vincent Abilities for AI-Powered DeFi Hedging on Hedera**

---

## 📋 Table of Contents

- [🎯 Quick Overview](#quick-overview)
- [📦 Published Abilities](#published-abilities)
- [🌐 IPFS Deployment](#ipfs-deployment)
- [📚 NPM Packages](#npm-packages)
- [🏗️ Architecture](#architecture)
- [🚀 Installation & Setup](#installation--setup)
- [📝 Ability Details](#ability-details)
- [🔄 Deployment Pipeline](#deployment-pipeline)
- [📡 Integration Guide](#integration-guide)
- [🧪 Testing](#testing)
- [🐛 Troubleshooting](#troubleshooting)
- [🤝 Contributing](#contributing)

---

## 🎯 Quick Overview

SaucerHedge Vincent Packages are **7 production-ready abilities** designed for the Vincent Protocol ecosystem. These abilities enable users to:

- ✅ **Open hedged LP positions** - Protect from impermanent loss
- ✅ **Close hedged positions** - Exit with P&L realization
- ✅ **Manage vault deposits** - Secure token storage
- ✅ **Check position status** - Real-time performance metrics
- ✅ **Vault position management** - Advanced hedging strategies
- ✅ **Position policies** - Max position size enforcement

---

## 📦 Published Abilities

### Complete Ability Portfolio

```
┌─────────────────────────────────────────────────────────────┐
│        SaucerHedge Vincent Abilities v1.0.4                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣  Open Hedged Position Ability                          │
│     └─ Create protected LP positions                       │
│                                                             │
│  2️⃣  Close Hedged Position Ability                         │
│     └─ Exit and collect profits                            │
│                                                             │
│  3️⃣  Open Vault Hedged Position Ability                    │
│     └─ Use vault funds for hedging                         │
│                                                             │
│  4️⃣  Close Vault Hedged Position Ability                   │
│     └─ Close vault-managed positions                       │
│                                                             │
│  5️⃣  Get Position Status Ability                           │
│     └─ Real-time performance analytics                     │
│                                                             │
│  6️⃣  Deposit to Vault Ability                              │
│     └─ Secure multi-asset deposits                         │
│                                                             │
│  ⚙️  Max Position Size Policy                              │
│     └─ Risk management enforcement                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Ability Specifications with IPFS & NPM Links

| # | Ability | Package | Version | IPFS CID | IPFS Gateway | NPM Registry |
|---|---------|---------|---------|----------|--------------|--------------|
| 1 | **Open Hedged Position** | `@saucerhedgevault/open-hedged-position-ability` | 1.0.4 | `bafkreiaiiptz4b7qze5zdrk6jtra53cg5v544mm2kspaq2wwsxct7cqp34` | [🔗 Pinata Gateway](https://gateway.pinata.cloud/ipfs/bafkreiaiiptz4b7qze5zdrk6jtra53cg5v544mm2kspaq2wwsxct7cqp34) | [📦 NPM](https://www.npmjs.com/package/@saucerhedgevault/open-hedged-position-ability) |
| 2 | **Close Hedged Position** | `@saucerhedgevault/close-hedged-position-ability` | 1.0.4 | `bafkreibrtwbqn2fafobcqpw5b2j7xnved65qd2ubrmzl6bluwzs7ptcnha` | [🔗 Pinata Gateway](https://gateway.pinata.cloud/ipfs/bafkreibrtwbqn2fafobcqpw5b2j7xnved65qd2ubrmzl6bluwzs7ptcnha) | [📦 NPM](https://www.npmjs.com/package/@saucerhedgevault/close-hedged-position-ability) |
| 3 | **Open Vault Position** | `@saucerhedgevault/open-vault-hedged-position-ability` | 1.0.4 | `bafkreigafo6ld57gdo2rwwd2w5gkddritf3jz6qd26gqt2vk4u7c5lriny` | [🔗 Pinata Gateway](https://gateway.pinata.cloud/ipfs/bafkreigafo6ld57gdo2rwwd2w5gkddritf3jz6qd26gqt2vk4u7c5lriny) | [📦 NPM](https://www.npmjs.com/package/@saucerhedgevault/open-vault-hedged-position-ability) |
| 4 | **Close Vault Position** | `@saucerhedgevault/close-vault-hedged-position-ability` | 1.0.4 | `bafkreib4yhggcla7xqcjoefiv42mihe2l63aopimytnpbpknshyucba744` | [🔗 Pinata Gateway](https://gateway.pinata.cloud/ipfs/bafkreib4yhggcla7xqcjoefiv42mihe2l63aopimytnpbpknshyucba744) | [📦 NPM](https://www.npmjs.com/package/@saucerhedgevault/close-vault-hedged-position-ability) |
| 5 | **Get Position Status** | `@saucerhedgevault/get-position-status-ability` | 1.0.4 | `bafkreiaok7eliimdlcxrbgiankxfeqj77gpnvh734ehbswkqj54q3vgkfi` | [🔗 Pinata Gateway](https://gateway.pinata.cloud/ipfs/bafkreiaok7eliimdlcxrbgiankxfeqj77gpnvh734ehbswkqj54q3vgkfi) | [📦 NPM](https://www.npmjs.com/package/@saucerhedgevault/get-position-status-ability) |
| 6 | **Deposit to Vault** | `@saucerhedgevault/deposit-to-vault-ability` | 1.0.4 | `bafkreihtvcrvbk7gwlidhepwyqhzg2o5kzzf2ldihf4bizqrcswcdaqja4` | [🔗 Pinata Gateway](https://gateway.pinata.cloud/ipfs/bafkreihtvcrvbk7gwlidhepwyqhzg2o5kzzf2ldihf4bizqrcswcdaqja4) | [📦 NPM](https://www.npmjs.com/package/@saucerhedgevault/deposit-to-vault-ability) |
| 7 | **Max Position Policy** | `@saucerhedgevault/max-position-size-policy` | 1.0.4 | `bafkreibbgyxl5frt3a3vhifz66jxekph5fgzovhhpngs3j2c2ivygtzenq` | [🔗 Pinata Gateway](https://gateway.pinata.cloud/ipfs/bafkreibbgyxl5frt3a3vhifz66jxekph5fgzovhhpngs3j2c2ivygtzenq) | [📦 NPM](https://www.npmjs.com/package/@saucerhedgevault/max-position-size-policy) |

---

## 🌐 IPFS Deployment

### Pinata IPFS Gateway Status

All abilities are deployed to IPFS via **Pinata** for permanent, decentralized storage and retrieval.

#### Deployment Details

```
┌─────────────────────────────────────────────────────────────────┐
│                  IPFS Deployment Status                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🌐 IPFS Provider: Pinata (pinata.cloud)                        │
│ 📊 Replication: 2 regions (FRA1 + NYC1)                        │
│ 🔄 Refresh Rate: Every deployment                              │
│ ✅ Status: All 7 abilities uploaded                            │
│ 💾 Total Storage: ~319 KB                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### IPFS Access Instructions

```bash
# Access via IPFS CID directly
ipfs get bafkreiaiiptz4b7qze5zdrk6jtra53cg5v544mm2kspaq2wwsxct7cqp34

# Or via Pinata Gateway
curl https://gateway.pinata.cloud/ipfs/bafkreiaiiptz4b7qze5zdrk6jtra53cg5v544mm2kspaq2wwsxct7cqp34

# Pin to your own IPFS node
ipfs pin add bafkreiaiiptz4b7qze5zdrk6jtra53cg5v544mm2kspaq2wwsxct7cqp34
```

---

## 📚 NPM Packages

### Official NPM Registry

All packages are published under the **@saucerhedgevault** organization scope:

```bash
npm registry: https://registry.npmjs.org
organization: @saucerhedgevault
total packages: 7
version: 1.0.4
status: ✅ All Active
```

### Package Installation

```bash
# Install individual ability
npm install @saucerhedgevault/open-hedged-position-ability

# Or with pnpm
pnpm add @saucerhedgevault/open-hedged-position-ability

# Install all 7 abilities
pnpm add \
  @saucerhedgevault/open-hedged-position-ability \
  @saucerhedgevault/close-hedged-position-ability \
  @saucerhedgevault/open-vault-hedged-position-ability \
  @saucerhedgevault/close-vault-hedged-position-ability \
  @saucerhedgevault/get-position-status-ability \
  @saucerhedgevault/deposit-to-vault-ability \
  @saucerhedgevault/max-position-size-policy
```

### Package Contents

Each package includes:

```
dist/
├── src/
│   ├── lib/
│   │   └── vincent-ability.ts/js    (Core ability implementation)
│   └── generated/
│       └── vincent-ability-metadata.json    (Metadata file with IPFS CID)
├── lib/
│   ├── index.d.ts                   (TypeScript declarations)
│   ├── index.js                     (Compiled JS)
│   └── vincent-ability.d.ts         (Type definitions)
└── tsconfig.tsbuildinfo            (Build info)

package.json
├── name: @saucerhedgevault/ability-name
├── version: 1.0.4
├── main: dist/lib/index.js
├── types: dist/lib/index.d.ts
├── files: [
│   "dist",
│   "dist/src/generated/vincent-ability-metadata.json"
│ ]
└── exports:
    ├── import: dist/lib/index.js
    └── types: dist/lib/index.d.ts
```

---

## 🏗️ Architecture

### Monorepo Structure

```
saucerhedge-vincent/
├── packages/
│   ├── open-hedged-position-ability/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── vincent-ability.ts
│   │   │   └── index.ts
│   │   ├── vincent-ability-metadata.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── close-hedged-position-ability/
│   ├── open-vault-hedged-position-ability/
│   ├── close-vault-hedged-position-ability/
│   ├── get-position-status-ability/
│   ├── deposit-to-vault-ability/
│   └── max-position-size-policy/
├── scripts/
│   ├── deploy-to-npm.ts
│   ├── deploy-to-ipfs.ts
│   └── validate-metadata.ts
├── nx.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
└── .env.example
```

### Metadata Structure

Each ability includes a **`vincent-ability-metadata.json`** file with IPFS CID:

```json
{
  "name": "@saucerhedgevault/open-hedged-position-ability",
  "version": "1.0.4",
  "title": "Open Hedged Position",
  "description": "Opens a hedged LP position to protect liquidity from impermanent loss",
  "ipfsCid": "bafkreiaiiptz4b7qze5zdrk6jtra53cg5v544mm2kspaq2wwsxct7cqp34",
  "ipfsGateway": "https://gateway.pinata.cloud/ipfs/bafkreiaiiptz4b7qze5zdrk6jtra53cg5v544mm2kspaq2wwsxct7cqp34",
  "supportedPolicies": [
    "max-position-size-policy"
  ],
  "inputs": {
    "type": "object",
    "properties": {
      "amount_usdc": {
        "type": "number",
        "description": "Amount of USDC to hedge"
      },
      "amount_hbar": {
        "type": "number",
        "description": "Amount of HBAR to hedge"
      }
    },
    "required": ["amount_usdc", "amount_hbar"]
  }
}
```

---

## 🚀 Installation & Setup

### Prerequisites

```bash
# Required versions
node >= 18.0.0
pnpm >= 8.0.0
npm >= 9.0.0 (for publishing)
```

### Step 1: Clone & Install

```bash
# Clone monorepo
git clone https://github.com/saucerhedgevault/vincent-packages.git
cd vincent-packages

# Install dependencies
pnpm install

# Verify
pnpm --version
nx --version
```

### Step 2: Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Fill required fields
# PINATA_JWT=your_jwt
# NPM_TOKEN=your_npm_token
```

### Step 3: Build All Abilities

```bash
# Build all packages
pnpm nx run-many --target=build --all

# Output:
# ✔  nx run open-hedged-position-ability:build
# ✔  nx run close-hedged-position-ability:build
# ✔  nx run open-vault-hedged-position-ability:build
# ... (all 7 packages)
```

### Step 4: Verify Build

```bash
# Check dist folders
ls packages/*/dist/

# Verify metadata files are in generated/
ls packages/*/dist/src/generated/vincent-ability-metadata.json
```

---

## 📝 Ability Details

### 1. Open Hedged Position Ability

**Purpose**: Open a new LP hedging position

```
📦 Package: @saucerhedgevault/open-hedged-position-ability
📍 Version: 1.0.4
🎯 Function: Opens hedge with 79/21 allocation
📥 Inputs:
  - amount_usdc: number (USDC to hedge)
  - amount_hbar: number (HBAR to hedge)
📤 Outputs:
  - position_id: string
  - tx_hash: string
  - lp_value: number
  - short_value: number
🌐 IPFS: bafkreiaiiptz4b7qze5zdrk6jtra53cg5v544mm2kspaq2wwsxct7cqp34
```

**Usage Example**:
```typescript
import { openHedgedPosition } from '@saucerhedgevault/open-hedged-position-ability';

const result = await openHedgedPosition({
  amount_usdc: 100,
  amount_hbar: 5
});
```

### 2. Close Hedged Position Ability

**Purpose**: Close and collect profits from active hedge

```
📦 Package: @saucerhedgevault/close-hedged-position-ability
📍 Version: 1.0.4
🎯 Function: Exit and realize P&L
📥 Inputs:
  - position_id: string
📤 Outputs:
  - tx_hash: string
  - usdc_return: number
  - hbar_return: number
  - pnl_percentage: number
🌐 IPFS: bafkreibrtwbqn2fafobcqpw5b2j7xnved65qd2ubrmzl6bluwzs7ptcnha
```

### 3. Open Vault Hedged Position Ability

**Purpose**: Open hedge using vault-managed funds

```
📦 Package: @saucerhedgevault/open-vault-hedged-position-ability
📍 Version: 1.0.4
🎯 Function: Vault-backed hedging
📥 Inputs:
  - vault_percentage: number (0-100)
📤 Outputs:
  - position_id: string
  - tx_hash: string
  - vault_used: number
🌐 IPFS: bafkreigafo6ld57gdo2rwwd2w5gkddritf3jz6qd26gqt2vk4u7c5lriny
```

### 4. Close Vault Hedged Position Ability

**Purpose**: Close vault-managed position

```
📦 Package: @saucerhedgevault/close-vault-hedged-position-ability
📍 Version: 1.0.4
🎯 Function: Exit vault position
📥 Inputs:
  - position_id: string
📤 Outputs:
  - tx_hash: string
  - total_return: number
🌐 IPFS: bafkreib4yhggcla7xqcjoefiv42mihe2l63aopimytnpbpknshyucba744
```

### 5. Get Position Status Ability

**Purpose**: Real-time position analytics

```
📦 Package: @saucerhedgevault/get-position-status-ability
📍 Version: 1.0.4
🎯 Function: Fetch metrics
📥 Inputs:
  - position_id: string
📤 Outputs:
  - lp_value: number
  - short_value: number
  - il_protection: number
  - apy: number
  - fees_earned: number
🌐 IPFS: bafkreiaok7eliimdlcxrbgiankxfeqj77gpnvh734ehbswkqj54q3vgkfi
```

### 6. Deposit to Vault Ability

**Purpose**: Multi-asset vault deposits

```
📦 Package: @saucerhedgevault/deposit-to-vault-ability
📍 Version: 1.0.4
🎯 Function: Secure deposits
📥 Inputs:
  - amount_usdc: number
  - amount_hbar: number
📤 Outputs:
  - tx_hash: string
  - usdc_shares: number
  - hbar_shares: number
🌐 IPFS: bafkreihtvcrvbk7gwlidhepwyqhzg2o5kzzf2ldihf4bizqrcswcdaqja4
```

### 7. Max Position Size Policy

**Purpose**: Risk enforcement policy

```
📦 Package: @saucerhedgevault/max-position-size-policy
📍 Version: 1.0.4
🎯 Function: Validate position size
📥 Inputs:
  - position_size: number
  - max_allowed: number
📤 Outputs:
  - is_valid: boolean
  - violation_margin: number
🌐 IPFS: bafkreibbgyxl5frt3a3vhifz66jxekph5fgzovhhpngs3j2c2ivygtzenq
```

---

## 🔄 Deployment Pipeline

### Manual Deployment

```bash
# 1. Build all packages
pnpm nx run-many --target=build --all

# 2. Deploy to IPFS
pnpm deploy:ipfs

# Expected output:
# 🌐 Uploading deposit-to-vault-ability...
# ✅ IPFS CID: bafkreihtvcrvbk7gwlidhepwyqhzg2o5kzzf2ldihf4bizqrcswcdaqja4
# 🌐 Uploading open-hedged-position-ability...
# ✅ IPFS CID: bafkreiaiiptz4b7qze5zdrk6jtra53cg5v544mm2kspaq2wwsxct7cqp34
# ... (5 more)

# 3. Deploy to NPM
pnpm deploy:npm

# Expected output:
# 📦 Publishing @saucerhedgevault/open-hedged-position-ability@1.0.4...
# ✅ Published successfully!
# 📦 Publishing @saucerhedgevault/close-hedged-position-ability@1.0.4...
# ✅ Published successfully!
# ... (5 more)
```

---

## 📡 Integration Guide

### Using with SaucerHedge Backend

```typescript
// src/agent/tools/abilityLoader.ts automatically discovers:
const abilities = [
  '@saucerhedgevault/open-hedged-position-ability',
  '@saucerhedgevault/close-hedged-position-ability',
  '@saucerhedgevault/open-vault-hedged-position-ability',
  '@saucerhedgevault/close-vault-hedged-position-ability',
  '@saucerhedgevault/get-position-status-ability',
  '@saucerhedgevault/deposit-to-vault-ability',
];

// Backend automatically:
// 1. Fetches from NPM registry
// 2. Loads vincent-ability-metadata.json with IPFS CID
// 3. Builds tools for LLM
// 4. Executes abilities based on user intent
```

---

## 🧪 Testing

### Run All Tests

```bash
# Test all packages
pnpm test

# Test specific package
pnpm test open-hedged-position-ability

# Watch mode
pnpm test --watch
```

---

## 🐛 Troubleshooting

### Issue: "Metadata file not found in package"

```bash
# Solution: Ensure metadata is in dist/src/generated/
mkdir -p packages/ability-name/dist/src/generated
cp packages/ability-name/vincent-ability-metadata.json \
   packages/ability-name/dist/src/generated/

# Rebuild
pnpm build
```

### Issue: "Failed to publish to NPM"

```bash
# Check npm login
npm whoami

# If not logged in:
npm login

# Retry publish
pnpm deploy:npm
```

### Issue: "IPFS CID invalid (Non-base58 character)"

```bash
# Validate metadata JSON
npx jsonlint packages/*/vincent-ability-metadata.json

# Ensure no special characters in CID field
```

---

## 🤝 Contributing

### Adding New Ability

```bash
# 1. Create new package
mkdir packages/my-new-ability

# 2. Add vincent-ability-metadata.json with IPFS CID
# 3. Build & deploy
pnpm nx run-many --target=build --all
pnpm deploy:ipfs && pnpm deploy:npm
```

---

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/saucerhedgevault/vincent-packages/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/saucerhedgevault/vincent-packages/discussions)
- 📧 **Email**: support@saucerhedge.com

---

## 📊 Deployment Status Dashboard

```
╔════════════════════════════════════════════════════════════════╗
║           🎭 VINCENT PACKAGES DEPLOYMENT STATUS               ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  NPM Registry (@saucerhedgevault)                             ║
║  ├─ Total Packages: 7                                         ║
║  ├─ Version: 1.0.4                                            ║
║  ├─ Status: ✅ ALL PUBLISHED                                 ║
║  └─ Last Updated: 2025-10-26 21:45 UTC                       ║
║                                                                ║
║  IPFS Storage (Pinata)                                        ║
║  ├─ Total Abilities: 7                                        ║
║  ├─ Total Size: ~319 KB                                       ║
║  ├─ Status: ✅ ALL STORED                                    ║
║  └─ Last Updated: 2025-10-26 21:40 UTC                       ║
║                                                                ║
║  Backend Integration                                          ║
║  ├─ Auto-loading: ✅ ENABLED                                 ║
║  ├─ Tool Discovery: ✅ WORKING                               ║
║  ├─ Ability Execution: ✅ FUNCTIONAL                         ║
║  └─ Last Verified: 2025-10-26 21:50 UTC                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

**Built with ❤️ by SaucerHedge Team**

*Last Updated: October 26, 2025*

*All 7 abilities deployed. IPFS stored. NPM published. Production ready. 🚀*