// backend/src/middlewares/firebaseAuth.js
const { verifyFirebaseToken } = require('../config/firebase');

const firebaseAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = await verifyFirebaseToken(token);
    req.firebaseUser = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Firebase token'
    });
  }
};

module.exports = { firebaseAuth };