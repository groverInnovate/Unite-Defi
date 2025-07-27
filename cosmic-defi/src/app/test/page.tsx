'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { TokenInput } from '@/components/ui/TokenInput'
import { Header } from '@/components/layout/Header'
import { TokenSelector } from '@/components/trading/TokenSelector'
import type { Token } from '@/components/trading/TokenSelector'

export default function TestPage() {
  const [inputValue, setInputValue] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const [showTokenSelector, setShowTokenSelector] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined)

  return (
    <div className="min-h-screen bg-space-black">
      {/* Header */}
      <Header 
        onConnectWallet={() => console.log('Connect wallet clicked')}
        walletConnected={false}
      />
      
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <h1 className="text-3xl font-bold text-cosmic-white">Component Test Page</h1>
        
        {/* Test Buttons */}
        <Card>
          <h2 className="text-xl text-cosmic-white mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="primary" loading>Loading...</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </Card>

        {/* Test Inputs */}
        <Card>
          <h2 className="text-xl text-cosmic-white mb-4">Inputs</h2>
          <div className="space-y-4">
            <Input
              label="Basic Input"
              placeholder="Enter some text"
              value={inputValue}
              onChange={setInputValue}
            />
            <Input
              label="Error Input"
              placeholder="This has an error"
              error="This field is required"
            />
            <TokenInput
              label="Token Amount"
              value={tokenAmount}
              onChange={setTokenAmount}
              token={selectedToken}
              onTokenSelect={() => setShowTokenSelector(true)}
            />
          </div>
        </Card>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg text-cosmic-white mb-2">Regular Card</h3>
            <p className="text-stardust-gray">This is a regular card with hover effects.</p>
          </Card>
          <Card glow>
            <h3 className="text-lg text-cosmic-white mb-2">Glowing Card</h3>
            <p className="text-stardust-gray">This card has a permanent glow effect.</p>
          </Card>
        </div>
      </div>

      {/* Token Selector Modal */}
      <TokenSelector
        isOpen={showTokenSelector}
        onClose={() => setShowTokenSelector(false)}
        onSelectToken={(token) => {
          setSelectedToken(token)
          setShowTokenSelector(false)
        }}
        selectedToken={selectedToken}
      />
    </div>
  )
}
