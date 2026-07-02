// // backend/src/controllers/cartController.js - FIXED (No ProductVariant)
// const Cart = require('../models/Cart');
// const CartItem = require('../models/CartItem');
// const Product = require('../models/Product');

// // @desc    Get user cart
// // @route   GET /api/cart
// // @access  Private
// exports.getCart = async (req, res) => {
//     try {
//         let cart = await Cart.findOne({ userId: req.user.id });

//         if (!cart) {
//             cart = await Cart.create({
//                 userId: req.user.id
//             });
//         }

//         const items = await CartItem.find({ cartId: cart._id });

//         // Populate variant details from Product model
//         const populatedItems = await Promise.all(items.map(async (item) => {
//             const product = await Product.findOne({
//                 'variants._id': item.variantId,
//                 deletedAt: null
//             });

//             if (!product) return null;

//             const variant = product.variants.id(item.variantId);
//             if (!variant) return null;

//             return {
//                 _id: item._id,
//                 variantId: {
//                     _id: variant._id,
//                     weight: variant.weight,
//                     unit: variant.unit,
//                     sellingPrice: variant.sellingPrice,
//                     mrp: variant.mrp,
//                     stock: variant.stock,
//                     productId: {
//                         _id: product._id,
//                         name: product.name,
//                         nameMr: product.nameMr,
//                         slug: product.slug,
//                         images: product.images,
//                         brand: product.brand,
//                         category: product.category
//                     }
//                 },
//                 quantity: item.quantity,
//                 price: item.price || variant.sellingPrice,
//                 total: (item.price || variant.sellingPrice) * item.quantity
//             };
//         }));

//         const cartItems = populatedItems.filter(item => item !== null);
//         let subtotal = 0;
//         cartItems.forEach(item => { subtotal += item.total; });

//         res.json({
//             success: true,
//             data: {
//                 items: cartItems,
//                 subtotal: subtotal,
//                 total: subtotal,
//                 count: cartItems.length
//             }
//         });
//     } catch (error) {
//         console.error('Get cart error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // @desc    Add to cart
// // @route   POST /api/cart
// // @access  Private
// exports.addToCart = async (req, res) => {
//     try {
//         const { variantId, quantity = 1 } = req.body;

//         if (!variantId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Variant ID is required'
//             });
//         }

//         // Find product containing this variant
//         const product = await Product.findOne({
//             'variants._id': variantId,
//             deletedAt: null
//         });

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Variant not found'
//             });
//         }

//         const variant = product.variants.id(variantId);
//         if (!variant) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Variant not found'
//             });
//         }

//         if (variant.stock < quantity) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Only ${variant.stock} items available`
//             });
//         }

//         let cart = await Cart.findOne({ userId: req.user.id });
//         if (!cart) {
//             cart = await Cart.create({
//                 userId: req.user.id
//             });
//         }

//         let cartItem = await CartItem.findOne({
//             cartId: cart._id,
//             variantId: variantId
//         });

//         if (cartItem) {
//             const newQuantity = cartItem.quantity + quantity;
//             if (variant.stock < newQuantity) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Only ${variant.stock} items available`
//                 });
//             }
//             cartItem.quantity = newQuantity;
//             await cartItem.save();
//         } else {
//             cartItem = await CartItem.create({
//                 cartId: cart._id,
//                 variantId: variantId,
//                 quantity: quantity,
//                 price: variant.sellingPrice
//             });
//             console.log("CartItem Saved =", cartItem);
//         }

//         const populatedItem = {
//             _id: cartItem._id,
//             variantId: {
//                 _id: variant._id,
//                 weight: variant.weight,
//                 unit: variant.unit,
//                 sellingPrice: variant.sellingPrice,
//                 mrp: variant.mrp,
//                 stock: variant.stock,
//                 productId: {
//                     _id: product._id,
//                     name: product.name,
//                     nameMr: product.nameMr,
//                     slug: product.slug,
//                     images: product.images,
//                     brand: product.brand,
//                     category: product.category
//                 }
//             },
//             quantity: cartItem.quantity,
//             price: cartItem.price,
//             total: cartItem.price * cartItem.quantity
//         };

//         res.status(201).json({
//             success: true,
//             message: 'Added to cart',
//             data: populatedItem
//         });
//     }catch (error) {
//         console.error('Add to cart error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // @desc    Update cart item quantity
// // @route   PUT /api/cart/:itemId
// // @access  Private
// exports.updateCartItem = async (req, res) => {
//     try {
//         const { itemId } = req.params;
//         const { quantity } = req.body;

//         if (quantity < 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Quantity cannot be negative'
//             });
//         }

//         const cartItem = await CartItem.findById(itemId);
//         if (!cartItem) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Cart item not found'
//             });
//         }

//         const cart = await Cart.findOne({
//             _id: cartItem.cartId,
//             userId: req.user.id
//         });

//         if (!cart) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Unauthorized'
//             });
//         }

//         // Check stock
//         const product = await Product.findOne({
//             'variants._id': cartItem.variantId,
//             deletedAt: null
//         });

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Variant not found'
//             });
//         }

//         const variant = product.variants.id(cartItem.variantId);
//         if (!variant) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Variant not found'
//             });
//         }

//         if (quantity === 0) {
//             await CartItem.findByIdAndDelete(itemId);
//             return res.json({
//                 success: true,
//                 message: 'Item removed from cart'
//             });
//         }

//         if (variant.stock < quantity) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Only ${variant.stock} items available`
//             });
//         }

//         cartItem.quantity = quantity;
//         await cartItem.save();

//         res.json({
//             success: true,
//             message: 'Cart updated',
//             data: cartItem
//         });
//     } catch (error) {
//         console.error('Update cart error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // @desc    Remove from cart
// // @route   DELETE /api/cart/:itemId
// // @access  Private
// exports.removeFromCart = async (req, res) => {
//     try {
//         const { itemId } = req.params;

//         const cartItem = await CartItem.findById(itemId);
//         if (!cartItem) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Cart item not found'
//             });
//         }

//         const cart = await Cart.findOne({
//             _id: cartItem.cartId,
//             userId: req.user.id
//         });

//         if (!cart) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Unauthorized'
//             });
//         }

//         await CartItem.findByIdAndDelete(itemId);

//         res.json({
//             success: true,
//             message: 'Item removed from cart'
//         });
//     } catch (error) {
//         console.error('Remove from cart error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // @desc    Clear cart
// // @route   DELETE /api/cart
// // @access  Private
// exports.clearCart = async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ userId: req.user.id });
//         if (!cart) {
//             return res.json({
//                 success: true,
//                 message: 'Cart already empty'
//             });
//         }

//         await CartItem.deleteMany({ cartId: cart._id });

//         res.json({
//             success: true,
//             message: 'Cart cleared successfully'
//         });
//     } catch (error) {
//         console.error('Clear cart error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };