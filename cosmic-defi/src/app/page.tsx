'use client'
import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { SwapInterface } from '@/components/trading/SwapInterface'
import { PriceChart } from '@/components/charts/PriceChart'
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Button } from '@/components/ui/Button'
import { ArrowLeftRight, Wallet, BarChart3 } from 'lucide-react'
import { useAccount } from 'wagmi'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('swap')
  
  // ✅ Now this hook can access WagmiProvider context
  const { isConnected } = useAccount()

  const tabs = [
    { id: 'swap', name: 'Swap', icon: ArrowLeftRight },
    { id: 'portfolio', name: 'Portfolio', icon: Wallet },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-space-black">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-asteroid-gray rounded-lg p-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2 px-6 py-2"
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content with Error Boundaries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'swap' && (
              <ErrorBoundary
                fallback={
                  <div className="p-6 bg-crimson-red/20 border border-crimson-red/50 rounded-lg">
                    <h2 className="text-lg font-semibold text-crimson-red mb-2">
                      Swap Interface Error
                    </h2>
                    <p className="text-sm text-cosmic-white">
                      Unable to load swap interface. Please refresh the page.
                    </p>
                  </div>
                }
              >
                <SwapInterface />
              </ErrorBoundary>
            )}
            
            {activeTab === 'portfolio' && (
              <ErrorBoundary
                fallback={
                  <div className="p-6 bg-crimson-red/20 border border-crimson-red/50 rounded-lg">
                    <h2 className="text-lg font-semibold text-crimson-red mb-2">
                      Portfolio Error
                    </h2>
                    <p className="text-sm text-cosmic-white">
                      Unable to load portfolio data. Please try again.
                    </p>
                  </div>
                }
              >
                {isConnected ? (
                  <PortfolioOverview />
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-asteroid-gray to-asteroid-gray/80 rounded-xl p-8 border border-meteor-gray/50">
                      <Wallet className="w-16 h-16 text-stardust-gray mx-auto mb-4" />
                      <h3 className="text-xl text-cosmic-white mb-2 font-semibold">
                        Connect Your Wallet
                      </h3>
                      <p className="text-stardust-gray mb-6">
                        Connect your wallet to view your portfolio, track your assets, and see transaction history
                      </p>
                      <div className="flex flex-col items-center space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-stardust-gray">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-aurora-green rounded-full"></div>
                            <span>Multi-chain support</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cosmic-purple rounded-full"></div>
                            <span>Real-time balances</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-stellar-pink rounded-full"></div>
                            <span>Transaction history</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-plasma-cyan rounded-full"></div>
                            <span>P&L tracking</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ErrorBoundary>
            )}
            
            {activeTab === 'analytics' && (
              <ErrorBoundary
                fallback={
                  <div className="p-6 bg-crimson-red/20 border border-crimson-red/50 rounded-lg">
                    <h2 className="text-lg font-semibold text-crimson-red mb-2">
                      Analytics Error
                    </h2>
                    <p className="text-sm text-cosmic-white">
                      Unable to load price charts. Please check your connection.
                    </p>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <PriceChart tokenSymbol="ETH" />
                    <PriceChart tokenSymbol="BTC" />
                  </div>
                  
                  {/* Additional Analytics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-asteroid-gray to-asteroid-gray/80 rounded-xl p-6 border border-meteor-gray/50">
                      <h4 className="text-lg font-semibold text-cosmic-white mb-3">
                        Market Overview
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-stardust-gray">Market Cap</span>
                          <span className="text-cosmic-white">$2.1T</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stardust-gray">24h Volume</span>
                          <span className="text-cosmic-white">$89B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stardust-gray">DeFi TVL</span>
                          <span className="text-cosmic-white">$45B</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-asteroid-gray to-asteroid-gray/80 rounded-xl p-6 border border-meteor-gray/50">
                      <h4 className="text-lg font-semibold text-cosmic-white mb-3">
                        Cross-Chain Activity
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-stardust-gray">Ethereum → Monad</span>
                          <span className="text-aurora-green">+12.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stardust-gray">Bridge Volume</span>
                          <span className="text-cosmic-white">$1.2M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stardust-gray">Active Routes</span>
                          <span className="text-cosmic-white">8</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-asteroid-gray to-asteroid-gray/80 rounded-xl p-6 border border-meteor-gray/50">
                      <h4 className="text-lg font-semibold text-cosmic-white mb-3">
                        Fusion+ Stats
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-stardust-gray">Orders Today</span>
                          <span className="text-cosmic-white">1,234</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stardust-gray">Avg. Execution</span>
                          <span className="text-cosmic-white">2.3min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stardust-gray">Success Rate</span>
                          <span className="text-aurora-green">99.8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Chart for Swap Tab */}
            {activeTab === 'swap' && (
              <ErrorBoundary
                fallback={
                  <div className="p-4 bg-meteor-gray/20 rounded-lg">
                    <p className="text-stardust-gray text-sm">Chart unavailable</p>
                  </div>
                }
              >
                <PriceChart tokenSymbol="ETH" className="h-120" />
              </ErrorBoundary>
            )}
            
            {/* Market Stats Card */}
            <div className="bg-gradient-to-br from-asteroid-gray to-asteroid-gray/80 rounded-xl p-6 border border-meteor-gray/50">
              <h3 className="text-lg font-semibold text-cosmic-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-cosmic-purple" />
                Market Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-stardust-gray">Total Volume 24h</span>
                  <span className="text-cosmic-white font-semibold">$1.2B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stardust-gray">Active Users</span>
                  <span className="text-cosmic-white font-semibold">45,231</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stardust-gray">Supported Chains</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-cosmic-white font-semibold">5</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" title="Ethereum"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full" title="Monad"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full" title="Polygon"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" title="Arbitrum"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full" title="Coming Soon"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stardust-gray">Available Tokens</span>
                  <span className="text-cosmic-white font-semibold">2,847</span>
                </div>
                
                {/* Mini Activity Indicator */}
                <div className="pt-2 border-t border-meteor-gray/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stardust-gray">Network Status</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-aurora-green rounded-full animate-pulse"></div>
                      <span className="text-aurora-green">All Systems Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



