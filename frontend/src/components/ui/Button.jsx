import React from 'react'
import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-maroon text-background-cream hover:bg-primary-maroon-dark',
    secondary: 'border-2 border-primary-maroon text-primary-maroon hover:bg-primary-maroon hover:text-background-cream',
    gold: 'bg-secondary-gold text-text-dark hover:bg-secondary-gold-dark',
    ghost: 'hover:bg-primary-maroon/5 text-text-dark-light',
    outline: 'border border-text-dark/20 text-text-dark hover:border-primary-maroon hover:text-primary-maroon',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-full font-button font-medium tracking-wider transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button   