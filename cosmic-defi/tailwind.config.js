/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-family-inter)', 'system-ui', 'sans-serif'],
        'space': ['var(--font-family-space)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-family-mono)', 'Menlo', 'monospace'],
      },
      colors: {
        'space-black': 'var(--color-space-black)',
        'cosmic-purple': 'var(--color-cosmic-purple)',
        'nebula-blue': 'var(--color-nebula-blue)',
        'plasma-cyan': 'var(--color-plasma-cyan)',
        'aurora-green': 'var(--color-aurora-green)',
        'solar-orange': 'var(--color-solar-orange)',
        'stellar-pink': 'var(--color-stellar-pink)',
        'crimson-red': 'var(--color-crimson-red)',
        'asteroid-gray': 'var(--color-asteroid-gray)',
        'meteor-gray': 'var(--color-meteor-gray)',
        'stardust-gray': 'var(--color-stardust-gray)',
        'cosmic-white': 'var(--color-cosmic-white)',
      },
      boxShadow: {
        'glow-purple': 'var(--shadow-glow-purple)',
        'glow-green': 'var(--shadow-glow-green)',
        'glow-red': 'var(--shadow-glow-red)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

