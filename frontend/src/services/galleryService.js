import api from './api'

export const galleryService = {
  // Get all gallery items
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/gallery', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching gallery items:', error)
      throw error
    }
  },

  // Get gallery item by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/gallery/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching gallery item:', error)
      throw error
    }
  },

  // Create new gallery item
  create: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post('/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // ✅ INCLUDE TOKEN
        },
        withCredentials: true // ✅ if using cookie/session-based auth (optional)
      });
      return response.data;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  },
  
  // Update gallery item
  update: async (id, galleryData) => {
    try {
      const response = await api.put(`/gallery/${id}`, galleryData)
      return response.data
    } catch (error) {
      console.error('Error updating gallery item:', error)
      throw error
    }
  },

  // Delete gallery item
  delete: async (id) => {
    try {
      const response = await api.delete(`/gallery/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      throw error
    }
  },

  // Upload media to gallery
  uploadMedia: async (formData) => {
    try {
      const response = await api.post('/gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error uploading media:', error)
      throw error
    }
  },

  // Get gallery items by category
  getByCategory: async (category, limit = 8) => {
    try {
      const response = await api.get(`/gallery/category/${category}?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching gallery items by category:', error)
      throw error
    }
  },

  delCategory : async (id) => {
    try{
      const res = await api.delete(`/gallery/delCategory/${id}`);
      return res.data;
    }catch(err){
      console.error('Error fetching gallery items by category:', err);
      throw err;
    }
  },
  // Get recent gallery items for homepage
  getRecent: async (limit = 4) => {
    try {
      const response = await api.get(`/gallery/recent?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching recent gallery items:', error)
      throw error
    }
  }
}

export default galleryService
