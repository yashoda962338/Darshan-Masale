// src/components/shop/ShopPagination.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ShopPagination = ({ language }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5 // This would come from API in production

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    const halfVisible = Math.floor(maxVisible / 2)
    
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex items-center justify-center gap-2 mt-12"
    >
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white hover:border-primary-maroon transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-10 h-10 rounded-full font-body font-medium transition-all ${
            currentPage === page
              ? 'bg-primary-maroon text-white shadow-md'
              : 'hover:bg-primary-maroon/5 text-text-dark'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white hover:border-primary-maroon transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default ShopPagination