// backend/src/controllers/categoryController.js
const Category = require('../models/Category');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// ============================================
// ADMIN CATEGORY CRUD
// ============================================

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private (Admin)
exports.getCategories = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;

    const filter = { deletedAt: null };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameMr: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const categories = await Category.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
      const count = await Product.countDocuments({
        category: cat.name,
        deletedAt: null
      });
      return {
        ...cat.toObject(),
        productCount: count,
      };
    }));

    const total = await Category.countDocuments(filter);

    res.json({
      success: true,
      data: {
        categories: categoriesWithCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single category
// @route   GET /api/admin/categories/:id
// @access  Private (Admin)
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
    }

    const category = await Category.findById(id);
    if (!category || category.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const productCount = await Product.countDocuments({
      category: category.name,
      deletedAt: null
    });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        productCount,
      },
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  try {
    const {
      name,
      nameMr,
      description,
      descriptionMr,
      image,
      status,
      displayOrder,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const category = await Category.create({
      name,
      nameMr: nameMr || '',
      slug,
      description: description || '',
      descriptionMr: descriptionMr || '',
      image: image || { url: '', publicId: '' },
      status: status || 'ACTIVE',
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      nameMr,
      description,
      descriptionMr,
      image,
      status,
      displayOrder,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
    }

    const category = await Category.findById(id);
    if (!category || category.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    let slug = category.slug;
    if (name && name !== category.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const existingCategory = await Category.findOne({
        slug,
        _id: { $ne: id },
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists',
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name || category.name,
        nameMr: nameMr || category.nameMr,
        slug,
        description: description || category.description,
        descriptionMr: descriptionMr || category.descriptionMr,
        image: image || category.image,
        status: status || category.status,
        displayOrder: displayOrder || category.displayOrder,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete category (Soft delete)
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
    }

    const category = await Category.findById(id);
    if (!category || category.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const productCount = await Product.countDocuments({
      category: category.name,
      deletedAt: null
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productCount} products. Move products first.`,
      });
    }

    category.deletedAt = new Date();
    await category.save();

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle category status
// @route   PATCH /api/admin/categories/:id/status
// @access  Private (Admin)
exports.toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
    }

    const category = await Category.findById(id);
    if (!category || category.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    category.status = status || (category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
    await category.save();

    res.json({
      success: true,
      message: 'Category status updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Toggle category status error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// PUBLIC CATEGORY APIs
// ============================================

// @desc    Get all active categories for frontend
// @route   GET /api/categories
// @access  Public
exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      status: 'ACTIVE',
      deletedAt: null,
    })
    .sort({ displayOrder: 1, name: 1 });

    const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
      const count = await Product.countDocuments({
        category: cat.name,
        status: 'PUBLISHED',
        deletedAt: null
      });
      return {
        ...cat.toObject(),
        productCount: count,
      };
    }));

    res.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    console.error('Get public categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};