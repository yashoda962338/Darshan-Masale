import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const NotFound = () => {
  const { language } = useLanguage()

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Darshan Masale</title>
      </Helmet>

      <section className="min-h-[70vh] flex items-center justify-center bg-background-cream">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg mx-auto px-4"
        >
          <span className="text-9xl font-heading font-bold text-primary-maroon/10">404</span>
          <h1 className="heading-section text-primary-maroon mt-4">
            {language === 'mr' ? 'पृष्ठ सापडले नाही' : 'Page Not Found'}
          </h1>
          <p className="text-text-muted mt-3">
            {language === 'mr' ? 'तुम्ही शोधत असलेले पृष्ठ हलवले गेले आहे किंवा ते अस्तित्वात नाही.' : 'The page you\'re looking for was moved or doesn\'t exist.'}
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 mt-8">
            <Home className="w-4 h-4" />
            {language === 'mr' ? 'मुख्यपृष्ठावर परत जा' : 'Back to Home'}
          </Link>
        </motion.div>
      </section>
    </>
  )
}

export default NotFound