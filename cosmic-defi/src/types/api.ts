// API request/response types for frontend-backend communication

export interface SwapQuoteRequest {
  srcChainId: number
  dstChainId: number
  srcToken: string
  dstToken: string
  amount: string
  userAddress: string
  slippage?: number
}

export interface SwapQuoteResponse {
  srcAmount: string
  dstAmount: string
  estimatedGas: string
  bridgeFee: string
  executionTime: string
  route: string
  priceImpact?: string
  minimumReceived?: string
}

export interface SwapExecuteRequest {
  quote: SwapQuoteResponse
  userAddress: string
  fromChain: number
  toChain: number
}

export interface SwapExecuteResponse {
  orderId: string
  status: 'pending' | 'submitted' | 'completed' | 'failed'
  transactionHash?: string
  estimatedTime?: string
}

export interface Token {
  address: string
  symbol: string
  name: string
  icon: string
  decimals: number
  chainId: number
  price?: number
  verified?: boolean
}

export interface TokenBalance {
  token: Token
  balance: string
  balanceUSD: number
}

export interface PortfolioData {
  totalValueUSD: number
  totalChange24h: number
  totalChangePercent24h: number
  tokens: TokenBalance[]
}

export interface TransactionHistory {
  transactions: Transaction[]
  hasMore: boolean
  nextPage?: string
}

export interface Transaction {
  id: string
  type: 'swap' | 'bridge' | 'transfer'
  status: 'pending' | 'completed' | 'failed'
  fromToken: Token
  toToken?: Token
  fromAmount: string
  toAmount?: string
  fromChain: number
  toChain?: number
  transactionHash: string
  timestamp: number
  gasFee?: string
  bridgeFee?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

