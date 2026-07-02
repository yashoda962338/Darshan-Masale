// src/components/shop/ShopSidebar.jsx
import React from 'react'
import { motion } from 'framer-motion'

const ShopSidebar = ({ filters, onFilterChange, language, isMobile }) => {
  const categories = [
    { id: 'all', label: language === 'mr' ? 'सर्व' : 'All Categories' },
    { id: 'powder', label: language === 'mr' ? 'पावडर' : 'Powder' },
    { id: 'masala', label: language === 'mr' ? 'प्रीमियम मसाला' : 'Premium Masala' },
    { id: 'special-cooking', label: language === 'mr' ? 'विशेष कुकिंग' : 'Special Cooking' },
    { id: 'budget', label: language === 'mr' ? 'बजेट' : 'Budget' },
    { id: 'traditional', label: language === 'mr' ? 'पारंपारिक' : 'Traditional' },
    { id: 'kolhapuri', label: language === 'mr' ? 'कोल्हापुरी' : 'Kolhapuri' },
    { id: 'special', label: language === 'mr' ? 'विशेष' : 'Special' },
  ]

  const weights = [
    { id: 'all', label: language === 'mr' ? 'सर्व वजन' : 'All Weights' },
    { id: '100 gm', label: '100 gm' },
    { id: '200 gm', label: '200 gm' },
    { id: '500 gm', label: '500 gm' },
    { id: '1 KG', label: '1 KG' },
  ]

  const availabilityOptions = [
    { id: 'all', label: language === 'mr' ? 'सर्व' : 'All' },
    { id: 'instock', label: language === 'mr' ? 'स्टॉकमध्ये' : 'In Stock' },
  ]

  const resetFilters = () => {
    onFilterChange({
      category: 'all',
      search: '',
      priceRange: [0, 1000],
      weight: 'all',
      availability: 'all',
      sort: 'popular'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl font-semibold text-primary-maroon">
          {language === 'mr' ? 'फिल्टर्स' : 'Filters'}
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs text-text-muted hover:text-primary-maroon transition-colors font-button"
        >
          {language === 'mr' ? 'रिसेट करा' : 'Reset'}
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <h4 className="font-body text-sm font-medium text-text-dark">
          {language === 'mr' ? 'श्रेणी' : 'Category'}
        </h4>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              className={`w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-all ${
                filters.category === cat.id
                  ? 'bg-primary-maroon text-white shadow-md'
                  : 'hover:bg-primary-maroon/5 text-text-dark'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <h4 className="font-body text-sm font-medium text-text-dark">
          {language === 'mr' ? 'किंमत' : 'Price Range'}
        </h4>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={filters.priceRange[1]}
            onChange={(e) => onFilterChange({ 
              priceRange: [0, parseInt(e.target.value)] 
            })}
            className="w-full accent-primary-maroon"
          />
          <div className="flex items-center justify-between text-sm text-text-muted mt-1">
            <span>₹0</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Weight Filter */}
      <div className="space-y-2">
        <h4 className="font-body text-sm font-medium text-text-dark">
          {language === 'mr' ? 'वजन' : 'Weight'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {weights.map((w) => (
            <button
              key={w.id}
              onClick={() => onFilterChange({ weight: w.id })}
              className={`px-3 py-1.5 rounded-full font-button text-xs transition-all ${
                filters.weight === w.id
                  ? 'bg-primary-maroon text-white shadow-md'
                  : 'bg-white border border-secondary-gold/20 hover:border-primary-maroon text-text-dark'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <h4 className="font-body text-sm font-medium text-text-dark">
          {language === 'mr' ? 'उपलब्धता' : 'Availability'}
        </h4>
        <div className="flex gap-4">
          {availabilityOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onFilterChange({ availability: opt.id })}
              className={`px-4 py-1.5 rounded-full font-button text-xs transition-all ${
                filters.availability === opt.id
                  ? 'bg-primary-maroon text-white shadow-md'
                  : 'bg-white border border-secondary-gold/20 hover:border-primary-maroon text-text-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {Object.values(filters).some(v => v !== 'all' && v !== '' && v[1] !== 1000) && (
        <div className="pt-4 border-t border-secondary-gold/10">
          <p className="text-xs text-text-muted font-body">
            {language === 'mr' ? 'सक्रिय फिल्टर्स' : 'Active Filters'}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.category !== 'all' && (
              <span className="px-2 py-0.5 bg-primary-maroon/10 text-primary-maroon rounded-full text-[10px] font-button">
                {categories.find(c => c.id === filters.category)?.label}
              </span>
            )}
            {filters.weight !== 'all' && (
              <span className="px-2 py-0.5 bg-primary-maroon/10 text-primary-maroon rounded-full text-[10px] font-button">
                {filters.weight}
              </span>
            )}
            {filters.availability === 'instock' && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-button">
                {language === 'mr' ? 'स्टॉकमध्ये' : 'In Stock'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopSidebar