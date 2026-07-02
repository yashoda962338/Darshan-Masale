    // 🔵 FRONTEND: src/pages/auth/ForgotPassword.jsx - Email Only
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await forgotPassword({ email });
    setIsLoading(false);
    
    if (result.success) {
      navigate('/auth/verify-forgot-password-otp', { state: { email: email } });
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Darshan Masale</title>
      </Helmet>

      <section className="min-h-screen flex items-center justify-center bg-background-cream py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto bg-white rounded-2xl shadow-soft p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-primary-maroon">
                Forgot Password
              </h1>
              <p className="text-text-muted mt-2 font-light">
                Enter your email address to receive OTP
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/auth/login"
                className="text-sm text-text-muted hover:text-primary-maroon transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;