// src/components/home/CategoryShowcase.jsx - Luxury Premium Showcase Redesign
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import categoriesData from '../../data/categories.json'
import productsData from '../../data/products.json'

const CategoryShowcase = () => {
  const { language } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Category banner configuration with product images for right side
  const categoryConfig = {
    'Powder Collection': {
      banner: '/assets/images/banners/powder-banner.jpg',
      bgPosition: 'center 35%',
      products: ['mirchi-powder.png', 'haldi-powder.png', 'dhania-powder.png'],
      subtitle: 'Pure & Authentic Spice Powders',
      subtitleMr: 'शुद्ध आणि प्रमाणिक मसाला पावडर',
      description: 'Premium quality turmeric, chili, and coriander powders'
    },
    'Premium Masala Collection': {
      banner: '/assets/images/banners/masala-banner.jpg',
      bgPosition: 'center 40%',
      products: ['garam-masala.png', 'kala-masala.png'],
      subtitle: 'Luxury Blends for Gourmet Cooking',
      subtitleMr: 'गौरवपूर्ण स्वयंपाकासाठी लक्झरी मिश्रण',
      description: 'Artisanal blends including Garam Masala and Kala Masala'
    },
    'Special Cooking Collection': {
      banner: '/assets/images/banners/special-cooking-banner.jpg',
      bgPosition: 'center 45%',
      products: ['chicken-masala.png', 'mutton-masala.png'],
      subtitle: 'Specialized Masalas for Meat Dishes',
      subtitleMr: 'मांस पदार्थांसाठी विशेष मसाले',
      description: 'Expertly crafted chicken and mutton masalas'
    },
    'Budget Pouch Collection': {
      banner: '/assets/images/banners/budget-banner.jpg',
      bgPosition: 'center 50%',
      products: ['budget-chicken-masala.png', 'budget-mutton-masala.png', 'budget-mirchi-powder.png'],
      subtitle: 'Quality Spices at Affordable Prices',
      subtitleMr: 'परवडणाऱ्या किंमतीत दर्जेदार मसाले',
      description: 'Premium spices in convenient ₹10 pouches'
    },
    'Traditional Masala Collection': {
      banner: '/assets/images/banners/traditional-banner.jpg',
      bgPosition: 'center 40%',
      products: ['tea-masala.png', 'khichadi-masala.png', 'pav-bhaji-masala.png', 'sambhar-masala.png'],
      subtitle: 'Time-Honored Family Recipes',
      subtitleMr: 'कालातीत कौटुंबिक पाककृती',
      description: 'Authentic masalas for Tea, Khichadi, Pav Bhaji, and Sambhar'
    },
    'Kolhapuri Collection': {
      banner: '/assets/images/banners/kolhapuri-banner.jpg',
      bgPosition: 'center 35%',
      products: ['kolhapuri-chicken.png', 'kolhapuri-mutton.png', 'kolhapuri-biryani.png', 'kolhapuri-shev-bhaji.png'],
      subtitle: 'Authentic Kolhapuri Spice Blends',
      subtitleMr: 'प्रमाणिक कोल्हापुरी मसाला मिश्रण',
      description: 'Bold and spicy blends from the heart of Kolhapur'
    },
    'Special Products': {
      banner: '/assets/images/banners/special-products-banner.jpg',
      bgPosition: 'center 40%',
      products: ['garlic-mix-chutney.png'],
      subtitle: 'Unique & Specialty Spice Products',
      subtitleMr: 'अद्वितीय आणि विशेष मसाला उत्पादने',
      description: 'Artisanal products including Garlic Mix Chutney'
    }
  }

  const getCategoryConfig = (categoryName) => {
    return categoryConfig[categoryName] || categoryConfig['Powder Collection']
  }

  const getProductImages = (categoryName) => {
    const config = getCategoryConfig(categoryName)
    return config.products || []
  }

  return (
    <section ref={sectionRef} className="section-padding bg-background-cream relative overflow-hidden">
      {/* Premium Background Decor */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary-gold/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-maroon/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <SectionHeader
          title={language === 'mr' ? 'आमच्या प्रीमियम संग्रह' : 'Our Premium Collections'}
          subtitle={language === 'mr' ? 'आमचा उत्तम मसाला संग्रह शोधा' : 'Discover Our Finest Collections'}
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoriesData.map((category, index) => {
            const config = getCategoryConfig(category.name)
            const isHovered = hoveredIndex === index
            const name = language === 'mr' ? category.nameMr : category.name
            const subtitle = language === 'mr' ? config.subtitleMr : config.subtitle
            const productImages = getProductImages(category.name)
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group"
              >
                <Link
                  to="/shop"
                  className="block relative overflow-hidden rounded-[24px] shadow-soft hover:shadow-elevated transition-all duration-500 cursor-pointer h-[280px] md:h-[300px]"
                >
                  {/* Background Banner Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-700"
                    style={{
                      backgroundImage: `url(${config.banner})`,
                      backgroundSize: 'cover',
                      backgroundPosition: config.bgPosition,
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Scale Effect on Hover */}
                    <div className={`absolute inset-0 transition-transform duration-700 ${
                      isHovered ? 'scale-108' : 'scale-100'
                    }`}
                    style={{
                      backgroundImage: `url(${config.banner})`,
                      backgroundSize: 'cover',
                      backgroundPosition: config.bgPosition,
                      backgroundRepeat: 'no-repeat',
                    }} />
                  </div>

                  {/* Premium Dark Overlay */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-95'
                  }`}
                  style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.30) 75%, rgba(0,0,0,0.10) 100%)'
                  }} />

                  {/* LEFT SIDE - Content */}
                  <div className="absolute inset-0 flex items-center z-10">
                    <div className="w-1/2 p-6 md:p-8 lg:p-10">
                      {/* Collection Name */}
                      <motion.h3 
                        className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg"
                        animate={{
                          y: isHovered ? -6 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {name}
                      </motion.h3>

                      {/* Short Description */}
                      <motion.p 
                        className="text-sm md:text-base text-white/80 mt-2 font-light tracking-wide drop-shadow-md"
                        animate={{
                          y: isHovered ? -3 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {subtitle}
                      </motion.p>

                      {/* View Collection Link */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: isHovered ? 1 : 0,
                          x: isHovered ? 0 : -10
                        }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        <div className="inline-flex items-center gap-3 text-sm md:text-base font-button font-medium tracking-wider text-secondary-gold group-hover:gap-4 transition-all duration-300">
                          <span>View Collection</span>
                          <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                            isHovered ? 'translate-x-1' : ''
                          }`} />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* RIGHT SIDE - Product PNGs */}
                  <div className="absolute inset-0 flex items-center justify-end z-10 pr-6 md:pr-8 lg:pr-10">
                    <div className="flex items-center justify-end gap-2 md:gap-3">
                      {productImages.map((product, idx) => (
                        <motion.div
                          key={idx}
                          className="relative"
                          animate={{
                            y: isHovered ? [-4, -8, -4] : 0,
                            scale: isHovered ? 1.05 : 1
                          }}
                          transition={{
                            duration: 2,
                            repeat: isHovered ? Infinity : 0,
                            ease: "easeInOut",
                            delay: idx * 0.2
                          }}
                          style={{
                            width: idx === 0 ? '80px' : '60px',
                            height: idx === 0 ? '80px' : '60px',
                          }}
                        >
                          <img
                            src={`/assets/images/products/${product}`}
                            alt={product.replace('.png', '')}
                            className="w-full h-full object-contain drop-shadow-2xl"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback if PNG not available
                              e.target.style.display = 'none'
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Glass Hover Effect Overlay */}
                  <div className={`absolute inset-0 transition-all duration-500 ${
                    isHovered ? 'bg-gradient-to-tr from-white/5 via-white/0 to-white/10' : ''
                  }`} />

                  {/* Premium Border Glow on Hover */}
                  <motion.div
                    className="absolute inset-0 rounded-[24px] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isHovered ? 0.4 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 rounded-[24px] border-2 border-secondary-gold/30" />
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-secondary-gold/10 shadow-soft">
            <span className="text-xs text-text-muted font-body flex items-center gap-2">
              <span className="text-secondary-gold">✦</span>
              {language === 'mr' 
                ? '७ प्रीमियम संग्रह • शुद्धता • गुणवत्ता • परंपरा' 
                : '7 Premium Collections • Purity • Quality • Tradition'}
              <span className="text-secondary-gold">✦</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CategoryShowcase