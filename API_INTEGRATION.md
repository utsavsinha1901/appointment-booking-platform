# Schedulink API Integration Documentation

## Overview

This document outlines the updated API integration between the Schedulink frontend and backend. The integration has been significantly improved with better error handling, comprehensive endpoints, and a structured service layer.

## Backend API Structure

### Base URL
- **Development**: `http://localhost:8000`
- **Production**: Update accordingly

### Authentication
Currently, no authentication is required. This can be added in future iterations.

### API Endpoints

#### Health Check
- **GET** `/` - Root endpoint
- **GET** `/health` - Health check endpoint

#### User Management
- **POST** `/users` - Create a new user
- **GET** `/users` - Get all users
- **GET** `/users/{user_id}` - Get specific user
- **GET** `/users/{user_id}/slots` - Get slots created by user
- **GET** `/users/{user_id}/bookings` - Get slots booked by user

#### Slot Management
- **POST** `/slots` - Create a new slot
- **GET** `/slots` - Get all slots (with optional filters)
- **GET** `/slots/{slot_id}` - Get specific slot
- **PUT** `/slots/{slot_id}` - Update slot
- **DELETE** `/slots/{slot_id}` - Delete slot
- **PATCH** `/slots/{slot_id}/book` - Book a slot
- **PATCH** `/slots/{slot_id}/cancel` - Cancel booking

### Query Parameters for Slots
- `date` (YYYY-MM-DD) - Filter by specific date
- `is_booked` (boolean) - Filter by booking status
- `user_id` (integer) - Filter by user ID

## Frontend Service Layer

### API Service Structure
The frontend uses a centralized API service (`/src/services/api.js`) that provides:

1. **Consistent Error Handling**: All API calls return `{ success: boolean, data?: any, error?: string }`
2. **Request/Response Transformation**: Automatically handles data format conversion
3. **Loading States**: Built-in loading state management
4. **Type Safety**: Proper TypeScript-like parameter validation

### Key Service Methods

#### Users Service
```javascript
apiService.users.create(userData)
apiService.users.getAll()
apiService.users.getById(userId)
apiService.users.getSlots(userId)
apiService.users.getBookings(userId)
```

#### Slots Service
```javascript
apiService.slots.create(slotData)
apiService.slots.getAll(filters)
apiService.slots.getById(slotId)
apiService.slots.book(slotId, userId)
apiService.slots.cancelBooking(slotId)
apiService.slots.update(slotId, updateData)
apiService.slots.delete(slotId)
```

## Data Models

### User Model
```javascript
{
  id: number,
  email: string,
  name: string,
  phone: string | null
}
```

### Slot Model
```javascript
{
  id: number,
  title: string,
  description: string | null,
  date: string (YYYY-MM-DD),
  start_time: string (HH:MM),
  end_time: string (HH:MM),
  is_booked: boolean,
  user_id: number | null,
  booked_by_user_id: number | null,
  user: User | null,
  booked_by: User | null
}
```

## Key Improvements Made

### Backend Improvements
1. **Enhanced Data Models**: Added booking status, proper relationships
2. **Comprehensive Endpoints**: Full CRUD operations with booking functionality
3. **Better Error Handling**: Proper HTTP status codes and error messages
4. **Input Validation**: Pydantic schemas with field validation
5. **Logging**: Added structured logging for debugging
6. **API Documentation**: Auto-generated OpenAPI/Swagger docs

### Frontend Improvements
1. **Service Layer**: Centralized API calls with consistent error handling
2. **Better Form Validation**: Client-side validation with real-time feedback
3. **Loading States**: Improved UX with loading indicators
4. **Success/Error Messages**: User-friendly feedback system
5. **Booking Interface**: Interactive slot booking/cancellation
6. **Responsive Design**: Better mobile experience

### Integration Improvements
1. **Data Consistency**: Matching data structures between frontend/backend
2. **Error Propagation**: Proper error handling from API to UI
3. **Real-time Updates**: Automatic refresh of data after operations
4. **Type Safety**: Better parameter validation and transformation

## Usage Examples

### Creating a User
```javascript
const result = await apiService.users.create({
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890"
});

if (result.success) {
  console.log("User created:", result.data);
} else {
  console.error("Error:", result.error);
}
```

### Creating a Slot
```javascript
const result = await apiService.slots.create({
  title: "Doctor Consultation",
  description: "General checkup",
  date: "2025-08-10",
  start_time: "14:00",
  end_time: "14:30",
  user_id: 1
});
```

### Booking a Slot
```javascript
const result = await apiService.slots.book(slotId, userId);
if (result.success) {
  // Slot booked successfully
  updateUI(result.data);
}
```

## Error Handling

### Backend Error Responses
```javascript
{
  "detail": "Error message here"
}
```

### Frontend Error Handling
```javascript
try {
  const result = await apiService.slots.create(data);
  if (!result.success) {
    // Handle API error
    setError(result.error);
  }
} catch (error) {
  // Handle network/unexpected errors
  setError("An unexpected error occurred");
}
```

## Testing the Integration

### Backend Testing
1. Start the backend: `docker-compose up backend`
2. Visit: `http://localhost:8000/docs` for Swagger UI
3. Test endpoints using the interactive documentation

### Frontend Testing
1. Start the frontend: `docker-compose up frontend`
2. Visit: `http://localhost:3000`
3. Test user creation, slot creation, and booking functionality

### Full Stack Testing
1. Start both services: `docker-compose up`
2. Test the complete workflow:
   - Create users
   - Create appointment slots
   - Book and cancel appointments
   - View different user roles (master vs regular)

## Future Enhancements

1. **Authentication**: Add JWT-based authentication
2. **Real-time Updates**: WebSocket integration for live updates
3. **Email Notifications**: Send booking confirmations
4. **Calendar Integration**: Export to calendar applications
5. **Advanced Filtering**: More sophisticated search and filter options
6. **Bulk Operations**: Create multiple slots, bulk booking
7. **Analytics**: Usage statistics and reporting
8. **Mobile App**: React Native version

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS is configured correctly
2. **Database Connection**: Check SQLite file permissions
3. **Port Conflicts**: Ensure ports 3000 and 8000 are available
4. **Package Dependencies**: Run `npm install` and `pip install -r requirements.txt`

### Debug Mode
- Backend: Set `reload=True` in uvicorn for auto-reload
- Frontend: Development server automatically reloads on changes
- Check browser console for detailed error messages
- Check backend logs for API errors

This integration provides a solid foundation for the Schedulink appointment scheduling system with room for future enhancements and scalability.
