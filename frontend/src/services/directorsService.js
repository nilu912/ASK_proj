import api from './api'

export const directorsService = {
  // Get all directors
  getAll: async () => {
    try {
      const response = await api.get('/directors')
      return response.data
    } catch (error) {
      console.error('Error fetching directors:', error)
      throw error
    }
  },

  // Get director by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/directors/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching director:', error)
      throw error
    }
  },

  // Create new director
  create: async (directorData) => {
    try {
      const response = await api.post('/directors', directorData)
      return response.data
    } catch (error) {
      console.error('Error creating director:', error)
      throw error
    }
  },

  // Update director
  update: async (id, directorData) => {
    try {
      const response = await api.put(`/directors/${id}`, directorData)
      return response.data
    } catch (error) {
      console.error('Error updating director:', error)
      throw error
    }
  },

  // Delete director
  delete: async (id) => {
    try {
      const response = await api.delete(`/directors/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting director:', error)
      throw error
    }
  },

  // Upload director photo
  uploadPhoto: async (id, formData) => {
    try {
      const response = await api.post(`/directors/${id}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    }
  }  
}

export default directorsService
