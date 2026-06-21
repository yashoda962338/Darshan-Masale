// src/components/home/Hero.jsx - Premium Enhanced Hero Slider
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Shield, Star, ChevronLeft, ChevronRight, Sparkles, Gem } from 'lucide-react'
import gsap from 'gsap'
import { useLanguage } from '../../context/LanguageContext'
import Button from '../ui/Button'
import heroData from '../../data/hero.json'

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation, Pagination, Keyboard, Parallax } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/parallax'

const Hero = () => {
  const { language } = useLanguage()
  const content = heroData[language] || heroData.en
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const sliderImages = [
    '/assets/images/shops/banner1.png',
    '/assets/images/shops/banner2.png',
    '/assets/images/shops/banner3.png',
    '/assets/images/shops/banner4.png',
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero-badge', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8 })
        .fromTo('.hero-title', { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.4')
        .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .fromTo('.hero-buttons', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex)
  }

  return (
    <section
      ref={containerRef}
      className="hero-container relative w-full overflow-hidden"
    >
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-cream to-transparent" />
      </div>

      {/* Gold Accent Lines */}
      <div className="absolute top-0 left-0 right-0 z-[1] pointer-events-none">
        <div className="h-[2px] w-0 bg-gradient-to-r from-secondary-gold/0 via-secondary-gold/50 to-secondary-gold/0 animate-[widthExpand_2s_ease-out_forwards]" />
      </div>

      {/* Full Width Image Slider */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination, Keyboard, Parallax]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          parallax={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          speed={1200}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          pagination={{
            el: '.hero-pagination',
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} !bg-white/40 !w-3 !h-3 !mx-1.5 !rounded-full !transition-all !duration-500 !border-2 !border-white/20 hover:!bg-secondary-gold"></span>`
            },
          }}
          keyboard={{ enabled: true }}
          onSlideChange={handleSlideChange}
          className="w-full h-full"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full bg-background-cream">
                {/* Premium Image with Zoom Animation */}
                <motion.div
                  className="w-full h-full"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 8, ease: "easeOut" }}
                >
                  <img
                    src={image}
                    alt={`Darshan Masale Premium Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      console.error(`Failed to load image: ${image}`);
                      e.target.style.display = 'none';
                    }}
                  />
                </motion.div>

                {/* Premium Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-tl from-secondary-gold/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary-gold/5 rounded-full blur-3xl pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Premium Navigation Arrows - Glass Morphism */}
      <button 
        className="hero-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-xl hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all duration-500 hover:scale-110 hover:border-secondary-gold/50 shadow-xl group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:text-secondary-gold transition-colors" />
      </button>
      <button 
        className="hero-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-xl hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all duration-500 hover:scale-110 hover:border-secondary-gold/50 shadow-xl group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:text-secondary-gold transition-colors" />
      </button>

      {/* Premium Pagination Dots */}
      <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2" />

      {/* Slide Counter */}
      <div className="absolute bottom-8 left-8 z-30 hidden lg:flex items-center gap-3 text-white/60 font-body text-sm">
        <span className="text-2xl font-heading font-bold text-secondary-gold">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <span className="w-8 h-[1px] bg-white/20" />
        <span className="text-white/40">{String(sliderImages.length).padStart(2, '0')}</span>
      </div>

      {/* Premium Content - Left Aligned with Glass Effect */}
      <div className="relative z-20 w-full h-full flex items-center">
        <div className="container-custom w-full px-4 md:px-8">
          <div className="max-w-2xl -ml-4 md:-ml-8 lg:-ml-12 xl:-ml-16 pl-4 md:pl-8 lg:pl-12 xl:pl-16 -mt-4 md:-mt-8 lg:-mt-12">
            
            {/* Premium Badge with Glow */}
            <motion.div
              className="hero-badge inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20 shadow-2xl mb-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-gold/10 via-transparent to-secondary-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Award className="w-4 h-4 text-secondary-gold relative z-10" />
              <span className="text-[11px] font-button font-semibold tracking-[0.25em] uppercase text-white relative z-10">
                Premium Quality Since 1995
              </span>
              <Shield className="w-4 h-4 text-secondary-gold relative z-10" />
              <Sparkles className="w-3 h-3 text-secondary-gold/50 relative z-10 animate-pulse" />
            </motion.div>

            {/* Main Title with Premium Typography */}
            <motion.h1
              className="hero-title font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] drop-shadow-2xl"
            >
              <span className="relative inline-block">
                {content.title}
                <span className="absolute -inset-1 bg-gradient-to-r from-secondary-gold/20 via-white/10 to-secondary-gold/20 blur-2xl" />
              </span>
            </motion.h1>

            {/* Subtitle with Gold Accent */}
            <motion.div className="relative mt-4">
              <p className="hero-subtitle text-base md:text-lg lg:text-xl text-white/90 font-light tracking-wide drop-shadow-xl max-w-lg leading-relaxed">
                {content.subtitle}
              </p>
              <motion.div
                className="absolute -bottom-4 left-0 w-20 h-[2px] bg-gradient-to-r from-secondary-gold to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '5rem' }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
            </motion.div>

            {/* Premium CTA Buttons */}
            <motion.div className="hero-buttons flex flex-wrap items-center gap-4 mt-8">
              <Button
                variant="primary"
                size="lg"
                className="!bg-gradient-to-r from-secondary-gold to-secondary-gold-dark !text-text-dark hover:!shadow-2xl hover:-translate-y-1 !px-10 !py-4 rounded-full font-button font-semibold text-sm tracking-wider transition-all duration-500 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Collection
                  <Gem className="w-4 h-4" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-secondary-gold-dark to-secondary-gold"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="!border-white/30 !text-white hover:!bg-white hover:!text-primary-maroon !bg-white/10 !backdrop-blur-sm !px-10 !py-4 rounded-full font-button font-semibold text-sm tracking-wider transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                Shop Now
              </Button>
            </motion.div>

            {/* Premium Statistics */}
            <motion.div
              className="hero-stats flex items-center gap-8 md:gap-12 mt-10 pt-8 border-t border-white/10"
            >
              {[
                { value: '25+', label: 'Years of Trust', icon: Award },
                { value: '500+', label: 'Happy Customers', icon: Star },
                { value: '50+', label: 'Premium Products', icon: Shield },
              ].map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} className="text-center group">
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <Icon className="w-4 h-4 text-secondary-gold opacity-60 group-hover:opacity-100 transition-opacity" />
                      <motion.span
                        className="block text-xl md:text-2xl font-heading font-bold text-secondary-gold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2 + i * 0.15, type: 'spring' }}
                      >
                        {stat.value}
                      </motion.span>
                    </div>
                    <span className="text-[9px] md:text-[10px] text-white/50 font-body tracking-[0.15em] uppercase group-hover:text-white/70 transition-colors">
                      {stat.label}
                    </span>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Premium Scroll Indicator */}
      <motion.div
        className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-20"
        animate={{
          y: [0, 8, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-[9px] font-button tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-secondary-gold to-transparent" />
        <motion.div
          className="w-1 h-1 rounded-full bg-secondary-gold"
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Premium Decorative Elements */}
      <div className="absolute bottom-0 right-0 z-[1] pointer-events-none opacity-10">
        <div className="w-64 h-64 bg-secondary-gold rounded-full blur-3xl" />
      </div>
      <div className="absolute top-20 right-20 z-[1] pointer-events-none opacity-5">
        <div className="w-48 h-48 bg-secondary-gold rounded-full blur-3xl" />
      </div>
    </section>
  )
}

export default Hero