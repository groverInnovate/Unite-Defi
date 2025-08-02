'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Menu, X, Zap, Scale } from 'lucide-react'

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    { 
      name: 'Swap', 
      href: '/', 
      icon: Zap,
      description: 'Cross-chain token swaps'
    },
    { 
      name: 'Resolver', 
      href: '/resolver', 
      icon: Scale,
      description: 'Manage cross-chain orders'
    },
  ]

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

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
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cosmic-purple to-stellar-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-cosmic-white">CosmicDeFi</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group"
                >
                  <motion.div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'text-cosmic-white bg-cosmic-purple/20 border border-cosmic-purple/50' 
                        : 'text-stardust-gray hover:text-cosmic-white hover:bg-meteor-gray/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </motion.div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-asteroid-gray text-cosmic-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {item.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-asteroid-gray rotate-45"></div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cosmic-purple rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side - Mobile Menu Button & Wallet */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-stardust-gray hover:text-cosmic-white hover:bg-meteor-gray/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>

            {/* Wallet Connection */}
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
      </div>

      {/* Mobile Navigation Menu */}
      <motion.div
        className={`md:hidden overflow-hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0, 
          height: isMobileMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-3 bg-asteroid-gray/20 border-t border-meteor-gray/50">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block"
                >
                  <motion.div
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'text-cosmic-white bg-cosmic-purple/20 border border-cosmic-purple/50' 
                        : 'text-stardust-gray hover:text-cosmic-white hover:bg-meteor-gray/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-stardust-gray">{item.description}</div>
                    </div>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-cosmic-purple rounded-full"></div>
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}

