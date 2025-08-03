# 🌌 Cosmic DeFi

**Cross-chain Limit Orders with Trust-Minimized Resolution**

Cosmic DeFi is a custom-built cross-chain trading infrastructure inspired by the 1inch ecosystem. It allows users to create off-chain signed orders that resolvers can fill in a secure, permissionless, and decentralized way. This system is powered by a carefully modified version of the [`@1inch/cross-chain-sdk`](https://github.com/1inch/cross-chain-sdk) and [`LimitOrderProtocol`](https://github.com/1inch/limit-order-protocol).

---

## 🔧 Key Modifications

We have extended the 1inch SDK and protocol in the following ways:

- ✅ **Support for Monad**  
  Added custom chain support to the `@1inch/cross-chain-sdk`, integrating the Monad testnet as both source and destination chains for orders.
  
- ✅ **Testnet Deployment**  
  Deployed the **LimitOrderProtocol (LOP)** and **EscrowFactory** contracts on both **Ethereum Sepolia** and **Monad Testnet**.  
  These deployments enable complete testing and simulation of cross-chain swaps in a real test environment.

> 📝 **Contract Addresses:**  
> - Sepolia LOP: `...`  
> - Sepolia EscrowFactory: `...`  
> - Monad LOP: `...`  
> - Monad EscrowFactory: `...`  

---

## 🧾 How It Works

### 👤 User Flow

1. **Create Order Off-Chain**  
   A user creates an **off-chain EIP-712 compliant signature** using their private key. This order includes details like `makerAsset`, `takerAsset`, `amounts`, `chain info`, `timelocks`, and a **hashlock secret**.

2. **Store Order**  
   The signed order and its metadata are saved in **MongoDB**, acting as an off-chain order book.

---

### 🧩 Resolver Flow

1. **See Pending Orders**  
   A **resolver** regularly polls the backend for open, unresolved orders.

2. **Deploy Ownable Resolver Contract**  
   To maintain separation and auditability, the resolver deploys their own instance of `Resolver.sol`, a minimal ownable contract that handles all escrow interaction logic.

3. **Initiate Escrow on Source Chain**  
   The resolver calls the `fillOrderWithTarget` function (wrapping the `FillOrderArgs`) on the **LOP** on the source chain, locking funds via the **EscrowFactory**.

4. **Deploy Escrow on Destination Chain**  
   The resolver calls `deployDstEscrow` to initialize the escrow on the destination chain for the taker.

5. **Reveal Secret & Settle**  
   Once escrows are active on both chains, the **secret** (originally committed via hashlock) is revealed to the resolver.  
   The resolver uses this secret to **unlock and withdraw funds from the source escrow**.

---

## 📦 Technologies Used

- **Solidity**
- **1inch CrossChain SDK (custom fork)**
- **1inch LimitOrderProtocol**
- **Ethers.js**
- **MongoDB**
- **Framer Motion / React (Frontend)**
- **Sepolia & Monad Testnets**

---

## 📁 Repository Structure (Coming Soon)

- `/contracts`: Solidity smart contracts (LOP, EscrowFactory, Resolver.sol)
- `/sdk`: Modified 1inch SDK fork with Monad support
- `/backend`: Order creation, MongoDB interaction, and resolver endpoints
- `/frontend`: Order creation and resolver dashboard interface

---

## 🧠 Future Work

- Add support for more chains (ZKSync, Base, etc.)
- Integrate Chainlink CCIP for native cross-chain messaging
- Build a reputation system for resolvers
- Add relayer support for gasless order creation

---

For questions or contributions, feel free to open an issue or pull request.  
Cosmic DeFi is still in active development 🚀
