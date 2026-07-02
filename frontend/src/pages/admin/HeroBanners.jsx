// frontend/src/pages/admin/HeroBanners.jsx - Connected to MongoDB API
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, ArrowUp, ArrowDown, X, Loader2, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const HeroBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    titleMr: '',
    subtitle: '',
    subtitleMr: '',
    desktopImage: '',
    mobileImage: '',
    buttonText: '',
    buttonLink: '',
    position: 'HERO',
    displayOrder: 0,
    isActive: true,
  });

  // Load banners from API
  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await adminService.getHeroBanners();
      setBanners(data || []);
    } catch (error) {
      console.error('Error loading banners:', error);
      toast.error(error.message || 'Failed to load banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // Handle image upload - FIXED: changed 'banners' to 'banner'
  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB');
      return;
    }

    setUploading(true);
    try {
      // FIXED: changed 'banners' to 'banner' to match backend allowedFolders
      const result = await adminService.uploadImage(file, 'banner');
      setFormData(prev => ({ ...prev, [field]: result.imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle add banner
  const handleAddBanner = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.desktopImage) {
      toast.error('Title and desktop image are required');
      return;
    }

    setUploading(true);
    try {
      await adminService.createHeroBanner(formData);
      toast.success('Banner created successfully!');
      setShowAddModal(false);
      resetForm();
      loadBanners();
    } catch (error) {
      toast.error(error.message || 'Failed to create banner');
    } finally {
      setUploading(false);
    }
  };

  // Handle edit banner
  const handleEditBanner = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.desktopImage) {
      toast.error('Title and desktop image are required');
      return;
    }

    setUploading(true);
    try {
      await adminService.updateHeroBanner(editingBanner._id, formData);
      toast.success('Banner updated successfully!');
      setShowEditModal(false);
      resetForm();
      loadBanners();
    } catch (error) {
      toast.error(error.message || 'Failed to update banner');
    } finally {
      setUploading(false);
    }
  };

  // Handle delete banner
  const handleDeleteBanner = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await adminService.deleteHeroBanner(id);
      toast.success('Banner deleted successfully!');
      loadBanners();
    } catch (error) {
      toast.error(error.message || 'Failed to delete banner');
    }
  };

  // Handle reorder
  const handleReorder = async (id, direction) => {
    const index = banners.findIndex(b => b._id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;
    
    const newBanners = [...banners];
    [newBanners[index], newBanners[newIndex]] = [newBanners[newIndex], newBanners[index]];
    
    // Update display orders
    const updates = newBanners.map((b, i) => ({
      ...b,
      displayOrder: i
    }));
    
    setBanners(updates);
    
    try {
      // Update each banner's display order
      for (const banner of updates) {
        await adminService.updateHeroBanner(banner._id, { displayOrder: banner.displayOrder });
      }
      toast.success('Order updated successfully!');
      loadBanners();
    } catch (error) {
      toast.error('Failed to update order');
      loadBanners(); // Refresh to revert
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleMr: '',
      subtitle: '',
      subtitleMr: '',
      desktopImage: '',
      mobileImage: '',
      buttonText: '',
      buttonLink: '',
      position: 'HERO',
      displayOrder: 0,
      isActive: true,
    });
    setEditingBanner(null);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      titleMr: banner.titleMr || '',
      subtitle: banner.subtitle || '',
      subtitleMr: banner.subtitleMr || '',
      desktopImage: banner.desktopImage || '',
      mobileImage: banner.mobileImage || '',
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      position: banner.position || 'HERO',
      displayOrder: banner.displayOrder || 0,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setShowEditModal(true);
  };

  // Loading state
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
        <title>Hero Banners - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              Hero Banners
            </h1>
            <p className="text-text-muted mt-1">
              Manage your homepage hero banners
            </p>
          </div>
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </Button>
        </div>

        {/* Empty State */}
        {banners.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-16 h-16 text-secondary-gold/30" />
              <h3 className="font-heading text-xl font-semibold text-text-dark mt-4">
                No Banners Found
              </h3>
              <p className="text-text-muted mt-2">
                Click "Add Banner" to create your first hero banner.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner._id} className="group relative rounded-2xl overflow-hidden bg-white shadow-soft">
                <div className="aspect-[16/9] relative">
                  <img 
                    src={banner.desktopImage} 
                    alt={banner.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-button font-medium ${
                      banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-text-dark hover:bg-secondary-gold hover:text-white transition-colors shadow-md"
                      onClick={() => openEditModal(banner)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-text-dark hover:bg-red-500 hover:text-white transition-colors shadow-md"
                      onClick={() => handleDeleteBanner(banner._id, banner.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Banner Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white font-heading text-lg font-semibold">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-white/70 text-sm">{banner.subtitle}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-white/70 text-xs">Position: {banner.position}</span>
                      <span className="text-white/70 text-xs">Order: {banner.displayOrder || 0}</span>
                    </div>
                  </div>

                  {/* Reorder Controls */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 flex flex-col gap-1">
                    <button 
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-text-dark hover:bg-primary-maroon hover:text-white transition-colors"
                      onClick={() => handleReorder(banner._id, 'up')}
                      disabled={banners.indexOf(banner) === 0}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button 
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-text-dark hover:bg-primary-maroon hover:text-white transition-colors"
                      onClick={() => handleReorder(banner._id, 'down')}
                      disabled={banners.indexOf(banner) === banners.length - 1}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Count */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            Total: {banners.length} {banners.length === 1 ? 'banner' : 'banners'}
          </p>
        </div>
      </motion.div>

      {/* Add Banner Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-secondary-gold/10">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-primary-maroon">
                    Add Banner
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-background-cream rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddBanner} className="p-6 space-y-4">
                {/* Desktop Image */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Desktop Image *
                  </label>
                  {formData.desktopImage ? (
                    <div className="relative group">
                      <img
                        src={formData.desktopImage}
                        alt="Desktop preview"
                        className="w-full h-48 object-cover rounded-xl border border-secondary-gold/20"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, desktopImage: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-secondary-gold/30 rounded-xl cursor-pointer hover:border-primary-maroon transition-colors bg-background-cream/30">
                      <div className="flex flex-col items-center justify-center">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 text-primary-maroon animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-text-muted" />
                            <p className="text-sm text-text-muted mt-2">
                              <span className="font-medium">Click to upload</span>
                            </p>
                            <p className="text-xs text-text-muted">PNG, JPG, WebP (Max 5MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'desktopImage')}
                        accept="image/*"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                {/* Mobile Image */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Mobile Image
                  </label>
                  {formData.mobileImage ? (
                    <div className="relative group">
                      <img
                        src={formData.mobileImage}
                        alt="Mobile preview"
                        className="w-full h-32 object-cover rounded-xl border border-secondary-gold/20"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mobileImage: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-secondary-gold/30 rounded-xl cursor-pointer hover:border-primary-maroon transition-colors bg-background-cream/30">
                      <div className="flex flex-col items-center justify-center">
                        {uploading ? (
                          <Loader2 className="w-6 h-6 text-primary-maroon animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-text-muted" />
                            <p className="text-sm text-text-muted mt-1">
                              <span className="font-medium">Upload</span>
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'mobileImage')}
                        accept="image/*"
                        disabled={uploading}
                      />
                    </label>
                  )}
                  <p className="text-xs text-text-muted mt-1">
                    Optional. If not provided, desktop image will be used.
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    required
                  />
                </div>

                {/* Title (Marathi) */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Title (Marathi)
                  </label>
                  <input
                    type="text"
                    name="titleMr"
                    value={formData.titleMr}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Subtitle (English)
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>

                {/* Subtitle (Marathi) */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Subtitle (Marathi)
                  </label>
                  <input
                    type="text"
                    name="subtitleMr"
                    value={formData.subtitleMr}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>

                {/* Button Text & Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Button Link
                    </label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      placeholder="/shop or https://..."
                    />
                  </div>
                </div>

                {/* Position & Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Position
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    >
                      <option value="HERO">Hero</option>
                      <option value="TOP">Top</option>
                      <option value="MIDDLE">Middle</option>
                      <option value="BOTTOM">Bottom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      min="0"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 accent-primary-maroon"
                  />
                  <label className="text-sm font-medium text-text-dark">
                    Active
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-secondary-gold/10">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-primary-maroon text-white rounded-xl hover:bg-primary-maroon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'Add Banner'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-background-cream text-text-dark rounded-xl hover:bg-background-cream/70 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Banner Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-secondary-gold/10">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-primary-maroon">
                    Edit Banner
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-background-cream rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleEditBanner} className="p-6 space-y-4">
                {/* Desktop Image */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Desktop Image *
                  </label>
                  {formData.desktopImage ? (
                    <div className="relative group">
                      <img
                        src={formData.desktopImage}
                        alt="Desktop preview"
                        className="w-full h-48 object-cover rounded-xl border border-secondary-gold/20"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, desktopImage: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-secondary-gold/30 rounded-xl cursor-pointer hover:border-primary-maroon transition-colors bg-background-cream/30">
                      <div className="flex flex-col items-center justify-center">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 text-primary-maroon animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-text-muted" />
                            <p className="text-sm text-text-muted mt-2">
                              <span className="font-medium">Click to upload</span>
                            </p>
                            <p className="text-xs text-text-muted">PNG, JPG, WebP (Max 5MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'desktopImage')}
                        accept="image/*"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                {/* Mobile Image */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Mobile Image
                  </label>
                  {formData.mobileImage ? (
                    <div className="relative group">
                      <img
                        src={formData.mobileImage}
                        alt="Mobile preview"
                        className="w-full h-32 object-cover rounded-xl border border-secondary-gold/20"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mobileImage: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-secondary-gold/30 rounded-xl cursor-pointer hover:border-primary-maroon transition-colors bg-background-cream/30">
                      <div className="flex flex-col items-center justify-center">
                        {uploading ? (
                          <Loader2 className="w-6 h-6 text-primary-maroon animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-text-muted" />
                            <p className="text-sm text-text-muted mt-1">
                              <span className="font-medium">Upload</span>
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'mobileImage')}
                        accept="image/*"
                        disabled={uploading}
                      />
                    </label>
                  )}
                  <p className="text-xs text-text-muted mt-1">
                    Optional. If not provided, desktop image will be used.
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    required
                  />
                </div>

                {/* Title (Marathi) */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Title (Marathi)
                  </label>
                  <input
                    type="text"
                    name="titleMr"
                    value={formData.titleMr}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Subtitle (English)
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>

                {/* Subtitle (Marathi) */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Subtitle (Marathi)
                  </label>
                  <input
                    type="text"
                    name="subtitleMr"
                    value={formData.subtitleMr}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>

                {/* Button Text & Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Button Link
                    </label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      placeholder="/shop or https://..."
                    />
                  </div>
                </div>

                {/* Position & Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Position
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    >
                      <option value="HERO">Hero</option>
                      <option value="TOP">Top</option>
                      <option value="MIDDLE">Middle</option>
                      <option value="BOTTOM">Bottom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      min="0"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 accent-primary-maroon"
                  />
                  <label className="text-sm font-medium text-text-dark">
                    Active
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-secondary-gold/10">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-primary-maroon text-white rounded-xl hover:bg-primary-maroon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'Update Banner'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 bg-background-cream text-text-dark rounded-xl hover:bg-background-cream/70 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroBanners;