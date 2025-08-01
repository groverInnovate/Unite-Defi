import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface InputProps {
  label?: string                 // Label text above input
  placeholder?: string           // Placeholder text
  type?: string                  // Input type (text, number, etc.)
  value?: string                 // Current value
  onChange?: (value: string) => void  // Function called when value changes
  error?: string                 // Error message to show
  disabled?: boolean             // Is input disabled?
  rightElement?: React.ReactNode // Element to show on right (like "MAX" button)
  className?: string             // Additional styles
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  rightElement,
  className = ''
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-stardust-gray mb-2">
          {label}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-asteroid-gray/50 border border-meteor-gray
            text-cosmic-white placeholder-stardust-gray
            focus:outline-none focus:border-cosmic-purple
            focus:shadow-glow-purple focus:bg-asteroid-gray/70
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? 'border-crimson-red focus:border-crimson-red focus:shadow-glow-red' : ''}
            ${rightElement ? 'pr-20' : ''}
          `}
        />
        
        {/* Right element (like MAX button) */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-crimson-red"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
