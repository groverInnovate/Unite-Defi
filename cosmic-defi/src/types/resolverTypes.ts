export interface ResolverOrder {
  /* ----------  Core order fields (Mongo) ---------- */
  salt: string
  maker: string
  makingAmount: string
  takingAmount: string
  makerAsset: string
  takerAsset: string

  timeLocks: TimeLocks
  timestamp: string
  srcChainId: number
  dstChainId: number
  Safety_deposit: string   // BigInt as string
  resolverAddress: string  // whitelist resolver
  nonce: string            // BigInt as string
  signature: string
  orderHash: string
  secret: string           // preimage for HashLock

  /* ----------  UI helpers (still needed) ---------- */
  fromTokenSymbol: string
  toTokenSymbol: string
  userAddress: string
  status: string
}

export enum OrderStatus {
  PENDING = 'PENDING',
  AWAITING_ESCROW = 'AWAITING_ESCROW',
  ESCROWED = 'ESCROWED',
  FILLED = 'FILLED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface TimeLocks {
  srcWithdrawal: string
  srcPublicWithdrawal: string
  srcCancellation: string
  srcPublicCancellation: string
  dstWithdrawal: string
  dstPublicWithdrawal: string
  dstCancellation: string
}
