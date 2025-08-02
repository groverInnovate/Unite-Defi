// src/services/simpleSecretService.ts

'use client'
import { keccak256, toUtf8Bytes } from 'ethers'

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
    if (typeof window === 'undefined' || !window.crypto) {
      // Return empty string if crypto is not available (e.g., on the server)
      return ''
    }
    
    try {
      const array = new Uint8Array(32)
      window.crypto.getRandomValues(array)
      return '0x' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      console.error('Failed to generate secure secret, using fallback:', error)
      // Fallback for older environments, though less secure
      let secret = '0x'
      const chars = '0123456789abcdef'
      for (let i = 0; i < 64; i++) {
        secret += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return secret
    }
  }

  /**
   * Generate secret and store its keccak256 hash
   */
  generateAndStoreSecret(): SimpleSwapSecret {
    const secret = this.generateSecret()
    
    // Add a guard to ensure a secret was actually generated
    if (!secret) {
        throw new Error("Failed to generate a valid secret. This function should only be called on the client-side.");
    }

    const secretHash = keccak256(secret) // secret is now a hex string, e.g., '0x...'
    
    const swapSecret: SimpleSwapSecret = {
      secret,
      secretHash,
      timestamp: Date.now()
    }
    
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