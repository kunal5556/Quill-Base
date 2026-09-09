import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isInitialized = true;
      localStorage.setItem("token", action.payload.token);
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isInitialized = true;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, setInitialized, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";
export const selectIsInitialized = (state) => state.auth.isInitialized;

export default authSlice.reducer;
