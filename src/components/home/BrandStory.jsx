// src/components/home/BrandStory.jsx - Premium Version
import React, { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play, Award, Clock, Star, Shield, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import brandData from '../../data/brandData.json'

const BrandStory = () => {
  const { language } = useLanguage()
  const data = brandData[language] || brandData.en
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const videoRef = useRef(null)

  useEffect(() => {
    if (isInView) {
      gsap.from('.brand-timeline-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        x: -30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
      })
    }
  }, [isInView])

  const milestones = [
    { year: '1995', label: 'Foundation', desc: 'Started in Nandurbar' },
    { year: '2005', label: 'Expansion', desc: 'Reached Maharashtra' },
    { year: '2015', label: 'Premium Line', desc: 'Luxury packaging' },
    { year: '2025', label: 'Global Reach', desc: 'International presence' },
  ]

  return (
    <section ref={sectionRef} className="section-padding bg-background-cream-light relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary-gold/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-maroon/5 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-secondary-gold" />
              <span className="text-xs font-button tracking-[0.2em] uppercase text-secondary-gold font-semibold">
                {data.story.subtitle}
              </span>
            </div>
            
            <h2 className="heading-section text-primary-maroon">
              {data.story.title}
            </h2>

            <div className="mt-6 space-y-4">
              {data.story.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  className="body-text leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              className="grid grid-cols-2 gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
            >
              {data.story.values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-secondary-gold/10 shadow-soft"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-maroon/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-primary-maroon" />
                  </div>
                  <span className="text-sm font-medium text-text-dark">{value}</span>
                </div>
              ))}
            </motion.div>

            {/* Premium Timeline */}
            <div className="mt-8 pt-8 border-t border-secondary-gold/10">
              <h4 className="font-heading text-sm font-semibold text-primary-maroon mb-4 tracking-wider">
                Our Journey Timeline
              </h4>
              <div className="flex items-center justify-between">
                {milestones.map((milestone, index) => (
                  <div key={index} className="brand-timeline-item text-center">
                    <div className="w-10 h-10 rounded-full bg-primary-maroon/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-xs font-bold text-primary-maroon">{milestone.year}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-text-dark uppercase tracking-wider">
                      {milestone.label}
                    </p>
                    <p className="text-[8px] text-text-muted mt-0.5">{milestone.desc}</p>
                    {index < milestones.length - 1 && (
                      <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-0 border-t-2 border-secondary-gold/20 border-dashed" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Content - Premium Video/Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated group">
              <img
                src="/images/brand-story.jpg"
                alt="Brand Story"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-maroon/30 via-transparent to-secondary-gold/20" />
              
              {/* Play Button Overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-20 h-20 rounded-full bg-glass backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/20">
                  <Play className="w-8 h-8 text-primary-maroon ml-1" />
                </div>
              </motion.div>

              {/* Premium Badge */}
              <div className="absolute bottom-4 left-4 bg-glass backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-button font-medium text-white tracking-wider">
                    Watch Our Story
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <motion.div
              className="absolute -bottom-6 -right-6 bg-secondary-gold text-text-dark px-6 py-4 rounded-2xl shadow-xl"
              initial={{ scale: 0, rotate: -5 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -5 }}
              transition={{ delay: 0.8, type: 'spring' }}
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className="block text-2xl font-heading font-bold">25+</span>
                  <span className="text-[10px] font-button tracking-wider uppercase">Years of Trust</span>
                </div>
                <div className="w-px h-8 bg-text-dark/20" />
                <div className="text-left">
                  <span className="block text-2xl font-heading font-bold">500+</span>
                  <span className="text-[10px] font-button tracking-wider uppercase">Happy Clients</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default BrandStory