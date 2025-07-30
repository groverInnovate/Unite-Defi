import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { WalletProvider } from '@/providers/wallet'
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
        font-sans bg-space-black min-h-screen scrollbar-cosmic
      `}>
        <WalletProvider>
          <div className="relative z-10">{children}</div>
        </WalletProvider>
      </body>
    </html>
  )
}



