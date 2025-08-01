'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, Activity, DollarSign, RefreshCw } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useAccount } from 'wagmi'
import { apiService } from '@/services/apiService'
import { PortfolioData } from '@/types/api'

export const PortfolioOverview: React.FC = () => {
  const { address } = useAccount()
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (address) {
      loadPortfolio()
    }
  }, [address])

  const loadPortfolio = async () => {
    if (!address) return
    
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiService.getPortfolio(address)
      setPortfolioData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio')
      console.error('Portfolio error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-meteor-gray rounded mb-2"></div>
                <div className="h-8 bg-meteor-gray rounded mb-2"></div>
                <div className="h-3 bg-meteor-gray rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-crimson-red mb-4">{error}</div>
        <Button onClick={loadPortfolio} variant="secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </Card>
    )
  }

  if (!portfolioData) return null

  const isPositiveChange = portfolioData.totalChange24h > 0

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Value */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stardust-gray">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-cosmic-white">
                ${portfolioData.totalValueUSD.toLocaleString()}
              </p>
              <p className={`text-sm flex items-center mt-1 ${
                isPositiveChange ? 'text-aurora-green' : 'text-crimson-red'
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {isPositiveChange ? '+' : ''}${portfolioData.totalChange24h.toFixed(2)} (
                {portfolioData.totalChangePercent24h.toFixed(2)}%)
              </p>
            </div>
            <div className="p-3 bg-cosmic-purple/20 rounded-full">
              <Wallet className="w-6 h-6 text-cosmic-purple" />
            </div>
          </div>
        </Card>

        {/* Daily P&L */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stardust-gray">24h P&L</p>
              <p className={`text-2xl font-bold ${
                isPositiveChange ? 'text-aurora-green' : 'text-crimson-red'
              }`}>
                {isPositiveChange ? '+' : ''}${portfolioData.totalChange24h.toFixed(2)}
              </p>
              <p className="text-sm text-stardust-gray mt-1">
                {portfolioData.totalChangePercent24h.toFixed(2)}% change
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              isPositiveChange ? 'bg-aurora-green/20' : 'bg-crimson-red/20'
            }`}>
              <DollarSign className={`w-6 h-6 ${
                isPositiveChange ? 'text-aurora-green' : 'text-crimson-red'
              }`} />
            </div>
          </div>
        </Card>

        {/* Active Positions */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stardust-gray">Active Positions</p>
              <p className="text-2xl font-bold text-cosmic-white">
                {portfolioData.tokens.length}
              </p>
              <p className="text-sm text-cosmic-purple mt-1">
                Tokens held
              </p>
            </div>
            <div className="p-3 bg-stellar-pink/20 rounded-full">
              <Activity className="w-6 h-6 text-stellar-pink" />
            </div>
          </div>
        </Card>
      </div>

      {/* Token Holdings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-cosmic-white">
            Your Holdings
          </h3>
          <Button onClick={loadPortfolio} variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {portfolioData.tokens.map((tokenBalance, index) => (
            <motion.div
              key={`${tokenBalance.token.address}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-meteor-gray/20 rounded-lg hover:bg-meteor-gray/30 transition-colors"
            >
              {/* Token Info */}
              <div className="flex items-center space-x-4">
                <img 
                  src={tokenBalance.token.icon} 
                  alt={tokenBalance.token.symbol}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-cosmic-white flex items-center">
                    {tokenBalance.token.symbol}
                    {tokenBalance.token.verified && (
                      <div className="w-2 h-2 bg-aurora-green rounded-full ml-2" />
                    )}
                  </div>
                  <div className="text-sm text-stardust-gray">
                    {tokenBalance.token.name}
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="text-right">
                <div className="font-medium text-cosmic-white">
                  {tokenBalance.balance} {tokenBalance.token.symbol}
                </div>
                <div className="text-sm text-stardust-gray">
                  ${tokenBalance.balanceUSD.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
          
          {portfolioData.tokens.length === 0 && (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-stardust-gray mx-auto mb-4" />
              <p className="text-stardust-gray">No tokens found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

