// src/components/common/Footer.jsx - Remove Recipes from quickLinks
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, 
  Send, ArrowRight, Shield, Award, Sparkles 
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { config } from '../../config'
import toast from 'react-hot-toast'

const Footer = () => {
  const { language, translate } = useLanguage()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const quickLinks = [
    { label: translate('nav.home'), path: '/' },
    { label: translate('nav.shop'), path: '/shop' },
    { label: translate('nav.about'), path: '/about' },
    // { label: translate('nav.recipes'), path: '/recipes' },  // REMOVED
    { label: translate('nav.contact'), path: '/contact' },
  ]

  // ... rest of the footer component remains the same
}

export default Footer