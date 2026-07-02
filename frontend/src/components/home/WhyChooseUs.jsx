import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import brandData from '../../data/brandData.json'
import { Leaf, Shield, Heart, Globe } from 'lucide-react'

const iconMap = {
  leaf: Leaf,
  shield: Shield,
  heart: Heart,
  globe: Globe,
}

const WhyChooseUs = () => {
  const { language } = useLanguage()
  const data = brandData[language] || brandData.en
  const points = data.whyChoose.points

  return (
    <section className="section-padding bg-background-cream-light">
      <div className="container-custom">
        <SectionHeader
          title={data.whyChoose.title}
          subtitle={data.whyChoose.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {points.map((point, index) => {
            const Icon = iconMap[point.icon] || Leaf
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-premium p-6 text-center group hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-maroon/5 flex items-center justify-center group-hover:bg-primary-maroon/10 transition-colors">
                  <Icon className="w-8 h-8 text-primary-maroon" />
                </div>
                <h4 className="font-heading text-lg font-semibold text-primary-maroon mt-4">
                  {point.title}
                </h4>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs