import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'

const PrivacyPolicy = () => {
  const { language } = useLanguage()
  const title = language === 'mr' ? 'गोपनीयता धोरण' : 'Privacy Policy'

  return (
    <>
      <Helmet>
        <title>{title} - Darshan Masale</title>
      </Helmet>

      <section className="section-padding bg-background-cream">
        <div className="container-custom max-w-3xl mx-auto">
          <h1 className="heading-section text-primary-maroon">{title}</h1>
          <div className="prose prose-lg mt-8 text-text-dark-light">
            <p>Last updated: January 2026</p>
            <p>At Darshan Masale, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
            <h3>Information We Collect</h3>
            <ul>
              <li>Name and contact information</li>
              <li>Order history and preferences</li>
              <li>Device and browsing information</li>
            </ul>
            <h3>How We Use Your Information</h3>
            <ul>
              <li>Process your orders and payments</li>
              <li>Send order updates and promotional offers</li>
              <li>Improve our products and services</li>
            </ul>
            <h3>Data Protection</h3>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
            <h3>Contact Us</h3>
            <p>If you have questions about this policy, please contact us at info@darshanmasale.com</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default PrivacyPolicy