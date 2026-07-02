// backend/src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    nameMr: {
        type: String,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    shortDescription: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    descriptionMr: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    brand: {
        type: String,
        trim: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    images: [{
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
        },
        alt: String,
        isPrimary: {
            type: Boolean,
            default: false,
        },
    }],
    featured: {
        type: Boolean,
        default: false,
    },
    bestSeller: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['PUBLISHED', 'INACTIVE', 'OUT_OF_STOCK'],
        default: 'PUBLISHED'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    variants: [{
        weight: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            enum: ['GM', 'KG', 'ML', 'L'],
            default: 'GM',
        },
        mrp: {
            type: Number,
            required: true,
            min: 0,
        },
        sellingPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
        },
    }],
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

productSchema.index({ name: 'text', nameMr: 'text', description: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestSeller: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'variants.sellingPrice': 1 });

productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

productSchema.virtual('lowestPrice').get(function () {
    if (!this.variants || this.variants.length === 0) return 0;
    return Math.min(...this.variants.map(v => v.sellingPrice));
});

productSchema.virtual('totalStock').get(function () {
    if (!this.variants || this.variants.length === 0) return 0;
    return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

productSchema.virtual('inStock').get(function () {
    return this.totalStock > 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);