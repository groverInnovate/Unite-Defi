# CosmicDeFi - Cross-Chain Swap Interface 🌌⛓️

A stunning, futuristic DeFi interface for seamless cross-chain token swaps powered by 1inch Fusion+ technology. Experience the cosmos of decentralized finance with our immersive space-themed UI featuring dynamic blockchain network visualization.

## ✨ Features

- **Cross-Chain Token Swaps** - Seamless swapping between Ethereum, Monad, and other supported chains
- **1inch Fusion+ Integration** - Powered by 1inch's advanced cross-chain technology
- **Real-Time Price Charts** - Interactive cryptocurrency price visualization with multiple timeframes
- **Immersive Space Theme** - Stunning cosmic background with twinkling stars and connected blockchain networks
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm/yarn/pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/groverInnovate/Unite-Defi.git
cd cosmic-defi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_1INCH_API_KEY=your_1inch_api_key_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ENABLE_TESTNETS=true
```

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the interface.

## 🏗️ Project Structure

```
cosmic-defi/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles with cosmic theme
│   │   ├── layout.tsx         # Root layout with cosmic background
│   │   └── page.tsx          # Main application page
│   ├── components/           # React components
│   │   ├── charts/          # Price charts and analytics
│   │   ├── trading/         # Swap interface components
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── providers/           # Context providers
│   ├── services/           # API services
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
└── tailwind.config.js     # Tailwind configuration
```

## 🎨 Cosmic Theme

### Key Components
- **Dense Star Field** - 40+ layers of twinkling stars
- **Blockchain Network** - Animated token nodes (Bitcoin, Ethereum, Sui, etc.)
- **Connection Lines** - Glowing data flow between chains
- **Meteor Effects** - Dynamic cosmic animations

### Color Palette
```css
--color-space-black: #000007      /* Deep space background */
--color-cosmic-purple: #6366f1    /* Primary brand color */
--color-nebula-blue: #3b82f6      /* Secondary accent */
--color-aurora-green: #10b981     /* Success states */
--color-stellar-pink: #ec4899     /* Highlights */
```

## 🔗 Supported Blockchains

- ✅ **Ethereum** - Full swap support
- ✅ **Monad** - Cross-chain swaps via Fusion+
- 🧪 **Sepolia** - Testnet support

## 🛠️ Development

### Available Scripts
```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Code linting
```

### Tech Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **RainbowKit** - Wallet connection
- **Wagmi** - Ethereum React hooks
- **Framer Motion** - Animations

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables in dashboard
3. Deploy automatically on push

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_1INCH_API_KEY` | 1inch API key for swaps | Yes |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `NEXT_PUBLIC_ENABLE_TESTNETS` | Enable testnet support | No |

## 🐛 Troubleshooting

**Wallet Connection Issues**
- Verify WalletConnect project ID is set
- Check browser wallet extension

**API Errors**
- Confirm 1inch API key is valid
- Check network connectivity

**Styling Issues**
- Clear Next.js cache: `rm -rf .next && npm run dev`
- Verify Tailwind CSS compilation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 1inch Network - Cross-chain technology
- RainbowKit - Wallet UX
- Wagmi - Ethereum hooks
- Tailwind CSS - Styling framework

<div align="center">

**Made with 💜 for the DeFi Community**

[Website](https://cosmicdefi.com) -  [Discord](https://discord.gg/cosmicdefi) -  [Twitter](https://twitter.com/cosmicdefi)

</div>

Sources
