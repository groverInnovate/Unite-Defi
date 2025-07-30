import React from 'react'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { BarChart3, ArrowLeftRight, Settings } from 'lucide-react'

export const Header: React.FC = () => {
  const navItems = [
    { name: 'Swap', icon: ArrowLeftRight, href: '/' },
    { name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ]

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
            {/* ✅ RainbowKit handles all wallet logic */}
            <ConnectButton 
              showBalance={false}
              chainStatus="icon"
              accountStatus={{ 
                smallScreen: 'avatar', 
                largeScreen: 'full' 
              }}
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
