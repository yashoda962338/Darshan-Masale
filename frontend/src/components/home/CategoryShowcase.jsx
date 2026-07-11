// src/components/home/CategoryShowcase.jsx - Luxury Premium Showcase Redesign
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import categoryService from '../../services/categoryService'

const CategoryShowcase = () => {
  const { language } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories({ limit: 50 })
        const categoriesArray = Array.isArray(data) ? data : data?.categories || []
        console.log('📦 Raw API Response:', data)
        console.log('📦 Loaded categories (count):', categoriesArray.length)
        categoriesArray.forEach((cat, idx) => {
          console.log(`  [${idx}] ${cat.name}:`, {
            imageUrl: cat.image?.url || 'MISSING',
            publicId: cat.image?.publicId || 'NONE',
            productCount: cat.productCount,
            slug: cat.slug,
            hasImageObject: !!cat.image,
            imageObject: cat.image
          })
        })
        setCategories(categoriesArray)
      } catch (error) {
        console.error('Failed to load categories for home showcase', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const getCategoryImage = (category) => {
    if (category?.image?.url) {
      console.log(`✅ Using image for ${category.name}: ${category.image.url}`)
      return category.image.url
    }
    console.warn(`⚠️ No image for ${category.name}, using placeholder`)
    // Premium gradient placeholder as fallback
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238B4513;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23DAA520;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="300" fill="url(%23grad)"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ECategory Image%3C/text%3E%3C/svg%3E'
  }

  const getCategorySubtitle = (category) => {
    if (!category) return ''
    return language === 'mr' ? (category.descriptionMr || category.description || '') : (category.description || '')
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

        {loading ? (
          <div className="text-center py-16 text-text-muted">Loading collections...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-text-muted">No collections available right now.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => {
            const isHovered = hoveredIndex === index
            const name = language === 'mr' ? (category.nameMr || category.name) : category.name
            const subtitle = getCategorySubtitle(category)
            const categorySlug = category.slug || ''
            const collectionHref = `/shop?category=${encodeURIComponent(categorySlug)}`
            const categoryImage = getCategoryImage(category)
            
            return (
              <motion.div
                key={category._id || category.id || index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group"
              >
                <Link
                  to={collectionHref}
                  className="block relative overflow-hidden rounded-[24px] shadow-soft hover:shadow-elevated transition-all duration-500 cursor-pointer h-[280px] md:h-[300px]"
                >
                  {/* Background Banner Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-700"
                    style={{
                      backgroundImage: `url(${categoryImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Scale Effect on Hover */}
                    <div className={`absolute inset-0 transition-transform duration-700 ${
                      isHovered ? 'scale-108' : 'scale-100'
                    }`}
                    style={{
                      backgroundImage: `url(${categoryImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
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

                  {/* RIGHT SIDE - Product Count / Premium Badge */}
                  <div className="absolute inset-0 flex items-center justify-end z-10 pr-6 md:pr-8 lg:pr-10">
                    <motion.div
                      className="rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md px-4 py-3 text-right text-white shadow-lg"
                      animate={{
                        y: isHovered ? [-4, -8, -4] : 0,
                        scale: isHovered ? 1.05 : 1
                      }}
                      transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: 'easeInOut' }}
                    >
                      <div className="flex items-center justify-end gap-2 text-secondary-gold">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-[0.3em]">Collection</span>
                      </div>
                      <div className="mt-2 text-2xl font-heading font-semibold text-white">{category.productCount || 0}</div>
                      <div className="text-xs text-white/90">{language === 'mr' ? 'उत्पाद' : 'Products'}</div>
                    </motion.div>
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
        )}

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