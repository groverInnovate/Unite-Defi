'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Star } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

// ✅ FIXED: Token interface MUST match SwapInterface.tsx exactly
interface Token {
  address: string
  symbol: string
  name: string
  icon: string
  balance?: string
  price?: number
  decimals: number 
  popular: boolean // ✅ ADDED: This was missing!
}

interface TokenSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectToken: (token: Token) => void
  selectedToken?: Token  // ✅ FIXED: Token | undefined
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  selectedToken
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ FIXED: Updated token list with decimals property
  const allTokens: Token[] = [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/tokens/eth.png',
      balance: '1.234',
      price: 2000,
      decimals: 18,  // ✅ ADDED
      popular: true
    },
    {
      address: '0xA0b86a33E6441e3A99EA75C4AAeE54F1B2B1c8e5',
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '/tokens/usdc.png',
      balance: '500.00',
      price: 1,
      decimals: 6,   // ✅ ADDED
      popular: true
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      icon: '/tokens/wbtc.png',
      balance: '0.05',
      price: 45000,
      decimals: 8,   // ✅ ADDED
      popular: true
    },
    {
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      symbol: 'LINK',
      name: 'Chainlink',
      icon: '/tokens/link.png',
      balance: '100.0',
      price: 15,
      decimals: 18,  // ✅ ADDED
      popular: true
    },
    {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      name: 'Uniswap',
      icon: '/tokens/uni.png',
      balance: '50.0',
      price: 8,
      decimals: 18,  // ✅ ADDED
      popular: false
    }
  ]

  // Filter tokens based on search
  const filteredTokens = useMemo(() => {
    if (!searchTerm) return allTokens
    
    return allTokens.filter(token =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  // Get popular tokens
  const popularTokens = allTokens.filter(token => token.popular)

  const handleTokenSelect = (token: Token) => {
    onSelectToken(token)
    onClose()
    setSearchTerm('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="w-full max-w-md bg-asteroid-gray rounded-xl border border-meteor-gray shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-meteor-gray">
                <h2 className="text-lg font-semibold text-cosmic-white">
                  Select Token
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search */}
              <div className="p-4">
                <Input
                  placeholder="Search by name or symbol"
                  value={searchTerm}
                  onChange={setSearchTerm}
                  rightElement={<Search className="w-4 h-4 text-stardust-gray" />}
                />
              </div>

              {/* Popular tokens (only show when not searching) */}
              {!searchTerm && (
                <div className="px-4 pb-4">
                  <h3 className="text-sm font-medium text-stardust-gray mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Popular Tokens
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTokens.map((token) => (
                      <Button
                        key={`popular-${token.address}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTokenSelect(token)}
                        className="flex items-center space-x-2"
                      >
                        <img 
                          src={token.icon} 
                          alt={token.symbol}
                          className="w-4 h-4 rounded-full"
                        />
                        <span>{token.symbol}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Token list */}
              <div className="max-h-80 overflow-y-auto">
                {filteredTokens.map((token, index) => (
                  <motion.button
                    key={`token-${token.address}-${index}`}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-meteor-gray/30 transition-colors"
                    onClick={() => handleTokenSelect(token)}
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
                  >
                    {/* Token icon */}
                    <img 
                      src={token.icon} 
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                    
                    {/* Token info */}
                    <div className="flex-1 text-left">
                      <div className="font-medium text-cosmic-white">
                        {token.symbol}
                      </div>
                      <div className="text-sm text-stardust-gray">
                        {token.name}
                      </div>
                    </div>
                    
                    {/* Balance */}
                    {token.balance && (
                      <div className="text-right">
                        <div className="text-cosmic-white font-mono text-sm">
                          {token.balance}
                        </div>
                        {token.price && (
                          <div className="text-stardust-gray text-xs">
                            ${(parseFloat(token.balance) * token.price).toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* No results */}
              {filteredTokens.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-stardust-gray">
                    No tokens found for "{searchTerm}"
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


