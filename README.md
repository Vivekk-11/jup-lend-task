# Jupiter Lend Position Manager

A Next.js application replicating the Jupiter Lend borrowing interface with full transaction capabilities for managing collateralized debt positions.

## 📹 Demo Video

[screencast-from-2025-12-10-13-20-04_iOklIHzK.webm](https://github.com/user-attachments/assets/bbdd7d32-ea3b-44a9-935f-0a30102856d9)

## 🚀 Live Demo

[\[Deployment URL\]](https://jup-lend-task.vercel.app/)

## 📋 Overview

This project is a fully functional replica of Jupiter Lend's position management interface, allowing users to interact with their leveraged positions on Solana. All operations execute real on-chain transactions with actual token transfers.

**Important Note**: This application is connected to a specific pre-existing position (Position ID: 5762) that was manually created for demonstration purposes. Users cannot create new positions through this interface - it is designed solely for managing the existing position.

## ✨ Features

### Core Functionality

- **Deposit Collateral**: Add SOL as collateral to your position (automatically wraps SOL to wSOL before deposit)
- **Withdraw Collateral**: Remove SOL from your position (respecting LTV limits)
- **Borrow**: Take out USDC loans against your collateral
- **Repay**: Pay back borrowed USDC to reduce debt

All four operations use Jupiter Lend's `getOperateIx` function with proper instruction handling:

- Deposit: `col_amount > 0` (with SOL → wSOL syncing)
- Withdraw: `col_amount < 0`
- Borrow: `debt_amount > 0`
- Repay: `debt_amount < 0`

### Real-Time Data Integration

- **Live Position Data**: Fetches actual position state using `getCurrentPositionState` from `@jup-ag/lend/borrow`
- **Oracle Price Feeds**: Real-time SOL/USDC price from Switchboard Oracle
- **Vault State**: Directly queries Jupiter Lend's vault IDL for accurate debt calculations
- **Dynamic LTV Calculation**: Real-time health factor and liquidation risk assessment

### What's Real vs Mocked

✅ **Real (Fully Integrated)**:

- All position data (collateral, debt, LTV)
- SOL/USDC price from Oracle
- Transaction execution with actual transfers
- Wallet balance fetching
- Health factor and liquidation calculations
- All modals and position state updates
- wSOL wrapping for deposits

❌ **Mocked**:

- Supply APY
- Debt APY

_(Note: APY values are hardcoded as they require historical rate calculations not exposed in the SDK)_

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Wallet**: Jupiter Wallet Adapter (Unified Wallet)
- **UI Components**: shadcn/ui
- **Icons**: react-icons
- **Typography**: Inter font (matching Jupiter Lend's design)
- **State Management**: React Hooks

## 🎨 Design

- **Visual Accuracy**: ~80-90% match with Jupiter Lend's interface
- **Color Scheme**: Near-exact color matching with original
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile
- **Animations**: Smooth transitions and loading states

## 🔑 Position Configuration
```typescript
// Hardcoded position ID (manually created for this demo)
const VAULT_ID = 1;
const POSITION_ID = 5762;
```
