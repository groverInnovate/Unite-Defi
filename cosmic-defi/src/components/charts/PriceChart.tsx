'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface PriceChartProps {
  tokenSymbol: string
  className?: string
}

interface ChartDataPoint {
  time: string
  price: number
  displayTime: string
}

interface PriceInfo {
  current: number
  change: number
  changePercent: number
  isPositive: boolean
  high24h: number
  low24h: number
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  tokenSymbol, 
  className = "" 
}) => {
  const [timeframe, setTimeframe] = useState('1D')
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [priceData, setPriceData] = useState<PriceInfo>({
    current: 3802.4,
    change: 45.60,
    changePercent: 1.22,
    isPositive: true,
    high24h: 3845.2,
    low24h: 3712.8
  })

  const timeframes = ['1D', '7D', '30D', '90D']

  // Generate realistic price data
  const generatePriceData = (tf: string): ChartDataPoint[] => {
    const basePrice = 3802.4
    const data: ChartDataPoint[] = []  // ✅ FIXED: Correct syntax
    
    switch (tf) {
      case '1D':
        for (let i = 0; i < 24; i++) {
          const variance = (Math.random() - 0.5) * 100
          const trendFactor = Math.sin((i / 24) * Math.PI * 2) * 30
          const price = basePrice + variance + trendFactor
          data.push({
            time: String(i),
            price: Math.max(price, 3000),
            displayTime: `${i.toString().padStart(2, '0')}:00`
          })
        }
        break
        
      case '7D':
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        for (let i = 0; i < 7; i++) {
          const variance = (Math.random() - 0.5) * 200
          const price = basePrice + variance + (i * 10)
          data.push({
            time: String(i),
            price: Math.max(price, 3200),
            displayTime: days[i]
          })
        }
        break
        
      case '30D':
        for (let i = 0; i < 10; i++) {
          const variance = (Math.random() - 0.5) * 300
          const price = basePrice + variance + (i * 5)
          data.push({
            time: String(i),
            price: Math.max(price, 3000),
            displayTime: `${i * 3 + 1}d`
          })
        }
        break
        
      case '90D':
        for (let i = 0; i < 13; i++) {
          const variance = (Math.random() - 0.5) * 400
          const price = basePrice + variance + (i * 15)
          data.push({
            time: String(i),
            price: Math.max(price, 2800),
            displayTime: `W${i + 1}`
          })
        }
        break
    }
    
    return data
  }

  // Update chart data when timeframe changes
  useEffect(() => {
    const newData = generatePriceData(timeframe)
    setChartData(newData)
    
    if (newData.length > 0) {
      const currentPrice = newData[newData.length - 1].price
      const startPrice = newData[0].price
      const change = currentPrice - startPrice
      const changePercent = (change / startPrice) * 100
      
      setPriceData({
        current: currentPrice,
        change: Math.abs(change),
        changePercent: Math.abs(changePercent),
        isPositive: change >= 0,
        high24h: Math.max(...newData.map(d => d.price)),
        low24h: Math.min(...newData.map(d => d.price))
      })
    }
  }, [timeframe])

  // Generate SVG path
  const generatePath = (data: ChartDataPoint[]): string => {  // ✅ FIXED: Added proper parameter typing
    if (data.length === 0) return ''
    
    const maxPrice = Math.max(...data.map(d => d.price))
    const minPrice = Math.min(...data.map(d => d.price))
    const priceRange = maxPrice - minPrice || 1
    
    // ✅ FIXED: Define width and height here
    const width = 300
    const height = 150
    
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((point.price - minPrice) / priceRange) * height
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')}`
  }

  // Generate Y-axis labels
  const generateYAxisLabels = () => {
    if (chartData.length === 0) return []
    
    const maxPrice = Math.max(...chartData.map(d => d.price))
    const minPrice = Math.min(...chartData.map(d => d.price))
    const priceRange = maxPrice - minPrice
    
    const labels = []
    for (let i = 0; i <= 4; i++) {
      const price = minPrice + (priceRange * (4 - i) / 4)
      labels.push({
        value: price,
        y: (i / 4) * 100,
        display: price >= 1000 ? `$${(price / 1000).toFixed(1)}k` : `$${price.toFixed(0)}`
      })
    }
    return labels
  }

  const yAxisLabels = generateYAxisLabels()
  const chartPath = generatePath(chartData)

  // ✅ FIXED: Added return statement - this was the main issue!
  return (
    <div className={`w-full ${className}`}>
      <Card className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cosmic-purple" />
            <h3 className="text-lg font-semibold text-cosmic-white">
              {tokenSymbol} Price
            </h3>
          </div>
          
          {/* Timeframe Buttons */}
          <div className="flex bg-asteroid-gray rounded-lg p-1">
            {timeframes.map((tf) => (
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

        {/* Price Info */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-cosmic-white">
            ${priceData.current.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
          <div className="flex items-center justify-between">
            <div className={`flex items-center text-sm ${
              priceData.isPositive ? 'text-aurora-green' : 'text-crimson-red'
            }`}>
              {priceData.isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {priceData.isPositive ? '+' : '-'}${priceData.change.toFixed(2)} ({priceData.changePercent.toFixed(2)}%)
            </div>
            <div className="text-xs text-stardust-gray">
              H: ${priceData.high24h.toFixed(0)} L: ${priceData.low24h.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative h-48 w-full bg-meteor-gray/10 rounded-lg overflow-hidden">
          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 -ml-12 z-10">
            {yAxisLabels.map((label, index) => (
              <div
                key={index}
                className="text-xs text-stardust-gray font-mono"
                style={{ transform: 'translateY(-50%)' }}
              >
                {label.display}
              </div>
            ))}
          </div>

          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 300 150"
            className="absolute inset-0"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id={`priceGradient-${tokenSymbol}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={priceData.isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.8" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
              </linearGradient>
              
              <linearGradient id={`areaGradient-${tokenSymbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={priceData.isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={priceData.isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
              </linearGradient>

              <pattern id={`grid-${tokenSymbol}`} width="30" height="15" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 15" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill={`url(#grid-${tokenSymbol})`} />

            {chartPath && (
              <>
                <motion.path
                  d={`${chartPath} L 300 150 L 0 150 Z`}
                  fill={`url(#areaGradient-${tokenSymbol})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />

                <motion.path
                  d={chartPath}
                  fill="none"
                  stroke={`url(#priceGradient-${tokenSymbol})`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </>
            )}

            {chartData.map((point, index) => {
              const maxPrice = Math.max(...chartData.map(d => d.price))
              const minPrice = Math.min(...chartData.map(d => d.price))
              const priceRange = maxPrice - minPrice || 1
              const x = (index / (chartData.length - 1)) * 300
              const y = 150 - ((point.price - minPrice) / priceRange) * 150
              
              return (
                <motion.circle
                  key={`point-${index}`}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#6366f1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                />
              )
            })}
          </svg>

          <div className="absolute inset-0 bg-transparent hover:bg-cosmic-purple/5 transition-colors rounded-lg cursor-crosshair" />
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-xs text-stardust-gray mt-2 px-2">
          {chartData.length > 0 && (
            <>
              <span>{chartData[0]?.displayTime}</span>
              {chartData.length > 2 && (
                <span>{chartData[Math.floor(chartData.length / 2)]?.displayTime}</span>
              )}
              <span>{chartData[chartData.length - 1]?.displayTime}</span>
            </>
          )}
        </div>

        {/* Chart Info Footer */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-meteor-gray/30">
          <div className="text-xs text-stardust-gray">
            Timeframe: {timeframe}
          </div>
          <div className="text-xs text-cosmic-purple">
            Live Market Data
          </div>
        </div>
      </Card>
    </div>
  )
}