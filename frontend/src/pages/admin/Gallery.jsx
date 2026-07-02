// frontend/src/pages/admin/Gallery.jsx - Admin Gallery (Requires Auth)
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Loader2, Upload, Camera } from 'lucide-react';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    titleMr: '',
    description: '',
    descriptionMr: '',
    category: 'OTHER',
    image: '',
  });

  // Load gallery images from ADMIN API (Requires Auth)
  const loadGalleryImages = async () => {
    setLoading(true);
    try {
      const data = await adminService.getGalleryImages();
      setImages(data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      toast.error(error.message || 'Failed to load gallery images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryImages();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e) => {
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
      const result = await adminService.uploadImage(file, 'gallery');
      setFormData(prev => ({ ...prev, image: result.imageUrl }));
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle add image
  const handleAddImage = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image) {
      toast.error('Title and image are required');
      return;
    }

    setUploading(true);
    try {
      await adminService.createGalleryImage(formData);
      toast.success('Image added to gallery!');
      setShowAddModal(false);
      resetForm();
      loadGalleryImages();
    } catch (error) {
      toast.error(error.message || 'Failed to add image');
    } finally {
      setUploading(false);
    }
  };

  // Handle delete image
  const handleDeleteImage = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await adminService.deleteGalleryImage(id);
      toast.success('Image deleted successfully!');
      loadGalleryImages();
    } catch (error) {
      toast.error(error.message || 'Failed to delete image');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleMr: '',
      description: '',
      descriptionMr: '',
      category: 'OTHER',
      image: '',
    });
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
        <title>Gallery - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              Gallery
            </h1>
            <p className="text-text-muted mt-1">
              Manage your website gallery
            </p>
          </div>
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Image
          </Button>
        </div>

        {/* Empty State */}
        {images.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <div className="flex flex-col items-center justify-center">
              <Camera className="w-16 h-16 text-secondary-gold/30" />
              <h3 className="font-heading text-xl font-semibold text-text-dark mt-4">
                No Images Found
              </h3>
              <p className="text-text-muted mt-2">
                Click "Add Image" to upload your first gallery image.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image._id} className="group relative rounded-2xl overflow-hidden bg-white shadow-soft">
                <img 
                  src={image.image} 
                  alt={image.title} 
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-heading font-semibold">{image.title}</h4>
                    <p className="text-white/70 text-sm">{image.category || 'Other'}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/80 transition-colors"
                      onClick={() => handleDeleteImage(image._id, image.title)}
                    >
                      <Trash2 className="w-4 h-4" />
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
            Total: {images.length} {images.length === 1 ? 'image' : 'images'}
          </p>
        </div>
      </motion.div>

      {/* Add Image Modal */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-secondary-gold/10">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-primary-maroon">
                    Add Image
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-background-cream rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddImage} className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Image *
                  </label>
                  {formData.image ? (
                    <div className="relative group">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border border-secondary-gold/20"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-secondary-gold/30 rounded-xl cursor-pointer hover:border-primary-maroon transition-colors bg-background-cream/30 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        disabled={uploading}
                      />
                    </label>
                  )}
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

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Description (English)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                  />
                </div>

                {/* Description (Marathi) */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Description (Marathi)
                  </label>
                  <textarea
                    name="descriptionMr"
                    value={formData.descriptionMr}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  >
                    <option value="SHOP">Shop</option>
                    <option value="PRODUCT">Product</option>
                    <option value="OWNER">Owner</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="EVENT">Event</option>
                    <option value="FACTORY">Factory</option>
                    <option value="OTHER">Other</option>
                  </select>
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
                      'Add Image'
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
    </>
  );
};

export default Gallery;