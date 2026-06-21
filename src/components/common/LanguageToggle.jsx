import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const LanguageToggle = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { language, switchLanguage } = useLanguage()
  const dropdownRef = useRef(null)

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  ]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLanguage = languages.find(l => l.code === language) || languages[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-primary-maroon/5 transition-colors"
      >
        <Globe className="w-4 h-4 text-text-dark-light" />
        <span className="text-sm font-medium font-body">{currentLanguage.flag}</span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 min-w-[160px] bg-glass backdrop-blur-xl rounded-2xl shadow-xl border border-secondary-gold/10 overflow-hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  switchLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-primary-maroon/5 transition-colors ${
                  language === lang.code ? 'bg-primary-maroon/10' : ''
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-body">{lang.label}</span>
                </span>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-primary-maroon" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageToggle