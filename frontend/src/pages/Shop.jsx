// frontend/src/pages/Shop.jsx - FIX IMPORT
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import productService from '../services/productService';
import ProductCard from '../components/ui/ProductCard';  // ✅ CORRECT PATH
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, limit: 12 });
  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || '',
    sort: '-createdAt',
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(filters);
      console.log('SHOP fetchProducts response:', data);
      const productList = Array.isArray(data) ? data : data.products || [];
      setProducts(productList);
      const paginationData = !Array.isArray(data) && data.pagination
        ? data.pagination
        : {
          page: 1,
          limit: filters.limit,
          total: productList.length,
          pages: 1,
        };
      setPagination(paginationData);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters({ ...filters, page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin mx-auto" />
          <p className="text-text-muted mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shop - Darshan Masale</title>
        <meta name="description" content="Shop premium Indian spices from Darshan Masale." />
      </Helmet>

      <section className="section-padding bg-background-cream min-h-screen">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="heading-section text-primary-maroon">Shop Spices</h1>
              <p className="subheading mt-2">Explore our premium collection</p>
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
              />
            </div>
          </div>

          {error ? (
            <div className="text-center py-16">
              <p className="text-red-500">{error}</p>
              <button onClick={fetchProducts} className="btn-primary mt-4">Retry</button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-heading text-2xl text-primary-maroon">No products found</h3>
              <p className="text-text-muted mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

// ✅ Add default export
export default Shop;