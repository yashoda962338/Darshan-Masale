// backend/src/config/firebase.js
const admin = require('firebase-admin');
const path = require('path');

// ✅ Initialize with service account JSON
const serviceAccount = require(path.resolve(__dirname, '../../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
};

module.exports = { admin, verifyFirebaseToken };