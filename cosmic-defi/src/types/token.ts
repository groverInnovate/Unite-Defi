export interface Token {
  address: string
  symbol: string
  name: string
  icon?: string
  decimals: number
  chainId: number
  balance?: string
  price?: number
  verified?: boolean
  popular?: boolean
}
