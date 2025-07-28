'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, Settings, Zap, TrendingUp } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TokenInput } from '../ui/TokenInput'
import { TokenSelector } from './TokenSelector'


// Define what a token looks like
interface Token {
  address: string
  symbol: string
  name: string
  icon: string
  balance?: string
  price?: number
  decimals?: number
}

// Sample tokens for testing
const sampleTokens: Token[] = [
  {
    address: '0x...',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '/tokens/eth.png',
    balance: '1.234',
    price: 2000,
    decimals: 18
  },
  {
    address: '0x...',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '/tokens/usdc.png',
    balance: '500.00',
    price: 1,
    decimals: 6
  }
]

export const SwapInterface: React.FC = () => {
  // State for managing the swap
  const [fromToken, setFromToken] = useState<Token | null>(sampleTokens[0])
  const [toToken, setToToken] = useState<Token | null>(sampleTokens[1])
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [showFromSelector, setShowFromSelector] = useState(false)
  const [showToSelector, setShowToSelector] = useState(false)
  const [slippage, setSlippage] = useState('0.5') // 0.5% default slippage
  const [isLoading, setIsLoading] = useState(false)

  // Calculate exchange rate and output amount
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      // Simple calculation for demo (in real app, this would call an API)
      const rate = fromToken.price! / toToken.price!
      const outputAmount = (parseFloat(fromAmount) * rate * 0.997).toFixed(6) // 0.3% fee
      setToAmount(outputAmount)
    } else {
      setToAmount('')
    }
  }, [fromAmount, fromToken, toToken])

  // Swap the tokens (flip from/to)
  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  // Handle the actual swap transaction
  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount) return
    
    setIsLoading(true)
    
    // Simulate transaction (in real app, this would call your smart contract)
    setTimeout(() => {
      alert(`Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}!`)
      setIsLoading(false)
      // Reset form
      setFromAmount('')
      setToAmount('')
    }, 2000)
  }

  // Calculate price impact (simplified)
  const priceImpact = fromAmount ? (parseFloat(fromAmount) * 0.001).toFixed(2) : '0'
  const isHighImpact = parseFloat(priceImpact) > 5

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-cosmic-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-cosmic-purple" />
            Cosmic Swap
          </h2>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => {/* Open settings modal */}}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* From Token Input */}
        <div className="space-y-4">
          <TokenInput
            label="From"
            value={fromAmount}
            onChange={setFromAmount}
            token={fromToken}
            onTokenSelect={() => setShowFromSelector(true)}
            showBalance={true}
          />

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleSwapTokens}
              className="p-2 bg-asteroid-gray rounded-full border border-meteor-gray hover:border-cosmic-purple transition-colors"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUpDown className="w-4 h-4 text-cosmic-purple" />
            </motion.button>
          </div>

          {/* To Token Input */}
          <TokenInput
            label="To"
            value={toAmount}
            onChange={setToAmount}
            token={toToken}
            onTokenSelect={() => setShowToSelector(true)}
            showBalance={false}
          />
        </div>

        {/* Swap Details */}
        {fromAmount && toAmount && fromToken && toToken && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-meteor-gray/20 rounded-lg space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-stardust-gray">Exchange Rate</span>
              <span className="text-cosmic-white">
                1 {fromToken.symbol} = {(fromToken.price! / toToken.price!).toFixed(6)} {toToken.symbol}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-stardust-gray">Price Impact</span>
              <span className={`${isHighImpact ? 'text-crimson-red' : 'text-aurora-green'}`}>
                {priceImpact}%
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-stardust-gray">Slippage Tolerance</span>
              <span className="text-cosmic-white">{slippage}%</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-stardust-gray">Network Fee</span>
              <span className="text-cosmic-white">~$2.50</span>
            </div>
          </motion.div>
        )}

        {/* High Price Impact Warning */}
        {isHighImpact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-crimson-red/20 border border-crimson-red/50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-crimson-red" />
              <span className="text-sm text-crimson-red font-medium">
                High Price Impact Warning
              </span>
            </div>
            <p className="text-xs text-crimson-red/80 mt-1">
              This trade may result in significant price impact. Consider reducing your trade size.
            </p>
          </motion.div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!fromAmount || !toAmount || isLoading}
          loading={isLoading}
          className="w-full mt-6"
          variant="primary"
        >
          {isLoading ? 'Swapping...' : 'Swap Tokens'}
        </Button>
      </Card>

      {/* Token Selectors */}
      <TokenSelector
        isOpen={showFromSelector}
        onClose={() => setShowFromSelector(false)}
        onSelectToken={setFromToken}
        selectedToken={fromToken}
      />
      
      <TokenSelector
        isOpen={showToSelector}
        onClose={() => setShowToSelector(false)}
        onSelectToken={setToToken}
        selectedToken={toToken}
      />
    </div>
  )
}
