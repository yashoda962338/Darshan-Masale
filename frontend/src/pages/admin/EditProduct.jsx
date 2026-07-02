// frontend/src/pages/admin/EditProduct.jsx - WITH MULTIPLE IMAGE SUPPORT
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        nameMr: '',
        category: '',
        description: '',
        descriptionMr: '',
        shortDescription: '',
        images: [],
        brand: '',
        tags: [],
        featured: false,
        bestSeller: false,
        status: 'PUBLISHED',
        variants: []
    });

    useEffect(() => {
        loadCategories();
        loadProduct();
    }, [id]);

    const loadCategories = async () => {
        try {
            const data = await adminService.getCategories();
            setCategories(data || []);
        } catch (error) {
            toast.error('Failed to load categories');
        }
    };

    const loadProduct = async () => {
        setFetching(true);
        try {
            const product = await adminService.getProduct(id);
            setFormData({
                name: product.name || '',
                nameMr: product.nameMr || '',
                category: product.category || '',
                description: product.description || '',
                descriptionMr: product.descriptionMr || '',
                shortDescription: product.shortDescription || '',
                images: product.images || [],
                brand: product.brand || '',
                tags: product.tags || [],
                featured: product.featured || false,
                bestSeller: product.bestSeller || false,
                status: product.status || 'PUBLISHED',
                variants: product.variants?.map(v => ({
                    _id: v._id,
                    weight: v.weight || '',
                    unit: v.unit || 'GM',
                    mrp: v.mrp || '',
                    sellingPrice: v.sellingPrice || '',
                    stock: v.stock || '',
                })) || [{ weight: '', unit: 'GM', mrp: '', sellingPrice: '', stock: '' }]
            });
        } catch (error) {
            toast.error('Failed to load product');
            navigate('/admin/products');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...formData.variants];
        updatedVariants[index][field] = value;
        setFormData({ ...formData, variants: updatedVariants });
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                { weight: '', unit: 'GM', mrp: '', sellingPrice: '', stock: '' }
            ]
        });
    };

    const removeVariant = (index) => {
        if (formData.variants.length <= 1) {
            toast.error('At least one variant is required');
            return;
        }
        const updatedVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: updatedVariants });
    };

    // Multiple Image Upload Handler
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
        
        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`${file.name} is not a valid image file`);
                continue;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large. Maximum size is 5MB`);
                continue;
            }

            setUploading(true);

            try {
                const result = await adminService.uploadImage(file, 'product');
                const isPrimary = formData.images.length === 0;
                setFormData(prev => ({
                    ...prev,
                    images: [
                        ...prev.images,
                        {
                            url: result.imageUrl,
                            publicId: result.publicId || '',
                            alt: formData.name || 'Product image',
                            isPrimary: isPrimary
                        }
                    ]
                }));
                toast.success(`${file.name} uploaded successfully!`);
            } catch (error) {
                toast.error(error.message || `Failed to upload ${file.name}`);
            } finally {
                setUploading(false);
            }
        }
        
        e.target.value = '';
    };

    const removeImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        if (updatedImages.length > 0 && formData.images[index].isPrimary) {
            updatedImages[0].isPrimary = true;
        }
        setFormData({ ...formData, images: updatedImages });
    };

    const setPrimaryImage = (index) => {
        const updatedImages = formData.images.map((img, i) => ({
            ...img,
            isPrimary: i === index
        }));
        setFormData({ ...formData, images: updatedImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.category) {
            toast.error('Product name and category are required');
            return;
        }

        if (formData.images.length === 0) {
            toast.error('At least one product image is required');
            return;
        }

        for (const variant of formData.variants) {
            if (!variant.weight || !variant.sellingPrice || !variant.stock) {
                toast.error('All variant fields (weight, price, stock) are required');
                return;
            }
        }

        setLoading(true);
        try {
            await adminService.updateProduct(id, formData);
            toast.success('Product updated successfully!');
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Edit Product - Admin Dashboard</title>
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-primary-maroon">
                            Edit Product
                        </h1>
                        <p className="text-text-muted mt-1">
                            Update product information
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-primary-maroon transition-colors"
                    >
                        <X className="w-5 h-5" />
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">
                                Product Name (English) *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">
                                Product Name (Marathi)
                            </label>
                            <input
                                type="text"
                                name="nameMr"
                                value={formData.nameMr}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">
                                Brand
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Multiple Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1.5">
                            Product Images *
                        </label>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {formData.images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image.url}
                                        alt={image.alt || 'Product'}
                                        className={`w-full h-32 object-cover rounded-xl border-2 ${
                                            image.isPrimary ? 'border-primary-maroon' : 'border-secondary-gold/20'
                                        }`}
                                    />
                                    {image.isPrimary && (
                                        <span className="absolute top-1 left-1 text-xs bg-primary-maroon text-white px-2 py-0.5 rounded">
                                            Primary
                                        </span>
                                    )}
                                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!image.isPrimary && (
                                            <button
                                                type="button"
                                                onClick={() => setPrimaryImage(index)}
                                                className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                                                title="Set as primary"
                                            >
                                                ★
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <label className={`flex flex-col items-center justify-center h-32 border-2 border-dashed border-secondary-gold/30 rounded-xl cursor-pointer hover:border-primary-maroon transition-colors bg-background-cream/30 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <div className="flex flex-col items-center justify-center">
                                    {uploading ? (
                                        <div className="w-6 h-6 border-2 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-text-muted" />
                                            <p className="text-xs text-text-muted mt-1 text-center">
                                                <span className="font-medium">Upload</span><br />
                                                <span className="text-[10px]">PNG, JPG, WebP</span>
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    multiple
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-text-muted">
                            Upload multiple images. First image will be primary. Max 5MB each.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1.5">
                            Short Description
                        </label>
                        <input
                            type="text"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                            placeholder="Brief description for product cards"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1.5">
                            Description (English)
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1.5">
                            Description (Marathi)
                        </label>
                        <textarea
                            name="descriptionMr"
                            value={formData.descriptionMr}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">
                                Tags
                            </label>
                            <input
                                type="text"
                                value={formData.tags.join(', ')}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                })}
                                className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                                placeholder="Comma separated tags"
                            />
                        </div>
                        <div className="flex items-center gap-4 pt-6">
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1.5">
                                    Featured
                                </label>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-primary-maroon"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1.5">
                                    Best Seller
                                </label>
                                <input
                                    type="checkbox"
                                    name="bestSeller"
                                    checked={formData.bestSeller}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-primary-maroon"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">
                                Product Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                            >
                                <option value="PUBLISHED">Active (Published)</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="border-t border-secondary-gold/10 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-heading text-lg font-semibold text-primary-maroon">
                                Product Variants
                            </h3>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-maroon/10 text-primary-maroon rounded-full hover:bg-primary-maroon hover:text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Variant
                            </button>
                        </div>

                        {formData.variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-background-cream rounded-xl mb-3">
                                <div>
                                    <label className="block text-xs font-medium text-text-dark mb-1">
                                        Weight *
                                    </label>
                                    <input
                                        type="number"
                                        value={variant.weight}
                                        onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-dark mb-1">
                                        Unit
                                    </label>
                                    <select
                                        value={variant.unit}
                                        onChange={(e) => handleVariantChange(index, 'unit', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                                    >
                                        <option value="GM">GM</option>
                                        <option value="KG">KG</option>
                                        <option value="ML">ML</option>
                                        <option value="L">L</option>
                                        <option value="G">G</option>
                                        <option value="PC">PC</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-dark mb-1">
                                        MRP (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        value={variant.mrp}
                                        onChange={(e) => handleVariantChange(index, 'mrp', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-dark mb-1">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        value={variant.sellingPrice}
                                        onChange={(e) => handleVariantChange(index, 'sellingPrice', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-dark mb-1">
                                        Stock *
                                    </label>
                                    <input
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                                        required
                                        min="0"
                                        step="1"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        className="w-full px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-secondary-gold/10">
                        <Button type="submit" variant="primary" disabled={loading || uploading}>
                            <Save className="w-5 h-5 mr-2" />
                            {loading ? 'Updating...' : uploading ? 'Uploading Images...' : 'Update Product'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </motion.div>
        </>
    );
};

export default EditProduct;