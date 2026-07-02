// 🔵 FRONTEND: src/pages/Forbidden.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Home } from 'lucide-react';

const Forbidden = () => {
  return (
    <>
      <Helmet>
        <title>Access Denied - Darshan Masale</title>
      </Helmet>

      <section className="min-h-[70vh] flex items-center justify-center bg-background-cream">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg mx-auto px-4"
        >
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="heading-section text-primary-maroon">403</h1>
          <h2 className="font-heading text-2xl font-semibold text-primary-maroon mt-2">
            Access Denied
          </h2>
          <p className="text-text-muted mt-3">
            You don't have permission to access this page.
          </p>
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2 mt-8"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default Forbidden;