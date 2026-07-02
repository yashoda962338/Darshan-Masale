// backend/src/routes/gallery.js - Public Gallery Routes
const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

// @desc    Get public gallery images
// @route   GET /api/gallery
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = {
      deletedAt: null,
      isActive: true,
    };
    
    if (category) {
      filter.category = category;
    }
    
    const images = await Gallery.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: images,
      count: images.length,
    });
  } catch (error) {
    console.error('Public gallery error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get gallery image by ID
// @route   GET /api/gallery/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const image = await Gallery.findOne({
      _id: req.params.id,
      deletedAt: null,
      isActive: true,
    });
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }
    
    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Get gallery image error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;