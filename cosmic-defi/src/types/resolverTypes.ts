export interface ResolverOrder {
  orderHash: string
  maker: string
  makerAsset: string
  makingAmount: string
  takerAsset: string
  takingAmount: string
  receiver: string
  status: OrderStatus
  hashLock: string
  sourceChainId: number
  destinationChainId: number
  createdAt: Date
  expiry: Date
  quoteId?: string
  
  // Display-friendly fields
  fromTokenSymbol: string
  toTokenSymbol: string
  userAddress: string
  
  // Resolver-specific fields
  srcContractDeployed?: boolean
  destContractDeployed?: boolean
  srcContractAddress?: string
  destContractAddress?: string
  resolverAddress?: string
  resolverFee?: string
  
  // Fields for future MongoDB integration (commented)
  // signature?: string
  // salt?: string
  // auctionParameters?: any
  // secretHashes?: string[]
  // updatedAt?: Date
}

export enum OrderStatus {
  PENDING = 'pending',
  AWAITING_ESCROW = 'awaiting_escrow',
  ESCROWED = 'escrowed',
  FILLED = 'filled',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}
