import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"; // Import auth reducer


const store = configureStore({
  reducer: {
    auth: authReducer, // Add other reducers if needed
  },
});

export default store; 