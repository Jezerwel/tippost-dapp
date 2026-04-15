# TipPost - Pay-to-Like Social dApp

TipPost is a decentralized social app where each like is an ETH tip.  
Creators publish image posts, and supporters tip directly on-chain (Sepolia) with no platform fee.

## What You Can Do

- Connect MetaMask and switch to Sepolia
- Create image posts with captions (up to 280 chars)
- Like a post by tipping `0.0001 ETH` minimum
- Prevent self-like and duplicate-like actions
- View posts and creator earnings in real time
- Track transactions via Sepolia Etherscan links in the UI

## Tech Stack

| Layer | Technology |
| --- | --- |
| Smart contracts | Solidity `0.8.28`, OpenZeppelin `ReentrancyGuard` |
| Ethereum dev tooling | Hardhat, Hardhat Ignition, TypeChain |
| Frontend | React 19 + TypeScript + Vite |
| Web3 integration | ethers.js v6 |
| Styling/UI | Tailwind CSS v4, react-toastify |
| Network | Sepolia testnet |

## Live Deployment

- Frontend: [https://tippost-grino.vercel.app](https://tippost-grino.vercel.app)
- Contract (Sepolia): `0x6b9088A547A650E9fD01Def9173652af5B8146cF`
- Etherscan: [View contract](https://sepolia.etherscan.io/address/0x6b9088A547A650E9fD01Def9173652af5B8146cF)

## Prerequisites

- Node.js 18+
- npm
- MetaMask extension
- Sepolia ETH for testing

## Quick Start (Frontend + Deployed Contract)

1. Clone the repo

```bash
git clone https://github.com/yourusername/tippost-dapp.git
cd tippost-dapp
```

2. Install dependencies

```bash
cd contracts && npm install
cd ../frontend && npm install
cd ..
```

3. Configure frontend env

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_CONTRACT_ADDRESS=0x6b9088A547A650E9fD01Def9173652af5B8146cF
VITE_CHAIN_ID=11155111
```

4. Run the frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`, connect MetaMask, and use Sepolia.

## Contract Development

From `contracts/`:

### Compile

```bash
npm run compile
```

### Test

```bash
npm test
```

### Clean artifacts

```bash
npm run clean
```

### Deploy to Sepolia (Ignition)

1. Create env file

```bash
cd contracts
cp .env.example .env
```

2. Set values in `contracts/.env`

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

3. Deploy

```bash
npx hardhat ignition deploy ignition/modules/TipPost.ts --network sepolia
```

4. (Optional) Verify

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## ABI Sync Workflow (Contract -> Frontend)

When contract ABI changes:

```bash
cd contracts
npm run compile
npx ts-node scripts/extractAbi.ts
```

This updates `frontend/src/abi/TipPost.json`.

## Frontend Environment Variables

`frontend/.env.example` currently includes:

- `VITE_CONTRACT_ADDRESS` (required)
- `VITE_CHAIN_ID` (used in part of frontend config)

The frontend also supports optional RPC overrides:

- `VITE_SEPOLIA_RPC_URL` (optional)
- `VITE_SEPOLIA_WSS_URL` (optional)

## Current Smart Contract Rules

- Minimum tip: `0.0001 ether` (`LIKEMINIMUM_COST`)
- Max caption length: `280` (`MAX_CAPTION_LENGTH`)
- Reverts for:
  - empty image URL
  - invalid post id
  - self-like
  - duplicate like
  - failed transfer

## Test Coverage (Current Suite)

The existing test file validates:

- Post creation and `PostCreated` event emission
- Successful post liking with ETH tip
- Revert on self-like
- Revert on duplicate-like

## Project Structure

```text
tippost-dapp/
├── contracts/
│   ├── contracts/TipPost.sol
│   ├── test/TipPost.test.ts
│   ├── ignition/modules/TipPost.ts
│   ├── scripts/extractAbi.ts
│   └── hardhat.config.ts
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── config/
│   │   └── abi/TipPost.json
│   └── .env.example
└── README.md
```

## Getting Sepolia ETH

Common faucets:

- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)
- [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

## Notes

- This is a **testnet-only** app. Do not use mainnet private keys.
- Keep `.env` files out of version control.
- Always confirm MetaMask is connected to Sepolia before transacting.
