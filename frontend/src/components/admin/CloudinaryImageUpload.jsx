// frontend/src/components/admin/CloudinaryImageUpload.jsx
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const CloudinaryImageUpload = ({
  images = [],
  onImagesChange,
  maxFiles = 5,
  folder = 'products',
  label = 'Upload Images',
  className = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      // Add folder info
      formData.append('folder', folder);

      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'https://darshan-masale-backend.onrender.com/api';
      const response = await fetch(`${API_URL}/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const newImages = data.data.images || [];
        onImagesChange([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded successfully!`);
        setUploadProgress(100);
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-text-dark">
        {label}
      </label>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url || image}
                alt={`Upload ${index + 1}`}
                className="w-24 h-24 rounded-xl object-cover border border-secondary-gold/20"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxFiles && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-secondary-gold/30 rounded-xl cursor-pointer hover:border-primary-maroon transition-colors bg-background-cream/30">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader className="w-8 h-8 text-primary-maroon animate-spin" />
              <p className="text-sm text-text-muted mt-2">Uploading...</p>
              <div className="w-32 h-1 bg-secondary-gold/20 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-primary-maroon rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-text-muted" />
              <p className="text-sm text-text-muted mt-2">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-text-muted">
                PNG, JPG, WebP (Max 5MB each)
              </p>
              <p className="text-xs text-text-muted text-secondary-gold">
                {images.length}/{maxFiles} images uploaded
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
};

export default CloudinaryImageUpload;