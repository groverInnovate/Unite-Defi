import React from 'react'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Header: React.FC = () => {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-space-black/95 backdrop-blur-md border-b border-meteor-gray/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Only */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-cosmic-purple to-stellar-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-cosmic-white">CosmicDeFi</span>
          </motion.div>

          {/* ❌ REMOVED: Navigation section - no more duplicate nav */}

          {/* Wallet Connection Only */}
          <div className="flex items-center">
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

