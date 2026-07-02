// frontend/src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
    if (!product) return null;

    const { 
        _id, 
        name, 
        slug, 
        images, 
        category,
        variants,
        status
    } = product;

    // Get primary image or first image
    const getPrimaryImage = () => {
        if (!images || images.length === 0) return '/placeholder-image.jpg';
        
        const primary = images.find(img => img.isPrimary);
        if (primary && primary.url) return primary.url;
        
        // Fallback to first image
        const firstImage = images[0];
        if (typeof firstImage === 'string') return firstImage;
        if (firstImage && firstImage.url) return firstImage.url;
        
        return '/placeholder-image.jpg';
    };

    // Get price from first variant
    const getPrice = () => {
        if (!variants || variants.length === 0) return null;
        return variants[0].sellingPrice || null;
    };

    // Calculate total stock
    const getTotalStock = () => {
        if (!variants || variants.length === 0) return 0;
        return variants.reduce((sum, variant) => sum + (parseInt(variant.stock) || 0), 0);
    };

    const imageUrl = getPrimaryImage();
    const price = getPrice();
    const totalStock = getTotalStock();
    const isInStock = totalStock > 0;

    // Don't show inactive products on frontend
    if (status === 'INACTIVE') return null;

    return (
        <div className="product-card group bg-white rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden">
            <Link to={`/product/${slug}`} className="block">
                <div className="product-card-image relative overflow-hidden aspect-square">
                    <img 
                        src={imageUrl} 
                        alt={name || 'Product'} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                        }}
                        loading="lazy"
                    />
                    {!isInStock && (
                        <span className="out-of-stock-badge absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Out of Stock
                        </span>
                    )}
                    {isInStock && totalStock < 5 && (
                        <span className="stock-low-badge absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Only {totalStock} left
                        </span>
                    )}
                </div>
                <div className="product-card-content p-4">
                    <h3 className="product-name font-heading text-base font-semibold text-text-dark line-clamp-2 min-h-[3.5rem]">
                        {name}
                    </h3>
                    {category && (
                        <p className="product-category text-sm text-text-muted mt-1">
                            {typeof category === 'string' ? category : category?.name || ''}
                        </p>
                    )}
                    <div className="product-price-section mt-2">
                        {price ? (
                            <p className="product-price font-bold text-lg text-primary-maroon">
                                ₹{typeof price === 'number' ? price.toFixed(2) : price}
                            </p>
                        ) : (
                            <p className="product-price text-text-muted">Price not available</p>
                        )}
                    </div>
                    <div className="product-stock-status mt-2">
                        {isInStock ? (
                            <span className="in-stock-badge text-xs text-green-600 font-medium">
                                In Stock
                            </span>
                        ) : (
                            <span className="out-of-stock-text text-xs text-red-500 font-medium">
                                Out of Stock
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;