import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata:  Metadata = {
  title: 'CosmicDeFi - Cross-Chain Swap Interface',
  description: 'A futuristic DeFi interface for seamless cross-chain swaps',
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
        {/* FIXED: Simplified background elements */}
        <div className="cosmic-background">
          {/* Floating particles */}
          <div className="floating-particle" style={{left: '10%', animationDelay: '0s'}}></div>
          <div className="floating-particle" style={{left: '25%', animationDelay: '2s'}}></div>
          <div className="floating-particle" style={{left: '40%', animationDelay: '4s'}}></div>
          <div className="floating-particle" style={{left: '55%', animationDelay: '1s'}}></div>
          <div className="floating-particle" style={{left: '70%', animationDelay: '3s'}}></div>
          <div className="floating-particle" style={{left: '85%', animationDelay: '5s'}}></div>
          
          {/* Shooting stars */}
          <div className="shooting-star" style={{top: '20%', left: '10%', animationDelay: '0s'}}></div>
          <div className="shooting-star" style={{top: '60%', left: '80%', animationDelay: '2s'}}></div>
          <div className="shooting-star" style={{top: '40%', left: '20%', animationDelay: '4s'}}></div>
        </div>
        
        {/* Your app content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}

