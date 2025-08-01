'use client'
import { keccak256 } from 'ethers'

interface SimpleSwapSecret {
  secret: string
  secretHash: string
  timestamp: number
}

class SimpleSecretService {
  private currentSecret: SimpleSwapSecret | null = null

  /**
   * Generate a simple random secret (32 bytes hex)
   */
  generateSecret(): string {
    if (typeof window === 'undefined') return ''
    
    try {
      // Generate 32 bytes of random data
      const array = new Uint8Array(32)
      window.crypto.getRandomValues(array)
      
      // Convert to hex string
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      console.error('Failed to generate secure secret:', error)
      // Fallback to Math.random
      return this.generateFallbackSecret()
    }
  }

  /**
   * Fallback secret generation
   */
  private generateFallbackSecret(): string {
    let secret = ''
    const chars = '0123456789abcdef'
    for (let i = 0; i < 64; i++) { // 32 bytes = 64 hex characters
      secret += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return secret
  }

  /**
   * Generate secret and store its keccak256 hash
   */
  generateAndStoreSecret(): SimpleSwapSecret {
    const secret = this.generateSecret()
    const secretHash = keccak256('0x' + secret) // Add 0x prefix for keccak256
    
    const swapSecret: SimpleSwapSecret = {
      secret,
      secretHash,
      timestamp: Date.now()
    }
    
    // Store the current secret
    this.currentSecret = swapSecret
    
    console.log('🔐 Secret generated:', secret)
    console.log('🔑 Secret hash (keccak256):', secretHash)
    
    return swapSecret
  }

  /**
   * Get current secret
   */
  getCurrentSecret(): SimpleSwapSecret | null {
    return this.currentSecret
  }

  /**
   * Get only the secret hash (what relayer needs)
   */
  getSecretHash(): string | null {
    return this.currentSecret?.secretHash || null
  }

  /**
   * Clear current secret
   */
  clearSecret(): void {
    this.currentSecret = null
  }
}

export const simpleSecretService = new SimpleSecretService()
export type { SimpleSwapSecret }
