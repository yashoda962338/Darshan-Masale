// src/pages/Process.jsx - Our Process Page
import React, { useRef, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  ArrowRight, ChevronDown, CheckCircle, Shield, Award, 
  Star, Sparkles, Play, Mail, Send, Leaf, Droplets,
  Wheat, Users, Package, Truck, Clock, Heart, ThumbsUp,
  Award as AwardIcon, BadgeCheck, Factory, TrendingUp
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import SectionHeader from '../components/ui/SectionHeader'
import { config } from '../config'
import toast from 'react-hot-toast'
import CountUp from 'react-countup'
import { useInView as useInViewHook } from 'react-intersection-observer'

const Process = () => {
  const { language, translate } = useLanguage()
  const sectionRef = useRef(null)
  const heroRef = useRef(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
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

  const timelineSteps = [
    {
      number: '01',
      icon: Leaf,
      titleEn: 'Premium Spice Sourcing',
      titleMr: 'उत्तम मसाल्यांची निवड',
      descriptionEn: 'We partner with sustainable farms across India to source the finest, most aromatic spices, ensuring every ingredient meets our premium standards.',
      descriptionMr: 'आम्ही भारतभरातील शाश्वत शेतांसोबत भागीदारी करून उत्तम, सुगंधी मसाले मिळवतो, प्रत्येक घटक आमच्या प्रीमियम मानकांनुसार आहे याची खात्री करतो.',
      image: '/assets/images/process/sourcing.jpg'
    },
    {
      number: '02',
      icon: Droplets,
      titleEn: 'Cleaning & Sorting',
      titleMr: 'स्वच्छता आणि वर्गीकरण',
      descriptionEn: 'Spices are carefully cleaned, washed, and sorted to remove any impurities, ensuring only the purest spices move forward in the process.',
      descriptionMr: 'कोणतीही अशुद्धता दूर करण्यासाठी मसाले काळजीपूर्वक स्वच्छ, धुतले आणि वर्गीकृत केले जातात, प्रक्रियेत फक्त शुद्ध मसाले पुढे जातात.',
      image: '/assets/images/process/cleaning.jpg'
    },
    {
      number: '03',
      icon: Wheat,
      titleEn: 'Traditional Grinding',
      titleMr: 'पारंपरिक दळण प्रक्रिया',
      descriptionEn: 'Using time-honored grinding techniques, we preserve the natural oils and essential flavors that make our spices truly exceptional.',
      descriptionMr: 'काळानुसार चाचणी केलेल्या दळण तंत्रांचा वापर करून, आम्ही नैसर्गिक तेले आणि आवश्यक चव जपतो जी आमच्या मसाल्यांना खरोखर अपवादात्मक बनवतात.',
      image: '/assets/images/process/grinding.jpg'
    },
    {
      number: '04',
      icon: Sparkles,
      titleEn: 'Authentic Blending',
      titleMr: 'पारंपरिक मसाला मिश्रण',
      descriptionEn: 'Our master blenders combine spices in precise proportions, following recipes passed down through generations to create consistent, authentic flavors.',
      descriptionMr: 'आमचे मास्टर ब्लेंडर्स पिढ्यानपिढ्या पारंपरिक पाककृतींचे अनुसरण करून मसाले अचूक प्रमाणात मिसळतात, सातत्यपूर्ण, प्रमाणिक चव तयार करतात.',
      image: '/assets/images/process/blending.jpg'
    },
    {
      number: '05',
      icon: Shield,
      titleEn: 'Quality Testing',
      titleMr: 'गुणवत्ता तपासणी',
      descriptionEn: 'Every batch undergoes rigorous quality testing in our certified lab to ensure purity, potency, and safety before it reaches your kitchen.',
      descriptionMr: 'प्रत्येक बॅच आपल्या स्वयंपाकघरात पोहोचण्यापूर्वी शुद्धता, सामर्थ्य आणि सुरक्षितता सुनिश्चित करण्यासाठी आमच्या प्रमाणित प्रयोगशाळेत कठोर गुणवत्ता तपासणीतून जाते.',
      image: '/assets/images/process/testing.jpg'
    },
    {
      number: '06',
      icon: Package,
      titleEn: 'Premium Packaging',
      titleMr: 'प्रीमियम पॅकिंग',
      descriptionEn: 'Our premium packaging locks in freshness and aroma, ensuring every packet delivers the authentic taste of Darshan Masale.',
      descriptionMr: 'आमचे प्रीमियम पॅकेजिंग ताजेपणा आणि सुगंध टिकवून ठेवते, प्रत्येक पाकिट दर्शन मसालेची प्रमाणिक चव देते याची खात्री करते.',
      image: '/assets/images/process/packaging.jpg'
    },
    {
      number: '07',
      icon: Truck,
      titleEn: 'Distribution',
      titleMr: 'वितरण',
      descriptionEn: 'From our facility to your doorstep, we ensure timely delivery while maintaining the quality and freshness of our premium spices.',
      descriptionMr: 'आमच्या सुविधेपासून तुमच्या दारापर्यंत, आम्ही आमच्या प्रीमियम मसाल्यांची गुणवत्ता आणि ताजेपणा राखून वेळेवर वितरण सुनिश्चित करतो.',
      image: '/assets/images/process/distribution.jpg'
    }
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <>
      <Helmet>
        <title>Our Manufacturing Process - Darshan Masale</title>
        <meta name="description" content="Discover the premium manufacturing process of Darshan Masale. From sourcing to packaging, we ensure quality and purity in every spice." />
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
            backgroundImage: 'url(/assets/images/process/hero-process.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary-maroon/95 via-primary-maroon/70 to-primary-maroon/40" />
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
                {language === 'mr' ? 'आमची प्रक्रिया' : 'Our Process'}
              </span>
            </div>

            {/* Hero Title */}
            <motion.h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {language === 'mr' ? 'आमची उत्पादन प्रक्रिया' : 'Our Manufacturing Process'}
            </motion.h1>

            {/* Hero Subtitle - English */}
            <motion.p 
              className="text-lg md:text-xl text-background-cream/80 mt-4 max-w-2xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {language === 'mr' 
                ? 'शेतीपासून आपल्या स्वयंपाकघरापर्यंत... प्रत्येक मसाल्यात गुणवत्ता, परंपरा आणि विश्वास.'
                : 'From carefully selected farms to your kitchen, every packet of Darshan Masale carries the taste of tradition.'}
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
              {language === 'mr' ? 'आमची कथा' : 'Our Story'}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-maroon mt-2">
              {language === 'mr' ? 'आम्ही प्रीमियम मसाले कसे बनवतो' : 'How We Create Premium Masale'}
            </h2>
            <div className="w-20 h-1 bg-gradient-gold rounded-full mx-auto mt-4" />
            <p className="text-text-muted text-base md:text-lg mt-6 font-light leading-relaxed">
              {language === 'mr'
                ? 'दर्शन मसाले येथे, आमची उत्पादन प्रक्रिया ही परंपरा, शुद्धता आणि गुणवत्तेचा उत्सव आहे. सर्वोत्तम शेतातून मसाले निवडण्यापासून ते आमच्या प्रीमियम पॅकेजिंगपर्यंत, प्रत्येक पायरी काळजीपूर्वक तयार केली जाते जेणेकरून तुम्हाला प्रत्येक पाकिटात प्रमाणिक चव मिळेल.'
                : 'At Darshan Masale, our manufacturing process is a celebration of tradition, purity, and quality. From sourcing spices from the finest farms to our premium packaging, every step is carefully crafted to ensure you receive the authentic taste in every packet.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== TIMELINE SECTION ==================== */}
      <section className="py-16 md:py-20 bg-background-cream-light relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary-maroon/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <SectionHeader
            title={language === 'mr' ? 'आमची उत्पादन प्रक्रिया' : 'Our Manufacturing Process'}
            subtitle={language === 'mr' ? 'शेतीपासून स्वयंपाकघरापर्यंत' : 'From Farm to Kitchen'}
            className="mb-12"
          />

          <div className="relative">
            {/* Timeline Center Line - Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary-gold/30 via-secondary-gold/10 to-transparent -translate-x-1/2" />

            {timelineSteps.map((step, index) => {
              const isLeft = index % 2 === 0
              const Icon = step.icon

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 mb-12 md:mb-16 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Connector Dot */}
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 z-20">
                    <div className="w-6 h-6 rounded-full bg-secondary-gold border-4 border-background-cream-light shadow-lg flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-maroon" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                      {/* Step Number & Icon */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`flex items-center gap-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                          <div className="w-14 h-14 rounded-full bg-primary-maroon/5 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-7 h-7 text-primary-maroon" />
                          </div>
                          <span className="font-heading text-3xl font-bold text-secondary-gold/30">
                            {step.number}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-xl md:text-2xl font-bold text-primary-maroon">
                        {language === 'mr' ? step.titleMr : step.titleEn}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-text-muted mt-2 font-light leading-relaxed">
                        {language === 'mr' ? step.descriptionMr : step.descriptionEn}
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

      {/* ==================== QUALITY PROMISE SECTION ==================== */}
      <section className="py-16 md:py-20 bg-background-cream">
        <div className="container-custom">
          <SectionHeader
            title={language === 'mr' ? 'आमची गुणवत्ता हमी' : 'Our Quality Promise'}
            subtitle={language === 'mr' ? 'प्रत्येक मसाल्यात गुणवत्ता' : 'Quality in Every Spice'}
            className="mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                titleEn: '100% Pure',
                titleMr: '१००% शुद्ध',
                descriptionEn: 'No additives or preservatives',
                descriptionMr: 'कोणतेही मिश्रण किंवा प्रिझर्व्हेटिव्ह नाहीत'
              },
              {
                icon: Award,
                titleEn: 'Traditional Recipes',
                titleMr: 'पारंपरिक चव',
                descriptionEn: 'Authentic flavors passed down generations',
                descriptionMr: 'पिढ्यानपिढ्या पारंपरिक चव'
              },
              {
                icon: CheckCircle,
                titleEn: 'No Artificial Colors',
                titleMr: 'कृत्रिम रंग नाहीत',
                descriptionEn: 'Natural colors from authentic spices',
                descriptionMr: 'प्रमाणिक मसाल्यांपासून नैसर्गिक रंग'
              },
              {
                icon: BadgeCheck,
                titleEn: 'Quality Tested',
                titleMr: 'गुणवत्ता प्रमाणित',
                descriptionEn: 'Every batch rigorously tested',
                descriptionMr: 'प्रत्येक बॅचची कठोर चाचणी'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-primary-maroon/5 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary-maroon" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-primary-maroon">
                  {language === 'mr' ? item.titleMr : item.titleEn}
                </h3>
                <p className="text-sm text-text-muted mt-1 font-light">
                  {language === 'mr' ? item.descriptionMr : item.descriptionEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CERTIFICATION SECTION ==================== */}
      <section className="py-16 md:py-20 bg-background-cream-light">
        <div className="container-custom">
          <SectionHeader
            title={language === 'mr' ? 'आमची प्रमाणपत्रे' : 'Our Certifications'}
            subtitle={language === 'mr' ? 'गुणवत्ता आणि सुरक्षितता' : 'Quality & Safety'}
            className="mb-12"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                titleEn: 'FSSAI Certified',
                titleMr: 'FSSAI प्रमाणित',
                descriptionEn: 'Government approved food safety',
                descriptionMr: 'सरकार मान्यताप्राप्त अन्न सुरक्षा'
              },
              {
                icon: AwardIcon,
                titleEn: 'Premium Quality',
                titleMr: 'प्रीमियम गुणवत्ता',
                descriptionEn: 'Highest quality standards',
                descriptionMr: 'सर्वोच्च गुणवत्ता मानके'
              },
              {
                icon: Shield,
                titleEn: 'Food Safety',
                titleMr: 'अन्न सुरक्षा',
                descriptionEn: 'Strict safety protocols',
                descriptionMr: 'कठोर सुरक्षा प्रोटोकॉल'
              },
              {
                icon: Star,
                titleEn: 'Excellence Award',
                titleMr: 'उत्कृष्टता पुरस्कार',
                descriptionEn: 'Recognized for quality excellence',
                descriptionMr: 'गुणवत्ता उत्कृष्टतेसाठी मान्यता'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary-gold/10 to-primary-maroon/5 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-10 h-10 text-secondary-gold" />
                </div>
                <h4 className="font-heading text-base font-semibold text-primary-maroon">
                  {language === 'mr' ? item.titleMr : item.titleEn}
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  {language === 'mr' ? item.descriptionMr : item.descriptionEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATISTICS SECTION ==================== */}
      <section ref={statsRef} className="py-16 md:py-20 bg-gradient-maroon relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-orange rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 25, suffix: '+', labelEn: 'Years of Trust', labelMr: 'विश्वासाची वर्षे' },
              { value: 500, suffix: '+', labelEn: 'Happy Customers', labelMr: 'समाधानी ग्राहक' },
              { value: 50, suffix: '+', labelEn: 'Premium Products', labelMr: 'प्रीमियम उत्पादने' },
              { value: 100, suffix: '%', labelEn: 'Quality Checked', labelMr: 'गुणवत्ता तपासणी' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-gold">
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
                <p className="text-sm md:text-base text-background-cream/70 mt-2 font-light">
                  {language === 'mr' ? stat.labelMr : stat.labelEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== VIDEO SECTION ==================== */}
      <section className="py-16 md:py-20 bg-background-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-maroon">
              {language === 'mr' ? 'आमचा उत्पादन प्रवास पहा' : 'Watch Our Manufacturing Journey'}
            </h2>
            <p className="text-text-muted mt-3 font-light">
              {language === 'mr' 
                ? 'आमच्या कारखान्यात शेतीपासून पॅकेजिंगपर्यंतच्या प्रक्रियेचा अनुभव घ्या.'
                : 'Experience the journey from farm to packaging in our state-of-the-art facility.'}
            </p>

            <div className="relative mt-8 rounded-2xl overflow-hidden shadow-elevated group cursor-pointer">
              <div 
                className="aspect-video bg-cover bg-center"
                style={{
                  backgroundImage: 'url(/assets/images/process/video-placeholder.jpg)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary-maroon/50 to-transparent flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                  >
                    <Play className="w-8 h-8 text-primary-maroon ml-1" />
                  </motion.div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-xs text-white font-button tracking-widest">
                  {language === 'mr' ? 'लवकरच येत आहे' : 'Coming Soon'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
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
              {language === 'mr' ? 'परंपरेची चव अनुभवा' : 'Taste the Tradition'}
            </h2>
            <p className="text-lg text-background-cream/70 mt-4 font-light">
              {language === 'mr'
                ? 'प्रमाणिक दर्शन मसाले अनुभवा.'
                : 'Experience authentic Darshan Masale.'}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 mt-8 px-8 py-4 bg-secondary-gold text-text-dark rounded-full font-button font-medium hover:bg-secondary-gold-dark transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>{language === 'mr' ? 'आमची उत्पादने पहा' : 'Explore Our Products'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== NEWSLETTER SECTION ==================== */}
      <section className="py-16 md:py-20 bg-background-cream-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Mail className="w-12 h-12 text-secondary-gold mx-auto mb-4" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-maroon">
              {language === 'mr' ? 'आमच्या वृत्तपत्राची सदस्यता घ्या' : 'Subscribe to Our Newsletter'}
            </h2>
            <p className="text-text-muted mt-2 font-light">
              {language === 'mr' 
                ? 'नवीन उत्पादने, रेसिपी आणि विशेष ऑफर मिळवा.' 
                : 'Get new products, recipes, and special offers.'}
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'mr' ? 'तुमचा ईमेल' : 'Your email address'}
                className="flex-1 px-6 py-3 rounded-full bg-white border-2 border-secondary-gold/20 focus:border-secondary-gold outline-none transition-colors font-body text-text-dark placeholder:text-text-muted"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary-maroon text-white rounded-full font-button font-medium hover:bg-primary-maroon-dark transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                {subscribed 
                  ? (language === 'mr' ? 'सदस्यता घेतली!' : 'Subscribed!') 
                  : (language === 'mr' ? 'सदस्यता घ्या' : 'Subscribe')}
              </button>
            </form>

            <p className="text-xs text-text-muted/60 mt-4">
              {language === 'mr' 
                ? 'स्पॅम नाही, फक्त उत्तम मसाल्यांच्या बातम्या' 
                : 'No spam, just quality spice news'}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Process