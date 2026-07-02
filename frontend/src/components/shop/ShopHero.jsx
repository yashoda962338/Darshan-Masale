// src/components/shop/ShopHero.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const ShopHero = ({ language }) => {
  return (
    <section className="relative bg-gradient-maroon text-background-cream overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-orange rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-background-cream/60 mb-4">
            <Link to="/" className="hover:text-secondary-gold transition-colors">
              {language === 'mr' ? 'मुख्यपृष्ठ' : 'Home'}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-background-cream/80">
              {language === 'mr' ? 'खरेदी' : 'Shop'}
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
            {language === 'mr' ? 'खरेदी' : 'Shop'}
          </h1>
          <p className="text-lg md:text-xl text-background-cream/70 mt-3 max-w-xl font-light">
            {language === 'mr' 
              ? 'पारंपारिक पाककृतींनी बनवलेले प्रमाणिक प्रीमियम मसाले शोधा.' 
              : 'Discover authentic premium spices crafted using traditional recipes.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ShopHero