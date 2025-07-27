/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Add our custom colors to Tailwind
      colors: {
        // Space colors
        'space-black': '#0a0a0f',
        'cosmic-purple': '#6366f1',
        'nebula-blue': '#3b82f6',
        'plasma-cyan': '#06b6d4',
        // Accent colors
        'aurora-green': '#10b981',
        'solar-orange': '#f59e0b',
        'stellar-pink': '#ec4899',
        'crimson-red': '#ef4444',
        // Grays
        'asteroid-gray': '#1f2937',
        'meteor-gray': '#374151',
        'stardust-gray': '#9ca3af',
        'cosmic-white': '#f9fafb',
      },
      // Custom box shadows for glow effects
      boxShadow: {
        'glow-purple': '0 0 20px rgba(99, 102, 241, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
      },
      // Custom fonts
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
