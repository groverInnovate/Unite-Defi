'use client'
import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { TrendingUp, TrendingDown } from 'lucide-react'

// FIXED: Use static data instead of Math.random() to avoid hydration mismatch
const staticPriceData = {
  '1D': [
    { time: '00:00', price: 2000, volume: 800000 },
    { time: '04:00', price: 2050, volume: 750000 },
    { time: '08:00', price: 1980, volume: 900000 },
    { time: '12:00', price: 2020, volume: 850000 },
    { time: '16:00', price: 2100, volume: 950000 },
    { time: '20:00', price: 2080, volume: 820000 },
    { time: '24:00', price: 2120, volume: 880000 }
  ],
  '7D': [
    { time: 'Mon', price: 1950, volume: 5000000 },
    { time: 'Tue', price: 2000, volume: 4800000 },
    { time: 'Wed', price: 2080, volume: 5200000 },
    { time: 'Thu', price: 2150, volume: 4900000 },
    { time: 'Fri', price: 2100, volume: 5100000 },
    { time: 'Sat', price: 2120, volume: 4700000 },
    { time: 'Sun', price: 2200, volume: 5300000 }
  ],
  '30D': [
    { time: 'Week 1', price: 1800, volume: 35000000 },
    { time: 'Week 2', price: 1950, volume: 38000000 },
    { time: 'Week 3', price: 2100, volume: 36000000 },
    { time: 'Week 4', price: 2200, volume: 39000000 }
  ],
  '90D': [
    { time: 'Month 1', price: 1600, volume: 120000000 },
    { time: 'Month 2', price: 1900, volume: 115000000 },
    { time: 'Month 3', price: 2200, volume: 125000000 }
  ]
}

interface PriceChartProps {
  tokenSymbol?: string
  className?: string
}

export const PriceChart: React.FC<PriceChartProps> = ({
  tokenSymbol = 'ETH',
  className = ''
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D' | '90D'>('7D')
  const [mounted, setMounted] = useState(false)

  // FIXED: Only render chart after component mounts on client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Show loading state during SSR
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-meteor-gray rounded mb-4"></div>
          <div className="h-64 bg-meteor-gray rounded"></div>
        </div>
      </Card>
    )
  }

  const data = staticPriceData[timeframe]
  const currentPrice = data[data.length - 1]?.price || 0
  const previousPrice = data[data.length - 2]?.price || 0
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2)
  const isPositive = priceChange > 0

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-asteroid-gray p-3 rounded-lg border border-meteor-gray shadow-lg">
          <p className="text-cosmic-white font-medium">{label}</p>
          <p className="text-cosmic-purple">
            Price: ${payload[0].value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-cosmic-white flex items-center">
            {tokenSymbol} Price Chart
            {isPositive ? (
              <TrendingUp className="w-4 h-4 ml-2 text-aurora-green" />
            ) : (
              <TrendingDown className="w-4 h-4 ml-2 text-crimson-red" />
            )}
          </h3>
          
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-2xl font-bold text-cosmic-white">
              ${currentPrice.toLocaleString()}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-aurora-green' : 'text-crimson-red'}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent}%)
            </span>
          </div>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex bg-asteroid-gray rounded-lg p-1">
          {(['1D', '7D', '30D', '90D'] as const).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="px-3 py-1 text-xs"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: '#6366f1',
                stroke: '#8b5cf6',
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  )
}

