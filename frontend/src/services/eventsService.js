import { createSearchParams } from 'react-router-dom';
import api from './api'
import axios from 'axios';

export const eventsService = {
  // Get all events
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/events', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },

  // Get event by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  },

  // Create new event
  // create: async (eventData) => {
  //   try {
  //     const response = await api.post('/events/', eventData)
  //     return response.data
  //   } catch (error) {
  //     console.error('Error creating event:', error)
  //     throw error
  //   }
  // },
  create: async (formData) => {
    try {
      const token = localStorage.getItem("token"); // 👈 or wherever you store the auth token
  
      const res = await api.post('/events/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // ✅ INCLUDE TOKEN
        },
        withCredentials: true // ✅ if using cookie/session-based auth (optional)
      });
  
      return res.data;
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Update event
  update: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData)
      return response.data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  // Delete event
  delete: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },

  // Upload event images
  uploadImages: async (id, formData) => {
    try {
      const response = await api.post(`/events/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    }
  },

  // Get upcoming events
  getUpcoming: async (limit = 4) => {
    try {
      const response = await api.get(`/events/upcoming?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching upcoming events:', error)
      throw error
    }
  }
}

export default eventsService
