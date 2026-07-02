// backend/src/utils/otpGenerator.js
const crypto = require('crypto');

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  // Method 1: Simple Math
  return Math.floor(100000 + Math.random() * 900000).toString();
  
  // Method 2: Crypto (more secure)
  // return crypto.randomInt(100000, 999999).toString();
  
  // Method 3: For production with better distribution
  // return crypto.randomBytes(3).readUIntBE(0, 3).toString().padStart(6, '0').slice(0, 6);
};

/**
 * Validate OTP format
 * @param {string} otp 
 * @returns {boolean}
 */
const isValidOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Generate OTP expiry time
 * @param {number} minutes - Minutes from now
 * @returns {Date}
 */
const getOTPExpiry = (minutes = 5) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

module.exports = {
  generateOTP,
  isValidOTP,
  getOTPExpiry,
};