import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import galleryService from "../../services/galleryService";

const GalleryUpload = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    poster: null, // new
    files: [], // renamed from 'images'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previews, setPreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "files" && files) {
      const fileArray = Array.from(files);
  
      // Filter out duplicates (by name + size)
      const newUniqueFiles = fileArray.filter(
        (file) =>
          !formData.files.some(
            (existing) =>
              existing.name === file.name && existing.size === file.size
          )
      );
  
      if (newUniqueFiles.length === 0) {
        e.target.value = null; // reset input for re-selecting same file
        return;
      }
  
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newUniqueFiles],
      }));
  
      const previewPromises = newUniqueFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              url: reader.result,
              type: file.type.startsWith("video") ? "video" : "image",
            });
          reader.readAsDataURL(file);
        });
      });
  
      Promise.all(previewPromises).then((newPreviews) =>
        setPreviews((prev) => [...prev, ...newPreviews])
      );
  
      e.target.value = null; // ✅ allows same files to be selected again
    } else if (name === "poster" && files?.[0]) {
      setFormData((prev) => ({ ...prev, poster: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const removeFile = (index) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, files: newFiles }));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      if (!formData.poster) throw new Error('Please select a poster image.');
      if (!formData.files.length) throw new Error('Please select at least one media file.');
  
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('poster', formData.poster); // 👈 poster file
  
      formData.files.forEach((file) => {
        data.append('media', file); // 👈 multiple media files
      });
      
      await galleryService.create(data);
  
      setSuccess(true);
      setFormData({ title: '', category: '', description: '', poster: null, files: [] });
      setPreviews([]);
  
      // setTimeout(() => navigate('/admin/gallery'), 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Helmet>
        <title>
          {t("admin.dashboard.uploadMedia")} | Admin | Apang Seva Kendra
        </title>
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t("admin.dashboard.uploadMedia")}
          </h1>
          <button
            onClick={() => navigate("/admin/gallery")}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            ← Back to Gallery
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
            Gallery uploaded successfully! Redirecting...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Title *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded focus:ring-accent"
              placeholder="Enter title"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded focus:ring-accent"
            >
              <option value="">Select category</option>
              <option value="events">Events</option>
              <option value="activities">Activities</option>
              <option value="success">Success</option>
              <option value="facilities">Facilities</option>
              <option value="testimonials">Testimonials</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full border px-3 py-2 rounded focus:ring-accent"
              placeholder="Write a short description"
            />
          </div>
          {/* Poster Upload */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Poster Image *
            </label>
            <input
              name="poster"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData((prev) => ({ ...prev, poster: file }));
                }
              }}
              required
              className="block w-full border p-2 rounded"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Upload Images or Videos *
            </label>
            <input
              name="files"
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleInputChange}
              className="block w-full border p-2 rounded"
            />
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((file, i) => (
                  <div key={i} className="relative">
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt="preview"
                        className="w-full h-24 object-cover rounded"
                      />
                    ) : (
                      <video
                        src={file.url}
                        className="w-full h-24 object-cover rounded"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/gallery")}
              className="px-4 py-2 border rounded text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.files.length}
              className="px-4 bg-black py-2 bg-accent text-white rounded hover:bg-accent-dark disabled:opacity-50"
            >
              {loading
                ? "Uploading..."
                : `Upload ${formData.files.length} File(s)`}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GalleryUpload;
