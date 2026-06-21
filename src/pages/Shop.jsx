// src/pages/Shop.jsx - Main Shop Page
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import ShopHero from '../components/shop/ShopHero'
import ShopSearch from '../components/shop/ShopSearch'
import ShopSidebar from '../components/shop/ShopSidebar'
import ShopProductGrid from '../components/shop/ShopProductGrid'
import ShopPagination from '../components/shop/ShopPagination'
import productsData from '../data/products.json'

const Shop = () => {
  const { language } = useLanguage()
  const [searchParams] = useSearchParams()
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(productsData)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    search: '',
    priceRange: [0, 1000],
    weight: 'all',
    availability: 'all',
    sort: 'popular'
  })

  // Apply filters whenever they change
  useEffect(() => {
    let result = [...productsData]

    // Category filter
    const categoryMap = {
      'powder': 'Powder Collection',
      'masala': 'Premium Masala Collection',
      'special-cooking': 'Special Cooking Collection',
      'budget': 'Budget Pouch Collection',
      'traditional': 'Traditional Masala Collection',
      'kolhapuri': 'Kolhapuri Collection',
      'special': 'Special Products'
    }

    if (filters.category && filters.category !== 'all') {
      const categoryName = categoryMap[filters.category]
      if (categoryName) {
        result = result.filter(p => p.category === categoryName)
      }
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.nameMr?.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      )
    }

    // Price filter
    result = result.filter(p => {
      const price = p.discountedPrice || p.price || 0
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Weight filter
    if (filters.weight && filters.weight !== 'all') {
      result = result.filter(p => 
        p.weightOptions?.some(w => w.label === filters.weight)
      )
    }

    // Availability filter
    if (filters.availability === 'instock') {
      result = result.filter(p => p.inStock === true)
    }

    // Sort
    switch (filters.sort) {
      case 'popular':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'price-low':
        result.sort((a, b) => (a.discountedPrice || a.price || 0) - (b.discountedPrice || b.price || 0))
        break
      case 'price-high':
        result.sort((a, b) => (b.discountedPrice || b.price || 0) - (a.discountedPrice || a.price || 0))
        break
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    setFilteredProducts(result)
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
  }

  return (
    <>
      <Helmet>
        <title>Shop Premium Spices - Darshan Masale</title>
        <meta name="description" content="Browse our premium collection of authentic Indian spices. Quality spices sourced from the finest farms." />
      </Helmet>

      <div className="min-h-screen bg-background-cream">
        {/* Hero Section */}
        <ShopHero language={language} />

        <div className="container-custom py-8">
          {/* Search Bar */}
          <ShopSearch onSearch={handleSearch} language={language} />

          <div className="flex gap-8 mt-8">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft text-text-dark font-button text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden md:block w-72 flex-shrink-0">
              <ShopSidebar 
                filters={filters} 
                onFilterChange={handleFilterChange}
                language={language}
              />
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {isMobileFilterOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 md:hidden"
                    onClick={() => setIsMobileFilterOpen(false)}
                  />
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="fixed top-0 left-0 bottom-0 w-80 bg-background-cream z-50 overflow-y-auto p-6 md:hidden"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-xl font-semibold text-primary-maroon">Filters</h3>
                      <button
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="p-2 rounded-full hover:bg-primary-maroon/5"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <ShopSidebar 
                      filters={filters} 
                      onFilterChange={handleFilterChange}
                      language={language}
                      isMobile
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-text-muted">
                  {language === 'mr' 
                    ? `${filteredProducts.length} उत्पादने सापडली` 
                    : `${filteredProducts.length} products found`}
                </p>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-text-muted font-body">
                    {language === 'mr' ? 'क्रमवारी:' : 'Sort:'}
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange({ sort: e.target.value })}
                    className="px-3 py-1.5 rounded-full bg-white border border-secondary-gold/20 text-sm font-body focus:border-primary-maroon outline-none"
                  >
                    <option value="popular">Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>
              </div>

              <ShopProductGrid products={filteredProducts} language={language} />
              
              {filteredProducts.length > 8 && (
                <ShopPagination language={language} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Shop