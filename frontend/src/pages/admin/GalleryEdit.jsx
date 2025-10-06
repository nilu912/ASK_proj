import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import galleryService from "../../services/galleryService";

const GalleryEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    poster: null,
    files: [],
  });

  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [mediaToDelete, setMediaToDelete] = useState([]);

  // Fetch existing gallery data
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setFetchLoading(true);
        const response = await galleryService.getById(id);
        const data = response.data;
        console.log(response.data)

        setExistingData(data);
        setFormData({
          title: data.title || "",
          category: data.category || "",
          description: data.description || "",
          poster: null, // Will show existing poster separately
          files: [],
        });
        
        // Set existing media for display
        setExistingMedia(data.media || []);
        
      } catch (err) {
        console.error("Error fetching gallery data:", err);
        setError("Failed to load gallery data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchGalleryData();
    }
  }, [id]);

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
        e.target.value = null;
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
              isNew: true,
            });
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previewPromises).then((newPreviews) =>
        setPreviews((prev) => [...prev, ...newPreviews])
      );

      e.target.value = null;
    } else if (name === "poster" && files?.[0]) {
      setFormData((prev) => ({ ...prev, poster: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeNewFile = (index) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, files: newFiles }));
    setPreviews(newPreviews);
  };

  const removeExistingMedia = (mediaIndex) => {
    const mediaItem = existingMedia[mediaIndex];
    setMediaToDelete((prev) => [...prev, mediaItem.publicId]);
    setExistingMedia((prev) => prev.filter((_, i) => i !== mediaIndex));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if we have at least one media item (existing or new)
      if (existingMedia.length === 0 && formData.files.length === 0) {
        throw new Error('Please keep at least one media file or add new ones.');
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);

      // Add poster if a new one is selected
      if (formData.poster) {
        data.append('poster', formData.poster);
      }

      // Add new media files
      formData.files.forEach((file) => {
        data.append('media', file);
      });

      // Add media to delete
      if (mediaToDelete.length > 0) {
        data.append('mediaToDelete', JSON.stringify(mediaToDelete));
      }

      await galleryService.update(id, data);

      setSuccess(true);
      setTimeout(() => navigate('/admin/gallery'), 2000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <>
        <Helmet>
          <title>Edit Gallery | Admin | Apang Seva Kendra</title>
        </Helmet>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </>
    );
  }

  if (!existingData) {
    return (
      <>
        <Helmet>
          <title>Edit Gallery | Admin | Apang Seva Kendra</title>
        </Helmet>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Gallery Not Found</h2>
            <p className="text-gray-600 mb-4">The requested gallery item could not be found.</p>
            <button
              onClick={() => navigate('/admin/gallery')}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-150"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Gallery - {existingData.title} | Admin | Apang Seva Kendra</title>
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Edit Gallery: {existingData.title}
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
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-900 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
            Gallery updated successfully! Redirecting...
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
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write a short description"
            />
          </div>

          {/* Current Poster */}
          {existingData.poster && (
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Current Poster Image
              </label>
              <div className="relative inline-block">
                <img
                  src={existingData.poster.url}
                  alt="Current poster"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            </div>
          )}

          {/* New Poster Upload */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              {existingData.poster ? 'Replace Poster Image' : 'Poster Image *'}
            </label>
            <input
              name="poster"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="block w-full border p-2 rounded"
            />
            {formData.poster && (
              <p className="text-sm text-green-600 mt-1">
                New poster selected: {formData.poster.name}
              </p>
            )}
          </div>

          {/* Existing Media */}
          {existingMedia.length > 0 && (
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Current Media ({existingMedia.length} items)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {existingMedia.map((media, i) => (
                  <div key={i} className="relative">
                    {media.mediaType === "image" ? (
                      <img
                        src={media.mediaUrl}
                        alt="existing media"
                        className="w-full h-24 object-cover rounded border"
                      />
                    ) : (
                      <video
                        src={media.mediaUrl}
                        className="w-full h-24 object-cover rounded border"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingMedia(i)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-700"
                      title="Remove this media"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b">
                      {media.mediaType}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Media */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Add New Images or Videos
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
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">New media to be added:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previews.map((file, i) => (
                    <div key={i} className="relative">
                      {file.type === "image" ? (
                        <img
                          src={file.url}
                          alt="new preview"
                          className="w-full h-24 object-cover rounded border-2 border-green-500"
                        />
                      ) : (
                        <video
                          src={file.url}
                          className="w-full h-24 object-cover rounded border-2 border-green-500"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-700"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-xs p-1 rounded-b">
                        NEW - {file.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Media Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Media Summary:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Current media files: {existingMedia.length}</p>
              <p>• New media files to add: {formData.files.length}</p>
              <p>• Media files to delete: {mediaToDelete.length}</p>
              <p className="font-medium">
                • Total after update: {existingMedia.length + formData.files.length}
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/gallery")}
              className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 transition duration-200"
            >
              {loading ? "Updating..." : "Update Gallery"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GalleryEdit;