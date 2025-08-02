import { ResolverOrder, OrderStatus } from '@/types/resolverTypes'

// Mock orders data - replace with MongoDB data when backend is ready
const mockOrders: ResolverOrder[] = [
  {
    orderHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    maker: '0x742d35Cc6637C0532e0b70EadfF37b5B0DA5FB8b',
    makerAsset: '0x0000000000000000000000000000000000000000',
    makingAmount: '1000000000000000000', // 1 ETH
    takerAsset: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    takingAmount: '2000000000000000000000', // 2000 USDC (adjusted for decimals)
    receiver: '0x742d35Cc6637C0532e0b70EadfF37b5B0DA5FB8b',
    status: OrderStatus.PENDING,
    hashLock: '0x8f9e7a2b3c4d5e6f1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    sourceChainId: 1,
    destinationChainId: 41454,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiry: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
    quoteId: 'quote_1234567890',
    fromTokenSymbol: 'ETH',
    toTokenSymbol: 'USDC',
    userAddress: '0x742d35Cc6637C0532e0b70EadfF37b5B0DA5FB8b',
    srcContractDeployed: false,
    destContractDeployed: false,
  },
  {
    orderHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    maker: '0x8ba1f109551bD432803012645Hac136c96c93bf47',
    makerAsset: '0xA0b86a33E6441e3A99EA75C4AAeE54F1B2B1c8e5',
    makingAmount: '500000000', // 500 USDC
    takerAsset: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    takingAmount: '12500000', // 0.125 WBTC
    receiver: '0x8ba1f109551bD432803012645Hac136c96c93bf47',
    status: OrderStatus.ESCROWED,
    hashLock: '0x7a8b9c0d1e2f3456789abcdef1234567890abcdef1234567890abcdef',
    sourceChainId: 1,
    destinationChainId: 11155111,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    expiry: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
    quoteId: 'quote_2345678901',
    fromTokenSymbol: 'USDC',
    toTokenSymbol: 'WBTC',
    userAddress: '0x8ba1f109551bD432803012645Hac136c96c93bf47',
    srcContractDeployed: true,
    destContractDeployed: true,
    srcContractAddress: '0xabc123def456789abcdef1234567890abcdef12',
    destContractAddress: '0xdef456789abcdef1234567890abcdef123456789a',
  },
  {
    orderHash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
    maker: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    makerAsset: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    makingAmount: '100000000000000000000', // 100 UNI
    takerAsset: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    takingAmount: '50000000000000000000', // 50 LINK
    receiver: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    status: OrderStatus.FILLED,
    hashLock: '0x9b0c1d2e3f4567890abcdef1234567890abcdef1234567890abcdef12',
    sourceChainId: 1,
    destinationChainId: 41454,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    expiry: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
    quoteId: 'quote_3456789012',
    fromTokenSymbol: 'UNI',
    toTokenSymbol: 'LINK',
    userAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    srcContractDeployed: true,
    destContractDeployed: true,
    srcContractAddress: '0x123abc456def789abcdef1234567890abcdef123',
    destContractAddress: '0x456def789abcdef1234567890abcdef123456789a',
  }
]

class MockOrderService {
  private orders: ResolverOrder[] = [...mockOrders]

  /**
   * Get all orders - TODO: Replace with MongoDB API call
   */
  async getAllOrders(): Promise<ResolverOrder[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...this.orders]
  }

  /**
   * Update order - TODO: Replace with MongoDB API call
   */
  async updateOrder(orderHash: string, updates: Partial<ResolverOrder>): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.orders.findIndex(order => order.orderHash === orderHash)
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...updates }
      return true
    }
    return false
  }

  /**
   * Get order by hash - TODO: Replace with MongoDB API call
   */
  async getOrderByHash(orderHash: string): Promise<ResolverOrder | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.orders.find(order => order.orderHash === orderHash) || null
  }

  /**
   * Get orders by status - TODO: Replace with MongoDB API call
   */
  async getOrdersByStatus(status: OrderStatus): Promise<ResolverOrder[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.orders.filter(order => order.status === status)
  }

  /**
   * Get orders by user - TODO: Replace with MongoDB API call
   */
  async getOrdersByUser(userAddress: string): Promise<ResolverOrder[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.orders.filter(order => 
      order.userAddress.toLowerCase() === userAddress.toLowerCase()
    )
  }
}

export const mockOrderService = new MockOrderService()
