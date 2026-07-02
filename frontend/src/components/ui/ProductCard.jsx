// frontend/src/components/ui/ProductCard.jsx - UNIFIED COMPONENT
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

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

  // Get primary image
  const getPrimaryImage = () => {
    if (!images || images.length === 0) return '/placeholder-image.jpg';
    const primary = images.find(img => img.isPrimary);
    if (primary?.url) return primary.url;
    const firstImage = images[0];
    if (typeof firstImage === 'string') return firstImage;
    if (firstImage?.url) return firstImage.url;
    return '/placeholder-image.jpg';
  };

  // Get price from first variant
  const getPrice = () => {
    if (!variants || variants.length === 0) return null;
    return variants[0].sellingPrice || null;
  };

  // Get first variant ID
  const getVariantId = () => {
    if (!variants || variants.length === 0) return null;
    return variants[0]._id || variants[0].id || null;
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
  const variantId = getVariantId();
  const inWishlist = isInWishlist(_id);

  // Don't show inactive products
  if (status === 'INACTIVE') return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variantId) {
      toast.error('Product variant not available');
      return;
    }
    if (!isInStock) {
      toast.error('Product is out of stock');
      return;
    }
    
    try {
      await addToCart(variantId, 1);
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  return (
    <div className="product-card group bg-white rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden">
      <Link to={`/product/${slug}`} className="block">
        <div className="product-card-image relative overflow-hidden aspect-square">
          <img 
            src={imageUrl} 
            alt={name || 'Product'} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.jpg'; }}
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
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 left-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-text-muted'}`} />
          </button>
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
              <span className="in-stock-badge text-xs text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="out-of-stock-text text-xs text-red-500 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
      {isInStock && variantId && (
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            className="w-full py-2 bg-primary-maroon text-white rounded-lg text-sm font-medium hover:bg-primary-maroon/90 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;