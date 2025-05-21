// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@store/auth.js';
import taskReducer from '@store/taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,  
  },
});
