# Cosmic DeFi

**Cross-chain Limit Orders with Trust-Minimized Resolution**

Cosmic DeFi is a custom-built, cross-chain trading infrastructure inspired by the 1inch ecosystem. It allows users to create off-chain signed orders that can be securely, permissionlessly, and decentrally filled by resolvers. This system is powered by a modified version of the `@1inch/cross-chain-sdk` and `LimitOrderProtocol`, enhanced for cross-chain functionality.

---

## 🔧 Key Features

* **Custom Chain Support:** Integrated **Monad Testnet** as both a source and destination chain, extending the functionality of the `@1inch/cross-chain-sdk`.
* **Testnet Deployment:** The **LimitOrderProtocol (LOP)** and **EscrowFactory** contracts have been deployed on both **Ethereum Sepolia** and **Monad Testnet**, enabling a complete simulation of cross-chain swaps.

**Contract Addresses:**

* Sepolia LOP: `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`
* Monad LOP: `0xd946F0bc4292a5b83894df44fc931e7852d728ff`

---

## 🧾 How It Works

### 👤 User Flow

1.  **Create Order Off-Chain:** A user creates an off-chain [EIP-712](https://eips.ethereum.org/EIPS/eip-712) compliant signature containing order details (e.g., `makerAsset`, `takerAsset`, `amounts`, `chain info`, `timelocks`) and a **hashlock secret**.
2.  **Store Order:** The signed order and metadata are stored in a **MongoDB** database, which acts as the off-chain order book.

### 🧩 Resolver Flow

1.  **See Pending Orders:** A resolver polls the backend for open orders.
2.  **Deploy Resolver Contract:** The resolver deploys their own `Resolver.sol` contract instance to manage all escrow interactions.
3.  **Initiate Escrow on Source Chain:** The resolver calls `fillOrderWithTarget` on the LOP on the source chain, which locks funds via the **EscrowFactory**.
4.  **Deploy Escrow on Destination Chain:** The resolver then calls `deployDstEscrow` to initialize the escrow on the destination chain for the taker.
5.  **Reveal Secret & Settle:** Once escrows are active, the secret from the hashlock is revealed. The resolver uses this secret to unlock and withdraw funds from the source escrow, completing the swap.

---

## 📦 Technologies Used

* **Solidity**
* **1inch CrossChain SDK** (custom fork)
* **1inch LimitOrderProtocol**
* **Ethers.js**
* **MongoDB**
* **Framer Motion / React** (Frontend)
* **Sepolia & Monad Testnets**

---

## 📁 Repository Structure

* `/monad-backend`: Contains the modified 1inch SDK fork with Monad support.
* `/backend`: Manages order creation, MongoDB interaction, and resolver endpoints.
* `/cosmic-defi`: The frontend, including the order creation and resolver dashboard interface.

---

## 🚀 Getting Started

1.  **Run the setup script:**
    ```bash
    ./setup.sh
    ```
2.  **Start the backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
3.  **Start the frontend:**
    ```bash
    cd cosmic-defi
    npm install
    npm run dev
    ```