import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

// Fetch tasks (admin gets all, user gets assigned)
export const fetchUserTasks = createAsyncThunk(
  "tasks/fetchUserTasks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/tasks");
      return res.data; // expect full array of task objects
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load tasks");
    }
  }
);
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/tasks/${taskId}`);
      return res.data.task;
    } catch (err) {
      if (err.response?.status === 403) {
        return rejectWithValue("You are not authorized to view this task.");
      }
      return rejectWithValue(err.response?.data?.message || "Failed to load task");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/tasks", taskData);
      return res.data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Task creation failed");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/tasks/${id}`, updatedData);
      return res.data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const toggleTaskStatus = createAsyncThunk(
  "tasks/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/tasks/${id}/status`, { status });
      return res.data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Status update failed");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Deletion failed");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null
  },
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
      state.loading = false;
    },
    clearSelectedTask: (state) => {
    state.selectedTask = null;
    state.error = null;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        // state.tasks = action.payload;
        state.tasks = Array.isArray(action.payload.tasks) ? action.payload.tasks : [];
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedTask = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })

      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  }
});

export const { clearTasks ,clearSelectedTask} = taskSlice.actions;
export default taskSlice.reducer;
