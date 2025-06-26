import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import taskReducer from "../redux/slices/taskSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});

export default store;
