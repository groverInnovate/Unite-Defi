// This file contains all our space theme colors and styles
export const theme = {
  // Main colors for our cosmic theme
  colors: {
    // Dark space colors
    space: {
      black: '#0a0a0f',      // Deep space background
      purple: '#6366f1',     // Primary cosmic purple
      blue: '#3b82f6',       // Nebula blue
      cyan: '#06b6d4',       // Plasma cyan
    },
    // Accent colors for different states
    accent: {
      green: '#10b981',      // Success/profit color
      orange: '#f59e0b',     // Warning color
      pink: '#ec4899',       // Special features
      red: '#ef4444',        // Error/loss color
    },
    // Gray shades for text and backgrounds
    gray: {
      900: '#1f2937',        // Dark cards
      800: '#374151',        // Borders
      400: '#9ca3af',        // Secondary text
      50: '#f9fafb',         // Primary text
    }
  },
  // Special glow effects
  effects: {
    glowPrimary: '0 0 20px rgba(99, 102, 241, 0.5)',
    glowSuccess: '0 0 20px rgba(16, 185, 129, 0.5)',
    glowError: '0 0 20px rgba(239, 68, 68, 0.5)',
  },
  // Gradients for cosmic look
  gradients: {
    cosmic: 'linear-gradient(145deg, #1f2937, #111827)',
    button: 'linear-gradient(145deg, #6366f1, #8b5cf6)',
  }
}

// Export individual colors for easy use
export const colors = theme.colors
export const effects = theme.effects
