import React, { createContext, useState, useContext, useEffect } from 'react'
import enTranslations from '../data/translations/en.json'
import mrTranslations from '../data/translations/mr.json'

const translations = {
  en: enTranslations,
  mr: mrTranslations,
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return saved || 'en'
  })

  const [t, setT] = useState(() => translations[language] || translations.en)

  useEffect(() => {
    localStorage.setItem('language', language)
    setT(translations[language] || translations.en)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'mr' ? 'ltr' : 'ltr'
  }, [language])

  const translate = (key) => {
    const keys = key.split('.')
    let value = t
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    return value
  }

  const switchLanguage = (lang) => {
    if (lang in translations) {
      setLanguage(lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, translate, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}