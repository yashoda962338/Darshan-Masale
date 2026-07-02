// src/pages/Categories.jsx - Add import at the top
import React, { useRef, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, Shield, Award, Star, Sparkles, Mail, Send } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import SectionHeader from '../components/ui/SectionHeader'
import categoryService from '../services/categoryService'
import toast from 'react-hot-toast'

const Categories = () => {
  const { language, translate } = useLanguage()
  const sectionRef = useRef(null)
  const heroRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState(null)

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true)
      setCategoryError(null)

      try {
        const data = await categoryService.getCategories()
        setCategories(data || [])
      } catch (err) {
        setCategoryError(err.message || 'Failed to load collections')
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Scroll to categories on load
  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.getElementById('collections')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Category banner configuration
  const categoryBanners = {
    'Powder Collection': {
      image: '/assets/images/banners/powder-banner.jpg',
      bgPosition: 'center 35%',
      subtitle: 'Pure chilli, turmeric and coriander powders made from carefully selected farms.',
      subtitleMr: 'काळजीपूर्वक निवडलेल्या शेतातून बनवलेली शुद्ध मिरची, हळद आणि धनिया पावडर.',
      slug: 'powder'
    },
    'Premium Masala Collection': {
      image: '/assets/images/banners/masala-banner.jpg',
      bgPosition: 'center 40%',
      subtitle: 'Luxury spice blends for authentic Indian cooking.',
      subtitleMr: 'प्रमाणिक भारतीय स्वयंपाकासाठी लक्झरी मसाला मिश्रण.',
      slug: 'masala'
    },
    'Special Cooking Collection': {
      image: '/assets/images/banners/special-cooking-banner.jpg',
      bgPosition: 'center 45%',
      subtitle: 'Chicken, Mutton and cooking masalas crafted for rich flavours.',
      subtitleMr: 'समृद्ध चवीसाठी तयार केलेले चिकन, मटन आणि कुकिंग मसाले.',
      slug: 'special-cooking'
    },
    'Budget Pouch Collection': {
      image: '/assets/images/banners/budget-banner.jpg',
      bgPosition: 'center 50%',
      subtitle: 'Affordable everyday spice packs without compromising quality.',
      subtitleMr: 'गुणवत्तेशी तडजोड न करता परवडणारे दैनंदिन मसाला पॅक.',
      slug: 'budget'
    },
    'Traditional Masala Collection': {
      image: '/assets/images/banners/traditional-banner.jpg',
      bgPosition: 'center 40%',
      subtitle: 'Traditional Maharashtrian spice recipes passed through generations.',
      subtitleMr: 'पिढ्यानपिढ्या पारंपारिक महाराष्ट्रीय मसाला पाककृती.',
      slug: 'traditional'
    },
    'Kolhapuri Collection': {
      image: '/assets/images/banners/kolhapuri-banner.jpg',
      bgPosition: 'center 35%',
      subtitle: 'Authentic Kolhapuri spice blends with bold flavours.',
      subtitleMr: 'बोल्ड चवीसह प्रमाणिक कोल्हापुरी मसाला मिश्रण.',
      slug: 'kolhapuri'
    },
    'Special Products': {
      image: '/assets/images/banners/special-products-banner.jpg',
      bgPosition: 'center 55%',
      subtitle: 'Unique specialty products including Garlic Mix Chutney.',
      subtitleMr: 'लसूण मिक्स चटणीसह अद्वितीय विशेष उत्पादने.',
      slug: 'special'
    }
  }

  const getCategoryBanner = (category = {}) => {
    const categoryName = category.name || '';
    if (category.image?.url) {
      return {
        image: category.image.url,
        bgPosition: 'center',
        subtitle: category.description || '',
        subtitleMr: category.descriptionMr || '',
        slug: category.slug || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }
    }

    return categoryBanners[categoryName] || categoryBanners['Powder Collection']
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      toast.success(
        language === 'mr' ? 'सदस्यता घेतली! धन्यवाद.' : 'Subscribed! Thank you.'
      )
      setTimeout(() => setSubscribed(false), 3000)
      setEmail('')
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <>
      <Helmet>
        <title>Our Premium Collections - Darshan Masale</title>
        <meta name="description" content="Explore our premium collections of authentic Indian spices. From traditional masalas to Kolhapuri specials." />
      </Helmet>

      {/* ==================== HERO SECTION ==================== */}
      <section 
        ref={heroRef}
        className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-maroon"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: 'url(/assets/images/banners/hero-banner.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary-maroon/90 via-primary-maroon/60 to-primary-maroon/40" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-secondary-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-background-cream/60 mb-6">
              <Link to="/" className="hover:text-secondary-gold transition-colors">
                {language === 'mr' ? 'मुख्यपृष्ठ' : 'Home'}
              </Link>
              <span className="text-background-cream/40">/</span>
              <span className="text-background-cream/80">
                {language === 'mr' ? 'श्रेणी' : 'Categories'}
              </span>
            </div>

            {/* Hero Title */}
            <motion.h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {language === 'mr' ? 'आमचे मसाला संग्रह' : 'Our Spice Collections'}
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p 
              className="text-lg md:text-xl text-background-cream/80 mt-4 max-w-2xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {language === 'mr' 
                ? 'पारंपारिकता, शुद्धता आणि प्रीमियम गुणवत्तेने तयार केलेले प्रमाणिक दर्शन मसाले संग्रह शोधा.'
                : 'Explore authentic Darshan Masale collections crafted with tradition, purity and premium quality.'}
            </motion.p>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-background-cream/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <span className="text-[10px] font-button tracking-[0.3em] uppercase">
                {language === 'mr' ? 'खाली स्क्रोल करा' : 'Scroll to explore'}
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== INTRODUCTION SECTION ==================== */}
      <section className="py-16 md:py-20 bg-background-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-xs font-button tracking-[0.2em] uppercase text-secondary-gold font-semibold">
              {language === 'mr' ? 'तुमचा संग्रह निवडा' : 'Choose Your Collection'}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-maroon mt-2">
              {language === 'mr' ? 'तुमचा संग्रह निवडा' : 'Choose Your Collection'}
            </h2>
            <p className="text-text-muted text-base md:text-lg mt-4 font-light leading-relaxed">
              {language === 'mr'
                ? 'दैनंदिन स्वयंपाकघरातील आवश्यक वस्तूंपासून ते पारंपारिक महाराष्ट्रीय मसाला मिश्रणापर्यंत, प्रत्येक रेसिपीसाठी योग्य संग्रह शोधा.'
                : 'From everyday kitchen essentials to traditional Maharashtrian spice blends, discover the perfect collection for every recipe.'}
            </p>
            <div className="w-20 h-1 bg-gradient-gold rounded-full mx-auto mt-6" />
          </motion.div>
        </div>
      </section>

      {/* ==================== COLLECTIONS SECTION ==================== */}
      <section 
        id="collections"
        ref={sectionRef}
        className="py-16 md:py-20 bg-background-cream-light"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {loadingCategories ? (
              <div className="col-span-full py-16 text-center text-text-muted">Loading collections...</div>
            ) : categoryError ? (
              <div className="col-span-full py-16 text-center text-red-600">{categoryError}</div>
            ) : categories.length === 0 ? (
              <div className="col-span-full py-16 text-center text-text-muted">No collections available.</div>
            ) : (
              categories.map((category, index) => {
                const bannerData = getCategoryBanner(category)
                const isHovered = hoveredIndex === index
                const name = language === 'mr' ? (category.nameMr || category.name) : category.name
                const subtitle = language === 'mr' ? (bannerData.subtitleMr || bannerData.subtitle) : bannerData.subtitle

                return (
                  <motion.div
                    key={category._id || category.slug || index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group"
                  >
                    <Link
                      to={`/shop?category=${category.slug || bannerData.slug}`}
                      className="block relative overflow-hidden rounded-[24px] shadow-soft hover:shadow-elevated transition-all duration-500 cursor-pointer"
                    >
                      <div 
                        className="relative w-full h-[280px] md:h-[300px] bg-cover bg-no-repeat"
                        style={{
                          backgroundImage: `url(${bannerData.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: bannerData.bgPosition,
                          backgroundRepeat: 'no-repeat',
                        }}
                      >
                        <div className={`absolute inset-0 transition-transform duration-700 ${
                          isHovered ? 'scale-105' : 'scale-100'
                        }`}
                        style={{
                          backgroundImage: `url(${bannerData.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: bannerData.bgPosition,
                          backgroundRepeat: 'no-repeat',
                        }} />

                        <div className={`absolute inset-0 transition-opacity duration-500 ${
                          isHovered ? 'opacity-100' : 'opacity-90'
                        }`}
                        style={{
                          background: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.20) 75%, rgba(0,0,0,0.05) 100%)'
                        }} />

                        <div className="absolute inset-0 flex items-center z-10">
                          <div className="w-full md:w-2/3 lg:w-1/2 p-6 md:p-8">
                            <motion.span
                              initial={{ opacity: 0.1 }}
                              animate={{ 
                                opacity: isHovered ? 0.2 : 0.08
                              }}
                              transition={{ duration: 0.3 }}
                              className="text-5xl md:text-6xl font-heading font-bold text-white/10 absolute -top-1 -left-1"
                            >
                              {String(index + 1).padStart(2, '0')}
                            </motion.span>

                            <motion.h2 
                              className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg relative z-10"
                              animate={{
                                y: isHovered ? -6 : 0
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {name}
                            </motion.h2>

                            <motion.p 
                              className="text-sm md:text-base text-white/80 mt-2 font-light tracking-wide drop-shadow-md relative z-10 line-clamp-2"
                              animate={{
                                y: isHovered ? -3 : 0
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {subtitle}
                            </motion.p>

                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ 
                                opacity: isHovered ? 1 : 0,
                                x: isHovered ? 0 : -10
                              }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 relative z-10"
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

                        <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none opacity-10">
                          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-secondary-gold to-transparent rounded-br-[24px]" />
                        </div>

                        <div className={`absolute inset-0 transition-all duration-500 ${
                          isHovered ? 'bg-gradient-to-tr from-white/5 via-white/0 to-white/10' : ''
                        }`} />

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
                      </div>
                    </Link>
                  </motion.div>
                )
                })
              )}
            </div>
          </div>
        </section>
    </>
  )
}

export default Categories