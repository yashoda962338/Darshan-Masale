    // src/components/home/GallerySection.jsx - Premium Version
    // Add this import at the top of GallerySection.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { X, ZoomIn, Image as ImageIcon, Grid, LayoutGrid } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import galleryData from '../../data/gallery.json'

const GallerySection = () => {
  const { language } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section ref={sectionRef} className="section-padding bg-background-cream-light relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-secondary-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-maroon/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title={language === 'mr' ? 'प्रतिमासंग्रह' : 'Gallery'}
            subtitle={language === 'mr' ? 'आमच्या प्रवासाचे क्षण' : 'Moments from our journey'}
            className="mb-0"
          />
          
          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-secondary-gold/10">
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

        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px]'
        }`}>
          {galleryData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                viewMode === 'masonry' && index % 3 === 0 ? 'md:row-span-2' : ''
              }`}
              style={{
                height: viewMode === 'masonry' && index % 3 === 0 ? '400px' : '200px'
              }}
              onClick={() => setSelectedImage(item)}
            >
              <div className="w-full h-full overflow-hidden bg-background-cream-dark/10">
                <img
                  src={item.image || '/images/placeholder.jpg'}
                  alt={language === 'mr' ? item.titleMr : item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Premium Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-maroon/80 via-primary-maroon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-4">
                <div>
                  <span className="text-background-cream font-heading font-semibold text-sm block">
                    {language === 'mr' ? item.titleMr : item.title}
                  </span>
                  <span className="text-xs text-background-cream/70 block">
                    {item.category}
                  </span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-glass backdrop-blur-md p-2 rounded-full border border-white/20"
                >
                  <ZoomIn className="w-4 h-4 text-white" />
                </motion.div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 right-3 bg-glass backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-button font-bold text-white tracking-widest uppercase">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain bg-black"
                />
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <h3 className="text-white font-heading text-2xl font-semibold">
                    {language === 'mr' ? selectedImage.titleMr : selectedImage.title}
                  </h3>
                  <p className="text-white/60 text-sm mt-1">{selectedImage.category}</p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-4">
                <button
                  className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                  onClick={() => {
                    const currentIndex = galleryData.findIndex(i => i.id === selectedImage.id)
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryData.length - 1
                    setSelectedImage(galleryData[prevIndex])
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                  onClick={() => {
                    const currentIndex = galleryData.findIndex(i => i.id === selectedImage.id)
                    const nextIndex = currentIndex < galleryData.length - 1 ? currentIndex + 1 : 0
                    setSelectedImage(galleryData[nextIndex])
                  }}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default GallerySection