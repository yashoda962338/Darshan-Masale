
// frontend/src/pages/Home.jsx - Complete with Real Products
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

// ✅ Import all components
import Hero from '../components/home/Hero';
import CategoryShowcase from '../components/home/CategoryShowcase';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BrandStory from '../components/home/BrandStory';
import ManufacturingProcess from '../components/home/ManufacturingProcess';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import GallerySection from '../components/home/GallerySection';
import FAQSection from '../components/home/FAQSection';
import Newsletter from '../components/home/Newsletter';

// Import services
import productService from '../services/productService';
import ProductCard from '../components/ui/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getFeaturedProducts();
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Failed to load featured products:', error);
      setError('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Darshan Masale - Premium Indian Spices | Since 1995</title>
        <meta
          name="description"
          content="Experience authentic Indian spices with Darshan Masale. Premium quality spices from Nandurbar, Maharashtra. Tradition of trust since 1995."
        />
        <meta property="og:title" content="Darshan Masale - Premium Indian Spices" />
        <meta property="og:description" content="Homemade Taste... Tradition of Trust..." />
        <meta property="og:type" content="website" />
        <meta
          name="keywords"
          content="Indian spices, premium spices, Darshan Masale, traditional spices, Maharashtra spices, turmeric, cumin, garam masala"
        />
        <link rel="canonical" href="https://darshanmasale.com" />
      </Helmet>

      {/* Hero Section */}
      <Hero />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products - Real Data from MongoDB */}
      <section className="section-padding bg-background-cream-light">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-button tracking-[0.2em] uppercase text-secondary-gold font-semibold">
              Our Collection
            </span>
            <h2 className="heading-section text-primary-maroon mt-2">
              Featured Products
            </h2>
            <p className="subheading mt-2">
              Discover our premium spice collection
            </p>
            <div className="w-20 h-1 bg-gradient-gold rounded-full mx-auto mt-4" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-soft p-4 animate-pulse">
                  <div className="aspect-square bg-background-cream rounded-xl" />
                  <div className="h-4 bg-background-cream rounded mt-4 w-3/4" />
                  <div className="h-3 bg-background-cream rounded mt-2 w-1/2" />
                  <div className="h-6 bg-background-cream rounded mt-3 w-1/3" />
                  <div className="h-10 bg-background-cream rounded mt-4 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button onClick={loadFeaturedProducts} className="btn-primary mt-4">
                Retry
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted">No featured products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product._id || product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Brand Story */}
      <BrandStory />

      {/* Manufacturing Process */}
      <ManufacturingProcess />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <Testimonials />

      {/* Gallery Section */}
      <GallerySection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
};

export default Home;