// backend/src/controllers/uploadController.js
const fs = require('fs');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload an image (product/gallery/banner/category) to Cloudinary
// @route   POST /api/admin/upload/:folder
// @access  Private (Admin)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const folder = req.params.folder || 'product';
    const allowedFolders = ['product', 'gallery', 'banner', 'category'];

    if (!allowedFolders.includes(folder)) {
      // Clean up the temp file before bailing out
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        success: false,
        message: `Invalid upload folder. Must be one of: ${allowedFolders.join(', ')}`,
      });
    }

    // Upload the locally-saved file (written by multer) to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `darshan-masale/${folder}s`,
      resource_type: 'image',
    });

    // Remove the local temp file now that it's safely in Cloudinary
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete local temp file:', err);
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error('Upload image error:', error);

    // Best-effort cleanup of temp file if something went wrong after multer saved it
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image',
    });
  }
};

// @desc    Delete an image from Cloudinary
// @route   DELETE /api/admin/upload/:folder/:filename
// @access  Private (Admin)
exports.deleteImage = async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const publicId = `darshan-masale/${folder}s/${filename}`;

    const result = await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image',
    });
  }
};