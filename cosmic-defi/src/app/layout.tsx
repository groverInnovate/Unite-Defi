import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { WalletProvider } from '@/providers/wallet'
import { Toaster } from 'react-hot-toast'
import './globals.css'

// Fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// ✅ FIXED: Correct syntax with colon and proper variable name
export const metadata: Metadata = {
  title: 'CosmicDeFi - Cross-Chain Swap Interface',
  description: 'A futuristic DeFi interface for seamless cross-chain swaps using 1inch Fusion+ technology',
  keywords: ['DeFi', '1inch', 'Fusion+', 'Cross-chain', 'Monad', 'Ethereum', 'Swap'],
  authors: [{ name: 'Cosmic DeFi Team' }],
  openGraph: {
    title: 'CosmicDeFi - Cross-Chain Swap Interface',
    description: 'Extending 1inch Fusion+ to Monad for seamless cross-chain trading',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CosmicDeFi - Cross-Chain Swap Interface',
    description: 'Extending 1inch Fusion+ to Monad for seamless cross-chain trading',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`
        ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}
        font-sans relative min-h-screen overflow-x-hidden scrollbar-cosmic
      `}>
        {/* 🌌 Cosmic Connected Blockchain Network Background */}
        <div className="blockchain-network">
          {/* Bitcoin Node - Top Left */}
          <div className="token-node large token-bitcoin" style={{
            top: '15%',
            left: '8%',
            animationDelay: '0s'
          }}>
            <div className="token-logo">₿</div>
          </div>

          {/* Ethereum Node - Top Right */}
          <div className="token-node large token-ethereum" style={{
            top: '20%',
            right: '12%',
            animationDelay: '1s'
          }}>
            <div className="token-logo">Ξ</div>
          </div>

          {/* Sui Node - Center Left */}
          <div className="token-node medium token-sui" style={{
            top: '45%',
            left: '15%',
            animationDelay: '2s'
          }}>
            <div className="token-logo">SUI</div>
          </div>

          {/* Chainlink Node - Center */}
          <div className="token-node medium token-chainlink" style={{
            top: '35%',
            left: '50%',
            transform: 'translateX(-50%)',
            animationDelay: '3s'
          }}>
            <div className="token-logo">LINK</div>
          </div>

          {/* Polygon Node - Center Right */}
          <div className="token-node medium token-polygon" style={{
            top: '55%',
            right: '20%',
            animationDelay: '4s'
          }}>
            <div className="token-logo">MATIC</div>
          </div>

          {/* Solana Node - Bottom Left */}
          <div className="token-node small token-solana" style={{
            bottom: '25%',
            left: '25%',
            animationDelay: '5s'
          }}>
            <div className="token-logo">SOL</div>
          </div>

          {/* Connection Lines */}
          {/* Bitcoin to Ethereum */}
          <div className="connection-line" style={{
            top: '18%',
            left: '16%',
            width: '68%',
            transform: 'rotate(-2deg)',
            animationDelay: '0.5s'
          }}></div>

          {/* Ethereum to Chainlink */}
          <div className="connection-line" style={{
            top: '28%',
            left: '50%',
            width: '35%',
            transform: 'rotate(25deg)',
            animationDelay: '1.5s'
          }}></div>

          {/* Sui to Chainlink */}
          <div className="connection-line" style={{
            top: '41%',
            left: '23%',
            width: '32%',
            transform: 'rotate(-8deg)',
            animationDelay: '2.5s'
          }}></div>

          {/* Chainlink to Polygon */}
          <div className="connection-line" style={{
            top: '45%',
            left: '57%',
            width: '25%',
            transform: 'rotate(15deg)',
            animationDelay: '3.5s'
          }}></div>

          {/* Sui to Solana */}
          <div className="connection-line" style={{
            bottom: '35%',
            left: '20%',
            width: '18%',
            transform: 'rotate(-45deg)',
            animationDelay: '4.5s'
          }}></div>

          {/* Bitcoin to Sui (vertical connection) */}
          <div className="connection-line" style={{
            top: '25%',
            left: '12%',
            width: '25%',
            transform: 'rotate(75deg)',
            animationDelay: '1s'
          }}></div>
        </div>

        {/* Main App Content */}
        <WalletProvider>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </WalletProvider>
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(31, 41, 55, 0.95)',
              color: '#f9fafb',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              backdropFilter: 'blur(8px)',
            },
          }}
        />
      </body>
    </html>
  )
}