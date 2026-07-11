import axios from "axios";
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { config } from '../config'
import toast from 'react-hot-toast'

const Contact = () => {
  const { language, translate } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    try {

      const response = await axios.post(

        `${import.meta.env.VITE_API_URL}/contact`,

        formData

      );

      if (response.data.success) {

        toast.success(response.data.message);

        setFormData({

          name: "",

          email: "",

          phone: "",

          subject: "",

          message: "",

        });

      }

    } catch (err) {

      console.log(err);

      toast.error(

        err.response?.data?.message ||

        "Failed to send message."

      );

    } finally {

      setSubmitting(false);

    }

  };

  return (
    <>
      <Helmet>
        <title>Contact Darshan Masale - Get in Touch</title>
        <meta name="description" content="Contact Darshan Masale for premium spice inquiries, wholesale orders, and more." />
      </Helmet>

      <section className="section-padding bg-background-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="heading-section text-primary-maroon">
              {language === 'mr' ? 'संपर्क साधा' : 'Get In Touch'}
            </h1>
            <p className="subheading mt-2">
              {language === 'mr' ? 'आम्हाला तुमच्याकडून ऐकायला आवडेल' : 'We\'d love to hear from you'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="card-premium p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-secondary-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading font-semibold text-primary-maroon">Address</h4>
                    <p className="text-sm text-text-muted">{config.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-secondary-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading font-semibold text-primary-maroon">Phone</h4>
                    <p className="text-sm text-text-muted">{config.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-secondary-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading font-semibold text-primary-maroon">Email</h4>
                    <p className="text-sm text-text-muted">{config.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-secondary-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading font-semibold text-primary-maroon">Working Hours</h4>
                    <p className="text-sm text-text-muted">Mon-Sat: 9:00 AM - 10:00 PM</p>
                    
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="card-premium p-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      {language === 'mr' ? 'तुमचे नाव' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      {language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    {language === 'mr' ? 'फोन नंबर' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    {language === 'mr' ? 'विषय' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    {language === 'mr' ? 'तुमचा संदेश' : 'Your Message'}
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto px-8 py-3 bg-primary-maroon text-background-cream rounded-full font-button font-medium hover:bg-primary-maroon-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? (language === 'mr' ? 'पाठवत आहे...' : 'Sending...') : (language === 'mr' ? 'संदेश पाठवा' : 'Send Message')}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 rounded-2xl overflow-hidden shadow-elevated"
          >
            <iframe
              src={config.contact.mapUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Darshan Masale Location"
            />
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Contact