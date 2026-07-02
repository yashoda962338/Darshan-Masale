// src/components/home/FeaturedProducts.jsx - Updated with collection organization
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import ProductCard from '../ui/ProductCard'
import productsData from '../../data/products.json'

const FeaturedProducts = () => {
  const { language } = useLanguage()
  
  // Get featured products from all collections
  const featured = productsData.filter(p => p.featured === true).slice(0, 4)
  
  // If no featured products, get premium products
  const displayProducts = featured.length > 0 ? featured : productsData.filter(p => 
    p.category?.includes('Premium') || p.tags?.includes('premium')
  ).slice(0, 4)

  return (
    <section className="section-padding bg-background-cream relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary-gold/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-maroon/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <SectionHeader
          title={language === 'mr' ? 'वैशिष्ट्यीकृत उत्पादने' : 'Featured Products'}
          subtitle={language === 'mr' ? 'आमचे उत्तम मसाले' : 'Our Finest Spices'}
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-button font-medium text-primary-maroon hover:text-secondary-gold transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts