// frontend/src/pages/ProductDetails.jsx - FIXED
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Bolt, Image, ChevronLeft, ChevronRight, Share2, MessageCircle, Instagram, Facebook, Send, Copy } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import reviewService from "../services/reviewService";
import { Star } from "lucide-react";
import './ProductDetails.css';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(slug);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  console.log('🔍 ProductDetails - slug:', slug);
  console.log('🔍 ProductDetails - product:', product);
  console.log('🔍 ProductDetails - loading:', loading);
  console.log('🔍 ProductDetails - error:', error);

  // Get images array with proper resolution
  const getImageList = useMemo(() => {
    if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
      return [];
    }
    return product.images.map(img => {
      if (typeof img === 'string') return { url: img };
      return { url: img.url || '', isPrimary: img.isPrimary || false };
    }).filter(img => img.url);
  }, [product?.images]);

  // Get the current image URL
  const currentImageUrl = useMemo(() => {
    if (getImageList.length === 0) return '/placeholder-image.jpg';
    const selectedIndex = selectedImageIndex < getImageList.length ? selectedImageIndex : 0;
    return getImageList[selectedIndex]?.url || '/placeholder-image.jpg';
  }, [getImageList, selectedImageIndex]);

  // Get variants
  const variants = product?.variants || [];
  const selectedVariant = variants[selectedVariantIndex] || {};

  // Calculate total stock
  const totalStock = useMemo(() => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((sum, variant) => sum + (parseInt(variant.stock) || 0), 0);
  }, [variants]);

  // Get stock for selected variant
  const variantStock = parseInt(selectedVariant.stock) || 0;
  const hasStock = variantStock > 0 || totalStock > 0;
  const maxStock = variantStock > 0 ? variantStock : totalStock;

  // Get prices
  const displayPrice = selectedVariant.sellingPrice || product?.price || 0;
  const originalPrice = selectedVariant.mrp || product?.mrp || displayPrice;

  // Get category name
  const categoryName = typeof product?.category === 'string'
    ? product.category
    : product?.category?.name || '';

  // Check if product is in wishlist
  const inWishlist = product ? isInWishlist(product._id || product.id) : false;

  // Reset selected image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  // Reset variant index when product changes
  useEffect(() => {
    if (variants.length > 0 && selectedVariantIndex >= variants.length) {
      setSelectedVariantIndex(0);
    }
  }, [variants, selectedVariantIndex]);

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariantIndex]);

  useEffect(() => {

    if (product?._id) {

      loadReviews();

    }

  }, [product]);

  const getVariantLabel = (variant, index) => {
    if (variant.name) return variant.name;
    if (variant.title) return variant.title;
    if (variant.weight) {
      const unit = variant.unit || '';
      return `${variant.weight}${unit}`.trim();
    }
    return `Variant ${index + 1}`;
  };

  const handleVariantSelect = (index) => {
    setSelectedVariantIndex(index);
    setQuantity(1);
  };

  const handleQuantityChange = (value) => {
    const parsed = parseInt(value);
    if (isNaN(parsed) || parsed < 1) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.min(parsed, Math.max(1, maxStock)));
  };

  const handleAddToCart = async () => {
    if (!hasStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    // Get the variant ID from selected variant
    const variantId = selectedVariant._id || selectedVariant.id;
    if (!variantId) {
      toast.error('Product variant not available');
      return;
    }

    try {
      await addToCart(variantId, quantity);
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = () => {

    if (!hasStock) {

      toast.error("Out of Stock");

      return;

    }

    if (!selectedVariant?._id) {

      toast.error("Please select product variant");

      return;

    }

    navigate("/checkout", {

      state: {

        buyNow: true,

        productId: product._id,

        variantId: selectedVariant._id,

        product: product,

        variant: selectedVariant,

        quantity: quantity

      }

    });

  };
  const handleToggleWishlist = async () => {
    if (!product) return;
    await toggleWishlist(product);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(prev =>
      prev === 0 ? getImageList.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev =>
      prev === getImageList.length - 1 ? 0 : prev + 1
    );
  };

  const loadReviews = async () => {

    if (!product?._id) return;

    try {

      const res = await reviewService.getProductReviews(product._id);

      setReviews(res.data.reviews);

      setAverageRating(res.data.averageRating);

      setTotalReviews(res.data.totalReviews);

    } catch (err) {

      console.log(err);

    }

  };

  const productUrl = window.location.href;

  const shareWhatsapp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(product.name + " " + productUrl)}`,
      "_blank"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      "_blank"
    );
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(product.name)}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(productUrl);
    toast.success("Link Copied");
  };

  const shareInstagram = () => {
    navigator.clipboard.writeText(productUrl);

    toast.success("Link copied. Paste it into Instagram.");
  };

  if (loading) {
    return (
      <div className="product-details-page flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
          <p className="text-text-muted">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="product-details-empty-state text-center py-16">
          <h2 className="text-2xl font-bold text-primary-maroon">Product Not Found</h2>
          <p className="text-text-muted mt-2">{error || 'The requested product could not be loaded.'}</p>
          <button
            onClick={() => navigate('/shop')}
            className="mt-4 px-6 py-2 bg-primary-maroon text-white rounded-full hover:bg-primary-maroon/90 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Darshan Masale</title>
        <meta name="description" content={product.description || 'Premium spice product details'} />
      </Helmet>

      <section className="product-details-page max-w-7xl mx-auto px-4 py-8">
        <div className="product-details-container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="product-gallery-main relative bg-background-cream rounded-2xl overflow-hidden aspect-square">
              {currentImageUrl ? (
                <div className="overflow-hidden rounded-2xl group cursor-zoom-in">

                  <img
                    src={currentImageUrl}
                    alt={product.name}
                    onClick={() => setShowLightbox(true)}
                    className="w-full h-full object-contain transition duration-500 group-hover:scale-150"
                  />

                </div>
              ) : (
                <div className="product-gallery-fallback flex items-center justify-center w-full h-full">
                  <Image className="fallback-icon w-16 h-16 text-text-muted" />
                </div>
              )}

              {/* Navigation arrows for multiple images */}
              {getImageList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {getImageList.length > 1 && (
              <div className="product-gallery-thumbs grid grid-cols-5 gap-2 mt-4">
                {getImageList.map((image, index) => (
                  <button
                    key={image.url || index}
                    type="button"
                    className={`product-thumb-button relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${selectedImageIndex === index
                      ? 'border-primary-maroon shadow-md'
                      : 'border-transparent hover:border-secondary-gold'
                      }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    {image.isPrimary && (
                      <span className="absolute bottom-0 left-0 right-0 text-center text-[8px] bg-primary-maroon/80 text-white py-0.5">
                        Primary
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-panel flex flex-col gap-4">
            {/* Category and Wishlist */}
            <div className="product-sale-strip flex items-center justify-between">
              <span className="product-category-label text-sm text-text-muted bg-background-cream px-3 py-1 rounded-full">
                {categoryName || 'Category'}
              </span>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="product-wishlist-button flex items-center gap-1 text-text-muted hover:text-primary-maroon transition-colors"
              >
                <Heart className={`icon w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="text-sm">{inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            <div className="relative mt-4">

              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-maroon text-white hover:bg-primary-maroon/90"
              >

                <Share2 size={18} />

                Share

              </button>

              {
                showShareMenu && (

                  <div className="absolute mt-2 bg-white shadow-xl rounded-xl w-56 border overflow-hidden z-50">

                    <button
                      onClick={shareWhatsapp}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >

                      <MessageCircle size={18} />

                      WhatsApp

                    </button>

                    <button
                      onClick={shareInstagram}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >

                      <Instagram size={18} />

                      Instagram

                    </button>

                    <button
                      onClick={shareFacebook}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >

                      <Facebook size={18} />

                      Facebook

                    </button>

                    <button
                      onClick={shareTelegram}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >

                      <Send size={18} />

                      Telegram

                    </button>

                    <button
                      onClick={copyLink}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >

                      <Copy size={18} />

                      Copy Link

                    </button>

                  </div>

                )

              }

            </div>
            {/* Title */}
            <h1 className="product-title text-2xl md:text-3xl font-bold text-primary-maroon">
              {product.name}
            </h1>

            {/* Description */}
            <p className="product-description text-text-muted leading-relaxed">
              {product.shortDescription || product.description || 'No description available'}
            </p>

            {/* Price */}
            <div className="product-price-block flex items-center gap-3">
              <div className="product-price-value text-2xl font-bold text-primary-maroon">
                ₹{typeof displayPrice === 'number' ? displayPrice.toFixed(2) : displayPrice}
              </div>
              {originalPrice > displayPrice && (
                <>
                  <div className="product-original-price text-lg text-text-muted line-through">
                    ₹{typeof originalPrice === 'number' ? originalPrice.toFixed(2) : originalPrice}
                  </div>
                  <div className="product-discount text-sm text-green-600 font-medium">
                    {Math.round((1 - displayPrice / originalPrice) * 100)}% OFF
                  </div>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="product-stock-row flex items-center gap-3">
              <div className={`stock-pill text-sm font-medium px-3 py-1 rounded-full ${hasStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                {hasStock ? 'In Stock' : 'Out of Stock'}
              </div>
              <div className="stock-details text-sm text-text-muted">
                {hasStock
                  ? `${maxStock} unit${maxStock > 1 ? 's' : ''} available`
                  : 'Currently unavailable'}
              </div>
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="product-variant-section">
                <span className="section-label text-sm font-medium text-text-dark block mb-2">
                  Choose Variant
                </span>
                <div className="variant-options flex flex-wrap gap-2">
                  {variants.map((variant, index) => (
                    <button
                      key={variant._id || index}
                      type="button"
                      className={`variant-pill px-4 py-2 rounded-full border-2 text-sm transition-all ${selectedVariantIndex === index
                        ? 'border-primary-maroon bg-primary-maroon text-white'
                        : 'border-secondary-gold/30 hover:border-primary-maroon/50 text-text-dark'
                        } ${parseInt(variant.stock) === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleVariantSelect(index)}
                      disabled={parseInt(variant.stock) === 0}
                    >
                      {getVariantLabel(variant, index)}
                      {parseInt(variant.stock) === 0 && ' (Out of Stock)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="product-quantity-section">
              <span className="section-label text-sm font-medium text-text-dark block mb-2">
                Quantity
              </span>
              <div className="quantity-control flex items-center gap-2">
                <button
                  type="button"
                  className="quantity-button w-10 h-10 flex items-center justify-center rounded-full border border-secondary-gold/30 hover:border-primary-maroon transition-colors disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={!hasStock || quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxStock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="quantity-input w-16 h-10 text-center border border-secondary-gold/30 rounded-lg focus:border-primary-maroon outline-none"
                  disabled={!hasStock}
                />
                <button
                  type="button"
                  className="quantity-button w-10 h-10 flex items-center justify-center rounded-full border border-secondary-gold/30 hover:border-primary-maroon transition-colors disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={!hasStock || quantity >= maxStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions-row flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                className="action-button add-to-cart-button flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-maroon text-white rounded-xl hover:bg-primary-maroon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={!hasStock}
              >
                <ShoppingCart className="action-icon w-5 h-5" />
                Add to Cart
              </button>
              <button
                type="button"
                className="action-button buy-now-button flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-secondary-gold text-primary-maroon rounded-xl hover:bg-secondary-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBuyNow}
                disabled={!hasStock}
              >
                <Bolt className="action-icon w-5 h-5" />
                Buy Now
              </button>
            </div>

            {/* Product Meta */}
            <div className="product-meta-grid grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-secondary-gold/20">
              {product.brand && (
                <div className="meta-item">
                  <span className="text-sm text-text-muted">Brand</span>
                  <strong className="block text-text-dark">{product.brand}</strong>
                </div>
              )}
              {selectedVariant.weight && (
                <div className="meta-item">
                  <span className="text-sm text-text-muted">Weight</span>
                  <strong className="block text-text-dark">
                    {selectedVariant.weight} {selectedVariant.unit || ''}
                  </strong>
                </div>
              )}
              {selectedVariant.stock !== undefined && (
                <div className="meta-item">
                  <span className="text-sm text-text-muted">Variant Stock</span>
                  <strong className="block text-text-dark">{selectedVariant.stock} units</strong>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="meta-item col-span-2">
                  <span className="text-sm text-text-muted">Tags</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-background-cream px-2 py-1 rounded-full text-text-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Reviews */}

        <div className="mt-16 border-t pt-10">

          <h2 className="text-3xl font-bold text-primary-maroon mb-3">

            Customer Reviews

          </h2>

          <div className="flex items-center gap-3 mb-8">

            <div className="flex">

              {[1, 2, 3, 4, 5].map((i) => (

                <Star
                  key={i}
                  size={22}
                  className={
                    i <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />

              ))}

            </div>

            <span className="font-bold">

              {averageRating}

            </span>

            <span className="text-gray-500">

              ({totalReviews} Reviews)

            </span>

          </div>

          {

            reviews.length === 0 ? (

              <div className="bg-gray-50 rounded-xl p-10 text-center">

                No Reviews Yet

              </div>

            ) : (

              <div className="space-y-6">

                {reviews.map(review => (

                  <div
                    key={review._id}
                    className="bg-white border rounded-xl p-6 shadow-sm"
                  >

                    <div className="flex justify-between">

                      <div>

                        <h3 className="font-bold">

                          {review.userId.firstName} {review.userId.lastName}

                        </h3>

                        <p className="text-xs text-green-600">

                          ✔ Verified Purchase

                        </p>

                      </div>

                      <span className="text-gray-400 text-sm">

                        {new Date(review.createdAt).toLocaleDateString()}

                      </span>

                    </div>

                    <div className="flex mt-3">

                      {[1, 2, 3, 4, 5].map(i => (

                        <Star
                          key={i}
                          size={18}
                          className={
                            i <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />

                      ))}

                    </div>

                    <p className="mt-4 text-gray-700">

                      {review.comment}

                    </p>

                  </div>

                ))}

              </div>

            )

          }

        </div>
      </section>
      {
        showLightbox && (

          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >

            <button
              className="absolute top-6 right-6 text-white text-5xl"
            >

              ×

            </button>

            <img

              src={currentImageUrl}

              alt={product.name}

              className="max-w-[90%] max-h-[90%] object-contain"

              onClick={(e) => e.stopPropagation()}

            />

          </div>

        )
      }
    </>
  );
};

export default ProductDetails;