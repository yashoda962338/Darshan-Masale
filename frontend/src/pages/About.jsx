// src/pages/About.jsx - Fixed with correct imports
import React, { useRef, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  ArrowRight, Shield, Award, Star, Sparkles, 
  Clock, MapPin, Phone, Mail, Calendar, 
  CheckCircle, Users, ShoppingBag, Truck,
  Heart, Leaf, Droplets, Factory, Package,
  ExternalLink, ChevronRight, Quote, Gem,
  Store  // <-- Added Store import
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import SectionHeader from '../components/ui/SectionHeader'
import { config } from '../config'
import CountUp from 'react-countup'
import { useInView as useInViewHook } from 'react-intersection-observer'

const About = () => {
  const { language } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [selectedImage, setSelectedImage] = useState(null)
  const [animatedStats, setAnimatedStats] = useState(false)

  const { ref: statsRef, inView: statsInView } = useInViewHook({
    triggerOnce: true,
    threshold: 0.3,
  })

  useEffect(() => {
    if (statsInView) {
      setAnimatedStats(true)
    }
  }, [statsInView])

  // Shop Images
  const shopImages = [
    {
      id: 1,
      src: '/assets/images/shops/front-image.jpg',
      alt: 'Darshan Masale Shop Front View',
      altMr: 'दर्शन मसाले दुकानाचा दृष्य',
      title: 'Shop Front',
      titleMr: 'दुकानाचा दृष्य'
    },
    {
      id: 2,
      src: '/assets/images/shops/front-2.jpg',
      alt: 'Darshan Masale Shop Interior',
      altMr: 'दर्शन मसाले दुकानाचा आतील भाग',
      title: 'Shop Interior',
      titleMr: 'दुकानाचा आतील भाग'
    }
  ]

  const products = [
    'Red Chilli Powder',
    'Turmeric Powder',
    'Coriander Powder',
    'Garam Masala',
    'Kitchen King',
    'Kala Masala',
    'Chicken Masala',
    'Mutton Masala',
    'Garlic Chutney',
    'Kolhapuri Masalas'
  ]

  const trustPoints = [
    {
      icon: Leaf,
      titleEn: '100% Pure Ingredients',
      titleMr: '१००% शुद्ध घटक',
      descriptionEn: 'No additives or artificial colors',
      descriptionMr: 'कोणतेही मिश्रण किंवा कृत्रिम रंग नाहीत'
    },
    {
      icon: Award,
      titleEn: 'Traditional Recipes',
      titleMr: 'पारंपरिक पाककृती',
      descriptionEn: 'Authentic recipes passed down generations',
      descriptionMr: 'पिढ्यानपिढ्या पारंपरिक पाककृती'
    },
    {
      icon: Factory,
      titleEn: 'Hygienic Manufacturing',
      titleMr: 'स्वच्छ उत्पादन',
      descriptionEn: 'Maintained with strict quality standards',
      descriptionMr: 'कठोर गुणवत्ता मानकांसह देखभाल'
    },
    {
      icon: Shield,
      titleEn: 'Quality Tested',
      titleMr: 'गुणवत्ता तपासणी',
      descriptionEn: 'Every batch rigorously tested',
      descriptionMr: 'प्रत्येक बॅचची कठोर चाचणी'
    },
    {
      icon: Package,
      titleEn: 'Affordable Pricing',
      titleMr: 'परवडणारी किंमत',
      descriptionEn: 'Premium quality at fair prices',
      descriptionMr: 'वाजवी किंमतीत प्रीमियम गुणवत्ता'
    },
    {
      icon: Heart,
      titleEn: 'Trusted Since 1995',
      titleMr: '१९९५ पासून विश्वासार्ह',
      descriptionEn: 'Over 25 years of trust and quality',
      descriptionMr: '२५+ वर्षांचा विश्वास आणि गुणवत्ता'
    }
  ]

  const journeyMilestones = [
    {
      year: '1995',
      titleEn: 'Darshan Masale Started',
      titleMr: 'दर्शन मसाले सुरू झाले',
      descriptionEn: 'A small family business with a dream to share authentic Indian spices.',
      descriptionMr: 'प्रमाणिक भारतीय मसाले शेअर करण्याच्या स्वप्नासह एक छोटा कौटुंबिक व्यवसाय.'
    },
    {
      year: '2005',
      titleEn: 'Expanded Manufacturing',
      titleMr: 'उत्पादन विस्तार',
      descriptionEn: 'Grew our production capacity to meet increasing demand.',
      descriptionMr: 'वाढत्या मागणी पूर्ण करण्यासाठी उत्पादन क्षमता वाढवली.'
    },
    {
      year: '2015',
      titleEn: 'Premium Packaging',
      titleMr: 'प्रीमियम पॅकेजिंग',
      descriptionEn: 'Introduced premium packaging to preserve freshness and aroma.',
      descriptionMr: 'ताजेपणा आणि सुगंध टिकवण्यासाठी प्रीमियम पॅकेजिंग सुरू केली.'
    },
    {
      year: '2020',
      titleEn: 'Digital Presence',
      titleMr: 'ऑनलाइन उपस्थिती',
      descriptionEn: 'Expanded reach through online platform and digital services.',
      descriptionMr: 'ऑनलाइन प्लॅटफॉर्म आणि डिजिटल सेवांद्वारे पोहोच वाढवली.'
    },
    {
      year: 'Today',
      titleEn: 'Serving Thousands',
      titleMr: 'हजारो ग्राहक',
      descriptionEn: 'Continuing our journey of quality, trust, and tradition.',
      descriptionMr: 'गुणवत्ता, विश्वास आणि परंपरेचा प्रवास सुरू आहे.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>About Darshan Masale - Premium Indian Spices Since 1995</title>
        <meta name="description" content="Learn about Darshan Masale's legacy of pure taste and trust. Serving authentic Indian spices with quality, purity and tradition since 1995." />
      </Helmet>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-maroon">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-orange rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span 
              className="text-xs font-button tracking-[0.3em] uppercase text-secondary-gold font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {language === 'mr' ? '१९९५ पासून' : 'Since 1995'}
            </motion.span>
            
            <motion.h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {language === 'mr' ? 'शुद्ध चव आणि विश्वासाचा वारसा' : 'A Legacy of Pure Taste & Trust'}
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-background-cream/70 mt-4 font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {language === 'mr'
                ? 'गुणवत्ता, शुद्धता आणि परंपरा यासह प्रमाणिक भारतीय मसाले सर्व्ह करत आहे.'
                : 'Serving authentic Indian spices with quality, purity and tradition.'}
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-20 h-0.5 bg-secondary-gold/30 rounded-full" />
              <Gem className="w-4 h-4 text-secondary-gold" />
              <div className="w-20 h-0.5 bg-secondary-gold/30 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 1: BRAND STORY ==================== */}
      <section className="py-16 md:py-20 bg-background-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src="/assets/images/shops/front-image.jpg"
                  alt={language === 'mr' ? 'दर्शन मसाले दुकान' : 'Darshan Masale Shop'}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-maroon/20 to-transparent" />
              </div>
              
              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-secondary-gold text-text-dark px-6 py-4 rounded-2xl shadow-xl"
                initial={{ scale: 0, rotate: -5 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <span className="text-3xl font-heading font-bold">25+</span>
                <p className="text-xs font-button tracking-wider uppercase">Years of Trust</p>
              </motion.div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <span className="text-xs font-button tracking-[0.2em] uppercase text-secondary-gold font-semibold">
                {language === 'mr' ? 'आमची कथा' : 'Our Story'}
              </span>
              <h2 className="heading-section text-primary-maroon mt-2">
                {language === 'mr' ? 'पारंपारिक चवेचा प्रवास' : 'The Journey of Authentic Taste'}
              </h2>
              <div className="w-20 h-1 bg-gradient-gold rounded-full mt-4" />

              <div className="space-y-4 mt-6 text-text-dark-light">
                <p className="text-base leading-relaxed">
                  {language === 'mr'
                    ? '१९९५ मध्ये, दर्शन मसालेची सुरुवात नंदुरबार येथे एका छोट्या कौटुंबिक व्यवसायाने झाली. आमचे संस्थापक, पारंपारिक कौटुंबिक पाककृतींनी प्रेरित होऊन, भारतीय मसाल्यांची प्रमाणिक चव जगाला देण्यासाठी निघाले.'
                    : 'In 1995, Darshan Masale began as a small family business in Nandurbar. Our founder, inspired by traditional family recipes, set out to share the authentic taste of Indian spices with the world.'}
                </p>
                <p className="text-base leading-relaxed">
                  {language === 'mr'
                    ? 'आज, आम्ही शाश्वत शेतीतून उत्तम मसाले मिळवून आणि पारंपरिक पद्धतींनी प्रक्रिया करून हा वारसा पुढे नेत आहोत. प्रत्येक बॅचची गुणवत्ता तपासणी केली जाते जेणेकरून शुद्ध, सुगंधी मसाले तुमच्या स्वयंपाकघरात पोहोचतात.'
                    : 'Today, we continue this legacy by sourcing the finest spices from sustainable farms and processing them using traditional methods. Every batch is quality tested to ensure pure, aromatic spices reach your kitchen.'}
                </p>
              </div>

              {/* Animated Statistics */}
              <div ref={statsRef} className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-secondary-gold/10">
                {[
                  { value: 25, suffix: '+', labelEn: 'Years of Trust', labelMr: 'विश्वासाची वर्षे' },
                  { value: 500, suffix: '+', labelEn: 'Retail Partners', labelMr: 'किरकोळ भागीदार' },
                  { value: 10000, suffix: '+', labelEn: 'Happy Customers', labelMr: 'समाधानी ग्राहक' },
                  { value: 100, suffix: '%', labelEn: 'Quality Assured', labelMr: 'गुणवत्ता हमी' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-heading text-2xl md:text-3xl font-bold text-primary-maroon">
                      {animatedStats && (
                        <CountUp
                          end={stat.value}
                          duration={3}
                          delay={index * 0.2}
                          suffix={stat.suffix}
                          enableScrollSpy
                        />
                      )}
                      {!animatedStats && `${stat.value}${stat.suffix}`}
                    </div>
                    <p className="text-xs text-text-muted mt-1 font-body">
                      {language === 'mr' ? stat.labelMr : stat.labelEn}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 2: OUR SHOP ==================== */}
      <section className="py-16 md:py-20 bg-background-cream-light">
        <div className="container-custom">
          <SectionHeader
            title={language === 'mr' ? 'आमचे दुकान' : 'Visit Our Store'}
            subtitle={language === 'mr' ? 'आमची उत्पादने थेट दुकानात अनुभवा' : 'Experience our products directly from our shop'}
            className="mb-12"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Shop Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src="/assets/images/shops/front-2.jpg"
                  alt={language === 'mr' ? 'दर्शन मसाले दुकानाचा आतील भाग' : 'Darshan Masale Shop Interior'}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-maroon/10 to-transparent" />
              </div>
              
              {/* Shop Badge */}
              <div className="absolute -bottom-4 -left-4 bg-primary-maroon text-white px-4 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary-gold" />
                  <span className="text-sm font-button font-medium">Nandurbar, Maharashtra</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Shop Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-soft border border-secondary-gold/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-maroon/5 flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary-maroon" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-primary-maroon">Darshan Masale</h3>
                  <p className="text-xs text-text-muted font-body">
                    {language === 'mr' ? 'उत्पादक आणि घाऊक पुरवठादार' : 'Manufacturer & Wholesale Supplier'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-dark">Location</p>
                    <p className="text-sm text-text-muted">Shop No. 1, Main Market, Nandurbar - 425412, Maharashtra</p>
                  </div>
                </div>

                {/* Products */}
                <div className="flex items-start gap-3">
                  <ShoppingBag className="w-5 h-5 text-secondary-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-dark">
                      {language === 'mr' ? 'उत्पादने' : 'Products'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {products.map((product, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-primary-maroon/5 text-primary-maroon px-2 py-0.5 rounded-full font-button"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3 pt-4 border-t border-secondary-gold/10">
                  <Clock className="w-5 h-5 text-secondary-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-dark">
                      {language === 'mr' ? 'कार्यवेळ' : 'Business Hours'}
                    </p>
                    <p className="text-sm text-text-muted">
                      Mon-Sat: 9 AM – 8 PM
                    </p>
                    <p className="text-sm text-text-muted">
                      Sunday: {language === 'mr' ? 'सुट्टी' : 'Holiday'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: WHY TRUST US ==================== */}
      <section className="py-16 md:py-20 bg-background-cream">
        <div className="container-custom">
          <SectionHeader
            title={language === 'mr' ? 'लोक आमच्यावर का विश्वास करतात' : 'Why People Trust Us'}
            subtitle={language === 'mr' ? 'गुणवत्ता आणि विश्वास' : 'Quality & Trust'}
            className="mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustPoints.map((point, index) => {
              const Icon = point.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-500 border border-secondary-gold/5 hover:border-secondary-gold/20"
                >
                  <div className="w-14 h-14 rounded-full bg-primary-maroon/5 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary-maroon" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-primary-maroon">
                    {language === 'mr' ? point.titleMr : point.titleEn}
                  </h3>
                  <p className="text-sm text-text-muted mt-1 font-light">
                    {language === 'mr' ? point.descriptionMr : point.descriptionEn}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: OUR JOURNEY ==================== */}
      <section className="py-16 md:py-20 bg-background-cream-light relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary-maroon/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <SectionHeader
            title={language === 'mr' ? 'आमचा प्रवास' : 'Our Journey'}
            subtitle={language === 'mr' ? '१९९५ पासून आजपर्यंत' : 'From 1995 to Today'}
            className="mb-12"
          />

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary-gold/30 via-secondary-gold/10 to-transparent -translate-x-1/2" />

            {journeyMilestones.map((milestone, index) => {
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 mb-12 md:mb-16 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 z-20">
                    <div className="w-6 h-6 rounded-full bg-secondary-gold border-4 border-background-cream-light shadow-lg flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-maroon" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-heading text-3xl font-bold text-secondary-gold/50">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-primary-maroon">
                        {language === 'mr' ? milestone.titleMr : milestone.titleEn}
                      </h3>
                      <p className="text-sm text-text-muted mt-1 font-light leading-relaxed">
                        {language === 'mr' ? milestone.descriptionMr : milestone.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Empty spacer */}
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5: GALLERY ==================== */}
      <section className="py-16 md:py-20 bg-background-cream">
        <div className="container-custom">
          <SectionHeader
            title={language === 'mr' ? 'आमची प्रतिमासंग्रह' : 'Our Gallery'}
            subtitle={language === 'mr' ? 'आमच्या दुकानाचे क्षण' : 'Moments from our shop'}
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shopImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-500 cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.src}
                    alt={language === 'mr' ? image.altMr : image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-maroon/60 via-primary-maroon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="font-heading text-xl font-semibold">
                      {language === 'mr' ? image.titleMr : image.title}
                    </h3>
                    <p className="text-sm text-white/70">
                      {language === 'mr' ? 'दर्शन मसाले' : 'Darshan Masale'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 6: CTA ==================== */}
      <section className="relative py-16 md:py-20 bg-gradient-maroon overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-orange rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {language === 'mr' ? 'दर्शन मसालेची प्रामाणिक चव अनुभव करा' : 'Experience the Authentic Taste of Darshan Masale'}
            </h2>

            <p className="text-lg text-background-cream/70 mt-4 font-light">
              {language === 'mr'
                ? 'आमच्या प्रीमियम मसाल्यांचा संग्रह शोधा आणि तुमच्या स्वयंपाकाला एक नवीन उंची द्या.'
                : 'Explore our premium spice collection and elevate your cooking to new heights.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-secondary-gold text-text-dark rounded-full font-button font-medium hover:bg-secondary-gold-dark transition-all shadow-lg"
              >
                <span>{language === 'mr' ? 'उत्पादने एक्सप्लोर करा' : 'Explore Products'}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-button font-medium hover:bg-white/20 transition-all shadow-lg"
              >
                <span>{language === 'mr' ? 'संपर्क करा' : 'Contact Us'}</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About