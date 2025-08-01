import { Token } from '../types/token' // ✅ FIXED: Import shared Token type

// ❌ REMOVE: Delete any local Token interface definition

// Real token lists from Uniswap
const TOKEN_LIST_URLS = {
  ethereum: 'https://tokens.uniswap.org',
  polygon: 'https://tokens.coingecko.com/polygon-pos/all.json',
}

class TokenService {
  private tokenCache: Map<number, Token[]> = new Map()
  private priceCache: Map<string, number> = new Map()

  async getTokenList(chainId: number): Promise<Token[]> {
    if (this.tokenCache.has(chainId)) {
      return this.tokenCache.get(chainId)!
    }

    try {
      let tokens: Token[] = []
      
      if (chainId === 1) { // Ethereum
        const response = await fetch(TOKEN_LIST_URLS.ethereum)
        const data = await response.json()
        tokens = data.tokens.slice(0, 50).map(this.mapToToken) // Top 50 tokens
      } else if (chainId === 41454) { // Monad
        tokens = this.getMonadTokens()
      }

      this.tokenCache.set(chainId, tokens)
      return tokens
    } catch (error) {
      console.error('Failed to fetch token list:', error)
      return this.getDefaultTokens(chainId)
    }
  }

  async getTokenPrices(tokenSymbols: string[]): Promise<Map<string, number>> {
    try {
      const symbols = tokenSymbols.join(',')
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd`
      )
      const data = await response.json()
      
      const priceMap = new Map<string, number>()
      Object.entries(data).forEach(([symbol, price]: [string, any]) => {
        priceMap.set(symbol.toUpperCase(), price.usd)
        this.priceCache.set(symbol, price.usd)
      })
      
      return priceMap
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      return new Map()
    }
  }

  // ✅ FIXED: mapToToken now returns consistent Token type
  private mapToToken(tokenData: any): Token {
    return {
      address: tokenData.address,
      symbol: tokenData.symbol,
      name: tokenData.name,
      decimals: tokenData.decimals,
      chainId: tokenData.chainId,
      icon: tokenData.logoURI || `/tokens/${tokenData.symbol.toLowerCase()}.png`,
      verified: true, // ✅ ADDED: Now consistent with shared type
      popular: false, // ✅ ADDED: Now consistent with shared type
      // price and balance will be added later
    }
  }

  // ✅ FIXED: getMonadTokens now returns consistent Token type
  private getMonadTokens(): Token[] {
    return [
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'MON',
        name: 'Monad',
        decimals: 18,
        chainId: 41454,
        icon: '/tokens/mon.png',
        verified: true,
        popular: true,
      },
      {
        address: '0x1234567890123456789012345678901234567890',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        chainId: 41454,
        icon: '/tokens/usdc.png',
        verified: true,
        popular: true,
      }
    ]
  }

  // ✅ FIXED: getDefaultTokens now returns consistent Token type
  private getDefaultTokens(chainId: number): Token[] {
    const baseTokens: Token[] = [
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: chainId === 1 ? 'ETH' : 'MON',
        name: chainId === 1 ? 'Ethereum' : 'Monad',
        decimals: 18,
        chainId,
        icon: `/tokens/${chainId === 1 ? 'eth' : 'mon'}.png`,
        verified: true,
        popular: true,
      }
    ]
    return baseTokens
  }
}

export const tokenService = new TokenService()

