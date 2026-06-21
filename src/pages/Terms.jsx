import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'

const Terms = () => {
  const { language } = useLanguage()
  const title = language === 'mr' ? 'सेवा अटी' : 'Terms of Service'

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
            <p>By using Darshan Masale's website and services, you agree to these terms and conditions.</p>
            <h3>Use of Website</h3>
            <ul>
              <li>You must be 18 years or older to make purchases</li>
              <li>You agree to provide accurate information</li>
              <li>You are responsible for maintaining account security</li>
            </ul>
            <h3>Products and Pricing</h3>
            <ul>
              <li>Product descriptions are for informational purposes</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to cancel orders due to errors</li>
            </ul>
            <h3>Shipping and Returns</h3>
            <ul>
              <li>Orders are processed within 2-3 business days</li>
              <li>Returns accepted within 7 days of delivery</li>
              <li>Products must be unopened and in original packaging</li>
            </ul>
            <h3>Contact</h3>
            <p>For questions about these terms, contact us at info@darshanmasale.com</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Terms