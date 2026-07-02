// frontend/src/pages/auth/VerifyRegistrationOTP.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import OTPInput from '../../components/auth/OTPInput';
import toast from 'react-hot-toast';

const VerifyRegistrationOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const email = location.state?.email || '';

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    try {
      const authService = (await import('../../services/authService')).default;
      await authService.verifyOTP({ email, otp });
      toast.success('OTP verified successfully! Please login.');
      navigate('/auth/login');
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setTimer(60);
    
    try {
      const authService = (await import('../../services/authService')).default;
      await authService.resendOTP({ email, purpose: 'REGISTRATION' });
      toast.success('OTP resent successfully! Please check your email.');
    } catch (error) {
      toast.error('Failed to resend OTP');
      setCanResend(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify OTP - Darshan Masale</title>
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
                Verify OTP
              </h1>
              <p className="text-text-muted mt-2 font-light">
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
            </div>

            <OTPInput value={otp} onChange={setOtp} />

            <Button
              onClick={handleVerify}
              variant="primary"
              size="lg"
              className="w-full mt-6"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-secondary-gold hover:text-secondary-gold-dark font-medium transition-colors"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span>Resend OTP in {timer}s</span>
                )}
              </p>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/auth/login')}
                className="text-sm text-text-muted hover:text-primary-maroon transition-colors"
              >
                Back to Login
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default VerifyRegistrationOTP;