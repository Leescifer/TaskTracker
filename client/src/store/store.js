import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '@/store/taskSlice';
import authReducer from '@/store/auth'; // Assuming you have this

// Check if environment is set correctly
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.error('WARNING: NEXT_PUBLIC_API_URL environment variable is not set!');
}

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For handling non-serializable values in state
    }),
});

// 5. Debugging utility for API connection issues
// Add this file to your project: apiDebugger.js

export const testApiConnection = async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get('authToken');
  
  console.log('Testing API connection...');
  console.log(`API URL: ${API_URL}`);
  console.log(`Auth token exists: ${!!token}`);
  
  if (!token) {
    console.error('No auth token found - user may not be logged in');
    return { success: false, error: 'No authentication token' };
  }
  
  try {
    // Simple ping request to check API connectivity
    const response = await axios.get(`${API_URL}/ping`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('API connection successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API connection failed:', error);
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      details: error.response?.data
    };
  }
};