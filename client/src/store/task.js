import { createSlice, createAsyncThunk, configureStore } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch tasks thunk
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get(`${API_URL}/tasks`, { withCredentials: true });
  return response.data;
});

// Create task thunk
export const createTask = createAsyncThunk("tasks/createTask", async (taskData) => {
  const response = await axios.post(`${API_URL}/tasks/store`, taskData, { withCredentials: true });
  return response.data;
});

// Delete task thunk
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId) => {
  await axios.delete(`${API_URL}/tasks/${taskId}/delete`, { withCredentials: true });
  return taskId;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((task) => task.id !== action.payload);
      });
  },
});

export const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer,
  },
});

export default tasksSlice.reducer;
