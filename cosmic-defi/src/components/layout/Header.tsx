import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Wallet, Settings, BarChart3, ArrowLeftRight } from 'lucide-react'

interface HeaderProps {
  onConnectWallet?: () => void
  walletConnected?: boolean
  walletAddress?: string
}

export const Header: React.FC<HeaderProps> = ({
  onConnectWallet,
  walletConnected = false,
  walletAddress
}) => {
  // Navigation items
  const navItems = [
    { name: 'Swap', icon: ArrowLeftRight, href: '/' },
    { name: 'Portfolio', icon: Wallet, href: '/portfolio' },
    { name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ]

  // Shorten wallet address for display
  const shortAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : ''

  return (
    <motion.header
      className="sticky top-0 z-50 bg-space-black/95 backdrop-blur-md border-b border-meteor-gray/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-cosmic-purple to-stellar-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-cosmic-white">CosmicDeFi</span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-stardust-gray hover:text-cosmic-purple transition-colors duration-200"
                whileHover={{ y: -2 }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </motion.a>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {/* Network Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-asteroid-gray rounded-lg">
              <div className="w-2 h-2 bg-aurora-green rounded-full animate-pulse" />
              <span className="text-sm text-cosmic-white">Ethereum</span>
            </div>

            {/* Wallet Button */}
            {walletConnected ? (
              <motion.div
                className="flex items-center space-x-2 px-4 py-2 bg-asteroid-gray rounded-lg border border-meteor-gray"
                whileHover={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}
              >
                <div className="w-2 h-2 bg-aurora-green rounded-full" />
                <span className="text-cosmic-white font-mono text-sm">
                  {shortAddress}
                </span>
              </motion.div>
            ) : (
              <Button
                onClick={onConnectWallet}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
