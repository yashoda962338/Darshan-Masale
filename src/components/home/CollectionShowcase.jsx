// src/components/home/CollectionShowcase.jsx - New component for organized collections
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import ProductCard from '../ui/ProductCard'
import productsData from '../../data/products.json'

const CollectionShowcase = ({ title, titleMr, category, bgColor = 'bg-background-cream-light' }) => {
  const { language } = useLanguage()
  
  const products = productsData.filter(p => p.category === category).slice(0, 4)

  if (products.length === 0) return null

  return (
    <section className={`section-padding ${bgColor} relative overflow-hidden`}>
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="heading-section text-primary-maroon">
              {language === 'mr' ? titleMr : title}
            </h2>
            <p className="subheading mt-2">
              {language === 'mr' ? 'आमच्या उत्तम मसाल्यांचा संग्रह' : 'Explore our premium collection'}
            </p>
          </div>
          <Link
            to={`/shop?category=${encodeURIComponent(category)}`}
            className="hidden sm:inline-flex items-center gap-2 font-button font-medium text-primary-maroon hover:text-secondary-gold transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CollectionShowcase