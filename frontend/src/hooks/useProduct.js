// frontend/src/hooks/useProduct.js - FIXED
import { useState, useEffect } from 'react';
import productService from '../services/productService';
import toast from 'react-hot-toast';

export const useProduct = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('No product slug provided');
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 Fetching product with slug:', slug);
        const data = await productService.getProductBySlug(slug);
        console.log('✅ Product data received:', data);
        
        if (data) {
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        setError(err.message || 'Failed to load product');
        toast.error(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};