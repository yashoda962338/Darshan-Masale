// backend/src/middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../../uploads/products'),
  path.join(__dirname, '../../uploads/gallery'),
  path.join(__dirname, '../../uploads/banners'),
  path.join(__dirname, '../../uploads/categories'),
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, '../../uploads/products');
    
    // Determine upload folder based on route
    if (req.baseUrl && req.baseUrl.includes('/gallery')) {
      uploadPath = path.join(__dirname, '../../uploads/gallery');
    } else if (req.baseUrl && req.baseUrl.includes('/banners')) {
      uploadPath = path.join(__dirname, '../../uploads/banners');
    } else if (req.baseUrl && req.baseUrl.includes('/categories')) {
      uploadPath = path.join(__dirname, '../../uploads/categories');
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/svg+xml'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF, SVG)'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10,
  },
  fileFilter: fileFilter,
});

// Handle multer errors
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
  next(err);
};

module.exports = { upload, handleUploadError };