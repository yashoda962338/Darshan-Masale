// frontend/src/pages/customer/Wishlist.jsx - FULLY FIXED
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import wishlistService from '../../services/wishlistService';
import cartService from '../../services/cartService';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      // Ensure data is an array
      const wishlistArray = Array.isArray(data) ? data : [];
      console.log('Wishlist data:', wishlistArray);
      setWishlist(wishlistArray);
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      toast.error(error.message || 'Failed to load wishlist');
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, productName) => {
    if (!id) {
      toast.error('Invalid item');
      return;
    }
    if (!confirm(`Remove "${productName || 'item'}" from wishlist?`)) return;

    try {
      await wishlistService.removeFromWishlist(id);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      console.error('Remove error:', error);
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (item) => {
    if (!item) return;
    
    // Get variant ID - check multiple possible locations
    let variantId = null;
    
    // Check if item has variantId directly
    if (item.variantId) {
      variantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId;
    }
    
    // Check if product has variants
    if (!variantId && item.productId?.variants && item.productId.variants.length > 0) {
      variantId = item.productId.variants[0]._id || item.productId.variants[0].id;
    }
    
    if (!variantId) {
      toast.error('Product variant not available');
      console.error('No variant found for item:', item);
      return;
    }

    setAddingToCart(item._id);
    try {
      await cartService.addToCart(variantId, 1);
      toast.success('Added to cart!');
      // Remove from wishlist after adding to cart
      await wishlistService.removeFromWishlist(item._id);
      fetchWishlist();
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-12 h-12 text-primary-maroon animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist - Darshan Masale</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-maroon">
            My Wishlist
          </h1>
          <p className="text-text-muted mt-1">
            {wishlist.length} items saved
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <Heart className="w-16 h-16 text-text-muted/30 mx-auto" />
            <h3 className="font-heading text-xl text-primary-maroon mt-4">
              Wishlist is empty
            </h3>
            <p className="text-text-muted mt-2">
              Start adding your favorite products
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-block px-6 py-2 bg-primary-maroon text-white rounded-full hover:bg-primary-maroon-dark transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => {
              // Safely access product data
              const product = item.productId || {};
              const variant = item.variantId || product?.variants?.[0] || {};
              const image = product?.images?.[0]?.url || '/placeholder-image.jpg';
              const price = variant?.sellingPrice || product?.variants?.[0]?.sellingPrice || 0;
              const productSlug = product?.slug || 
                product?.name?.toLowerCase().replace(/\s+/g, '-') || '#';
              const productName = product?.name || 'Product';

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-soft p-4 hover:shadow-elevated transition-all duration-300"
                >
                  <Link to={`/product/${productSlug}`} className="block">
                    <img
                      src={image}
                      alt={productName}
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                    />
                  </Link>
                  <div className="mt-3">
                    <Link to={`/product/${productSlug}`}>
                      <h4 className="font-heading font-semibold text-primary-maroon hover:text-secondary-gold transition-colors line-clamp-2">
                        {productName}
                      </h4>
                    </Link>
                    <p className="text-lg font-bold text-primary-maroon">
                      ₹{price}
                    </p>
                    {variant?.weight && (
                      <p className="text-sm text-text-muted">
                        {variant.weight} {variant.unit || ''}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={addingToCart === item._id}
                        className="flex-1 px-4 py-2 bg-primary-maroon text-white rounded-full text-xs font-button font-medium hover:bg-primary-maroon-dark transition-colors disabled:opacity-50"
                      >
                        {addingToCart === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 inline mr-1" />
                            Add to Cart
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRemove(item._id, productName)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Wishlist;