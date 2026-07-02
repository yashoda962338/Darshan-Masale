// backend/src/controllers/productController.js
const Product = require('../models/Product');
const mongoose = require('mongoose');

// ============================================
// PUBLIC PRODUCT APIs
// ============================================

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      featured,
      bestSeller,
      sort = '-createdAt',
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { 
      status: 'ACTIVE',
      deletedAt: null,
    };

    // Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameMr: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter['variants.sellingPrice'] = {};
      if (minPrice) filter['variants.sellingPrice'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['variants.sellingPrice'].$lte = parseFloat(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    }

    // Best Seller filter
    if (bestSeller === 'true') {
      filter.bestSeller = true;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    let sortField = {};
    switch (sort) {
      case '-createdAt':
        sortField = { createdAt: -1 };
        break;
      case 'price':
        sortField = { 'variants.sellingPrice': 1 };
        break;
      case '-price':
        sortField = { 'variants.sellingPrice': -1 };
        break;
      case 'rating':
        sortField = { rating: -1 };
        break;
      case 'popular':
        sortField = { reviews: -1 };
        break;
      default:
        sortField = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .sort(sortField)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({
      slug,
      status: 'ACTIVE',
      deletedAt: null,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      featured: true,
      status: 'ACTIVE',
      deletedAt: null,
    })
    .sort({ createdAt: -1 })
    .limit(8);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get best sellers
// @route   GET /api/products/bestsellers
// @access  Public
exports.getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({
      bestSeller: true,
      status: 'ACTIVE',
      deletedAt: null,
    })
    .sort({ createdAt: -1 })
    .limit(8);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get best sellers error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const filter = {
      category: decodeURIComponent(category),
      status: 'ACTIVE',
      deletedAt: null,
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// ADMIN PRODUCT APIs
// ============================================

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private (Admin)
exports.getAdminProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      featured,
      bestSeller,
      sort = '-createdAt',
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { deletedAt: null };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameMr: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (bestSeller !== undefined) filter.bestSeller = bestSeller === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/admin/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      nameMr,
      category,
      brand,
      description,
      descriptionMr,
      shortDescription,
      tags,
      images,
      featured,
      bestSeller,
      status,
      variants,
    } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name and category are required',
      });
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if product exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this name already exists',
      });
    }

    // Process variants
    let processedVariants = [];
    if (variants && variants.length > 0) {
      processedVariants = variants.map((v) => ({
        weight: parseFloat(v.weight) || 0,
        unit: v.unit || 'GM',
        mrp: parseFloat(v.mrp) || 0,
        sellingPrice: parseFloat(v.sellingPrice) || 0,
        stock: parseInt(v.stock) || 0,
        sku: v.sku || `DM-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      }));
    }

    const product = await Product.create({
      name,
      nameMr: nameMr || '',
      slug,
      shortDescription: shortDescription || '',
      description: description || '',
      descriptionMr: descriptionMr || '',
      category,
      brand: brand || '',
      tags: tags || [],
      images: images || [],
      featured: featured || false,
      bestSeller: bestSeller || false,
      status: status || 'DRAFT',
      variants: processedVariants,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get product by ID (Admin)
// @route   GET /api/admin/products/:id
// @access  Private (Admin)
exports.getAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const product = await Product.findById(id);

    if (!product || product.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get admin product error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      nameMr,
      category,
      brand,
      description,
      descriptionMr,
      shortDescription,
      tags,
      images,
      featured,
      bestSeller,
      status,
      variants,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const product = await Product.findById(id);

    if (!product || product.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update slug if name changed
    let slug = product.slug;
    if (name && name !== product.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const existingProduct = await Product.findOne({
        slug,
        _id: { $ne: id },
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this name already exists',
        });
      }
    }

    // Process variants
    let processedVariants = [];
    if (variants && variants.length > 0) {
      processedVariants = variants.map((v) => ({
        weight: parseFloat(v.weight) || 0,
        unit: v.unit || 'GM',
        mrp: parseFloat(v.mrp) || 0,
        sellingPrice: parseFloat(v.sellingPrice) || 0,
        stock: parseInt(v.stock) || 0,
        sku: v.sku || `DM-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        nameMr: nameMr || product.nameMr,
        slug,
        shortDescription: shortDescription || product.shortDescription,
        description: description || product.description,
        descriptionMr: descriptionMr || product.descriptionMr,
        category: category || product.category,
        brand: brand || product.brand,
        tags: tags || product.tags,
        images: images || product.images,
        featured: featured !== undefined ? featured : product.featured,
        bestSeller: bestSeller !== undefined ? bestSeller : product.bestSeller,
        status: status || product.status,
        variants: processedVariants.length > 0 ? processedVariants : product.variants,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const product = await Product.findById(id);

    if (!product || product.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.deletedAt = new Date();
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product status (Admin)
// @route   PATCH /api/admin/products/:id/status
// @access  Private (Admin)
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const product = await Product.findById(id);

    if (!product || product.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.status = status;
    await product.save();

    res.json({
      success: true,
      message: 'Product status updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};