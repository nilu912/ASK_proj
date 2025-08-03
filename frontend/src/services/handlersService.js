import api from './api'

export const handlersService = {
  // Get all handlers
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/handlers', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching handlers:', error)
      throw error
    }
  },

  // Get handler by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/handlers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching handler:', error)
      throw error
    }
  },

  // Create new handler
  create: async (handlerData) => {
    try {
      const response = await api.post('/handlers', handlerData)
      return response.data
    } catch (error) {
      console.error('Error creating handler:', error)
      throw error
    }
  },

  // Update handler
  update: async (id, handlerData) => {
    try {
      const response = await api.put(`/handlers/${id}`, handlerData)
      return response.data
    } catch (error) {
      console.error('Error updating handler:', error)
      throw error
    }
  },

  // Delete handler
  delete: async (id) => {
    try {
      const response = await api.delete(`/handlers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting handler:', error)
      throw error
    }
  },

  // Update handler status
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/handlers/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating handler status:', error)
      throw error
    }
  }
}

export default handlersService
