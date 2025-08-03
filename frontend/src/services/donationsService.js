import api from './api'

export const donationsService = {
  // Get all donations
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/donations', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching donations:', error)
      throw error
    }
  },

  // Get donation by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/donations/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching donation:', error)
      throw error
    }
  },

  // Create new donation
  create: async (donationData) => {
    try {
      const response = await api.post('/donations', donationData)
      return response.data
    } catch (error) {
      console.error('Error creating donation:', error)
      throw error
    }
  },

  // Update donation
  update: async (id, donationData) => {
    try {
      const response = await api.put(`/donations/${id}`, donationData)
      return response.data
    } catch (error) {
      console.error('Error updating donation:', error)
      throw error
    }
  },

  // Delete donation
  delete: async (id) => {
    try {
      const response = await api.delete(`/donations/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting donation:', error)
      throw error
    }
  },

  // Get donation statistics
  getStats: async (period = 'month') => {
    try {
      const response = await api.get(`/donations/stats?period=${period}`)
      return response.data
    } catch (error) {
      console.error('Error fetching donation stats:', error)
      throw error
    }
  },

  // Export donations
  export: async (params = {}) => {
    try {
      const response = await api.get('/donations/export', { 
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting donations:', error)
      throw error
    }
  }
}

export default donationsService
