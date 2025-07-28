import React from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, Activity, DollarSign } from 'lucide-react'
import { Card } from '../ui/Card'

// Sample portfolio data
const portfolioData = {
  totalValue: 12847.52,
  dailyChange: 284.32,
  dailyChangePercent: 2.27,
  tokens: [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '/tokens/eth.png',
      balance: '1.234',
      value: 2468.00,
      change: 123.45,
      changePercent: 5.26
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '/tokens/usdc.png',
      balance: '5000.00',
      value: 5000.00,
      change: 0,
      changePercent: 0
    },
    {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      icon: '/tokens/wbtc.png',
      balance: '0.123',
      value: 5379.52,
      change: 160.87,
      changePercent: 3.08
    }
  ]
}

export const PortfolioOverview: React.FC = () => {
  const isPositiveChange = portfolioData.dailyChange > 0

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
                ${portfolioData.totalValue.toLocaleString()}
              </p>
              <p className={`text-sm flex items-center mt-1 ${
                isPositiveChange ? 'text-aurora-green' : 'text-crimson-red'
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {isPositiveChange ? '+' : ''}${portfolioData.dailyChange.toFixed(2)} (
                {portfolioData.dailyChangePercent.toFixed(2)}%)
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
                {isPositiveChange ? '+' : ''}${portfolioData.dailyChange.toFixed(2)}
              </p>
              <p className="text-sm text-stardust-gray mt-1">
                {portfolioData.dailyChangePercent.toFixed(2)}% change
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
        <h3 className="text-lg font-semibold text-cosmic-white mb-4">
          Your Holdings
        </h3>
        
        <div className="space-y-4">
          {portfolioData.tokens.map((token, index) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-meteor-gray/20 rounded-lg hover:bg-meteor-gray/30 transition-colors"
            >
              {/* Token Info */}
              <div className="flex items-center space-x-4">
                <img 
                  src={token.icon} 
                  alt={token.symbol}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-cosmic-white">
                    {token.symbol}
                  </div>
                  <div className="text-sm text-stardust-gray">
                    {token.name}
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="text-right">
                <div className="font-medium text-cosmic-white">
                  {token.balance} {token.symbol}
                </div>
                <div className="text-sm text-stardust-gray">
                  ${token.value.toLocaleString()}
                </div>
              </div>

              {/* Change */}
              <div className="text-right">
                <div className={`font-medium ${
                  token.change > 0 ? 'text-aurora-green' : 
                  token.change < 0 ? 'text-crimson-red' : 'text-stardust-gray'
                }`}>
                  {token.change > 0 ? '+' : ''}${token.change.toFixed(2)}
                </div>
                <div className={`text-sm ${
                  token.changePercent > 0 ? 'text-aurora-green' : 
                  token.changePercent < 0 ? 'text-crimson-red' : 'text-stardust-gray'
                }`}>
                  {token.changePercent > 0 ? '+' : ''}{token.changePercent.toFixed(2)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
