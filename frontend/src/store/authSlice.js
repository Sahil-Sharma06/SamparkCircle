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
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.isAuthenticated = !!action.payload.token;
      if (action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
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
