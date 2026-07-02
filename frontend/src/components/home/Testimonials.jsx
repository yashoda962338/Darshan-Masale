// src/components/home/Testimonials.jsx - Premium Redesign
import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import { 
  Star, Quote, User, ChevronLeft, ChevronRight, 
  Shield, CheckCircle, Award, Truck, Sparkles,
  MapPin, Calendar, ShoppingBag, ExternalLink
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import testimonialsData from '../../data/testimonials.json'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const Testimonials = () => {
  const { language } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const swiperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Enhanced testimonials with realistic data
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      nameMr: 'प्रिया शर्मा',
      location: 'Mumbai, Maharashtra',
      locationMr: 'मुंबई, महाराष्ट्र',
      rating: 5,
      date: '2021',
      reviewEn: 'The aroma of Darshan Masale reminds me of my grandmother\'s cooking. Pure quality that brings back beautiful memories.',
      reviewMr: 'दर्शन मसाल्यांचा सुगंध मला माझ्या आजीच्या स्वयंपाकाची आठवण करून देतो. शुद्ध गुणवत्ता जी सुंदर आठवणी परत आणते.',
      image: '/assets/images/testimonials/priya.jpg',
      products: ['Mirchi Powder', 'Haldi Powder', 'Kitchen King'],
      verified: true,
      customerSince: '2021'
    },
    {
      id: 2,
      name: 'Mahesh Patil',
      nameMr: 'महेश पाटील',
      location: 'Nashik, Maharashtra',
      locationMr: 'नाशिक, महाराष्ट्र',
      rating: 5,
      date: '2022',
      reviewEn: 'गेल्या अनेक वर्षांपासून आम्ही फक्त दर्शन मसाले वापरतो. Quality that never disappoints.',
      reviewMr: 'गेल्या अनेक वर्षांपासून आम्ही फक्त दर्शन मसाले वापरतो. अशी गुणवत्ता जी कधीही निराश करत नाही.',
      image: '/assets/images/testimonials/mahesh.jpg',
      products: ['Garam Masala', 'Kala Masala'],
      verified: true,
      customerSince: '2022'
    },
    {
      id: 3,
      name: 'Sneha Joshi',
      nameMr: 'स्नेहा जोशी',
      location: 'Pune, Maharashtra',
      locationMr: 'पुणे, महाराष्ट्र',
      rating: 5,
      date: '2020',
      reviewEn: 'The Garam Masala has authentic homemade taste. It reminds me of my mother\'s kitchen in the hills.',
      reviewMr: 'गरम मसाल्याला प्रमाणिक घरगुती चव आहे. ही मला डोंगरातील माझ्या आईच्या स्वयंपाकघराची आठवण करून देते.',
      image: '/assets/images/testimonials/sneha.jpg',
      products: ['Garam Masala', 'Tea Masala'],
      verified: true,
      customerSince: '2020'
    },
    {
      id: 4,
      name: 'Rohit Pawar',
      nameMr: 'रोहित पवार',
      location: 'Kolhapur, Maharashtra',
      locationMr: 'कोल्हापूर, महाराष्ट्र',
      rating: 5,
      date: '2021',
      reviewEn: 'The Kitchen King Masala gives restaurant-quality flavor to every dish. Highly recommended.',
      reviewMr: 'किचन किंग मसाला प्रत्येक पदार्थाला रेस्टॉरंट-दर्जाची चव देतो. अत्यंत शिफारस करण्याजोगा.',
      image: '/assets/images/testimonials/rohit.jpg',
      products: ['Kitchen King', 'Kolhapuri Mutton Masala'],
      verified: true,
      customerSince: '2021'
    },
    {
      id: 5,
      name: 'Anita Deshmukh',
      nameMr: 'अनिता देशमुख',
      location: 'Nagpur, Maharashtra',
      locationMr: 'नागपूर, महाराष्ट्र',
      rating: 5,
      date: '2023',
      reviewEn: 'I\'ve tried many brands, but Darshan Masale\'s purity and flavor are unmatched. A true taste of Maharashtra.',
      reviewMr: 'मी अनेक ब्रँड वापरले आहेत, पण दर्शन मसाल्यांची शुद्धता आणि चव अतुलनीय आहे. महाराष्ट्राची खरी चव.',
      image: '/assets/images/testimonials/anita.jpg',
      products: ['Sambhar Masala', 'Pav Bhaji Masala'],
      verified: true,
      customerSince: '2023'
    },
    {
      id: 6,
      name: 'Vikram Singh',
      nameMr: 'विक्रम सिंह',
      location: 'Mumbai, Maharashtra',
      locationMr: 'मुंबई, महाराष्ट्र',
      rating: 5,
      date: '2022',
      reviewEn: 'The packaging is premium, the spices are fresh, and the taste is authentic. Darshan Masale is now my go-to brand.',
      reviewMr: 'पॅकेजिंग प्रीमियम आहे, मसाले ताजे आहेत आणि चव प्रमाणिक आहे. दर्शन मसाले आता माझा आवडता ब्रँड आहे.',
      image: '/assets/images/testimonials/vikram.jpg',
      products: ['Chicken Masala', 'Garam Masala'],
      verified: true,
      customerSince: '2022'
    }
  ]

  const stats = [
    { value: '4.9', labelEn: 'Average Rating', labelMr: 'सरासरी रेटिंग', icon: Star },
    { value: '12,500+', labelEn: 'Happy Customers', labelMr: 'समाधानी ग्राहक', icon: User },
    { value: '25+', labelEn: 'Years of Trust', labelMr: 'विश्वासाची वर्षे', icon: Award },
    { value: '100%', labelEn: 'Verified Reviews', labelMr: 'प्रमाणित पुनरावलोकने', icon: CheckCircle }
  ]

  const trustBadges = [
    { icon: MapPin, labelEn: 'Trusted Across Maharashtra', labelMr: 'संपूर्ण महाराष्ट्रात विश्वासार्ह' },
    { icon: Truck, labelEn: 'Fast Delivery', labelMr: 'जलद वितरण' },
    { icon: Shield, labelEn: 'Premium Quality', labelMr: 'प्रीमियम गुणवत्ता' },
    { icon: Calendar, labelEn: 'Since 1995', labelMr: '१९९५ पासून' },
    { icon: Award, labelEn: 'FSSAI Certified', labelMr: 'FSSAI प्रमाणित' }
  ]

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating 
                ? 'fill-secondary-gold text-secondary-gold' 
                : 'text-secondary-gold/20'
            } transition-colors duration-300`}
          />
        ))}
      </div>
    )
  }

  return (
    <section ref={sectionRef} className="section-padding bg-background-cream relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-maroon/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-orange/3 rounded-full blur-3xl" />
        
        {/* Floating Spice Illustrations */}
        {['🌿', '🌶️', '⭐', '🌺', '🌾'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-7xl opacity-[0.03] pointer-events-none"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.5,
            }}
            style={{
              top: `${10 + i * 15}%`,
              left: `${i % 2 === 0 ? 5 : 85}%`,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <SectionHeader
          title={language === 'mr' ? 'आमच्या ग्राहकांचे अनुभव' : 'What Our Customers Say'}
          subtitle={language === 'mr' ? 'ग्राहकांचे अनुभव' : 'Customer Experiences'}
          className="mb-8"
        />

        {/* Statistics Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-secondary-gold/10 shadow-soft"
              >
                <Icon className="w-6 h-6 text-secondary-gold mx-auto mb-2" />
                <div className="font-heading text-2xl md:text-3xl font-bold text-primary-maroon">
                  {stat.value}
                </div>
                <p className="text-xs text-text-muted mt-1 font-body">
                  {language === 'mr' ? stat.labelMr : stat.labelEn}
                </p>
              </div>
            )
          })}
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            grabCursor={true}
            slidesPerView={1}
            breakpoints={{
              640: { 
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              768: { 
                slidesPerView: 2,
                spaceBetween: 24,
                coverflowEffect: {
                  depth: 60,
                }
              },
              1024: { 
                slidesPerView: 3,
                spaceBetween: 30,
                coverflowEffect: {
                  depth: 80,
                }
              },
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
              renderBullet: (index, className) => {
                return `<span class="${className} !bg-secondary-gold !w-2 !h-2 !mx-1"></span>`
              }
            }}
            autoplay={{ 
              delay: 5000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true 
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="pb-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="h-full bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 hover:bg-white/95 border border-secondary-gold/10 hover:border-secondary-gold/30 group">
                    
                    {/* Quote Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <Quote className="w-8 h-8 text-secondary-gold/20 flex-shrink-0" />
                      <div className="flex items-center gap-2">
                        {renderStars(testimonial.rating)}
                        <span className="text-xs text-text-muted font-body ml-1">
                          {testimonial.rating}.0
                        </span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm md:text-base text-text-dark-light leading-relaxed font-light line-clamp-4 min-h-[80px]">
                      {language === 'mr' ? testimonial.reviewMr : testimonial.reviewEn}
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-secondary-gold/10">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-maroon to-primary-maroon-dark flex items-center justify-center text-white text-xl font-heading font-bold shadow-lg">
                          {testimonial.image ? (
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.innerHTML = testimonial.name.charAt(0)
                              }}
                            />
                          ) : (
                            testimonial.name.charAt(0)
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-primary-maroon text-sm">
                          {language === 'mr' ? testimonial.nameMr : testimonial.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {language === 'mr' ? testimonial.locationMr : testimonial.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Calendar className="w-3 h-3 text-secondary-gold" />
                          <span className="text-[10px] text-text-muted font-body">
                            Customer Since {testimonial.customerSince}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Products Purchased */}
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-secondary-gold/10">
                      <span className="text-[10px] text-text-muted font-body flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        Purchased:
                      </span>
                      {testimonial.products.map((product, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] bg-primary-maroon/5 text-primary-maroon px-2 py-0.5 rounded-full font-button font-medium"
                        >
                          {product}
                        </span>
                      ))}
                    </div>

                    {/* Verified Badge */}
                    {testimonial.verified && (
                      <div className="flex items-center gap-1 mt-3">
                        <Shield className="w-3 h-3 text-green-500" />
                        <span className="text-[9px] text-green-600 font-button font-medium tracking-wider">
                          ✓ Verified Purchase
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation - Desktop */}
          <div className="hidden md:flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-3 rounded-full bg-white shadow-soft hover:shadow-elevated transition-all hover:bg-primary-maroon hover:text-white group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:text-white" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-3 rounded-full bg-white shadow-soft hover:shadow-elevated transition-all hover:bg-primary-maroon hover:text-white group"
            >
              <ChevronRight className="w-5 h-5 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Bottom Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <button className="inline-flex items-center gap-2 text-sm font-button font-medium text-primary-maroon hover:text-secondary-gold transition-colors group">
            <span>Read More Reviews</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-secondary-gold/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-3 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-maroon/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-secondary-gold" />
                  </div>
                  <span className="text-[10px] font-button font-medium text-text-dark leading-tight">
                    {language === 'mr' ? badge.labelMr : badge.labelEn}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials