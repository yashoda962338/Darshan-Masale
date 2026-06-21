// src/components/home/ManufacturingProcess.jsx - Premium Version
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import brandData from '../../data/brandData.json'
import { Check, ArrowRight } from 'lucide-react'

const ManufacturingProcess = () => {
  const { language } = useLanguage()
  const data = brandData[language] || brandData.en
  const steps = data.process.steps
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section ref={sectionRef} className="section-padding bg-background-cream relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-cream via-background-cream-light to-background-cream" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-maroon/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <SectionHeader
          title={data.process.title}
          subtitle={data.process.subtitle}
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-500 border border-secondary-gold/5">
                {/* Step Number with Gradient */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-maroon to-primary-maroon-dark flex items-center justify-center text-white text-2xl font-heading font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%+12px)] right-0">
                      <div className="relative">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-secondary-gold/30 to-secondary-gold/10" />
                        <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-secondary-gold/30" />
                      </div>
                    </div>
                  )}
                </div>

                <h4 className="font-heading text-lg font-semibold text-primary-maroon group-hover:text-secondary-gold transition-colors">
                  {step.title}
                </h4>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {step.description}
                </p>

                {/* Interactive Checkmark */}
                <motion.div
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary-maroon/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                >
                  <Check className="w-4 h-4 text-primary-maroon" />
                </motion.div>
              </div>

              {/* Connecting Line (Mobile/Tablet) */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center py-2">
                  <div className="w-px h-6 bg-secondary-gold/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust Certificate */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 bg-glass backdrop-blur-md px-8 py-4 rounded-full border border-secondary-gold/20 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-text-dark">100% Quality Assured</span>
            </div>
            <div className="w-px h-6 bg-secondary-gold/20" />
            <span className="text-sm text-text-muted">ISO 22000 Certified</span>
            <div className="w-px h-6 bg-secondary-gold/20" />
            <span className="text-sm text-text-muted">FSSC 22000</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ManufacturingProcess