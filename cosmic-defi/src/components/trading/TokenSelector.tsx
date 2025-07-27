import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Star } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

// Define what a token looks like
export interface Token {
  address: string
  symbol: string
  name: string
  icon: string
  balance?: string
  price?: number
  popular?: boolean     // Is this a popular token?
}

interface TokenSelectorProps {
  isOpen: boolean                           // Is modal open?
  onClose: () => void                      // Function to close modal
  onSelectToken: (token: Token) => void    // Function when token is selected
  selectedToken?: Token                     // Currently selected token
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  selectedToken
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Sample token list (in real app, this would come from an API)
  const allTokens: Token[] = [
    {
      address: '0x...',
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/tokens/eth.png',
      balance: '1.234',
      price: 2000,
      popular: true
    },
    {
      address: '0x...',
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '/tokens/usdc.png',
      balance: '500.00',
      price: 1,
      popular: true
    },
    {
      address: '0x...',
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      icon: '/tokens/wbtc.png',
      balance: '0.05',
      price: 45000,
      popular: true
    },
    // Add more tokens here...
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
    setSearchTerm('') // Clear search when closing
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
                        key={token.symbol}
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
                {filteredTokens.map((token) => (
                  <motion.button
                    key={token.address}
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
