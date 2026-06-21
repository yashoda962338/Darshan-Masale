import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import toast from 'react-hot-toast'

const Newsletter = () => {
  const { language, translate } = useLanguage()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      toast.success(
        language === 'mr' ? 'सदस्यता घेतली! तुमच्या ईमेलवर धन्यवाद.' : 'Subscribed! Thank you.'
      )
      setTimeout(() => setSubmitted(false), 3000)
      setEmail('')
    }
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-maroon relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-secondary-gold/10 rounded-r-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-accent-orange/10 rounded-l-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Mail className="w-12 h-12 text-secondary-gold mx-auto mb-4" />
          <h2 className="heading-section text-background-cream">
            {language === 'mr' ? 'आमच्या वृत्तपत्राची सदस्यता घ्या' : 'Subscribe to Our Newsletter'}
          </h2>
          <p className="subheading text-background-cream/70 mt-3">
            {language === 'mr' ? 'विशेष ऑफर आणि नवीन उत्पादनांसाठी' : 'Get exclusive offers and new product updates'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'mr' ? 'तुमचा ईमेल' : 'Your email address'}
                required
                className="w-full px-6 py-3 rounded-full bg-background-cream/10 border border-background-cream/20 text-background-cream placeholder:text-background-cream/40 focus:border-secondary-gold outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-secondary-gold text-text-dark rounded-full font-button font-medium hover:bg-secondary-gold-dark transition-colors flex items-center justify-center gap-2"
            >
              {submitted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {language === 'mr' ? 'सदस्यता घ्या' : 'Subscribe'}
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-background-cream/50 mt-4">
            {language === 'mr' ? 'स्पॅम नाही, फक्त उत्तम मसाल्यांच्या बातम्या' : 'No spam, just quality spice news'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter