import api from './api'

export const inquiriesService = {
  // Get all inquiries
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/inquiries', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      throw error
    }
  },

  // Get inquiry by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/inquiries/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching inquiry:', error)
      throw error
    }
  },

  // Create new inquiry
  create: async (inquiryData) => {
    try {
      const response = await api.post('/inquiries', inquiryData)
      return response.data
    } catch (error) {
      console.error('Error creating inquiry:', error)
      throw error
    }
  },

  // Update inquiry status
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/inquiries/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating inquiry status:', error)
      throw error
    }
  },

  // Delete inquiry
  delete: async (id) => {
    try {
      const response = await api.delete(`/inquiries/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting inquiry:', error)
      throw error
    }
  },

  // Reply to inquiry
  reply: async (id, replyData) => {
    try {
      const response = await api.post(`/inquiries/${id}/reply`, replyData)
      return response.data
    } catch (error) {
      console.error('Error replying to inquiry:', error)
      throw error
    }
  }
}

export default inquiriesService
