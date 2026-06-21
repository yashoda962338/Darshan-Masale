// src/pages/Gallery.jsx - Updated import
import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ChevronLeft, ChevronRight, Camera, 
  Grid, LayoutGrid
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import SectionHeader from '../components/ui/SectionHeader'
import galleryData from '../data/gallery'  // Removed .js extension

const Gallery = () => {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [filteredImages, setFilteredImages] = useState(galleryData)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(galleryData)
    } else {
      setFilteredImages(galleryData.filter(img => img.category === selectedCategory))
    }
  }, [selectedCategory])

  // Get unique categories
  const categories = ['all', ...new Set(galleryData.map(img => img.category))]

  const openLightbox = (image, index) => {
    setSelectedImage(image)
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  const navigateLightbox = (direction) => {
    const newIndex = lightboxIndex + direction
    if (newIndex >= 0 && newIndex < filteredImages.length) {
      setLightboxIndex(newIndex)
      setSelectedImage(filteredImages[newIndex])
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === 'Escape') closeLightbox()
        if (e.key === 'ArrowLeft') navigateLightbox(-1)
        if (e.key === 'ArrowRight') navigateLightbox(1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, lightboxIndex])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const placeholderCount = Math.max(0, 4 - filteredImages.length)

  return (
    <>
      <Helmet>
        <title>Gallery - Darshan Masale | Moments at Our Shop</title>
        <meta name="description" content="Explore the gallery of Darshan Masale - premium Indian spice shop in Nandurbar, Maharashtra. View our shop, products, and journey." />
      </Helmet>

      <section className="section-padding bg-background-cream min-h-screen">
        <div className="container-custom">
          {/* Header */}
          <SectionHeader
            title={language === 'mr' ? 'आमची प्रतिमासंग्रह' : 'Our Gallery'}
            subtitle={language === 'mr' ? 'दर्शन मसालेचे क्षण' : 'Moments at Darshan Masale'}
            className="mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-text-muted max-w-2xl mx-auto font-light mb-10"
          >
            {language === 'mr'
              ? 'आमच्या दुकानाचा, उत्पादनांचा आणि प्रमाणिक मसाल्यांच्या प्रवासाचा एक झलक पहा.'
              : 'Take a glimpse into our shop, products, and journey of delivering authentic spices.'}
          </motion.p>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-button font-medium text-sm tracking-wider transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-secondary-gold text-text-dark shadow-lg shadow-secondary-gold/20 scale-105'
                    : 'bg-white text-text-muted hover:bg-primary-maroon/5 shadow-soft hover:shadow-md'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-text-muted font-body">
              {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            </p>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-secondary-gold/10 shadow-soft">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary-maroon text-white shadow-md'
                    : 'hover:bg-primary-maroon/10 text-text-muted'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'masonry'
                    ? 'bg-primary-maroon text-white shadow-md'
                    : 'hover:bg-primary-maroon/10 text-text-muted'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid gap-5 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[250px]'
            }`}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-500 cursor-pointer ${
                  viewMode === 'masonry' && index % 3 === 0 ? 'md:row-span-2' : ''
                }`}
                style={{
                  height: viewMode === 'masonry' && index % 3 === 0 ? '500px' : '300px'
                }}
                onClick={() => openLightbox(image, index)}
              >
                {/* Image */}
                <div className="w-full h-full overflow-hidden bg-background-cream-dark/5">
                  <img
                    src={image.image}
                    alt={language === 'mr' ? image.titleMr : image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-maroon/80 via-primary-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 bg-secondary-gold/20 backdrop-blur-sm text-white text-[10px] font-button font-bold tracking-widest uppercase rounded-full mb-2 border border-secondary-gold/30">
                      {image.category}
                    </span>
                    <h3 className="font-heading text-xl font-semibold text-white">
                      {language === 'mr' ? image.titleMr : image.title}
                    </h3>
                    <p className="text-sm text-white/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {language === 'mr' ? image.descriptionMr : image.description}
                    </p>
                  </div>
                </div>

                {/* Gold Border Glow on Hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-secondary-gold/0 group-hover:border-secondary-gold/50 transition-all duration-500 pointer-events-none" />
              </motion.div>
            ))}

            {/* Placeholder Cards */}
            {placeholderCount > 0 && Array.from({ length: placeholderCount }).map((_, index) => (
              <motion.div
                key={`placeholder-${index}`}
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-dashed border-secondary-gold/20 hover:border-secondary-gold/40 transition-all duration-500 flex flex-col items-center justify-center p-8 min-h-[280px] group"
              >
                <Camera className="w-16 h-16 text-secondary-gold/30 group-hover:text-secondary-gold/50 transition-colors duration-500" />
                <h4 className="font-heading text-xl font-semibold text-text-muted mt-4">
                  {language === 'mr' ? 'लवकरच येत आहे' : 'Coming Soon'}
                </h4>
                <p className="text-sm text-text-muted/60 text-center mt-2 font-light max-w-xs">
                  {language === 'mr'
                    ? 'आम्ही आमचा प्रवास, उत्पादने, टीम आणि ग्राहक अनुभव सतत कॅप्चर करत आहोत.'
                    : 'We are continuously capturing our journey, products, team, and customer experiences.'}
                </p>
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-gold/0 via-secondary-gold/0 to-secondary-gold/5 group-hover:to-secondary-gold/10 transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Message */}
          {filteredImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mt-12"
            >
              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-secondary-gold/10 shadow-soft">
                <span className="text-xs text-text-muted font-body flex items-center gap-2">
                  <span className="text-secondary-gold">✦</span>
                  {language === 'mr'
                    ? 'आमच्या प्रवासाचे अधिक क्षण लवकरच'
                    : 'More moments from our journey coming soon'}
                  <span className="text-secondary-gold">✦</span>
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Premium Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/40 text-sm font-body">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain bg-black"
                />
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 bg-secondary-gold/20 text-secondary-gold text-[10px] font-button font-bold tracking-widest uppercase rounded-full border border-secondary-gold/30">
                      {selectedImage.category}
                    </span>
                  </div>
                  <h3 className="text-white font-heading text-2xl font-semibold">
                    {language === 'mr' ? selectedImage.titleMr : selectedImage.title}
                  </h3>
                  <p className="text-white/70 text-sm mt-1">
                    {language === 'mr' ? selectedImage.descriptionMr : selectedImage.description}
                  </p>
                </div>
              </div>

              {/* Navigation Controls */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateLightbox(-1)
                    }}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateLightbox(1)
                    }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Gallery