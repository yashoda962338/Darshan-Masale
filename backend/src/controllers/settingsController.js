// backend/src/controllers/settingsController.js
const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    // Update only allowed fields
    const allowedFields = [
      'storeName', 'storeNameMr', 'phone', 'email', 'address', 'addressMr',
      'website', 'currency', 'logo', 'logoId', 'favicon', 'faviconId',
      'metaTitle', 'metaDescription', 'metaKeywords',
      'facebookUrl', 'instagramUrl', 'youtubeUrl', 'twitterUrl',
      'workingHours', 'workingDays',
      'deliveryCharges', 'freeDeliveryThreshold', 'taxRate',
      'maintenanceMode', 'maintenanceMessage', 'allowGuestCheckout', 'allowReviews',
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });
    
    settings.updatedBy = req.user?.userId || req.user?.id;
    await settings.save();
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};