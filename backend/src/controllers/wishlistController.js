// backend/src/controllers/wishlistController.js - COMPLETE
const Wishlist = require('../models/Wishlist');
const WishlistItem = require('../models/WishlistItem');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    console.log('💜 GET /api/wishlist - User:', req.user?.id);
    
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id });
      console.log('✅ New wishlist created for user:', req.user.id);
    }

    const items = await WishlistItem.find({ wishlistId: wishlist._id })
      .sort({ createdAt: -1 });

    // Populate product details with embedded variants
    const populatedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.productId)
        .select('name nameMr slug images variants brand category');
      
      if (!product) return null;

      let variant = null;
      if (item.variantId) {
        variant = product.variants.id(item.variantId);
      }

      return {
        _id: item._id,
        productId: {
          _id: product._id,
          name: product.name,
          nameMr: product.nameMr,
          slug: product.slug,
          images: product.images,
          variants: product.variants,
          brand: product.brand,
          category: product.category
        },
        variantId: variant ? {
          _id: variant._id,
          weight: variant.weight,
          unit: variant.unit,
          sellingPrice: variant.sellingPrice,
          mrp: variant.mrp,
          stock: variant.stock
        } : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    }));

    const filteredItems = populatedItems.filter(item => item !== null);

    console.log(`✅ Wishlist fetched: ${filteredItems.length} items`);

    res.json({
      success: true,
      data: filteredItems,
      count: filteredItems.length
    });
  } catch (error) {
    console.error('❌ Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    console.log('💜 POST /api/wishlist - User:', req.user?.id, 'Body:', req.body);
    
    const { productId, variantId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findOne({
      _id: productId,
      deletedAt: null
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If variantId provided, check if it exists in product's embedded variants
    if (variantId) {
      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant not found in product'
        });
      }
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id });
      console.log('✅ New wishlist created for user:', req.user.id);
    }

    // Check if item already exists
    const existingItem = await WishlistItem.findOne({
      wishlistId: wishlist._id,
      productId: productId,
      variantId: variantId || null
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Item already in wishlist'
      });
    }

    // Create wishlist item
    const wishlistItem = await WishlistItem.create({
      wishlistId: wishlist._id,
      productId: productId,
      variantId: variantId || null
    });

    // Add to wishlist items array
    wishlist.items.push(wishlistItem._id);
    await wishlist.save();

    // Populate the item
    let variant = null;
    if (variantId) {
      variant = product.variants.id(variantId);
    }

    const populatedItem = {
      _id: wishlistItem._id,
      productId: {
        _id: product._id,
        name: product.name,
        nameMr: product.nameMr,
        slug: product.slug,
        images: product.images,
        variants: product.variants,
        brand: product.brand,
        category: product.category
      },
      variantId: variant ? {
        _id: variant._id,
        weight: variant.weight,
        unit: variant.unit,
        sellingPrice: variant.sellingPrice,
        mrp: variant.mrp,
        stock: variant.stock
      } : null,
      createdAt: wishlistItem.createdAt,
      updatedAt: wishlistItem.updatedAt
    };

    console.log('✅ Item added to wishlist:', wishlistItem._id);

    res.status(201).json({
      success: true,
      message: 'Added to wishlist',
      data: populatedItem
    });
  } catch (error) {
    console.error('❌ Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    console.log('💜 DELETE /api/wishlist/:id - User:', req.user?.id, 'ID:', req.params.id);
    
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Wishlist item ID is required'
      });
    }

    // Find wishlist item
    const wishlistItem = await WishlistItem.findById(id);
    if (!wishlistItem) {
      console.log('❌ Wishlist item not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
    }

    // Check if item belongs to user's wishlist
    const wishlist = await Wishlist.findOne({
      _id: wishlistItem.wishlistId,
      userId: req.user.id
    });

    if (!wishlist) {
      console.log('❌ Unauthorized - Wishlist not found for user');
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to remove this item'
      });
    }

    // Remove from wishlist items array
    wishlist.items = wishlist.items.filter(
      itemId => itemId.toString() !== id
    );
    await wishlist.save();

    // Delete the wishlist item
    await WishlistItem.findByIdAndDelete(id);

    console.log('✅ Item removed from wishlist:', id);

    res.json({
      success: true,
      message: 'Removed from wishlist',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variantId } = req.query;

    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      return res.json({
        success: true,
        data: { inWishlist: false }
      });
    }

    const existingItem = await WishlistItem.findOne({
      wishlistId: wishlist._id,
      productId: productId,
      variantId: variantId || null
    });

    res.json({
      success: true,
      data: {
        inWishlist: !!existingItem,
        itemId: existingItem?._id || null
      }
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res) => {
  try {
    console.log('💜 DELETE /api/wishlist - User:', req.user?.id);
    
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      return res.json({
        success: true,
        message: 'Wishlist already empty'
      });
    }

    // Delete all wishlist items
    await WishlistItem.deleteMany({ wishlistId: wishlist._id });
    
    // Clear items array
    wishlist.items = [];
    await wishlist.save();

    console.log('✅ Wishlist cleared for user:', req.user.id);

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Move wishlist item to cart
// @route   POST /api/wishlist/:id/move-to-cart
// @access  Private
exports.moveToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const Cart = require('../models/Cart');
    const CartItem = require('../models/CartItem');

    // Find wishlist item
    const wishlistItem = await WishlistItem.findById(id);
    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
    }

    // Check if item belongs to user's wishlist
    const wishlist = await Wishlist.findOne({
      _id: wishlistItem.wishlistId,
      userId: req.user.id
    });

    if (!wishlist) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Get product with embedded variants
    const product = await Product.findById(wishlistItem.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get variant from embedded variants
    let variant = null;
    let variantId = wishlistItem.variantId;
    let price = 0;

    if (variantId) {
      variant = product.variants.id(variantId);
      if (variant) {
        price = variant.sellingPrice;
      }
    }

    // If no variant found, use first variant
    if (!variant && product.variants && product.variants.length > 0) {
      variant = product.variants[0];
      variantId = variant._id;
      price = variant.sellingPrice;
    }

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'No variant available for this product'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ 
        userId: req.user.id,
        items: []
      });
    }

    // Check if variant already in cart
    const existingCartItem = await CartItem.findOne({
      cartId: cart._id,
      variantId: variantId
    });

    if (existingCartItem) {
      // Increase quantity
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      // Create new cart item
      await CartItem.create({
        cartId: cart._id,
        variantId: variantId,
        quantity: 1,
        price: price
      });
    }

    // Remove from wishlist
    wishlist.items = wishlist.items.filter(
      itemId => itemId.toString() !== id
    );
    await wishlist.save();
    await WishlistItem.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Moved to cart successfully'
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};