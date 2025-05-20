
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@store/auth.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
