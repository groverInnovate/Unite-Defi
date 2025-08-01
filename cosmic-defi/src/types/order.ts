export interface Order {
  orderHash: string                    // Unique identifier (primary key)
  maker: string                       // User's Ethereum address
  makerAsset: string                  // Token being sold (address)
  makingAmount: string                // Amount being sold (in wei)
  takerAsset: string                  // Token to receive (address)
  takingAmount: string                // Amount to receive (in wei)
  receiver: string                    // Address to receive tokens
  signature?: string                  // Order signature (optional for hackathon)
  status: OrderStatus                 // Order status
  hashLock: string                    // Secret hash (keccak256)
  sourceChainId: number               // Source blockchain ID
  destinationChainId: number          // Destination blockchain ID
  createdAt: Date                     // Creation timestamp
  updatedAt: Date                     // Last update timestamp
  expiry: Date                        // Order expiry
  quoteId?: string                    // Quote reference ID
  
  // Hackathon additions
  secret?: string                     // Raw secret (for demo purposes)
  userAddress: string                 // For easy querying
  fromTokenSymbol: string             // For UI display
  toTokenSymbol: string               // For UI display
}

export enum OrderStatus {
  PENDING = 'pending',
  AWAITING_ESCROW = 'awaiting_escrow',
  ESCROWED = 'escrowed',
  FILLED = 'filled',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}
