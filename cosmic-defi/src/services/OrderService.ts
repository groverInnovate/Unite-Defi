// services/orderService.ts
import { ResolverOrder } from '@/types/resolverTypes'

export const orderService = {
  getAllOrders: async (): Promise<ResolverOrder[]> => {
    const res = await fetch('http://localhost:5000/api/orders')
    if (!res.ok) throw new Error('Failed to fetch orders')
    return res.json()
  },

  getOrderByHash: async (orderHash: string): Promise<ResolverOrder> => {
    const res = await fetch(`http://localhost:5000/api/orders/${orderHash}`)
    if (!res.ok) throw new Error('Failed to fetch order by hash')
    return res.json()
  },



  updateOrder: async (orderHash: string, updates: Partial<ResolverOrder>): Promise<ResolverOrder> => {
    const res = await fetch(`http://localhost:5000/api/orders/${orderHash}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!res.ok) throw new Error('Failed to update order')
    return res.json()
  }
}
