'use client'
import React, { useState, useEffect } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { motion } from 'framer-motion'
import { ArrowUpDown, Settings, Zap, Network, Clock, ExternalLink, Shield, Key, Copy, Eye, EyeOff } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TokenInput } from '../ui/TokenInput'
import { TokenSelector } from './TokenSelector'
import { apiService } from '@/services/apiService'
import { tokenService } from '@/services/TokenService'
import { simpleSecretService, SimpleSwapSecret } from '@/services/secretService' // ✅ UPDATED IMPORT
import { useTokenBalances } from '@/hooks/useTokenBalances'
import { SwapQuoteResponse } from '@/types/api'
import { useSignTypedData } from 'wagmi';
import { Token } from '@/types/token'
import toast from 'react-hot-toast'
import crypto from 'crypto'
import * as Sdk from '@1inch/cross-chain-sdk'
import {ethers, getAddress} from 'ethers'
import {CHAIN_CONFIGS, getLatestBlockTimestamp} from './config'
const {Address} = Sdk
// Supported chains for cross-chain swaps
const SUPPORTED_CHAINS = {
  1: { name: 'Ethereum', color: 'text-blue-400', explorer: 'https://etherscan.io' },
  11155111: { name: 'Sepolia', color: 'text-blue-300', explorer: 'https://sepolia.etherscan.io' },
  10143: { name: 'Monad', color: 'text-purple-400', explorer: 'https://testnet-explorer.monad.xyz' },
}


export const SwapInterface: React.FC = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { signTypedDataAsync } = useSignTypedData();
  // State
  const [tokens, setTokens] = useState<Token[]>([])
  const [fromToken, setFromToken] = useState<Token | undefined>()
  const [toToken, setToToken] = useState<Token | undefined>()
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromChain, setFromChain] = useState<number>(chainId || 1)
  const [toChain, setToChain] = useState<number>(41454)
  const [quote, setQuote] = useState<SwapQuoteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCrossChain, setIsCrossChain] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  // ✅ SIMPLIFIED: Secret management state
  const [currentSecret, setCurrentSecret] = useState<SimpleSwapSecret | null>(null)
  const [showSecret, setShowSecret] = useState(false)
  const [secretCopied, setSecretCopied] = useState(false)

  // UI state
  const [showFromSelector, setShowFromSelector] = useState(false)
  const [showToSelector, setShowToSelector] = useState(false)
  const [slippage, setSlippage] = useState('1.0')

  // Load tokens for current chain
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const chainTokens = await tokenService.getTokenList(fromChain)
        setTokens(chainTokens)
        
        if (!fromToken && chainTokens.length > 0) {
          setFromToken(chainTokens[0])
        }
        if (!toToken && chainTokens.length > 1) {
          setToToken(chainTokens[1])
        }
      } catch (error) {
        console.error('Failed to load tokens:', error)
      }
    }

    loadTokens()
  }, [fromChain])

  // Get token balances
  const { balances } = useTokenBalances(tokens)

  // Get quote when inputs change
  useEffect(() => {
    if (fromToken && toToken && fromAmount && address && isConnected) {
      const debounceTimer = setTimeout(() => {
        getQuote()
      }, 500)

      return () => clearTimeout(debounceTimer)
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
      
      const amountInWei = (parseFloat(fromAmount) * Math.pow(10, fromToken.decimals)).toString()
      
      const quoteData = await apiService.getSwapQuote({
        srcChainId: fromChain,
        dstChainId: toChain,
        srcToken: fromToken.address,
        dstToken: toToken.address,
        amount: amountInWei,
        userAddress: address,
        slippage: parseFloat(slippage),
      })
      
      setQuote(quoteData)
      
      const outputAmount = parseFloat(quoteData.dstAmount) / Math.pow(10, toToken.decimals)
      setToAmount(outputAmount.toFixed(6))
      
    } catch (error: any) {
      console.error('Failed to get quote:', error)
      setError(error.message || 'Failed to get quote')
      setQuote(null)
      setToAmount('')
      toast.error('Failed to get swap quote')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ SIMPLIFIED: Handle swap with simple secret generation
  const handleSwap = async () => {
    if (!quote || !address || !isConnected || !fromToken || !toToken) return
    
    try {
      setIsLoading(true)
      setError(null)
      setTransactionHash(null)
      
      // ✅ SIMPLIFIED: Generate secret and hash for cross-chain swaps
      let swapSecret: SimpleSwapSecret | null = null
      
      
        swapSecret = simpleSecretService.generateAndStoreSecret()
        setCurrentSecret(swapSecret)
        toast.success('🔐 Secret generated and hash stored!')
      
      
      if (chainId !== fromChain) {
        toast.loading(
          `🔄 Switching to ${SUPPORTED_CHAINS[fromChain as keyof typeof SUPPORTED_CHAINS]?.name} network...`,
          { duration: 4000 }
        )
        
        try {
          await switchChain({ chainId: fromChain })
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (switchError: any) {
          toast.error('❌ Network switch cancelled or failed')
          setIsLoading(false)
          return
        }
      }
      const TIMELOCKS = {
        srcWithdrawal: 10n,
        srcPublicWithdrawal: 120n,
        srcCancellation: 121n,
        srcPublicCancellation: 122n,
        dstWithdrawal: 10n,
        dstPublicWithdrawal: 100n,
        dstCancellation: 101n,
      };
      const SAFETY_DEPOSIT = ethers.parseEther('0.001'); // 0.001 ETH
      const UINT_40_MAX = 2n ** 40n - 1n;
      const srcConfig = CHAIN_CONFIGS[fromChain];
      const dstConfig = CHAIN_CONFIGS[toChain];
      console.log('srcConfig:', srcConfig)
      const USDC_Address = (srcConfig.tokens.USDC.address)
      console.log(USDC_Address)
      const makingAmount = ethers.parseUnits(fromAmount, fromToken.decimals);
      const takingAmount = ethers.parseUnits(quote.dstAmount, toToken.decimals);
      const srcTimestamp = await getLatestBlockTimestamp(srcConfig.url);
      toast.loading('🚀 Executing swap transaction...')
      const order = Sdk.CrossChainOrder.new(
            new Address(srcConfig.escrowFactory),
            {
                salt: Sdk.randBigInt(1000n), // Or a more robust random generator
                maker: new Address(address),
                makingAmount: makingAmount,
                takingAmount: takingAmount,
                makerAsset: new Address(USDC_Address),
                takerAsset: new Address("0x7D0cd861fAC3E694511946695c353534C7c3808B"),
            },
            {
                hashLock: Sdk.HashLock.forSingleFill(swapSecret.secret),
                timeLocks: Sdk.TimeLocks.new(TIMELOCKS),
                srcChainId: srcConfig.chainId,
                dstChainId: Sdk.NetworkEnum.MONAD,
                srcSafetyDeposit: SAFETY_DEPOSIT,
                dstSafetyDeposit: SAFETY_DEPOSIT,
            },
            {
                auction: new Sdk.AuctionDetails({
                    initialRateBump: 0,
                    points: [],
                    duration: 120n, // 2 minutes
                    startTime: srcTimestamp
                }),
                whitelist: [{
                    address: new Address(srcConfig.resolver),
                    allowFrom: 0n
                }],
                resolvingStartTime: 0n,
            },
            {
                nonce: Sdk.randBigInt(UINT_40_MAX),
                allowPartialFills: false,
                allowMultipleFills: false,
            }
        );
        
        console.log("Constructed Order:", order);
        toast.loading('Please approve the transaction in your wallet...');
        const typedData = order.getTypedData(fromChain);
        const signature = await signTypedDataAsync({
          domain: typedData.domain,
          types: typedData.types, // Pass the full types object from the payload
          primaryType: typedData.primaryType, // Let wagmi know the main type, e.g., "Order"
          message: typedData.message, // The actual order data to be signed
        });
        const orderHash = order.getOrderHash(srcConfig.chainId)
        const payload = {
          salt: order.salt.toString(),
          maker: order.maker.toString(),
          makingAmount: order.makingAmount.toString(),
          takingAmount: order.takingAmount.toString(),
          makerAsset: order.makerAsset.toString(),
          takerAsset: order.takerAsset.toString(),

          timeLocks: Object.fromEntries(
            Object.entries(TIMELOCKS).map(([k, v]) => [k, v.toString()])
          ),

          srcChainId: srcConfig.chainId.toString(),
          dstChainId: Sdk.NetworkEnum.MONAD.toString(),
          Safety_deposit: SAFETY_DEPOSIT.toString(),
          timestamp: srcTimestamp.toString(),
          resolverAddress: srcConfig.resolver,
          nonce: order.nonce.toString(),
          signature,
          orderHash: orderHash.toString?.() ?? orderHash,
          secret: swapSecret.secret
        }
        console.log(JSON.stringify(payload))
        const res = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          const data = await res.json()
          console.log('Order stored:', data)
        } else {
          const error = await res.text()
          console.error('Error storing order:', error)
        }

    } catch (error: any) {
      console.error('Swap failed:', error)
      setError(error.message || 'Swap failed')
      toast.error('❌ Swap failed: ' + (error.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ SIMPLIFIED: Copy secret function
  const copySecret = async () => {
    if (!currentSecret) return
    
    try {
      await navigator.clipboard.writeText(currentSecret.secret)
      setSecretCopied(true)
      toast.success('Secret copied to clipboard!')
      
      setTimeout(() => setSecretCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy secret:', error)
      toast.error('Failed to copy secret')
    }
  }

  // ✅ SIMPLIFIED: Copy secret hash function
  const copySecretHash = async () => {
    if (!currentSecret) return
    
    try {
      await navigator.clipboard.writeText(currentSecret.secretHash)
      toast.success('Secret hash copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy secret hash:', error)
      toast.error('Failed to copy secret hash')
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
    setCurrentSecret(null)
    simpleSecretService.clearSecret()
  }

  const swapTokensAndChains = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
    
    if (isCrossChain) {
      setFromChain(toChain)
      setToChain(fromChain)
    }
    
    setQuote(null)
    setCurrentSecret(null)
    simpleSecretService.clearSecret()
  }

  const handleFromTokenSelect = (token: Token) => {
    setFromToken(token)
  }

  const handleToTokenSelect = (token: Token) => {
    setToToken(token)
  }

  const fromTokenWithBalance = fromToken ? {
    ...fromToken,
    balance: balances[fromToken.address] || '0.0000',
    icon: fromToken.icon || '/tokens/default.png'
  } : undefined

  const toTokenWithBalance = toToken ? {
    ...toToken,
    balance: balances[toToken.address] || '0.0000',
    icon: toToken.icon || '/tokens/default.png'
  } : undefined

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        {/* Header with Cross-Chain Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-cosmic-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-cosmic-purple" />
            1inch Fusion+ Swap
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

        {/* ✅ SIMPLIFIED: Secret Display */}
        {currentSecret && isCrossChain && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-4 bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-cosmic-purple" />
                <span className="text-sm font-medium text-cosmic-purple">
                  Swap Secret Generated
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-1 h-6 w-6"
                >
                  {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copySecret}
                  className="p-1 h-6 w-6"
                >
                  <Copy className={`w-3 h-3 ${secretCopied ? 'text-aurora-green' : ''}`} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Secret */}
              <div className="bg-asteroid-gray/50 p-3 rounded-lg">
                <div className="text-xs text-stardust-gray mb-1">Secret:</div>
                <div className="font-mono text-xs text-cosmic-white break-all leading-relaxed">
                  {showSecret ? currentSecret.secret : '•'.repeat(64)}
                </div>
              </div>

              {/* Secret Hash (Keccak256) */}
              <div className="bg-asteroid-gray/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-stardust-gray">Secret Hash (Keccak256):</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copySecretHash}
                    className="p-1 h-4 w-4"
                  >
                    <Copy className="w-2 h-2" />
                  </Button>
                </div>
                <div className="font-mono text-xs text-aurora-green break-all leading-relaxed">
                  {currentSecret.secretHash}
                </div>
              </div>
            </div>
            
            <div className="text-xs text-stardust-gray mt-2 opacity-75">
              Generated: {new Date(currentSecret.timestamp).toLocaleTimeString()}
            </div>
          </motion.div>
        )}

        {/* Network Information */}
        {isCrossChain && chainId !== fromChain && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Network className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">
                Network Switch Required
              </span>
            </div>
            <div className="text-xs text-stardust-gray">
              Your wallet is connected to{' '}
              <span className="text-cosmic-white">
                {SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS]?.name || 'Unknown'}
              </span>
              , but the swap needs to start on{' '}
              <span className="text-cosmic-white">
                {SUPPORTED_CHAINS[fromChain as keyof typeof SUPPORTED_CHAINS]?.name}
              </span>
              . You'll be asked to approve the network switch.
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-crimson-red/20 border border-crimson-red/50 rounded-lg">
            <p className="text-sm text-crimson-red">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {transactionHash && (
          <div className="mb-4 p-3 bg-aurora-green/20 border border-aurora-green/50 rounded-lg">
            <p className="text-sm text-aurora-green mb-2">Transaction submitted!</p>
            <a 
              href={`${SUPPORTED_CHAINS[fromChain as keyof typeof SUPPORTED_CHAINS]?.explorer}/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-aurora-green hover:underline flex items-center"
            >
              View on Explorer <ExternalLink className="w-3 h-3 ml-1" />
            </a>
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
            token={fromTokenWithBalance}
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
            token={toTokenWithBalance}
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

                <div className="flex justify-between text-sm">
                  <span className="text-stardust-gray flex items-center">
                    <Key className="w-3 h-3 mr-1" />
                    Secret Required
                  </span>
                  <span className="text-aurora-green">✓ Will be generated</span>
                </div>
              </>
            )}
            
            {quote.priceImpact && (
              <div className="flex justify-between text-sm">
                <span className="text-stardust-gray">Price Impact</span>
                <span className="text-cosmic-white">{quote.priceImpact}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-stardust-gray">Estimated Gas</span>
              <span className="text-cosmic-white">{quote.estimatedGas} ETH</span>
            </div>

            {quote.minimumReceived && (
              <div className="flex justify-between text-sm">
                <span className="text-stardust-gray">Minimum Received</span>
                <span className="text-cosmic-white">
                  {(parseFloat(quote.minimumReceived) / Math.pow(10, toToken?.decimals || 18)).toFixed(6)} {toToken?.symbol}
                </span>
              </div>
            )}
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
              <span className="text-sm text-stardust-gray">
                {quote ? 'Processing swap...' : 'Getting quote...'}
              </span>
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
            : isCrossChain && fromChain !== toChain
            ? 'Generate Secret & Swap'
            : 'Swap'}
        </Button>
      </Card>

      {/* Token Selectors */}
      <TokenSelector
        isOpen={showFromSelector}
        onClose={() => setShowFromSelector(false)}
        onSelectToken={handleFromTokenSelect}
        selectedToken={fromToken}
        tokens={tokens}
      />

      <TokenSelector
        isOpen={showToSelector}
        onClose={() => setShowToSelector(false)}
        onSelectToken={handleToTokenSelect}
        selectedToken={toToken}
        tokens={tokens}
      />
    </div>
  )
}
