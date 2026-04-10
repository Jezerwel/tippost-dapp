# TipPost - Pay-to-Like Social Platform

A decentralized social platform where users create posts with images and captions, and others show appreciation by tipping ETH. Built with Solidity, React, and ethers.js on the Sepolia testnet.

## What is TipPost?

TipPost reimagines social media engagement by combining content sharing with real value transfer. Instead of just clicking a like button, users send ETH tips to creators they appreciate. Every like becomes a direct financial contribution.

The platform runs entirely on-chain, meaning no central authority controls your content or earnings. Creators receive 100% of the tips sent to their posts instantly, with no platform fees or withdrawal delays.

## Features

- **Create Posts**: Share images with captions (up to 280 characters)
- **Pay-to-Like**: Show appreciation by sending ETH tips (minimum 0.001 ETH)
- **Instant Earnings**: Creators receive tips directly to their wallet
- **No Platform Fees**: 100% of tips go to creators
- **Transparent History**: All posts and tips stored on-chain
- **Anti-Gaming Protection**: Prevent self-liking and duplicate likes
- **Real-time Updates**: UI reflects blockchain state changes immediately
- **Wallet Integration**: Seamless MetaMask connection

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Smart Contract** | Solidity ^0.8.28 |
| **Contract Framework** | Hardhat |
| **Security** | OpenZeppelin ReentrancyGuard |
| **Frontend** | React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 (utility-first, `@tailwindcss/vite`) |
| **Build Tool** | Vite 8 |
| **Web3 Library** | ethers.js v6 |
| **UI Notifications** | react-toastify |
| **Network** | Sepolia Testnet |
| **Wallet** | MetaMask |

## Smart Contract

The TipPost smart contract is deployed on the Sepolia testnet:

**Contract Address:** `0x538Cd3c96Ab67500b487dD872b9b008169066D6C`

**Etherscan (Sepolia):** [View on Etherscan](https://sepolia.etherscan.io/address/0x538Cd3c96Ab67500b487dD872b9b008169066D6C)

### Contract Features
- Minimum tip amount: 0.001 ETH
- Maximum caption length: 280 characters
- Gas-optimized storage with packed structs
- CEI (Checks-Effects-Interactions) pattern for security
- Custom errors for gas efficiency

## Live Demo

**Deployed Frontend:** [https://tippost-grino.vercel.app](https://tippost-grino.vercel.app/)

## Getting Started

### Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MetaMask** browser extension - [Download here](https://metamask.io/)
3. **Sepolia ETH** for testing - See [Getting Sepolia ETH](#getting-sepolia-eth) section

### Install MetaMask

1. Install the MetaMask extension for your browser
2. Create a new wallet or import an existing one
3. Switch to the Sepolia testnet (it should appear in the network dropdown)
4. If Sepolia is not visible, add it manually:
   - Network Name: Sepolia
   - RPC URL: https://rpc.sepolia.org
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io

## Running Locally

Follow these steps to run the project on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tippost-dapp.git
cd tippost-dapp
```

### 2. Install Dependencies

Install contract dependencies:
```bash
cd contracts
npm install
cd ..
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 3. Set Up Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit the `.env` file and add your configuration:

```env
# Contract Configuration
VITE_CONTRACT_ADDRESS=0x...

# Chain ID (11155111 for Sepolia testnet)
VITE_CHAIN_ID=11155111

# Optional: Alchemy/Infura RPC (for more reliable connections)
# VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

### 4. Run the Frontend Locally

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Connect Your Wallet

1. Open the app in your browser
2. Click "Connect Wallet" button
3. Approve the connection in MetaMask
4. Ensure you are on the Sepolia testnet

## Testing

Run the Hardhat test suite to verify contract functionality:

```bash
cd contracts
npx hardhat test
```

### Test Coverage

The test suite covers:
- Post creation with valid data
- Post creation validation (empty URL, long captions)
- Liking posts with various tip amounts
- Error cases (insufficient tips, duplicate likes, self-liking)
- Earnings tracking verification
- Event emission validation

### Run Tests with Coverage

```bash
npx hardhat coverage
```

### Run Tests on Local Network

Start a local Hardhat node:
```bash
npx hardhat node
```

In another terminal, run tests against the local node:
```bash
npx hardhat test --network localhost
```

## Deployment

### Deploy the Smart Contract

1. Set up your deployment private key:
```bash
cd contracts
cp .env.example .env
```

2. Edit `.env` and add:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here  # Never commit this!
ETHERSCAN_API_KEY=your_etherscan_api_key  # For verification
```

3. Run the deployment script:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

4. Verify the contract on Etherscan:
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Deploy the Frontend

The frontend can be deployed to any static hosting service. For Vercel:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add `VITE_CONTRACT_ADDRESS` with your deployed contract address
   - Add `VITE_CHAIN_ID` as `11155111`

4. Redeploy with new environment variables:
```bash
vercel --prod
```

## Environment Variables

### Frontend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CONTRACT_ADDRESS` | Yes | Deployed TipPost contract address |
| `VITE_CHAIN_ID` | Yes | Chain ID (11155111 for Sepolia) |
| `VITE_RPC_URL` | No | Custom RPC URL for better reliability |

### Contracts (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `SEPOLIA_RPC_URL` | Yes | Sepolia network RPC endpoint |
| `PRIVATE_KEY` | Yes | Deployer wallet private key |
| `ETHERSCAN_API_KEY` | No | For contract verification |

**Security Warning:** Never commit `.env` files containing real private keys. The `.env` files are included in `.gitignore` by default.

## Getting Sepolia ETH

You need Sepolia test ETH to interact with the contract. Here are free faucets:

### Official Faucets

1. **Alchemy Sepolia Faucet**
   - URL: https://sepoliafaucet.com/
   - Amount: 0.5 ETH per day
   - Requires: Free Alchemy account

2. **Infura Sepolia Faucet**
   - URL: https://www.infura.io/faucet/sepolia
   - Amount: 0.5 ETH per day
   - Requires: Free Infura account

3. **Google Cloud Faucet**
   - URL: https://cloud.google.com/application/web3/faucet/ethereum/sepolia
   - Amount: 0.05 ETH per day
   - Requires: Google account

### Alternative Faucets

4. **QuickNode Sepolia Faucet**
   - URL: https://faucet.quicknode.com/ethereum/sepolia
   - Amount: 0.05 ETH
   - Requires: QuickNode account

5. **PoW Faucet (No signup)**
   - URL: https://sepolia-faucet.pk910.de/
   - Amount: Variable (mine in browser)
   - Requires: Just your wallet address

### Using the Faucet

1. Copy your MetaMask wallet address (0x...)
2. Visit one of the faucets above
3. Paste your address and request ETH
4. Wait 30-60 seconds for the transaction to confirm
5. Check your MetaMask balance on Sepolia network

## Project Structure

```
tippost-dapp/
├── contracts/              # Smart contract code
│   ├── contracts/
│   │   └── TipPost.sol    # Main contract
│   ├── test/              # Contract tests
│   ├── scripts/           # Deployment scripts
│   └── hardhat.config.ts  # Hardhat configuration
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── vite.config.ts     # Vite configuration
└── .sisyphus/             # Project documentation
```

## Author

Created by Sisyphus-Junior as part of the TipPost dApp work plan.

## License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 TipPost Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**Note:** This is a testnet application. Do not use mainnet ETH. Always verify you are connected to the Sepolia testnet before making transactions.
