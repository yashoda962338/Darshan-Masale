import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import ProductCard from '../ui/ProductCard'
import productsData from '../../data/products.json'

const BestSellers = () => {
  const { language } = useLanguage()
  const bestSellers = productsData.filter(p => p.tags?.includes('bestseller') || p.tags?.includes('best-seller'))

  // If no best sellers tagged, use a subset
  const displayProducts = bestSellers.length > 0 ? bestSellers : productsData.slice(0, 4)

  return (
    <section className="section-padding bg-background-cream">
      <div className="container-custom">
        <SectionHeader
          title={language === 'mr' ? 'सर्वाधिक विक्री' : 'Best Sellers'}
          subtitle={language === 'mr' ? 'सर्वाधिक लोकप्रिय मसाले' : 'Our most popular spices'}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellers