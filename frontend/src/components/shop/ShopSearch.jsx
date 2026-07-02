// src/components/shop/ShopSearch.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

const ShopSearch = ({ onSearch, language }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`relative transition-all duration-300 ${
        isFocused ? 'scale-[1.02]' : 'scale-100'
      }`}
    >
      <div className="relative">
        <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
          isFocused ? 'text-secondary-gold' : 'text-text-muted'
        }`} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={language === 'mr' ? 'उत्पादने शोधा...' : 'Search products...'}
          className="w-full px-14 py-4 rounded-full bg-white shadow-soft border-2 border-secondary-gold/10 focus:border-secondary-gold outline-none transition-all font-body text-text-dark placeholder:text-text-muted"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-maroon/5 transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        )}
      </div>
      
      {/* Search Tips */}
      {searchTerm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-text-muted font-body px-2"
        >
          {language === 'mr' 
            ? 'नाव, श्रेणी किंवा वजनाने शोधा' 
            : 'Search by product name, category, or weight'}
        </motion.div>
      )}
    </motion.div>
  )
}

export default ShopSearch