import React from 'react'
import { motion } from 'framer-motion'

const SectionHeader = ({ 
  title, 
  subtitle, 
  centered = true,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}) => {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`font-body text-sm uppercase tracking-widest text-secondary-gold font-medium mb-3 ${subtitleClassName}`}
      >
        {subtitle}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`heading-section text-primary-maroon ${titleClassName}`}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-16 h-1 bg-gradient-gold rounded-full mx-auto mt-4"
      />
    </div>
  )
}

export default SectionHeader