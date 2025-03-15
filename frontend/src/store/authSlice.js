// store/authSlice.js (Redux Toolkit)
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    user: null, 
    token: null,
    isAuthenticated: false
  },
  reducers: {
    login: (state, action) => {
      // Make sure we're handling the response structure correctly
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.isAuthenticated = !!action.payload.token;
      
      // Store auth data in localStorage for persistence
      if (action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage on logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    // Add a reducer to restore auth state from localStorage
    restoreAuth: (state) => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    }
  },
});

export const { login, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
