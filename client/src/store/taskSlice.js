import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    console.error('API URL is not defined in environment variables');
    return 'http://localhost:5000';
  }
  return url;
};

const getAuthHeader = () => {
  const token = Cookies.get('authToken');
  if (!token) {
    console.warn('Auth token not found in cookies');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

const normalizeStatus = (status) =>
  status?.toLowerCase().replace(/\s+/g, '') || 'todo';

const setLoading = (state) => {
  state.loading = true;
  state.error = null;
};

const setError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

// Async Thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const headers = getAuthHeader();
    if (!headers.Authorization) {
      return rejectWithValue('No authentication token available');
    }

    const res = await axios.get(`${getApiUrl()}/tasks`, { headers });
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tasks';
    const statusCode = err.response?.status;

    return rejectWithValue({
      message: errorMessage,
      status: statusCode,
      details: err.response?.data || 'No details available'
    });
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (data, { rejectWithValue }) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.post(`${getApiUrl()}/tasks`, data, { headers });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Create failed');
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, data }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.put(`${getApiUrl()}/tasks/${id}`, data, { headers });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    const headers = getAuthHeader();
    await axios.delete(`${getApiUrl()}/tasks/${id}`, { headers });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Delete failed');
  }
});

// Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, setLoading)
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.map((task) => ({
          ...task,
          status: normalizeStatus(task.status),
        }));
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || 'Unknown error';
      })

      // Create Task
      .addCase(createTask.pending, setLoading)
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push({
          ...action.payload,
          status: normalizeStatus(action.payload.status),
        });
        state.loading = false;
      })
      .addCase(createTask.rejected, setError)

      // Update Task
      .addCase(updateTask.pending, setLoading)
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = {
          ...action.payload,
          status: normalizeStatus(action.payload.status),
        };
        state.tasks = state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        state.loading = false;
      })
      .addCase(updateTask.rejected, setError)

      // Delete Task
      .addCase(deleteTask.pending, setLoading)
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTask.rejected, setError);
  },
});

export const { clearErrors } = taskSlice.actions;
export default taskSlice.reducer;
