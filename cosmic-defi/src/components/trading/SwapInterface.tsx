'use client'
import React, { useState, useEffect } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { motion } from 'framer-motion'
import { ArrowUpDown, Settings, Zap, Network, Clock } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TokenInput } from '../ui/TokenInput'
import { TokenSelector } from './TokenSelector'
import { apiService } from '@/services/apiService'
import { SwapQuoteResponse } from '@/types/api'

// ✅ FIXED: Ensure Token interface matches everywhere
interface Token {
  address: string
  symbol: string
  name: string
  icon: string
  balance?: string
  price?: number
  decimals: number  // ✅ REQUIRED: Add decimals property
}

// Supported chains for cross-chain swaps
const SUPPORTED_CHAINS = {
  1: { name: 'Ethereum', color: 'text-blue-400' },
  41454: { name: 'Monad', color: 'text-purple-400' },
}

// ✅ FIXED: Default tokens with decimals property
const defaultTokens: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '/tokens/eth.png',
    balance: '1.234',
    price: 2000,
    decimals: 18  // ✅ ADDED
  },
  {
    address: '0xA0b86a33E6441e3A99EA75C4AAeE54F1B2B1c8e5',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '/tokens/usdc.png',
    balance: '500.00',
    price: 1,
    decimals: 6  // ✅ ADDED
  }
]

export const SwapInterface: React.FC = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // ✅ FIXED: Change from Token | null to Token | undefined
  const [fromToken, setFromToken] = useState<Token | undefined>(defaultTokens[0])
  const [toToken, setToToken] = useState<Token | undefined>(defaultTokens[1])
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromChain, setFromChain] = useState<number>(1)
  const [toChain, setToChain] = useState<number>(41454)
  const [quote, setQuote] = useState<SwapQuoteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCrossChain, setIsCrossChain] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [showFromSelector, setShowFromSelector] = useState(false)
  const [showToSelector, setShowToSelector] = useState(false)
  const [slippage, setSlippage] = useState('1.0')

  // ✅ FIXED: Wrapper functions for onSelectToken
  const handleFromTokenSelect = (token: Token) => {
    setFromToken(token)  // Now token is guaranteed to be Token, not null
  }

  const handleToTokenSelect = (token: Token) => {
    setToToken(token)  // Now token is guaranteed to be Token, not null
  }

  // Get quote when inputs change
  useEffect(() => {
    if (fromToken && toToken && fromAmount && address && isConnected) {
      getQuote()
    } else {
      setQuote(null)
      setToAmount('')
    }
  }, [fromToken, toToken, fromAmount, fromChain, toChain, address, isConnected])

  const getQuote = async () => {
    if (!fromToken || !toToken || !fromAmount || !address) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      const quoteData = await apiService.getSwapQuote({
        srcChainId: fromChain,
        dstChainId: toChain,
        srcToken: fromToken.address,
        dstToken: toToken.address,
        amount: fromAmount,
        userAddress: address,
        slippage: parseFloat(slippage),
      })
      
      setQuote(quoteData)
      setToAmount(quoteData.dstAmount)
    } catch (error: any) {
      console.error('Failed to get quote:', error)
      setError(error.message || 'Failed to get quote')
      setQuote(null)
      setToAmount('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = async () => {
    if (!quote || !address || !isConnected) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      if (chainId !== fromChain) {
        await switchChain({ chainId: fromChain })
      }
      
      const result = await apiService.executeSwap({
        quote,
        userAddress: address,
        fromChain,
        toChain,
      })
      
      console.log('Swap initiated:', result)
      
      // Reset form after successful swap
      setFromAmount('')
      setToAmount('')
      setQuote(null)
      
    } catch (error: any) {
      console.error('Swap failed:', error)
      setError(error.message || 'Swap failed')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCrossChain = () => {
    setIsCrossChain(!isCrossChain)
    if (!isCrossChain) {
      setFromChain(1)
      setToChain(41454)
    } else {
      setFromChain(chainId)
      setToChain(chainId)
    }
    setQuote(null)
    setToAmount('')
  }

  const swapTokensAndChains = () => {
    // Swap tokens
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
    
    // Swap chains if cross-chain
    if (isCrossChain) {
      setFromChain(toChain)
      setToChain(fromChain)
    }
    
    // Reset quote
    setQuote(null)
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        {/* Header with Cross-Chain Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-cosmic-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-cosmic-purple" />
            Fusion+ Swap
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isCrossChain ? "primary" : "ghost"}
              size="sm"
              onClick={toggleCrossChain}
              className="flex items-center space-x-1"
            >
              <Network className="w-4 h-4" />
              <span>Cross-Chain</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chain Selectors (if cross-chain) */}
        {isCrossChain && (
          <div className="flex items-center justify-between mb-4 p-3 bg-meteor-gray/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-stardust-gray">From:</span>
              <select 
                value={fromChain}
                onChange={(e) => setFromChain(Number(e.target.value))}
                className="bg-asteroid-gray text-cosmic-white px-2 py-1 rounded text-sm"
              >
                {Object.entries(SUPPORTED_CHAINS).map(([id, chain]) => (
                  <option key={id} value={id}>{chain.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-stardust-gray">To:</span>
              <select 
                value={toChain}
                onChange={(e) => setToChain(Number(e.target.value))}
                className="bg-asteroid-gray text-cosmic-white px-2 py-1 rounded text-sm"
              >
                {Object.entries(SUPPORTED_CHAINS).map(([id, chain]) => (
                  <option key={id} value={id}>{chain.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-crimson-red/20 border border-crimson-red/50 rounded-lg">
            <p className="text-sm text-crimson-red">{error}</p>
          </div>
        )}

        {/* Wallet Connection Prompt */}
        {!isConnected && (
          <div className="mb-4 p-4 bg-cosmic-purple/20 border border-cosmic-purple/50 rounded-lg text-center">
            <p className="text-sm text-cosmic-white">
              Connect your wallet to start trading
            </p>
          </div>
        )}

        {/* Token Inputs */}
        <div className="space-y-4">
          <TokenInput
            label="From"
            value={fromAmount}
            onChange={setFromAmount}
            token={fromToken}
            onTokenSelect={() => setShowFromSelector(true)}
            showBalance={isConnected}
          />

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={swapTokensAndChains}
              className="p-2 bg-asteroid-gray rounded-full border border-meteor-gray hover:border-cosmic-purple transition-colors"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading}
            >
              <ArrowUpDown className="w-4 h-4 text-cosmic-purple" />
            </motion.button>
          </div>

          <TokenInput
            label="To"
            value={toAmount}
            onChange={setToAmount}
            token={toToken}
            onTokenSelect={() => setShowToSelector(true)}
            showBalance={false}
          />
        </div>

        {/* Quote Details */}
        {quote && !error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-meteor-gray/20 rounded-lg space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-stardust-gray">Route</span>
              <span className="text-cosmic-purple capitalize">{quote.route}</span>
            </div>
            
            {isCrossChain && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-stardust-gray flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Execution Time
                  </span>
                  <span className="text-cosmic-white">{quote.executionTime}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-stardust-gray">Bridge Fee</span>
                  <span className="text-cosmic-white">{quote.bridgeFee} ETH</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-stardust-gray">Estimated Gas</span>
              <span className="text-cosmic-white">{quote.estimatedGas} ETH</span>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-meteor-gray/20 rounded-lg text-center"
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cosmic-purple"></div>
              <span className="text-sm text-stardust-gray">Getting quote...</span>
            </div>
          </motion.div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!quote || isLoading || !isConnected || !!error}
          loading={isLoading}
          className="w-full mt-6"
          variant="primary"
        >
          {!isConnected 
            ? 'Connect Wallet' 
            : isLoading 
            ? 'Processing...' 
            : isCrossChain 
            ? `Swap via Fusion+ Bridge` 
            : 'Swap Tokens'}
        </Button>
      </Card>

      {/* ✅ FIXED: Use wrapper functions for onSelectToken */}
      <TokenSelector
        isOpen={showFromSelector}
        onClose={() => setShowFromSelector(false)}
        onSelectToken={handleFromTokenSelect}  // ✅ FIXED: Wrapper function
        selectedToken={fromToken}              // ✅ FIXED: Now Token | undefined
      />
      
      <TokenSelector
        isOpen={showToSelector}
        onClose={() => setShowToSelector(false)}
        onSelectToken={handleToTokenSelect}   // ✅ FIXED: Wrapper function
        selectedToken={toToken}               // ✅ FIXED: Now Token | undefined
      />
    </div>
  )
}


