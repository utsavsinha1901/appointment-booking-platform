import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

const SlotForm = ({ onSlotCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    user_id: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch users for the dropdown
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const result = await apiService.users.getAll();
      if (result.success) {
        setUsers(result.data);
      } else {
        console.error('Failed to fetch users:', result.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear success message when editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }
    
    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }
    
    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    } else if (formData.start_time && formData.end_time <= formData.start_time) {
      newErrors.end_time = 'End time must be after start time';
    }
    
    // Validate duration (should be at least 15 minutes)
    if (formData.start_time && formData.end_time && formData.end_time > formData.start_time) {
      const start = new Date(`2000-01-01T${formData.start_time}`);
      const end = new Date(`2000-01-01T${formData.end_time}`);
      const diffMinutes = (end - start) / (1000 * 60);
      if (diffMinutes < 15) {
        newErrors.end_time = 'Slot duration must be at least 15 minutes';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    
    try {
      // Prepare data for API (convert user_id to integer or null)
      const slotData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        user_id: formData.user_id ? parseInt(formData.user_id) : null
      };

      const result = await apiService.slots.create(slotData);
      
      if (result.success) {
        console.log('Slot created:', result.data);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          date: '',
          start_time: '',
          end_time: '',
          user_id: ''
        });
        
        // Show success message
        setSuccessMessage('Slot created successfully!');
        
        // Notify parent component
        if (onSlotCreated) {
          onSlotCreated(result.data);
        }
      } else {
        // Handle API errors
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <Calendar className="w-6 h-6 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Appointment Slot</h2>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 text-sm">{successMessage}</span>
        </div>
      )}
      
      {/* General Error Message */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800 text-sm">{errors.general}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Appointment Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input-field ${errors.title ? 'border-red-500' : ''}`}
            placeholder="e.g., Consultation, Meeting, Checkup"
            disabled={loading}
            autoComplete="off"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="Add any additional details about this appointment slot"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date *
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                className={`input-field pl-10 ${errors.date ? 'border-red-500' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Assign to User (Optional)
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="input-field pl-10"
                disabled={loading || loadingUsers}
              >
                <option value="">Select a user (optional)</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time *
            </label>
            <div className="relative">
              <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.start_time ? 'border-red-500' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
          </div>

          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Time *
            </label>
            <div className="relative">
              <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="time"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.end_time ? 'border-red-500' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Slot...
            </div>
          ) : (
            'Create Appointment Slot'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        * Required fields • Minimum duration: 15 minutes
      </div>
    </div>
  );
};

export default SlotForm;
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time *
            </label>
            <div className="relative">
              <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.start_time ? 'border-red-500' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
          </div>

          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
              End Time *
            </label>
            <div className="relative">
              <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="time"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.end_time ? 'border-red-500' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating Slot...' : 'Create Appointment Slot'}
        </button>
      </form>
    </div>
  );
};

export default SlotForm;

