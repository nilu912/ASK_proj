// components/AdminForm.jsx
import React, { useState, useEffect } from 'react';
import { uploadToCloudinary } from '../services/cloudinary';

const AdminForm = ({ service, item = {}, onSave, children }) => {
  const [data, setData] = useState(item);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(item);
  }, [item]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpload = async (file) => {
    try {
      const uploadResponse = await uploadToCloudinary(file);
      return uploadResponse.secure_url;
    } catch (error) {
      setError('Error uploading media. Please try again later.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload media if present
      if (data.photo instanceof File) {
        const photoUrl = await handleUpload(data.photo);
        if (photoUrl) data.photo = photoUrl;
      }

      if (data.images) {
        const images = await Promise.all(
          Array.from(data.images).map((file) => handleUpload(file))
        );
        data.images = images.filter((url) => url !== null);
      }

      let savedItem;
      if (data.id) {
        savedItem = await service.update(data.id, data);
      } else {
        savedItem = await service.create(data);
      }

      onSave(savedItem);
    } catch (error) {
      setError('Error saving data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {children({ data, handleChange, loading })}
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default AdminForm;

