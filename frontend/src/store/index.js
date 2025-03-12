import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Import auth reducer

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add other reducers if needed
  },
});
