import api from '../axios';

// ===== API SERVICE LAYER =====

export const apiService = {
  // ===== USER ENDPOINTS =====
  users: {
    create: async (userData) => {
      try {
        const response = await api.post('/users', userData);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error creating user:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to create user' 
        };
      }
    },

    getAll: async () => {
      try {
        const response = await api.get('/users');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error fetching users:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to fetch users' 
        };
      }
    },

    getById: async (userId) => {
      try {
        const response = await api.get(`/users/${userId}`);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error fetching user:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to fetch user' 
        };
      }
    },

    getSlots: async (userId) => {
      try {
        const response = await api.get(`/users/${userId}/slots`);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error fetching user slots:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to fetch user slots' 
        };
      }
    },

    getBookings: async (userId) => {
      try {
        const response = await api.get(`/users/${userId}/bookings`);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to fetch user bookings' 
        };
      }
    }
  },

  // ===== SLOT ENDPOINTS =====
  slots: {
    create: async (slotData) => {
      try {
        // Transform the data to match backend schema
        const backendData = {
          title: slotData.title,
          description: slotData.description || null,
          date: slotData.date,
          start_time: slotData.start_time,
          end_time: slotData.end_time,
          user_id: slotData.user_id || null
        };
        
        const response = await api.post('/slots', backendData);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error creating slot:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to create slot' 
        };
      }
    },

    getAll: async (filters = {}) => {
      try {
        const params = new URLSearchParams();
        if (filters.date) params.append('date', filters.date);
        if (filters.is_booked !== undefined) params.append('is_booked', filters.is_booked);
        if (filters.user_id) params.append('user_id', filters.user_id);

        const response = await api.get(`/slots?${params}`);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error fetching slots:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to fetch slots' 
        };
      }
    },

    getById: async (slotId) => {
      try {
        const response = await api.get(`/slots/${slotId}`);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error fetching slot:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to fetch slot' 
        };
      }
    },

    book: async (slotId, userId) => {
      try {
        const response = await api.patch(`/slots/${slotId}/book`, {
          user_id: userId
        });
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error booking slot:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to book slot' 
        };
      }
    },

    cancelBooking: async (slotId) => {
      try {
        const response = await api.patch(`/slots/${slotId}/cancel`);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error cancelling booking:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to cancel booking' 
        };
      }
    },

    update: async (slotId, updateData) => {
      try {
        const response = await api.put(`/slots/${slotId}`, updateData);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error updating slot:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to update slot' 
        };
      }
    },

    delete: async (slotId) => {
      try {
        const response = await api.delete(`/slots/${slotId}`);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error deleting slot:', error);
        return { 
          success: false, 
          error: error.response?.data?.detail || 'Failed to delete slot' 
        };
      }
    }
  },

  // ===== UTILITY FUNCTIONS =====
  health: async () => {
    try {
      const response = await api.get('/health');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Health check failed:', error);
      return { 
        success: false, 
        error: 'Backend service unavailable' 
      };
    }
  }
};

export default apiService;
