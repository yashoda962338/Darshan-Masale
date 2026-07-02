// frontend/src/pages/admin/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, X, Upload } from 'lucide-react';
import categoryService from '../../services/categoryService';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, limit: 10 });
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nameMr: '',
    description: '',
    descriptionMr: '',
    image: '',
    status: 'ACTIVE',
    displayOrder: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, [pagination.page, searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit, search: searchTerm };
      const data = await categoryService.getCategories(params);
      setCategories(data.categories || []);
      setPagination(data.pagination || { page: 1, total: 0, pages: 0, limit: 10 });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryService.createCategory(formData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', nameMr: '', description: '', descriptionMr: '', image: '', status: 'ACTIVE', displayOrder: 0 });
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await categoryService.toggleCategoryStatus(id, newStatus);
      toast.success(`Category ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to toggle status');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      nameMr: category.nameMr || '',
      description: category.description || '',
      descriptionMr: category.descriptionMr || '',
      image: category.image?.url || '',
      status: category.status || 'ACTIVE',
      displayOrder: category.displayOrder || 0,
    });
    setShowModal(true);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Categories - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              Categories
            </h1>
            <p className="text-text-muted mt-1">
              {pagination.total} categories in catalog
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', nameMr: '', description: '', descriptionMr: '', image: '', status: 'ACTIVE', displayOrder: 0 });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-maroon text-white rounded-full font-button font-medium hover:bg-primary-maroon-dark transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
            />
          </div>
        </div>

        {/* Categories Table */}
        {categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="font-heading text-2xl text-primary-maroon">No categories yet</h3>
            <p className="text-text-muted mt-2">Start by adding your first category</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-cream">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Marathi Name</th>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Products</th>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Order</th>
                    <th className="px-6 py-4 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-button font-medium text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-gold/10">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-background-cream/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {category.image?.url && (
                            <img src={category.image.url} alt={category.name} className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <span className="font-medium text-text-dark">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">{category.nameMr || '-'}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">{category.productCount || 0}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">{category.displayOrder || 0}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(category._id, category.status)}
                          className={`px-3 py-1 rounded-full text-xs font-button font-medium transition-colors ${
                            category.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {category.status || 'ACTIVE'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-1.5 text-text-muted hover:text-secondary-gold transition-colors rounded-lg hover:bg-secondary-gold/10"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="p-1.5 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-gold/10">
                <p className="text-sm text-text-muted">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} categories
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-primary-maroon">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-background-cream rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="e.g., Powder Collection"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Name (Marathi)
                  </label>
                  <input
                    type="text"
                    value={formData.nameMr}
                    onChange={(e) => setFormData({ ...formData, nameMr: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="मराठीमध्ये नाव"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                    placeholder="Category description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Description (Marathi)
                  </label>
                  <textarea
                    rows="2"
                    value={formData.descriptionMr}
                    onChange={(e) => setFormData({ ...formData, descriptionMr: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                    placeholder="मराठीमध्ये वर्णन"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="primary">
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AdminCategories;