// src/pages/Home.jsx - Updated with collection organization
import React from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '../components/home/Hero'
import CategoryShowcase from '../components/home/CategoryShowcase'
import FeaturedProducts from '../components/home/FeaturedProducts'
import CollectionShowcase from '../components/home/CollectionShowcase'
import BrandStory from '../components/home/BrandStory'
import ManufacturingProcess from '../components/home/ManufacturingProcess'
import WhyChooseUs from '../components/home/WhyChooseUs'
import Testimonials from '../components/home/Testimonials'
import GallerySection from '../components/home/GallerySection'
import FAQSection from '../components/home/FAQSection'
import Newsletter from '../components/home/Newsletter'

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Darshan Masale - Premium Indian Spices | Since 1995</title>
        <meta name="description" content="Experience authentic Indian spices with Darshan Masale. Premium quality spices from Nandurbar, Maharashtra. Tradition of trust since 1995." />
        <meta property="og:title" content="Darshan Masale - Premium Indian Spices" />
        <meta property="og:description" content="Homemade Taste... Tradition of Trust..." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="Indian spices, premium spices, Darshan Masale, traditional spices, Maharashtra spices, turmeric, cumin, garam masala" />
        <link rel="canonical" href="https://darshanmasale.com" />
      </Helmet>
      
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      
      {/* Organized Collections with alternating backgrounds */}
      <CollectionShowcase 
        title="Powder Collection" 
        titleMr="पावडर संग्रह" 
        category="Powder Collection" 
        bgColor="bg-background-cream-light" 
      />
      
      <CollectionShowcase 
        title="Premium Masala Collection" 
        titleMr="प्रीमियम मसाला संग्रह" 
        category="Premium Masala Collection" 
        bgColor="bg-background-cream" 
      />
      
      <BrandStory />
      
      <CollectionShowcase 
        title="Traditional Masala Collection" 
        titleMr="पारंपारिक मसाला संग्रह" 
        category="Traditional Masala Collection" 
        bgColor="bg-background-cream-light" 
      />
      
      <CollectionShowcase 
        title="Kolhapuri Collection" 
        titleMr="कोल्हापुरी संग्रह" 
        category="Kolhapuri Collection" 
        bgColor="bg-background-cream" 
      />
      
      <ManufacturingProcess />
      <WhyChooseUs />
      <Testimonials />
      <GallerySection />
      <FAQSection />
      <Newsletter />
    </>
  )
}

export default Home