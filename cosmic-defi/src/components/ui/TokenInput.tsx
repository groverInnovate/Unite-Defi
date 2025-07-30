import React from 'react'
import { Input } from './Input'
import { Button } from './Button'
import { ChevronDown } from 'lucide-react'

interface Token {
  symbol: string
  name: string
  icon: string
  address: string
  balance?: string
  decimals: number  // ✅ ADDED: Required decimals property
}

interface TokenInputProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  token?: Token | null                  // Selected token
  onTokenSelect?: () => void       // Function to open token selector
  showBalance?: boolean            // Should we show balance?
  className?: string
}

export const TokenInput: React.FC<TokenInputProps> = ({
  label,
  value,
  onChange,
  token,
  onTokenSelect,
  showBalance = true,
  className = ''
}) => {
  // Function to set maximum balance
  const handleMaxClick = () => {
    if (token?.balance && onChange) {
      onChange(token.balance)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and balance */}
      <div className="flex justify-between items-center">
        {label && (
          <label className="text-sm font-medium text-stardust-gray">
            {label}
          </label>
        )}
        {showBalance && token?.balance && (
          <span className="text-sm text-stardust-gray">
            Balance: {token.balance} {token.symbol}
          </span>
        )}
      </div>
      
      {/* Input with token selector */}
      <div className="relative">
        <Input
          type="number"
          placeholder="0.0"
          value={value}
          onChange={onChange}
          rightElement={
            <div className="flex items-center space-x-2">
              {/* MAX button */}
              {token?.balance && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMaxClick}
                  className="text-xs px-2 py-1"
                >
                  MAX
                </Button>
              )}
              
              {/* Token selector button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={onTokenSelect}
                className="flex items-center space-x-2 min-w-max"
              >
                {token ? (
                  <>
                    <img 
                      src={token.icon} 
                      alt={token.symbol}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{token.symbol}</span>
                  </>
                ) : (
                  <span>Select Token</span>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          }
        />
      </div>
    </div>
  )
}
