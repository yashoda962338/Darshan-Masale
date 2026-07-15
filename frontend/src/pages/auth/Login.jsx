// 🔵 FRONTEND: src/pages/auth/Login.jsx - WITH BACK BUTTON + RETURN URL SUPPORT
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const { login, isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  // ✅ If already authenticated, redirect to returnUrl (or home)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log('✅ Already authenticated, redirecting to', returnUrl || '/');
      navigate(returnUrl || '/');
    }
  }, [isAuthenticated, loading, navigate, returnUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const credentials = loginType === 'email'
      ? { email: formData.email, password: formData.password }
      : { phone: formData.phone, password: formData.password };

    console.log('📡 Sending login request:', credentials);

    const result = await login(credentials);
    setIsLoading(false);

    console.log('📡 Login result:', result);

    if (result.success) {
      toast.success('Login successful!');
      navigate(returnUrl || '/');
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Darshan Masale</title>
      </Helmet>

      <section className="min-h-screen flex items-center justify-center bg-background-cream py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto bg-white rounded-2xl shadow-soft p-8 md:p-10"
          >
            {/* ✅ Back Button - Top Left */}
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-text-muted hover:text-primary-maroon transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
              </button>
            </div>

            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-primary-maroon">
                Welcome Back
              </h1>
              <p className="text-text-muted mt-2 font-light">
                Sign in to your account
              </p>
            </div>

            <div className="flex gap-2 bg-background-cream rounded-xl p-1 mb-6">
              <button
                onClick={() => setLoginType('email')}
                className={`flex-1 py-2 rounded-lg font-button text-sm font-medium transition-all ${
                  loginType === 'email'
                    ? 'bg-primary-maroon text-white shadow-md'
                    : 'text-text-muted hover:text-primary-maroon'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => setLoginType('phone')}
                className={`flex-1 py-2 rounded-lg font-button text-sm font-medium transition-all ${
                  loginType === 'phone'
                    ? 'bg-primary-maroon text-white shadow-md'
                    : 'text-text-muted hover:text-primary-maroon'
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {loginType === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors font-body"
                    placeholder="your@email.com"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors font-body"
                    placeholder="9876543210"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors font-body"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary-maroon" />
                  <span className="text-sm text-text-muted">Remember me</span>
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-secondary-gold hover:text-secondary-gold-dark transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="text-secondary-gold hover:text-secondary-gold-dark font-medium transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Login;