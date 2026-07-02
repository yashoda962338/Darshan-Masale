// backend/src/middlewares/cloudinaryUpload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

// Create Cloudinary storage
const createStorage = (folder = 'products') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `darshan-masale/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ],
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return `${folder}-${uniqueSuffix}`;
      }
    }
  });
};

// Create multer instance with Cloudinary storage
const createUpload = (folder = 'products', maxFiles = 5) => {
  const storage = createStorage(folder);
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: parseInt(process.env.CLOUDINARY_MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF)'), false);
      }
    }
  });

  return upload;
};

// Handle upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  if (err && err.message && err.message.includes('Only image files')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next(err);
};

module.exports = { createUpload, handleUploadError };