import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// Define what props our button can accept
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'  // Different button styles
  size?: 'sm' | 'md' | 'lg'                    // Different sizes
  children: React.ReactNode                     // Button text/content
  disabled?: boolean                            // Is button disabled?
  loading?: boolean                             // Is button in loading state?
  onClick?: () => void                          // What happens when clicked
  className?: string                            // Additional CSS classes
  type?: 'button' | 'submit' | 'reset'        // HTML button type
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
}) => {
  // Define base styles that all buttons share
  const baseStyles = `
    relative overflow-hidden rounded-lg font-medium 
    transition-all duration-200 transform-gpu
    focus:outline-none focus:ring-2 focus:ring-cosmic-purple/50
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  // Different styles for each variant
  const variants = {
    primary: `
      bg-gradient-to-r from-cosmic-purple to-stellar-pink
      text-white shadow-lg hover:shadow-glow-purple
      hover:scale-105 active:scale-95
    `,
    secondary: `
      bg-asteroid-gray border border-meteor-gray
      text-cosmic-white hover:border-cosmic-purple
      hover:shadow-glow-purple hover:bg-asteroid-gray/80
    `,
    ghost: `
      bg-transparent border border-transparent
      text-cosmic-purple hover:bg-cosmic-purple/10
      hover:border-cosmic-purple/50
    `
  }

  // Different sizes
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      // Framer Motion animations
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Loading spinner */}
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
      )}
      
      {/* Button content */}
      <span className={loading ? 'opacity-70' : 'opacity-100'}>
        {children}
      </span>
      
      {/* Cosmic glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/20 to-stellar-pink/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  )
}
