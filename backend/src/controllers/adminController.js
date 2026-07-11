// backend/src/controllers/adminController.js - FIXED (No ProductVariant)
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Gallery = require('../models/Gallery');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const HeroBanner = require('../models/HeroBanner');
const Address = require('../models/Address');

// ============================================
// DASHBOARD - REAL DATA FROM MONGODB
// ============================================

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({ deletedAt: null });
        const totalCategories = await Category.countDocuments({ deletedAt: null });
        const totalCustomers = await User.countDocuments({ deletedAt: null, role: 'CUSTOMER' });
        const totalOrders = await Order.countDocuments({ deletedAt: null });
        const pendingOrders = await Order.countDocuments({ status: 'PENDING', deletedAt: null });
        const completedOrders = await Order.countDocuments({ status: 'DELIVERED', deletedAt: null });

        const deliveredOrders = await Order.find({ status: 'DELIVERED', deletedAt: null });
        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

        const recentOrders = await Order.find({ deletedAt: null })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'firstName lastName email');

        const latestCustomers = await User.find({ deletedAt: null, role: 'CUSTOMER' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName email phone createdAt');

        // Get low stock products from embedded variants
        const products = await Product.find({ deletedAt: null });
        const lowStockProducts = [];

        for (const product of products) {
            for (const variant of product.variants) {
                if (variant.stock <= 10) {
                    lowStockProducts.push({
                        name: product.name,
                        stock: variant.stock,
                        sku: variant.sku || 'N/A',
                        variant: `${variant.weight}${variant.unit}`
                    });
                }
            }
        }

        const monthlyRevenue = await Order.aggregate([
            { $match: { status: 'DELIVERED', deletedAt: null } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 }
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    totalProducts,
                    totalCategories,
                    totalCustomers,
                    totalOrders,
                    totalRevenue,
                    pendingOrders,
                    completedOrders,
                },
                recentOrders,
                latestCustomers,
                lowStockProducts: lowStockProducts.slice(0, 10),
                monthlyRevenue
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// CATEGORIES - BASIC CRUD
// ============================================

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private (Admin)
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ deletedAt: null })
            .sort({ displayOrder: 1 });

        // Get product count for each category
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const productCount = await Product.countDocuments({
                category: cat.name,
                deletedAt: null
            });
            return {
                ...cat.toObject(),
                productCount
            };
        }));

        res.json({
            success: true,
            data: categoriesWithCount
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
    try {
        const { name, nameMr, description, descriptionMr, image, displayOrder } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const slug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const category = await Category.create({
            name,
            nameMr: nameMr || '',
            slug,
            description: description || '',
            descriptionMr: descriptionMr || '',
            image: image || '',
            status: 'ACTIVE',
            displayOrder: displayOrder || 0,
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const { name, ...updateData } = req.body;
        if (name && name !== category.name) {
            const slug = name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            updateData.slug = slug;
            updateData.name = name;
        }

        Object.assign(category, updateData);
        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        category.deletedAt = new Date();
        await category.save();

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// ORDERS
// ============================================

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = { deletedAt: null };
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const orders = await Order.find(filter)
            .populate('userId', 'firstName lastName email phone')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private (Admin)
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'firstName lastName email phone')
            .populate('addressId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Get order items with product details
        const items = await OrderItem.find({ orderId: order._id });

        // Populate product details from embedded variants
        const populatedItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.productId)
                .select('name nameMr slug images brand category variants');

            let variant = null;

            if (
                product &&
                product.variants &&
                item.variantId
            ) {
                variant = product.variants.id(item.variantId);
            }

            return {
                ...item.toObject(),
                productId: product || null,
                variantId: variant || null
            };
        }));

        res.json({
            success: true,
            data: {
                ...order.toObject(),
                items: populatedItems
            }
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        //---------------------------------------
        // ORDER STATUS
        //---------------------------------------

        order.status = status;

        //---------------------------------------
        // PAYMENT STATUS
        //---------------------------------------

        if (order.paymentMethod === "COD") {

            if (status === "DELIVERED") {

                order.paymentStatus = "SUCCESS";

            }

            else if (status === "CANCELLED") {

                order.paymentStatus = "CANCELLED";

            }

            else {

                order.paymentStatus = "PENDING";

            }

        }

        else {

            // ONLINE PAYMENT

            if (status === "CANCELLED") {

                order.paymentStatus = "REFUNDED";

            }

            else {

                order.paymentStatus = "SUCCESS";

            }

        }

        //---------------------------------------

        await order.save();

        res.json({

            success: true,

            message: "Order status updated successfully",

            data: order

        });

    }

    catch (error) {

        console.log("========== UPDATE ORDER ERROR ==========");

        console.log(error);

        console.log(error.stack);

        console.log(error.errors);

        console.log("========================================");

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ============================================
// CUSTOMERS
// ============================================

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private (Admin)
exports.getCustomers = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        const filter = { deletedAt: null, role: 'CUSTOMER' };

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const customers = await User.find(filter)
            .select('-passwordHash')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: {
                customers,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get customer by ID
// @route   GET /api/admin/customers/:id
// @access  Private (Admin)
exports.getCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id).select('-passwordHash');
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        const orders = await Order.find({ userId: customer._id })
            .sort({ createdAt: -1 });
        const addresses = await Address.find({ userId: customer._id });

        res.json({
            success: true,
            data: {
                customer,
                orders,
                addresses,
                totalOrders: orders.length,
                totalSpent: orders.reduce((sum, o) => sum + o.total, 0)
            }
        });
    } catch (error) {
        console.error('Get customer error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Block customer
// @route   PUT /api/admin/customers/:id/block
// @access  Private (Admin)
exports.blockCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        customer.status = 'BLOCKED';
        await customer.save();

        res.json({
            success: true,
            message: 'Customer blocked successfully'
        });
    } catch (error) {
        console.error('Block customer error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Unblock customer
// @route   PUT /api/admin/customers/:id/unblock
// @access  Private (Admin)
exports.unblockCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        customer.status = 'ACTIVE';
        await customer.save();

        res.json({
            success: true,
            message: 'Customer unblocked successfully'
        });
    } catch (error) {
        console.error('Unblock customer error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete customer
// @route   DELETE /api/admin/customers/:id
// @access  Private (Admin)
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        customer.deletedAt = new Date();
        await customer.save();

        res.json({
            success: true,
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// COUPONS - BASIC CRUD
// ============================================

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private (Admin)
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ deletedAt: null })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: coupons
        });
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create coupon
// @route   POST /api/admin/coupons
// @access  Private (Admin)
exports.createCoupon = async (req, res) => {
    try {
        const { code, type, value, minOrderValue, maxDiscount, usageLimit, startDate, endDate } = req.body;

        if (!code || !value) {
            return res.status(400).json({
                success: false,
                message: 'Code and value are required'
            });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            type: type || 'PERCENTAGE',
            value,
            minOrderValue: minOrderValue || 0,
            maxDiscount: maxDiscount || 0,
            usageLimit: usageLimit || 100,
            startDate: startDate || new Date(),
            endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'ACTIVE',
        });

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        });
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private (Admin)
exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        Object.assign(coupon, req.body);
        await coupon.save();

        res.json({
            success: true,
            message: 'Coupon updated successfully',
            data: coupon
        });
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private (Admin)
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        coupon.deletedAt = new Date();
        await coupon.save();

        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// GALLERY - BASIC CRUD
// ============================================

// @desc    Get gallery images
// @route   GET /api/admin/gallery
// @access  Private (Admin)
exports.getGalleryImages = async (req, res) => {
    try {
        const images = await Gallery.find({ deletedAt: null })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: images
        });
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create gallery image
// @route   POST /api/admin/gallery
// @access  Private (Admin)
exports.createGalleryImage = async (req, res) => {
    try {
        const { title, titleMr, description, descriptionMr, category, image } = req.body;

        if (!title || !image) {
            return res.status(400).json({
                success: false,
                message: 'Title and image are required'
            });
        }

        const galleryImage = await Gallery.create({
            title,
            titleMr,
            description,
            descriptionMr,
            image,
            category: category || 'OTHER',
            isActive: true,
        });

        res.status(201).json({
            success: true,
            message: 'Image added to gallery',
            data: galleryImage
        });
    } catch (error) {
        console.error('Create gallery error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/admin/gallery/:id
// @access  Private (Admin)
exports.deleteGalleryImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        image.deletedAt = new Date();
        await image.save();

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Delete gallery error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// REVIEWS - BASIC CRUD
// ============================================

// @desc    Get reviews
// @route   GET /api/admin/reviews
// @access  Private (Admin)
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ deletedAt: null })
            .populate('userId', 'firstName lastName email')
            .populate('productId', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update review status
// @route   PUT /api/admin/reviews/:id
// @access  Private (Admin)
exports.updateReviewStatus = async (req, res) => {
    try {
        const { isApproved } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.isApproved = isApproved;
        await review.save();

        res.json({
            success: true,
            message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
            data: review
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.deletedAt = new Date();
        await review.save();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// HERO BANNERS - BASIC CRUD
// ============================================

// @desc    Get hero banners
// @route   GET /api/admin/banners
// @access  Private (Admin)
exports.getHeroBanners = async (req, res) => {
    try {
        const banners = await HeroBanner.find({ deletedAt: null })
            .sort({ displayOrder: 1 });

        res.json({
            success: true,
            data: banners
        });
    } catch (error) {
        console.error('Get banners error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create hero banner
// @route   POST /api/admin/banners
// @access  Private (Admin)
exports.createHeroBanner = async (req, res) => {
    try {
        const { title, titleMr, subtitle, subtitleMr, desktopImage, mobileImage, buttonText, buttonLink, position, displayOrder } = req.body;

        if (!title || !desktopImage) {
            return res.status(400).json({
                success: false,
                message: 'Title and desktop image are required'
            });
        }

        const banner = await HeroBanner.create({
            title,
            titleMr,
            subtitle,
            subtitleMr,
            desktopImage,
            mobileImage: mobileImage || desktopImage,
            buttonText,
            buttonLink,
            position: position || 'HERO',
            displayOrder: displayOrder || 0,
            isActive: true,
        });

        res.status(201).json({
            success: true,
            message: 'Banner created successfully',
            data: banner
        });
    } catch (error) {
        console.error('Create banner error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update hero banner
// @route   PUT /api/admin/banners/:id
// @access  Private (Admin)
exports.updateHeroBanner = async (req, res) => {
    try {
        const banner = await HeroBanner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }

        Object.assign(banner, req.body);
        await banner.save();

        res.json({
            success: true,
            message: 'Banner updated successfully',
            data: banner
        });
    } catch (error) {
        console.error('Update banner error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete hero banner
// @route   DELETE /api/admin/banners/:id
// @access  Private (Admin)
exports.deleteHeroBanner = async (req, res) => {
    try {
        const banner = await HeroBanner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }

        banner.deletedAt = new Date();
        await banner.save();

        res.json({
            success: true,
            message: 'Banner deleted successfully'
        });
    } catch (error) {
        console.error('Delete banner error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// REPORTS
// ============================================
// @desc    Get sales report
// @route   GET /api/admin/reports/sales
// @access  Private (Admin)
exports.getSalesReport = async (req, res) => {
    try {
        const { period = 'monthly', startDate, endDate } = req.query;

        const match = { deletedAt: null };

        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                match.createdAt.$lte = end;
            }
        }

        let groupId;
        if (period === 'daily') {
            groupId = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' },
            };
        } else if (period === 'weekly') {
            groupId = {
                year: { $isoWeekYear: '$createdAt' },
                week: { $isoWeek: '$createdAt' },
            };
        } else {
            groupId = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
            };
        }

        const report = await Order.aggregate([
            { $match: match },
            {
                $group: {
                    _id: groupId,
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1, '_id.week': -1 } },
            { $limit: 30 },
        ]);

        const totalRevenue = report.reduce((sum, r) => sum + r.revenue, 0);
        const totalOrders = report.reduce((sum, r) => sum + r.orders, 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        res.json({
            success: true,
            data: {
                report: report.reverse(),
                summary: {
                    totalRevenue,
                    totalOrders,
                    avgOrderValue,
                },
            },
        });
    } catch (error) {
        console.error('Sales report error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// @desc    Get product report
// @route   GET /api/admin/reports/products
// @access  Private (Admin)
exports.getProductReport = async (req, res) => {
    try {
        const topProducts = await OrderItem.aggregate([
            {
                $group: {
                    _id: '$productId',
                    totalSold: { $sum: '$quantity' },
                    totalRevenue: { $sum: '$totalPrice' }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $match: { 'product.deletedAt': null } },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            data: {
                topProducts
            }
        });
    } catch (error) {
        console.error('Product report error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        const now = new Date();
        let startDate = new Date(now);
        let groupId;

        if (period === 'week') {
            startDate.setDate(startDate.getDate() - 7 * 12);
            groupId = {
                year: { $isoWeekYear: '$createdAt' },
                week: { $isoWeek: '$createdAt' },
            };
        } else if (period === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 5);
            groupId = { year: { $year: '$createdAt' } };
        } else {
            startDate.setMonth(startDate.getMonth() - 12);
            groupId = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
            };
        }

        const revenueTrend = await Order.aggregate([
            { $match: { deletedAt: null, createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: groupId,
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
        ]);

        const topCategories = await OrderItem.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $match: { 'product.deletedAt': null } },
            {
                $group: {
                    _id: '$product.category',
                    totalSold: { $sum: '$quantity' },
                    totalRevenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            data: {
                revenueTrend,
                topCategories,
                period
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// USERS (Super Admin Only)
// ============================================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Super Admin)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ deletedAt: null })
            .select('-passwordHash')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Super Admin)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.role = role;
        await user.save();

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// SETTINGS
// ============================================

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
exports.getSettings = async (req, res) => {
    try {
        const Settings = require('../models/Settings');
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
        const Settings = require('../models/Settings');
        const settings = await Settings.getSettings();

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