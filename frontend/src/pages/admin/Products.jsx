// frontend/src/pages/admin/Products.jsx - FULLY WORKING
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Edit, Trash2, Eye, 
  Filter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import adminService from '../../services/adminService';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, limit: 10 });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [pagination.page, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        category: selectedCategory,
      };
      const data = await adminService.getProducts(params);
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, total: 0, pages: 0, limit: 10 });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await adminService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Products - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              Products
            </h1>
            <p className="text-text-muted mt-1">
              {pagination.total} products in catalog
            </p>
          </div>
          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-maroon text-white rounded-full font-button font-medium hover:bg-primary-maroon-dark transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-4 py-3 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="font-heading text-2xl text-primary-maroon">No products found</h3>
            <p className="text-text-muted mt-2">Start by adding your first product</p>
            <Link to="/admin/products/add" className="btn-primary inline-block mt-6">
              Add Product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-cream">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-button font-medium text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-gold/10">
                  {products.map((product) => {
                    const totalStock = product.variants?.reduce((sum, v) => sum + v.availableStock, 0) || 0;
                    const lowestPrice = product.variants?.length > 0 
                      ? Math.min(...product.variants.map(v => v.sellingPrice))
                      : 0;
                    
                    return (
                      <tr key={product._id} className="hover:bg-background-cream/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-primary-maroon/5 flex items-center justify-center">
                                <span className="text-sm font-heading font-bold text-primary-maroon">DM</span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-text-dark">{product.name}</p>
                              <p className="text-xs text-text-muted">SKU: {product.variants?.[0]?.sku || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {product.categoryId?.name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-primary-maroon">
                          {lowestPrice > 0 ? `₹${lowestPrice}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {totalStock > 0 ? totalStock : 'Out of Stock'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-button font-medium bg-green-100 text-green-700">
                            Published
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="p-2 text-text-muted hover:text-secondary-gold transition-colors rounded-lg hover:bg-secondary-gold/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-gold/10">
                <p className="text-sm text-text-muted">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AdminProducts;