import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode      // Content inside the card
  className?: string             // Additional styles
  hover?: boolean                // Should card have hover effect?
  glow?: boolean                 // Should card have glow effect?
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false
}) => {
  return (
    <motion.div
      className={`
        relative p-6 rounded-xl
        bg-gradient-to-br from-asteroid-gray to-asteroid-gray/80
        border border-meteor-gray/50
        backdrop-blur-sm
        ${hover ? 'hover:border-cosmic-purple/50 hover:shadow-glow-purple' : ''}
        ${glow ? 'shadow-glow-purple' : 'shadow-lg'}
        ${className}
      `}
      // Animation when card appears
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      // Hover animations
      whileHover={hover ? { 
        y: -2, 
        transition: { duration: 0.2 } 
      } : {}}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cosmic-purple/5 to-stellar-pink/5" />
      
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
