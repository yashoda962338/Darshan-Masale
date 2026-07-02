// src/components/shop/ShopProductGrid.jsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../ui/ProductCard'

const ShopProductGrid = ({ products, language }) => {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="font-heading text-2xl text-primary-maroon">
          {language === 'mr' ? 'कोणतीही उत्पादने सापडली नाहीत' : 'No products found'}
        </h3>
        <p className="text-text-muted mt-2">
          {language === 'mr' 
            ? 'कृपया तुमचे फिल्टर्स समायोजित करा किंवा वेगळ्या श्रेणीत शोधा' 
            : 'Please adjust your filters or try a different category'}
        </p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={products.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export default ShopProductGrid