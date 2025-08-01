import { 
  SwapQuoteRequest, 
  SwapQuoteResponse, 
  SwapExecuteRequest, 
  SwapExecuteResponse,
  Token,
  PortfolioData,
  TransactionHistory,
  ApiError 
} from '@/types/api'
import { Order, OrderStatus } from '@/types/order'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error')
    }
  }

  // Swap Quote
  async getSwapQuote(params: SwapQuoteRequest): Promise<SwapQuoteResponse> {
    // For development: return mock data if backend is not available
    try {
      return await this.request<SwapQuoteResponse>('/api/swap/quote', {
        method: 'POST',
        body: JSON.stringify(params),
      })
    } catch (error) {
      console.warn('Backend not available, using mock ', error)
      return this.getMockQuote(params)
    }
  }

  // Execute Swap
  async executeSwap(params: SwapExecuteRequest): Promise<SwapExecuteResponse> {
    try {
      return await this.request<SwapExecuteResponse>('/api/swap/execute', {
        method: 'POST',
        body: JSON.stringify(params),
      })
    } catch (error) {
      console.warn('Backend not available, using mock response:', error)
      return this.getMockSwapExecution(params)
    }
  }

  // Get Token List
  async getTokenList(chainId?: number): Promise<Token[]> {
    try {
      const endpoint = chainId ? `/api/tokens?chainId=${chainId}` : '/api/tokens'
      return await this.request<Token[]>(endpoint)
    } catch (error) {
      console.warn('Backend not available, using mock tokens:', error)
      return this.getMockTokens()
    }
  }

  // Get Portfolio
  async getPortfolio(address: string): Promise<PortfolioData> {
    try {
      return await this.request<PortfolioData>(`/api/portfolio/${address}`)
    } catch (error) {
      console.warn('Backend not available, using mock portfolio:', error)
      return this.getMockPortfolio()
    }
  }

  // Get Transaction History
  async getTransactionHistory(address: string, page = 1): Promise<TransactionHistory> {
    try {
      return await this.request<TransactionHistory>(`/api/transactions/${address}?page=${page}`)
    } catch (error) {
      console.warn('Backend not available, using mock history:', error)
      return this.getMockTransactionHistory()
    }
  }

  // Mock Data Methods (for development)
  private getMockQuote(params: SwapQuoteRequest): Promise<SwapQuoteResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isCrossChain = params.srcChainId !== params.dstChainId
        const amount = parseFloat(params.amount) || 1
        const fee = isCrossChain ? 0.005 : 0.003
        
        resolve({
          srcAmount: params.amount,
          dstAmount: (amount * (1 - fee)).toString(),
          estimatedGas: isCrossChain ? '0.004' : '0.002',
          bridgeFee: isCrossChain ? '0.005' : '0',
          executionTime: isCrossChain ? '2-5 minutes' : '30 seconds',
          route: 'fusion-plus',
          priceImpact: (amount * 0.001).toFixed(3) + '%',
          minimumReceived: (amount * (1 - fee) * 0.995).toString(),
        })
      }, 1000)
    })
  }

  private getMockSwapExecution(params: SwapExecuteRequest): Promise<SwapExecuteResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orderId: `fusion-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          status: 'pending',
          transactionHash: `0x${Math.random().toString(16).substring(2).padStart(64, '0')}`,
          estimatedTime: params.quote.executionTime,
        })
      }, 500)
    })
  }

  private getMockTokens(): Promise<Token[]> {
    return Promise.resolve([
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: 'Ethereum',
        icon: '/tokens/eth.png',
        decimals: 18,
        chainId: 1,
        price: 2000,
        verified: true,
      },
      {
        address: '0xA0b86a33E6441e3A99EA75C4AAeE54F1B2B1c8e5',
        symbol: 'USDC',
        name: 'USD Coin',
        icon: '/tokens/usdc.png',
        decimals: 6,
        chainId: 1,
        price: 1,
        verified: true,
      },
      {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        icon: '/tokens/wbtc.png',
        decimals: 8,
        chainId: 1,
        price: 45000,
        verified: true,
      },
    ])
  }

  private getMockPortfolio(): Promise<PortfolioData> {
    return Promise.resolve({
      totalValueUSD: 12847.52,
      totalChange24h: 284.32,
      totalChangePercent24h: 2.27,
      tokens: [
        {
          token: {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            name: 'Ethereum',
            icon: '/tokens/eth.png',
            decimals: 18,
            chainId: 1,
            price: 2000,
            verified: true,
          },
          balance: '1.234',
          balanceUSD: 2468.00,
        },
      ],
    })
  }

  private getMockTransactionHistory(): Promise<TransactionHistory> {
    return Promise.resolve({
      transactions: [],
      hasMore: false,
    })
  }
  async storeOrder(orderData: Partial<Order>): Promise<{ success: boolean; orderId: string }> {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error(`Failed to store order: ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error storing order:', error)
      throw error
    }
  }

  /**
   * Get order by hash
   */
  async getOrder(orderHash: string): Promise<Order | null> {
    try {
      const response = await fetch(`/api/orders/${orderHash}`)
      
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`Failed to get order: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting order:', error)
      throw error
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderHash: string, status: OrderStatus): Promise<boolean> {
    try {
      const response = await fetch(`/api/orders/${orderHash}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })

      return response.ok
    } catch (error) {
      console.error('Error updating order status:', error)
      return false
    }
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userAddress: string): Promise<Order[]> {
    try {
      const response = await fetch(`/api/orders/user/${userAddress}`)
      
      if (!response.ok) {
        throw new Error(`Failed to get user orders: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting user orders:', error)
      return []
    }
  }
}



export const apiService = new ApiService()

