'use client'
import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { SwapInterface } from '@/components/trading/SwapInterface'
import { PriceChart } from '@/components/charts/PriceChart'
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview'
import { Button } from '@/components/ui/Button'
import { ArrowLeftRight, Wallet, BarChart3 } from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('swap')
  const [walletConnected, setWalletConnected] = useState(false)

  const tabs = [
    { id: 'swap', name: 'Swap', icon: ArrowLeftRight },
    { id: 'portfolio', name: 'Portfolio', icon: Wallet },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ]

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-space-black">
      {/* Header */}
      <Header 
        onConnectWallet={handleConnectWallet}
        walletConnected={walletConnected}
        walletAddress={walletConnected ? '0x1234...abcd' : undefined}
      />

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

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'swap' && (
              <div>
                <SwapInterface />
              </div>
            )}
            
            {activeTab === 'portfolio' && (
              <div>
                {walletConnected ? (
                  <PortfolioOverview />
                ) : (
                  <div className="text-center py-12">
                    <Wallet className="w-16 h-16 text-stardust-gray mx-auto mb-4" />
                    <h3 className="text-xl text-cosmic-white mb-2">
                      Connect Your Wallet
                    </h3>
                    <p className="text-stardust-gray mb-6">
                      Connect your wallet to view your portfolio
                    </p>
                    <Button onClick={handleConnectWallet} variant="primary">
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <PriceChart tokenSymbol="ETH" />
                <PriceChart tokenSymbol="BTC" />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Always show price chart in sidebar for swap tab */}
            {activeTab === 'swap' && (
              <PriceChart tokenSymbol="ETH" className="h-80" />
            )}
            
            {/* Market Stats Card */}
            <div className="bg-gradient-to-br from-asteroid-gray to-asteroid-gray/80 rounded-xl p-6 border border-meteor-gray/50">
              <h3 className="text-lg font-semibold text-cosmic-white mb-4">
                Market Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stardust-gray">Total Volume 24h</span>
                  <span className="text-cosmic-white">$1.2B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stardust-gray">Active Users</span>
                  <span className="text-cosmic-white">45,231</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stardust-gray">Supported Chains</span>
                  <span className="text-cosmic-white">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stardust-gray">Available Tokens</span>
                  <span className="text-cosmic-white">2,847</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

