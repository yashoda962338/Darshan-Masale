// backend/src/services/cloudinaryService.js
const { cloudinary } = require('../config/cloudinary');
const logger = require('../config/logger');

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path or base64
 * @param {string} folder - Folder name in Cloudinary
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Cloudinary upload result
 */
const uploadImage = async (filePath, folder = 'products', options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `darshan-masale/${folder}`,
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options
    });
    return result;
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file paths or buffers
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Array>} - Array of upload results
 */
const uploadMultipleImages = async (files, folder = 'products') => {
  try {
    const uploadPromises = files.map(file => {
      return cloudinary.uploader.upload(file, {
        folder: `darshan-masale/${folder}`,
        quality: 'auto:good',
        fetch_format: 'auto',
      });
    });
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    logger.error('Cloudinary multiple upload error:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} - Delete result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<Array>} - Array of delete results
 */
const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => {
      return cloudinary.uploader.destroy(publicId);
    });
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    logger.error('Cloudinary multiple delete error:', error);
    throw error;
  }
};

/**
 * Update image in Cloudinary
 * @param {string} oldPublicId - Old Cloudinary public ID
 * @param {string} newFilePath - New file path or base64
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<object>} - Upload result
 */
const updateImage = async (oldPublicId, newFilePath, folder = 'products') => {
  try {
    // Delete old image
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }
    // Upload new image
    const result = await uploadImage(newFilePath, folder);
    return result;
  } catch (error) {
    logger.error('Cloudinary update error:', error);
    throw error;
  }
};

/**
 * Get image URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {object} transformations - Cloudinary transformations
 * @returns {string} - Image URL
 */
const getImageUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    quality: 'auto:good',
    fetch_format: 'auto',
    ...transformations
  });
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary image URL
 * @returns {string} - Public ID
 */
const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  const publicId = fileName.split('.')[0];
  // Get the folder path
  const folderParts = parts.slice(parts.indexOf('upload') + 2, -1);
  const folder = folderParts.join('/');
  return folder ? `${folder}/${publicId}` : publicId;
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  updateImage,
  getImageUrl,
  extractPublicId,
};